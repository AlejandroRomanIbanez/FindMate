import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";

function Post({ post, currentUser }) {
  const currDate = new Date(post.createdAt).toLocaleDateString();
  const currTime = new Date(post.createdAt).toLocaleTimeString();

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
        <span className="w-1/12 flex items-center justify-center">
          <BsThreeDotsVertical
            fontSize={22}
            className="text-white cursor-pointer my-2 rotate-90"
          />
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
    </div>
  );
}

export default Post;
