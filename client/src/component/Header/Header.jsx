import React, { useState } from 'react';
import { HiHome } from 'react-icons/hi';
import { HiOutlineHome } from "react-icons/hi";
import { FaRegUser } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { HiUserGroup } from "react-icons/hi";
import { MdAccountCircle } from 'react-icons/md';
import { BiHelpCircle } from 'react-icons/bi';
import { FaAngleDown, FaPowerOff } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import Search from '../Search/Search';

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
  };

  return (
    <div className="w-full flex items-center justify-around py-2 sticky top-0 z-50 bg-black">
      {/* logo and Search input */}
      <span className="w-auto lg:w-1/4 flex items-center justify-start relative">
        <span className="lg:w-10 lg:h-8 w-6 h-6 bg-white rounded-full shadow-md mx-2 cursor-pointer flex items-center justify-center">
          <span className="lg:w-4 lg:h-4 w-2 h-2 bg-black cursor-pointer"></span>
        </span>
        <span className="lg:mx-3 lg:flex w-full relative">
          <Search />
        </span>
      </span>

      {/* menu buttons */}
      <span className="w-auto lg:w-1/2 flex items-center justify-center">
        <HiOutlineHome className="text-white cursor-pointer text-lg mx-2" />
        <FaRegUser className="text-white cursor-pointer text-lg mx-2" />
        <HiOutlineUserGroup className="text-white cursor-pointer text-lg mx-2" />
      </span>

      {/* user menu */}
      <span className="w-auto lg:w-1/4 flex items-center justify-end cursor-pointer p-1 relative">
        <span
          className="w-10 lg:w-32 h-8 shadow-md bg-black/70 flex items-center justify-center rounded-md"
          onClick={() => setShowMenu(!showMenu)}
        >
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
            alt="userPic"
            className="w-9 h-5/6 object-cover rounded-lg"
          />
          <h2 className="text-xs text-white mx-2 font-semibold lg:flex hidden mt-2">
            username@example.com
          </h2>
          <FaAngleDown className="mx-1 text-white" />
        </span>
        {/* dropdown menu */}
        {showMenu && (
          <div className="absolute w-32 h-36 shadow-xl top-10 right-0 flex items-center justify-center flex-col bg-black/90 rounded-md">
            <li className="w-full h-1/4 shadow flex items-center justify-start list-none px-1 text-white text-xs font-bold hover:bg-gray-900 transition-all duration-300">
              <MdAccountCircle fontSize={16} className="mx-2" />
              Account
            </li>
            <li className="w-full h-1/4 shadow flex items-center justify-start list-none px-1 text-white text-xs font-bold hover:bg-gray-900 transition-all duration-300">
              <BiHelpCircle fontSize={16} className="mx-2" />
              Help
            </li>
            <li className="w-full h-1/4 shadow flex items-center justify-start list-none px-1 text-white text-xs font-bold hover:bg-gray-900 transition-all duration-300">
              <FiSettings fontSize={16} className="mx-2" />
              Setting
            </li>
            <li
              className="w-full h-1/4 shadow flex items-center justify-start list-none px-1 text-white text-xs font-bold hover:bg-gray-900 transition-all duration-300 cursor-pointer"
              onClick={handleLogout}
            >
              <FaPowerOff fontSize={16} className="mx-2" />
              Log Out
            </li>
          </div>
        )}
      </span>
    </div>
  );
}

export default Header;
