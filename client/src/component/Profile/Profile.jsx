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
} from 'mdb-react-ui-kit';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';
import "./Profile.css";

Modal.setAppElement('#root'); // Set the app element for accessibility

export default function Profile() {
  const [hovered, setHovered] = useState(false);
  const { username } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    bio: '',
    avatar_url: '',
    friends: {
      followers: [],
      following: []
    },
    posts: []
  });

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/user/me', {
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
      const response = await fetch(`http://localhost:5000/api/user/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);

        // Fetch the posts for the user
        const postsResponse = await fetch(`http://localhost:5000/api/post/user/${data._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const postsData = await postsResponse.json();
        if (postsResponse.ok) {
          setUser(prevUser => ({ ...prevUser, posts: postsData }));
        } else {
          alert(postsData.error);
        }
      } else {
        alert(data.error);
      }
    };

    fetchCurrentUserData();
    fetchUserData();
  }, [username]);

  const toggleEditProfileModal = () => setShowEditProfileModal(!showEditProfileModal);

  const toggleImageModal = (image = '') => {
    setModalImage(image);
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
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/user/edit', {
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

  const renderPosts = () => {
    if (user.posts.length === 1) {
      return (
        <MDBRow className="g-2 justify-content-center">
          <MDBCol className="mb-2" md="6">
            <div className='bg-image hover-overlay ripple shadow-1-strong rounded'>
              <MDBCardImage
                src={user.posts[0].img_url}
                alt="Single post"
                className="w-100 rounded-3"
                onClick={() => toggleImageModal(user.posts[0].img_url)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </MDBCol>
        </MDBRow>
      );
    } else {
      return (
        <MDBRow className="g-2">
          {user.posts.slice(0, 4).map((post, index) => (
            <MDBCol key={index} className="mb-2" md="6">
              <div className='bg-image hover-overlay ripple shadow-1-strong rounded'>
                <MDBCardImage
                  src={post.img_url}
                  alt={`image ${index + 1}`}
                  className="w-100 rounded-3"
                  onClick={() => toggleImageModal(post.img_url)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </MDBCol>
          ))}
        </MDBRow>
      );
    }
  };

  return (
    <div style={{ background: 'linear-gradient(to right, #4b6cb7, #182848)', minHeight: '100vh' }}>
      <MDBRow className="justify-content-center align-items-center h-100">
        <MDBCol lg="9" xl="7">
          <MDBCard>
            <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
              <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                <MDBCardImage 
                  src={user.avatar_url || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"}
                  alt="User avatar" 
                  className="mt-4 mb-2 img-thumbnail" 
                  fluid 
                  style={{ width: '150px', zIndex: '1' }} 
                />
                {currentUser && currentUser.username === user.username && (
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
                  <MDBCardText className="font-italic mb-1">{user.bio}</MDBCardText>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <MDBCardText className="lead fw-normal mb-0">Recent photos</MDBCardText>
                <MDBCardText className="mb-0"><a href="#!" className="text-muted">Show all</a></MDBCardText>
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
        className="edit-profile-modal-content"
        overlayClassName="modal-overlay"
      >
        <form className="edit-profile-modal" onSubmit={handleSubmit}>
          <input
            type="file"
            id="image"
            accept="image/*"
            className="my-3 cursor-pointer file:bg-yellow-200 file:border-yellow-400 file:text-base file:font-semibold file:rounded-md file:mx-5 file:outline-none file:shadow-md file:font-sans file:cursor-pointer file:px-4"
            onChange={handleFileChange}
          />
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
            className="w-full my-3 bg-transparent border border-gray-900 rounded px-2 text-sm outline-none py-2 placeholder:text-gray-300"
            value={user.bio}
            onChange={handleChange}
          />
          <input
            type="submit"
            className="px-5 py-2 my-4 text-white font-semibold rounded-md cursor-pointer"
            value="Save changes"
            style={{ background: 'linear-gradient(45deg, gray 0%, yellow 100%)' }}
          />
        </form>
      </Modal>

      <Modal
        isOpen={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
        contentLabel="Image Modal"
        className="image-modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="image-modal-inner">
          <img src={modalImage} alt="Modal" className="img-fluid" />
        </div>
      </Modal>
    </div>
  );
}
