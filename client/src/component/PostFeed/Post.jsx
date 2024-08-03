import React, { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Post({ post, currentUser, onDeletePost }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);  // Ref for the dropdown menu
  const currDate = new Date(post.createdAt).toLocaleDateString();
  const currTime = new Date(post.createdAt).toLocaleTimeString();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/post/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onDeletePost(post._id);
        setIsModalOpen(false);
      } else {
        const data = await response.json();
        console.error('Error deleting post:', data.error);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-800 w-full lg:px-4 py-2 my-3 rounded-3xl flex items-center justify-center flex-col">
      {/* post top section */}
      <span className="w-full flex items-center justify-center my-2">
        <span className="w-1/12 flex items-center justify-center">
          <img
            src={currentUser?.avatar_url || "https://via.placeholder.com/100"}
            alt="userPic"
            className="lg:w-10 lg:h-10 w-8 h-8 rounded-2xl object-cover border-2 border-gray-500 cursor-pointer"
          />
        </span>
        <span className="w-3/4 flex items-start justify-center flex-col">
          <h3 className="mx-2 text-gray-400 text-sm lg:text-base cursor-pointer font-semibold my-1">
            {currentUser?.email || "Loading..."}
          </h3>
          <h3 className="mx-2 text-gray-200 text-sm lg:text-lg cursor-pointer font-semibold flex items-center justify-center">
            {currentUser?.username || "Loading..."}
          </h3>
        </span>
        <span className="relative w-1/12 flex items-center justify-center">
          <BsThreeDotsVertical
            fontSize={22}
            className="text-white cursor-pointer my-2 rotate-90"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50"
            >
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                onClick={() => setIsModalOpen(true)}
              >
                Delete Post
              </button>
            </div>
          )}
        </span>
      </span>
      <span className="text-white text-sm lg:text-base w-full px-5 my-2 font-light tracking-wider">
        {post.content}
      </span>
      {/* post image section */}
      <span className="w-full px-5 my-4">
        <img
          src={post.img_url}
          alt="post"
          className="w-full h-72 md:h-96 lg:h-[36rem] object-cover rounded-2xl"
        />
      </span>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Delete Post"
        className="flex items-center justify-center h-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white max-w-sm mx-auto">
          <h2 className="text-lg font-bold mb-4">Delete Post</h2>
          <p>Are you sure you want to delete this post?</p>
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 mr-2 text-white bg-gray-600 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-white bg-red-600 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Post;
