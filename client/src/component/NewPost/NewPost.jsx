import React, { useState } from "react";
import Modal from 'react-modal';
import { BsImage } from "react-icons/bs";
import { NewPostSkeleton } from "../Skeleton/Skeleton";

Modal.setAppElement('#root');

function NewPost({ onNewPost, currentUser }) {
  const [uploadData, setUploadData] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !title) {
      return;
    }

    setUploading(true);
    let img_url = '';

    if (image) {
      const formData = new FormData();
      formData.append('image', image);

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/post/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        const data = await response.json();
        if (response.ok) {
          img_url = data.img_url;
        } else {
          console.error('Error uploading image:', data.error);
          setUploading(false);
          return;
        }
      } catch (error) {
        console.error('Error uploading image to ImgBB:', error);
        setUploading(false);
        return;
      }
    }

    const postData = {
      content: title,
      img_url: img_url,
      author: currentUser._id,  // Make sure the author is correctly assigned
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/post/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();
      if (response.ok) {
        onNewPost();
        setUploadData(false);
        setImage(null);
        setTitle('');
      } else {
        console.error('Error creating post:', data.error);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full lg:w-4/5 rounded-xl px-3 py-2 bg-gray-800 flex items-center justify-center flex-col">
      {!currentUser ? (
        <NewPostSkeleton />
      ) : (
        <>
          <span className="flex items-center justify-center w-full">
            <img
              src={currentUser?.avatar_url || "/user_default.png"}
              alt=""
              className="lg:w-12 lg:h-12 w-10 h-10 rounded-2xl border-2 border-gray-500 object-cover overflow-hidden"
            />
            <input
              type="text"
              className="w-3/4 lg:w-3/4 lg:h-9 h-8 bg-black/40 mx-2 rounded-lg px-4 text-gray-300 outline-none text-xs lg:text-sm"
              placeholder="Tell your friends about your thoughts..."
              maxLength={150}
              onClick={() => setUploadData(true)}
            />
          </span>

          <span className="flex flex-wrap items-center justify-end w-full lg:w-4/5 my-3">
            <label
              className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 px-3 rounded-lg cursor-pointer py-2 m-1"
              onClick={() => setUploadData(true)}
            >
              <BsImage className="text-green-600 mx-1" />
              <h3 className="text-white text-xs">Photo</h3>
            </label>
          </span>

          <Modal
            isOpen={uploadData}
            onRequestClose={() => setUploadData(false)}
            shouldCloseOnOverlayClick={true}
            contentLabel="New Post"
            className="flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
          >
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white max-w-md mx-auto relative">
              <h2 className="text-lg font-bold mb-4">Create New Post</h2>
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
                  maxLength={150}
                  placeholder="Your Thoughts..."
                  className="w-full my-3 bg-gray-700 border border-gray-600 rounded px-4 py-2 text-sm outline-none placeholder-gray-400"
                  value={title}
                  onChange={handleTitleChange}
                />
                <div className="flex justify-center">
                  <input
                    type="submit"
                    className="px-5 py-2 my-4 text-white font-semibold rounded-md cursor-pointer"
                    value={uploading ? "Uploading..." : "Upload"}
                    style={{ background: 'linear-gradient(45deg, gray 0%, yellow 100%)' }}
                    disabled={uploading}
                  />
                </div>
              </form>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

export default NewPost;
