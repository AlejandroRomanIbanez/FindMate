import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";

function Post({ post }) {
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();

  return (
    <div className="bg-gray-800 w-full lg:px-4 py-2 my-3 rounded-3xl flex items-center justify-center flex-col">
      {/* post top section */}
      <span className="w-full flex items-center justify-center my-2">
        <span className="w-1/12 flex items-center justify-center">
          <img
            src={post.userPhoto}
            alt="userPic"
            className="lg:w-10 lg:h-10 w-8 h-8 rounded-2xl object-cover border-2 border-gray-500 cursor-pointer"
          />
        </span>
        <span className="w-3/4 flex items-start justify-center flex-col">
          <h3 className="mx-2 text-gray-400 text-sm lg:text-base cursor-pointer font-semibold my-1">
            {post.userEmail}
          </h3>
          <h3 className="mx-2 text-gray-200 text-sm lg:text-lg cursor-pointer font-semibold flex items-center justify-center">
            {post.displayName}
            <span className="mx-2 text-xs lg:text-sm text-gray-500 flex items-center justify-center">
              <p className="mx-2">{currDate}</p>
              <p>{currTime}</p>
            </span>
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
        {post.description}
      </span>
      {/* post image section */}
      <span className="w-full px-5 my-4">
        <img
          src={post.imageUrl}
          alt="post"
          className="w-full h-72 md:h-96 lg:h-[36rem] object-cover rounded-2xl"
        />
      </span>
      {/* like comment */}
      <span className="w-full flex items-center justify-start text-white px-5 my-1 border-b border-gray-700 py-3">
        <AiOutlineHeart fontSize={19} className="mx-2 cursor-pointer" />
        <FaRegCommentDots fontSize={19} className="mx-2 cursor-pointer" />
        <IoIosSend fontSize={19} className="mx-2 cursor-pointer" />
      </span>
      {/* comments part */}
      <span className="w-full px-1 py-2 flex items-center justify-center">
        <img
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
          alt="userPic"
          className="lg:w-10 lg:h-10 w-8 h-8 rounded-2xl object-cover border-2 border-gray-500 cursor-pointer"
        />
        <input
          type="text"
          placeholder="Write your comment"
          className="w-5/6 mx-4 text-gray-200 outline-none bg-gray-700 h-9 rounded-lg text-sm px-3 placeholder:text-gray-600"
        />
      </span>
    </div>
  );
}

export default Post;
