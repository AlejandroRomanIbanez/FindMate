import React, { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBTooltip,
} from 'mdb-react-ui-kit';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';
import "./Profile.css";
import { ProfileSkeleton } from '../Skeleton/Skeleton';
import Ad from '../Ad/Ad';
import { FaAd } from 'react-icons/fa';
import UpgradeModal from '../Modals/UpgradeModal';

const mockAds = [
  {
    id: "ad1",
    logo_url: "https://cdn.pixabay.com/photo/2023/07/04/07/25/self-consciousness-8105584_960_720.jpg",
    company: "Crypto Bro",
    title: "Check out our product",
    description: "This is an amazing product that you should check out!",
    img_url: "https://images.pexels.com/photos/6771243/pexels-photo-6771243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isAd: true
  },
  {
    id: "ad2",
    logo_url: "https://cdn.pixabay.com/photo/2015/12/09/13/44/vector-1084755_960_720.png",
    company: "Prolos",
    title: "Bring order to chaos",
    description: "We provide excellent services that you can rely on.",
    img_url: "https://images.pexels.com/photos/3671145/pexels-photo-3671145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isAd: true
  }
];

Modal.setAppElement('#root'); // Set the app element for accessibility

export default function Profile() {
  const [hovered, setHovered] = useState(false);
  const { username } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalImageIsAd, setModalImageIsAd] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [combinedFeed, setCombinedFeed] = useState([]);
  const [adsInserted, setAdsInserted] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [bioCharCount, setBioCharCount] = useState(0);
  const [bioError, setBioError] = useState(false);

  const MAX_CHARS = 100;

  useEffect(() => {
    setCombinedFeed([]);
    setAdsInserted(false);

    const fetchCurrentUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data);
      } else {
        console.error(data.error);
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data._id);
      if (response.ok) {
        const postsResponse = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/post/user/${data._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const postsData = await postsResponse.json();
        if (postsResponse.ok) {
          data.posts = postsData;
          setUser(data);
        } else {
          alert(postsData.error);
        }
      } else {
        alert(data.error);
      }
      setLoading(false);
    };

    const fetchData = async () => {
      await fetchCurrentUserData();
      await fetchUserData();
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    if (user && user.posts && !adsInserted) {
      const combined = [...user.posts];
      const adCount = Math.min(mockAds.length, Math.floor(user.posts.length / 2));
      for (let i = 0; i < adCount; i++) {
        const adIndex = Math.floor(Math.random() * (combined.length + 1));
        combined.splice(adIndex, 0, mockAds[i]);
      }
      setCombinedFeed(combined);
      setAdsInserted(true);
    }
  }, [user, adsInserted]);

  const toggleEditProfileModal = () => {
    setShowEditProfileModal(!showEditProfileModal);
    if (user && user.bio) {
      setBioCharCount(user.bio.length);
    }
  };

  const toggleUpgradeModal = () => {
    setShowUpgradeModal(!showUpgradeModal);
  };

  const toggleImageModal = (image = '', isAd = false) => {
    setModalImage(image);
    setModalImageIsAd(isAd);
    setShowImageModal(!showImageModal);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser(prevUser => ({ ...prevUser, avatar_url: reader.result }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'bio') {
      if (value.length <= MAX_CHARS) {
        setBioCharCount(value.length);
        setBioError(false);
        setUser(prevUser => ({ ...prevUser, bio: value }));
      } else {
        setBioError(true);
      }
    } else {
      setUser(prevUser => ({ ...prevUser, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bioError) {
      return;
    }
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(user)
    });
    const data = await response.json();
    if (response.ok) {
      alert('Profile updated successfully');
      toggleEditProfileModal();
    } else {
      alert(data.error);
    }
  };

  const handleUpgrade = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/buy_sub`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      alert('Subscription upgraded successfully');
      toggleUpgradeModal();
      setCurrentUser(prev => ({ ...prev, isPaid: true }));
    } else {
      alert(data.error);
    }
  };

  useEffect(() => {
    if (user && user.posts && !adsInserted) {
      const combined = [...user.posts];

      // Insert ads with a bug for paid users
      if (currentUser && currentUser.isPaid) {
        for (let i = 0; i < mockAds.length; i++) {
          const adIndex = Math.floor(Math.random() * (combined.length + 1));
          combined.splice(adIndex, 0, {
            id: `error${i}`,
            isError: true,
            message: 'Oops! Something went wrong while loading this content.'
          });
        }
      } else {
        // Normal ad insertion for unpaid users
        const adCount = Math.min(mockAds.length, Math.floor(user.posts.length / 2));
        for (let i = 0; i < adCount; i++) {
          const adIndex = Math.floor(Math.random() * (combined.length + 1));
          combined.splice(adIndex, 0, mockAds[i]);
        }
      }

      setCombinedFeed(combined);
      setAdsInserted(true);
    }
  }, [user, adsInserted, currentUser]);

  const renderPosts = () => (
    <MDBRow className="g-2">
      {combinedFeed.slice(0, showAll ? combinedFeed.length : 4).map((item, index) =>
        item.isError ? (
          <MDBCol key={item.id} className="mb-2" md="6">
            <div className="bg-gray-800 p-3 rounded shadow-sm">
              <img src="/process-error.svg" alt="error" className='w-100' />
              <p className="text-danger">{item.message}</p>
            </div>
          </MDBCol>
        ) : item.img_url ? (
          <MDBCol key={index} className="mb-2" md="6">
            <div 
              className='bg-image hover-overlay ripple shadow-1-strong rounded' 
              style={{ position: 'relative' }}
              onClick={() => toggleImageModal(item.img_url, item.isAd)}
            >
              <MDBCardImage
                src={item.img_url}
                alt={`image ${index + 1}`}
                className="w-100 rounded-3 post-image"
                style={{ cursor: 'pointer' }}
              />
              {item.isAd && (
                <span className="absolute top-2 right-2">
                  <MDBTooltip tag='span' wrapperClass='d-inline-block' title='This is an ad'>
                    <FaAd fontSize={20} className="text-yellow-500 cursor-pointer" />
                  </MDBTooltip>
                </span>
              )}
            </div>
          </MDBCol>
        ) : (
          <MDBCol key={item.id} className="mb-2" md="6">
            <Ad ad={item} isProfile={true} />
          </MDBCol>
      ))}
    </MDBRow>
  );

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(to right, #4b6cb7, #182848)', minHeight: '100vh' }}>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(to right, #4b6cb7, #182848)', minHeight: '100vh' }}>
      <MDBRow className="justify-content-center align-items-center h-100">
        <MDBCol lg="9" xl="7">
          <MDBCard>
            <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
              <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px', height: '500px' }}>
                <MDBCardImage 
                  src={user.avatar_url || process.env.PUBLIC_URL + "/user_default.png"}
                  alt="User avatar" 
                  className="mt-4 mb-2 img-thumbnail" 
                  fluid 
                  style={{ width: '150px', zIndex: '1' }} 
                />
                {currentUser && currentUser.username === user.username && (
                  <>
                  <MDBBtn 
                    outline 
                    color="dark" 
                    style={{ 
                      height: '36px', 
                      overflow: 'visible', 
                      backgroundColor: hovered ? 'black' : 'transparent',
                      color: hovered ? 'white' : 'black',
                      borderColor: 'black',
                      transition: 'background-color 0.3s, color 0.3s'
                    }} 
                    onClick={toggleEditProfileModal}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    Edit profile
                  </MDBBtn>
                  <MDBBtn 
                    color="warning" 
                    className="mt-2"
                    onClick={toggleUpgradeModal}
                  >
                    {user.isPaid ? "Subscription" : "Upgrade Plan"}
                  </MDBBtn>
                </>
                )}
              </div>
              <div className="ms-3" style={{ marginTop: '115px' }}>
                <MDBTypography className='mb-1' tag="h5">{user.username}</MDBTypography>
                <MDBCardText className='mb-1'>{user.email}</MDBCardText>
                <MDBCardText>Age: {user.age}</MDBCardText>
              </div>
            </div>
            <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="d-flex justify-content-end text-center py-1">
                <div>
                  <MDBCardText className="mb-1 h5">{user.posts.length}</MDBCardText>
                  <MDBCardText className="small text-muted mb-0">Photos</MDBCardText>
                </div>
                <div className="px-3">
                  <MDBCardText className="mb-1 h5">{user.friends.followers.length}</MDBCardText>
                  <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                </div>
                <div>
                  <MDBCardText className="mb-1 h5">{user.friends.following.length}</MDBCardText>
                  <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                </div>
              </div>
            </div>
            <MDBCardBody className="text-black p-4">
              <div className="mb-5">
                <p className="lead fw-normal mb-1">About</p>
                <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                  <MDBCardText className="font-italic mb-1">{user.bio ? user.bio.substring(0, 20) : ''}</MDBCardText>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <MDBCardText className="lead fw-normal mb-0">Recent photos</MDBCardText>
                <MDBCardText className="mb-0">
                  <a href="#!" className="text-muted" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "Show less" : "Show all"}
                  </a>
                </MDBCardText>
              </div>
              {renderPosts()}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <Modal
        isOpen={showEditProfileModal}
        onRequestClose={toggleEditProfileModal}
        contentLabel="Edit Profile"
        className="flex items-center justify-center h-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <label className="block my-3">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="block w-full text-sm text-gray-300
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-yellow-200 file:text-gray-700
                           hover:file:bg-yellow-300"
                onChange={handleFileChange}
              />
            </label>
            <input
              type="text"
              name="username"
              maxLength={150}
              placeholder="Username..."
              className="w-full my-3 bg-transparent border border-gray-900 rounded px-2 text-sm outline-none py-2 placeholder:text-gray-300"
              value={user.username}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email..."
              className="w-full my-3 bg-transparent border border-gray-900 rounded px-2 text-sm outline-none py-2 placeholder:text-gray-300"
              value={user.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password..."
              className="w-full my-3 bg-transparent border border-gray-900 rounded px-2 text-sm outline-none py-2 placeholder:text-gray-300"
              value={user.password}
              onChange={handleChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age..."
              className="w-full my-3 bg-transparent border border-gray-900 rounded px-2 text-sm outline-none py-2 placeholder:text-gray-300"
              value={user.age}
              onChange={handleChange}
            />
            <textarea
              name="bio"
              placeholder="Bio..."
              className={`w-full my-3 bg-transparent rounded px-2 text-sm outline-none py-2 placeholder:text-gray-300 ${bioError ? 'border-2 border-red-500' : 'border border-gray-900'}`}
              value={user.bio}
              onChange={handleChange}
              style={{ 
                borderColor: bioError ? 'red' : 'gray',
                borderWidth: bioError ? '2px' : '1px'
              }}
            />
            <div className="flex justify-between items-center text-sm">
              <span className={bioError ? 'text-red-500' : 'text-gray-300'}>
                {bioError ? 'You have reached the limit to talk about you.' : `Words: ${bioCharCount}/${MAX_CHARS}`}
              </span>
            </div>
            <input
              type="submit"
              className={`px-5 py-2 my-4 font-semibold rounded-md cursor-pointer ${bioError ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-gray-500 to-yellow-500 text-white'}`}
              value="Save changes"
              disabled={bioError}
            />
          </form>
        </div>
      </Modal>

      <UpgradeModal isOpen={showUpgradeModal} onRequestClose={toggleUpgradeModal}/>
      <Modal
        isOpen={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
        contentLabel="Image Modal"
        className="image-modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="image-modal-inner" style={{ position: 'relative' }}>
          <img src={modalImage} alt="Modal" className="img-fluid" />
          {modalImageIsAd && (
            <span className="absolute top-2 right-2">
              <MDBTooltip tag='span' wrapperClass='d-inline-block' title='This is an ad'>
                <FaAd fontSize={20} className="text-yellow-500 cursor-pointer" />
              </MDBTooltip>
            </span>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
        contentLabel="Image Modal"
        className="image-modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="image-modal-inner" style={{ position: 'relative' }}>
          <img src={modalImage} alt="Modal" className="img-fluid" />
          {modalImageIsAd && (
            <span className="absolute top-2 right-2">
              <MDBTooltip tag='span' wrapperClass='d-inline-block' title='This is an ad'>
                <FaAd fontSize={20} className="text-yellow-500 cursor-pointer" />
              </MDBTooltip>
            </span>
          )}
        </div>
      </Modal>
    </div>
  );
}
