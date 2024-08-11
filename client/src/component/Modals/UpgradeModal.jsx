import React, { useState, useEffect, useRef } from 'react';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import Modal from 'react-modal';

const UpgradeModal = ({ isOpen, onRequestClose, modalMessage  }) => {
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriptionStartDate, setSubscriptionStartDate] = useState(null);
    const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
    const [refundAmount, setRefundAmount] = useState(null);
    const [showRefundDialog, setShowRefundDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const modalRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onRequestClose();
        }
      };
  
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.body.classList.remove('overflow-hidden');
      };
    }, [isOpen, onRequestClose]);
  
    useEffect(() => {
      if (isOpen) {
        const fetchSubscriptionDetails = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/user/me', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              if (data.isPaid) {
                setIsSubscribed(true);
                setSubscriptionStartDate(new Date(data.subscription_start_date));
                setSubscriptionEndDate(new Date(data.subscription_end_date));
              }
            }
          } catch (error) {
            console.error('Failed to fetch subscription details:', error);
          } finally {
            setLoading(false);
          }
        };
  
        fetchSubscriptionDetails();
      } else {
        setCardholderName('');
        setCardNumber('');
        setExpirationDate('');
        setCvc('');
        setErrors({});
        setIsSubscribed(false);
        setSubscriptionStartDate(null);
        setSubscriptionEndDate(null);
        setLoading(true);
      }
    }, [isOpen]);
  
    const validateInputs = () => {
      let validationErrors = {};
  
      if (cardholderName.trim() === '') {
        validationErrors.cardholderName = 'Cardholder name is required';
      }
  
      const cardNumberPattern = /^\d{16}$/;
      if (!cardNumberPattern.test(cardNumber)) {
        validationErrors.cardNumber = 'Card number must be 16 digits';
      }
  
      const expirationPattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
      if (!expirationPattern.test(expirationDate)) {
        validationErrors.expirationDate = 'Expiration date must be MM/YY format';
      }
  
      const cvcPattern = /^\d{3,4}$/;
      if (!cvcPattern.test(cvc)) {
        validationErrors.cvc = 'CVC must be 3 or 4 digits';
      }
  
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    };
  
    const handleInputChange = (e, maxLength, setState, fieldName) => {
      const { value } = e.target;
      if (value.length <= maxLength) {
        setState(value);
        if (errors[fieldName]) {
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[fieldName];
            return newErrors;
          });
        }
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be ${maxLength} digits max`
        }));
      }
    };
  
    const handlePayment = async () => {
      if (validateInputs()) {
        try {
          const response = await fetch('http://localhost:5000/api/user/buy_sub', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log('Subscription successful:', data.message);
            onRequestClose();
          } else {
            const errorData = await response.json();
            console.error('Subscription failed:', errorData.error);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
    };
  
    const handleCancelSubscription = () => {
        const totalSubscriptionCost = 9.99; // Total subscription cost
        
        // Extract the remaining time from the calculated string
        const remainingTimeString = calculateRemainingTime();
        const [daysStr, hoursStr, minutesStr] = remainingTimeString.split(', ');
        
        const remainingDays = parseInt(daysStr.split(' ')[0]) || 0;
        const remainingHours = parseInt(hoursStr.split(' ')[0]) || 0;
        const remainingMinutes = parseInt(minutesStr.split(' ')[0]) || 0;
      
        // Convert the remaining time into a fraction of a day
        const remainingFraction = remainingDays + remainingHours / 24 + remainingMinutes / (24 * 60);
      
        // Calculate total subscription time in days (assuming 30 days for monthly subscription)
        const totalDays = 30;
      
        // Calculate the refund as a proportion of the remaining time
        const calculatedRefund = (totalSubscriptionCost * remainingFraction) / totalDays;
      
        // Ensure the refund amount is within a reasonable range (e.g., not negative)
        const refundAmount = calculatedRefund > 0 ? Math.round(calculatedRefund * 100) / 100 : 0;
      
        // Set the refund amount rounded to two decimal places
        setRefundAmount(refundAmount);
        setShowRefundDialog(true);
      };
      
      

    const confirmCancelSubscription = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/cancel_sub', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Subscription cancelled:', data.message);
          setIsSubscribed(false);
          setSubscriptionEndDate(null);
          setRefundAmount(null);
          setShowRefundDialog(false);
          onRequestClose();
        } else {
          const errorData = await response.json();
          console.error('Cancel subscription failed:', errorData.error);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
  
    const calculateRemainingTime = () => {
      if (!subscriptionEndDate) return null;
      const now = new Date();
      const diff = subscriptionEndDate - now;
      if (diff <= 0) return 'Expired';
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${days} days, ${hours} hours, ${minutes} minutes`;
    };
  
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Upgrade Plan"
        className="flex items-center justify-center h-full w-full p-0 m-0"
        overlayClassName="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-sm"
        shouldCloseOnOverlayClick={true}
      >
        <div ref={modalRef} className="relative p-0 m-0 max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-auto">
          
          {/* Close Button */}
          <button 
            onClick={onRequestClose} 
            className="absolute top-2 right-2 text-gray-800 text-xl font-bold z-10"
          >
            &times;
          </button>
  
          <MDBCard className="shadow-xl rounded-lg bg-white text-gray-800">
            <MDBCardBody className="p-md-5">
              {loading ? (
                <div className="text-center">
                  <p>Loading your subscription details...</p>
                </div>
              ) : isSubscribed ? (
                <div className="text-center">
                  <h4 className="text-gray-800 mb-4">Your Plan</h4>
                  <div className="px-3 py-4 border-success border-2 rounded mt-4 d-flex justify-content-between">
                    <div className="d-flex flex-row align-items-center">
                      <img
                        src="/ad-ocalypse.png"
                        className="rounded"
                        width="60"
                        alt="Plan"
                      />
                      <div className="d-flex flex-column ms-4">
                        <span className="h5 mb-1"><strong>Ad-ocalypse Now</strong></span>
                        <span className="small text-muted"> The Ad-ocalypse You’ve Been Waiting For!</span>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center">
                      <span className="h2 mx-1 mb-0">9,99</span>
                      <sup className="dollar font-weight-bold text-muted">€</sup>
                      <span className="text-muted font-weight-bold mt-2">/ Month</span>
                    </div>
                  </div>
                  <p className="mt-4 text-green-600">
                    {modalMessage || `Your subscription is active. Time left until renewal: ${calculateRemainingTime()}`}
                  </p>
                  <MDBBtn block size="lg" color="danger" className="mt-5" onClick={handleCancelSubscription}>
                    Cancel Subscription
                  </MDBBtn>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-gray-800 text-center">Upgrade your plan</h4>
                    <p className="text-muted pb-2 text-center">
                      Please enter your payment details below to upgrade to our premium plan and enjoy all features.
                    </p>
                  </div>
                  
                  <div className="px-3 py-4 border-primary border-2 rounded mt-4 d-flex justify-content-between">
                    <div className="d-flex flex-row align-items-center">
                      <img
                        src="/ad-ocalypse.png"
                        className="rounded"
                        width="60"
                        alt="Plan"
                      />
                      <div className="d-flex flex-column ms-4">
                        <span className="h5 mb-1"><strong>Ad-ocalypse Now</strong></span>
                        <span className="small text-muted"> The Ad-ocalypse You’ve Been Waiting For!</span>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center">
                      <span className="h2 mx-1 mb-0">9,99</span>
                      <sup className="dollar font-weight-bold text-muted">€</sup>
                      <span className="text-muted font-weight-bold mt-2">/ Month</span>
                    </div>
                  </div>
                  <h4 className="mt-5 text-gray-800">Payment Details</h4>
                  <div className="mt-4">
                    <MDBInput
                      label="Cardholder's Name"
                      id="cardholderName"
                      type="text"
                      size="lg"
                      className="mb-4"
                      value={cardholderName}
                      onChange={(e) => handleInputChange(e, 50, setCardholderName, 'cardholderName')}
                    />
                    {errors.cardholderName && <div className="text-red-500 mb-2">{errors.cardholderName}</div>}
  
                    <MDBInput
                      label="Card Number"
                      id="cardNumber"
                      type="text"
                      size="lg"
                      className="mb-4"
                      value={cardNumber}
                      onChange={(e) => handleInputChange(e, 16, setCardNumber, 'cardNumber')}
                    />
                    {errors.cardNumber && <div className="text-red-500 mb-2">{errors.cardNumber}</div>}
  
                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ width: "48%" }}>
                        <MDBInput
                          label="Expiration Date (MM/YY)"
                          id="expirationDate"
                          type="text"
                          value={expirationDate}
                          onChange={(e) => handleInputChange(e, 5, setExpirationDate, 'expirationDate')}
                        />
                        {errors.expirationDate && <div className="text-red-500 mb-2">{errors.expirationDate}</div>}
                      </div>
  
                      <div style={{ width: "48%" }}>
                        <MDBInput
                          label="CVC"
                          id="cvc"
                          type="text"
                          value={cvc}
                          onChange={(e) => handleInputChange(e, 4, setCvc, 'cvc')}
                        />
                        {errors.cvc && <div className="text-red-500 mb-2">{errors.cvc}</div>}
                      </div>
                    </div>
                  </div>
                  <MDBBtn block size="lg" color="primary" className="mt-5" onClick={handlePayment}>
                    Proceed to payment <MDBIcon fas icon="long-arrow-alt-right" />
                  </MDBBtn>
                </>
              )}
            </MDBCardBody>
          </MDBCard>
  
          {/* Refund Confirmation Dialog */}
          {showRefundDialog && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-75 backdrop-filter backdrop-blur-sm">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-xl font-semibold mb-4">Confirm Cancellation</h4>
                <p className="mb-4">You will receive a refund of €{refundAmount}. Do you want to continue?</p>
                <div className="flex justify-end space-x-4">
                  <MDBBtn color="danger" onClick={confirmCancelSubscription}>
                    Continue
                  </MDBBtn>
                  <MDBBtn color="secondary" onClick={() => setShowRefundDialog(false)}>
                    Cancel
                  </MDBBtn>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };
  
  export default UpgradeModal;