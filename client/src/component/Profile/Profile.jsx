import React, { useState } from 'react';
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
import { ImCross } from 'react-icons/im';

export default function Profile() {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div style={{ background: 'linear-gradient(to right, #4b6cb7, #182848)', minHeight: '100vh' }}>
      <MDBRow className="justify-content-center align-items-center h-100">
        <MDBCol lg="9" xl="7">
          <MDBCard>
            <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
              <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                <MDBCardImage 
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                  alt="Generic placeholder image" 
                  className="mt-4 mb-2 img-thumbnail" 
                  fluid 
                  style={{ width: '150px', zIndex: '1' }} 
                />
                <MDBBtn 
                  outline 
                  color="dark" 
                  style={{ height: '36px', overflow: 'visible' }} 
                  onClick={toggleModal}
                >
                  Edit profile
                </MDBBtn>
              </div>
              <div className="ms-3" style={{ marginTop: '130px' }}>
                <MDBTypography tag="h5">Andy Horwitz</MDBTypography>
                <MDBCardText>New York</MDBCardText>
              </div>
            </div>
            <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="d-flex justify-content-end text-center py-1">
                <div>
                  <MDBCardText className="mb-1 h5">253</MDBCardText>
                  <MDBCardText className="small text-muted mb-0">Photos</MDBCardText>
                </div>
                <div className="px-3">
                  <MDBCardText className="mb-1 h5">1026</MDBCardText>
                  <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                </div>
                <div>
                  <MDBCardText className="mb-1 h5">478</MDBCardText>
                  <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                </div>
              </div>
            </div>
            <MDBCardBody className="text-black p-4">
              <div className="mb-5">
                <p className="lead fw-normal mb-1">About</p>
                <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                  <MDBCardText className="font-italic mb-1">Web Developer</MDBCardText>
                  <MDBCardText className="font-italic mb-1">Lives in New York</MDBCardText>
                  <MDBCardText className="font-italic mb-0">Photographer</MDBCardText>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <MDBCardText className="lead fw-normal mb-0">Recent photos</MDBCardText>
                <MDBCardText className="mb-0"><a href="#!" className="text-muted">Show all</a></MDBCardText>
              </div>
              <MDBRow className="g-2">
                <MDBCol className="mb-2">
                  <MDBCardImage 
                    src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                    alt="image 1" 
                    className="w-100 rounded-3" 
                  />
                </MDBCol>
                <MDBCol className="mb-2">
                  <MDBCardImage 
                    src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                    alt="image 1" 
                    className="w-100 rounded-3" 
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow className="g-2">
                <MDBCol className="mb-2">
                  <MDBCardImage 
                    src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                    alt="image 1" 
                    className="w-100 rounded-3" 
                  />
                </MDBCol>
                <MDBCol className="mb-2">
                  <MDBCardImage 
                    src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                    alt="image 1" 
                    className="w-100 rounded-3" 
                  />
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {showModal && (
        <div className="fixed w-screen h-screen top-0 left-0 bg-black/50 z-50 flex items-center justify-center">
          <form className="w-full flex items-center justify-center h-full">
            <div className="w-full max-w-md bg-gray-700 relative shadow-lg rounded-md flex items-center justify-center flex-col text-white px-3 py-4">
              <input
                type="file"
                id="image"
                accept="image/*"
                className="my-3 cursor-pointer file:bg-yellow-200 file:border-yellow-400 file:text-base file:font-semibold file:rounded-md file:mx-5 file:outline-none file:shadow-md file:font-sans file:cursor-pointer file:px-4"
              />
              <input
                type="text"
                maxLength={150}
                placeholder="Username..."
                className="w-full my-3 bg-transparent border border-gray-900 rounded px-2 text-sm outline-none py-2 placeholder:text-gray-300"
              />
              <input
                type="email"
                placeholder="Email..."
                className="w-full my-3 bg-transparent border border-gray-900 rounded px-2 text-sm outline-none py-2 placeholder:text-gray-300"
              />
              <input
                type="password"
                placeholder="Password..."
                className="w-full my-3 bg-transparent border border-gray-900 rounded px-2 text-sm outline-none py-2 placeholder:text-gray-300"
              />
              <input
              type="submit"
              className="px-5 py-2 my-4 text-white font-semibold rounded-md cursor-pointer"
              value="Save changes"
              style={{ background: 'linear-gradient(45deg, gray 0%, yellow 100%)' }}
            />
              <ImCross
                fontSize={15}
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
