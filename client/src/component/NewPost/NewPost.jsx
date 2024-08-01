import React, { useState } from "react";
import { BsImage, BsFillCalendar2HeartFill } from "react-icons/bs";
import { MdOutlineSlowMotionVideo, MdOutlinePoll } from "react-icons/md";
import { ImCross } from "react-icons/im";

function NewPost() {
  const [uploadData, setUploadData] = useState(false);

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
          onChange={() => setUploadData(true)}
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
          <form className="w-full flex items-center justify-center h-full">
            <div className="w-full max-w-md bg-gray-800 relative shadow-lg rounded-lg flex items-center justify-center flex-col text-white px-3 py-4">
              <input
                type="file"
                id="image"
                accept="image/*"
                className="my-3 cursor-pointer file:bg-yellow-200 file:border-yellow-400 file:text-base file:font-semibold file:rounded-md file:mx-5 file:outline-none file:shadow-md file:font-sans file:cursor-pointer file:px-4"
              />
              <input
                type="text"
                maxLength={150}
                placeholder="Post title..."
                className="w-full my-3 bg-gray-700 border border-gray-600 rounded px-4 py-2 text-sm outline-none placeholder-gray-400"
              />
              <input
                type="submit"
                className="px-5 py-2 my-4 text-white font-semibold rounded-md cursor-pointer"
                value="Upload"
                style={{ background: 'linear-gradient(45deg, gray 0%, yellow 100%)' }}
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
