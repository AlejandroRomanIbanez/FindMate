import React, { useState, useEffect, useRef } from 'react';
import { MDBSpinner } from 'mdb-react-ui-kit';

function Friends({ isOpen, onClose, initialTab, currentUser, allUsers, fetchCurrentUser }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'followers');
  const [loading, setLoading] = useState({});
  const modalRef = useRef();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleUnfollow = async (targetUserId) => {
    setLoading(prev => ({ ...prev, [targetUserId]: true }));

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/remove_friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ target_user_id: targetUserId })
      });
      const data = await response.json();
      if (response.ok) {
        fetchCurrentUser(); // Re-fetch current user data
      } else {
        console.error(`Error unfollowing user: ${data.error}`);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const getUserInfo = (userId) => {
    return allUsers.find(user => user._id === userId) || {};
  };

  const followersTab = (
    <div className="space-y-4">
      {currentUser?.friends.followers.map(userId => {
        const user = getUserInfo(userId);
        return (
          <div key={user._id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar_url || '/user_default.png'}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-gray-300">{user.username}</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  const followingTab = (
    <div className="space-y-4">
      {currentUser?.friends.following.map(userId => {
        const user = getUserInfo(userId);
        return (
          <div key={user._id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar_url || '/user_default.png'}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-gray-300">{user.username}</span>
            </div>
            <button 
              className="text-xs px-3 py-1 rounded-md bg-gray-600 text-white flex items-center justify-center hover:bg-gray-500 transition duration-300"
              onClick={() => handleUnfollow(user._id)}
              disabled={loading[user._id]}
            >
              {loading[user._id] ? (
                <MDBSpinner color='light' size='sm' />
              ) : (
                'Unfollow'
              )}
            </button>
          </div>
        );
      })}
    </div>
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div ref={modalRef} className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-lg">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-500 text-xl"
          >
            &times;
          </button>
        </div>
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded-full ${activeTab === 'followers' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300'}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers
          </button>
          <button
            className={`px-4 py-2 rounded-full ${activeTab === 'following' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300'}`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
        </div>
        <div className="overflow-y-auto max-h-80">
          {activeTab === 'followers' ? followersTab : followingTab}
        </div>
      </div>
    </div>
  );
}

export default Friends;
