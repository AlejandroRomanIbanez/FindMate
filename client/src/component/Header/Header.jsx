import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiHome, HiOutlineHome } from 'react-icons/hi';
import { FaRegUser, FaUser } from 'react-icons/fa';
import { HiOutlineUserGroup, HiUserGroup } from 'react-icons/hi';
import { MdAccountCircle } from 'react-icons/md';
import { BiHelpCircle } from 'react-icons/bi';
import { FaAngleDown, FaPowerOff } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import Search from '../Search/Search';

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        handleLogout();
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        handleLogout();
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
  };

  const handleNavigation = (path) => {
    navigate(path);
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
        <span
          className="text-lg mx-2 cursor-pointer"
          onMouseEnter={() => setHoveredIcon('home')}
          onMouseLeave={() => setHoveredIcon('')}
          onClick={() => handleNavigation('/')}
        >
          {hoveredIcon === 'home' ? <HiHome className="text-white" /> : <HiOutlineHome className="text-white" />}
        </span>
        <span
          className="text-lg mx-2 cursor-pointer"
          onMouseEnter={() => setHoveredIcon('user')}
          onMouseLeave={() => setHoveredIcon('')}
          onClick={() => handleNavigation(`/profile/${user?.username}`)}
        >
          {hoveredIcon === 'user' ? <FaUser className="text-white" /> : <FaRegUser className="text-white" />}
        </span>
        <span
          className="text-lg mx-2 cursor-pointer"
          onMouseEnter={() => setHoveredIcon('group')}
          onMouseLeave={() => setHoveredIcon('')}
        >
          {hoveredIcon === 'group' ? <HiUserGroup className="text-white" /> : <HiOutlineUserGroup className="text-white" />}
        </span>
      </span>

      {/* user menu */}
      <span className="w-auto lg:w-1/4 flex items-center justify-end cursor-pointer p-1 relative">
        <span
          className="w-10 lg:w-32 h-8 shadow-md bg-black/70 flex items-center justify-center rounded-md"
          onClick={() => setShowMenu(!showMenu)}
        >
          <img
            src={user?.avatar_url || "/user_default.png"}
            alt="userPic"
            className="w-9 h-5/6 object-cover rounded-lg"
          />
          <h2 className="text-xs text-white mx-2 font-semibold lg:flex hidden mt-2">
            {user?.username || 'Loading...'}
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
