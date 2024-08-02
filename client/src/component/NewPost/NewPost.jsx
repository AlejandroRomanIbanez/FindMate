import React, { useState } from "react";
import { BsImage, BsFillCalendar2HeartFill } from "react-icons/bs";
import { MdOutlineSlowMotionVideo, MdOutlinePoll } from "react-icons/md";
import { ImCross } from "react-icons/im";

function NewPost({ onNewPost }) {
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
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        img_url = data.data.url;
      } catch (error) {
        console.error('Error uploading image to ImgBB:', error);
        setUploading(false);
        return;
      }
    }

    const postData = {
      content: title,
      img_url: img_url,
    };

    try {
      const response = await fetch('http://localhost:5000/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();
      if (response.ok) {
        onNewPost(data);
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
      <span className="flex items-center justify-center w-full">
        <img
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
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
          className="flex items-center justify-center bg-gray-700 px-3 rounded-lg cursor-pointer py-2 m-1"
          onClick={() => setUploadData(true)}
        >
          <BsImage className="text-green-600 mx-1" />
          <h3 className="text-white text-xs">Photo</h3>
        </label>
        <label
          className="flex items-center justify-center bg-gray-700 px-3 rounded-lg cursor-pointer py-2 m-1"
        >
          <MdOutlineSlowMotionVideo fontSize={18} className="text-blue-600 mx-1" />
          <h3 className="text-white text-xs">Video</h3>
        </label>
        <label className="flex items-center justify-center bg-gray-700 px-3 rounded-lg cursor-pointer py-2 m-1">
          <MdOutlinePoll fontSize={18} className="text-orange-600 mx-1" />
          <h3 className="text-white text-xs">Poll</h3>
        </label>
        <label className="flex items-center justify-center bg-gray-700 px-3 rounded-lg cursor-pointer py-2 m-1">
          <BsFillCalendar2HeartFill className="text-yellow-600 mx-1" />
          <h3 className="text-white text-xs">Schedule</h3>
        </label>
      </span>

      {uploadData && (
        <div className="fixed w-screen h-screen top-0 left-0 bg-black/50 z-50 flex items-center justify-center">
          <form className="w-full flex items-center justify-center h-full" onSubmit={handleSubmit}>
            <div className="w-full max-w-md bg-gray-800 relative shadow-lg rounded-lg flex items-center justify-center flex-col text-white px-3 py-4">
              <input
                type="file"
                id="image"
                accept="image/*"
                className="my-3 cursor-pointer file:bg-yellow-200 file:border-yellow-400 file:text-base file:font-semibold file:rounded-md file:mx-5 file:outline-none file:shadow-md file:font-sans file:cursor-pointer file:px-4"
                onChange={handleFileChange}
              />
              <input
                type="text"
                maxLength={150}
                placeholder="Post title..."
                className="w-full my-3 bg-gray-700 border border-gray-600 rounded px-4 py-2 text-sm outline-none placeholder-gray-400"
                value={title}
                onChange={handleTitleChange}
              />
              <input
                type="submit"
                className="px-5 py-2 my-4 text-white font-semibold rounded-md cursor-pointer"
                value={uploading ? "Uploading..." : "Upload"}
                style={{ background: 'linear-gradient(45deg, gray 0%, yellow 100%)' }}
                disabled={uploading}
              />
              <ImCross
                fontSize={15}
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setUploadData(false)}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default NewPost;
