import React, { useState } from 'react';
import "./Auth.css";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                window.location.href = '/';
            } else if (data.errors) {
                setError(data.errors[0].msg);
            } else {
                setError(data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    const handleSignUp = async () => {
        setError(''); // Clear previous errors
        try {
            const formattedDate = dateOfBirth;
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, date_of_birth: formattedDate, bio }) 
            });
            const data = await response.json();
            if (response.ok) {
                setIsLogin(true);
            } else if (data.errors) {
                setError(data.errors[0].msg);
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <MDBContainer fluid className='my-5'>
            <MDBRow className='g-0 align-items-center'>
                <MDBCol md='6'>
                    <MDBCard className='my-5 cascading-right' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
                        <MDBCardBody className='p-5 shadow-5 text-center'>
                            <h2 className="fw-bold mb-5">{isLogin ? 'Login' : 'Sign up now'}</h2>
                            {!isLogin && (
                                <>
                                    <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                                    <MDBInput wrapperClass='mb-4' label='Date of Birth' id='form2' type='date' value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />  {/* Date input */}
                                    <MDBInput wrapperClass='mb-4' label='Bio' id='form3' type='text' value={bio} onChange={(e) => setBio(e.target.value)} />
                                </>
                            )}
                            <MDBInput wrapperClass='mb-4' label='Email' id='form4' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' label='Password' id='form5' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <MDBBtn className='w-100 mb-4' size='md' onClick={isLogin ? handleLogin : handleSignUp}>{isLogin ? 'Login' : 'Sign up'}</MDBBtn>
                            {error && <p className="text-danger">{error}</p>}  {/* Display error message */}
                            <p className="mb-0">{isLogin ? "Don't have an account?" : 'Already have an account?'} <span onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: '#1266f1' }}>{isLogin ? 'Sign up' : 'Login'}</span></p>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md='6' className='image-column'>
                    <img src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg" className="w-100 rounded-4 shadow-4" alt="" fluid />
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Auth;
