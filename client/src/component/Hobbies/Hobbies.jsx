import React from "react";
import { MdClose } from "react-icons/md";

function Hobbies() {
  const hobbies = [
    "Reading",
    "Traveling",
    "Cooking",
    "Photography",
    "Gardening",
    "Drawing",
    "Writing",
    "Music",
    "Gaming",
    "Sports",
  ];

  return (
    <div className="w-full max-w-sm bg-gray-800 shadow-md rounded-3xl overflow-hidden relative flex items-center justify-center flex-col p-4 my-5">
      <span className="w-full px-5 font-bold text-xl text-gray-300 flex items-center justify-center">
        Hobbies
      </span>
      <input
        type="text"
        className="w-11/12 mt-3 bg-transparent outline-none border border-gray-700 text-sm font-thin px-2 rounded-md placeholder:text-xs text-gray-300"
        placeholder="Type your hobbies..."
      />
      <span className="w-full h-auto flex items-center justify-center flex-wrap p-2 mt-4">
        {hobbies.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-center justify-center cross mx-1 my-1"
            >
              <span className="capitalize bg-gray-700 px-3 p-1 text-xs font-semibold rounded-xl text-gray-300">
                {item}
              </span>
              <MdClose className="icon opacity-0 cursor-pointer ml-1" />
            </div>
          );
        })}
      </span>
    </div>
  );
}

export default Hobbies;
