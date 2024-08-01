import React from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from 'mdb-react-ui-kit';

const EditProfileModal = ({ isOpen, toggle }) => {
  return (
    <MDBModal staticBackdrop tabIndex='-1' show={isOpen} setShow={toggle}>
      <MDBModalDialog>
        <MDBModalContent className="bg-gray-800 text-gray-300">
          <MDBModalHeader>
            <MDBModalTitle>Edit Profile</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={toggle}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <form>
              <div className="mb-4">
                <label htmlFor="image" className="form-label">Profile Image</label>
                <MDBInput type="file" id="image" className="form-control bg-gray-700 text-gray-300" />
              </div>
              <div className="mb-4">
                <label htmlFor="username" className="form-label">Username</label>
                <MDBInput type="text" id="username" className="form-control bg-gray-700 text-gray-300" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email</label>
                <MDBInput type="email" id="email" className="form-control bg-gray-700 text-gray-300" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <MDBInput type="password" id="password" className="form-control bg-gray-700 text-gray-300" />
              </div>
            </form>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='secondary' onClick={toggle}>
              Close
            </MDBBtn>
            <MDBBtn>Save changes</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default EditProfileModal;
