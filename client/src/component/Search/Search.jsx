import React, { useState, useEffect } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { MDBSpinner } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

const Search = ({ user, allUsers, loading, setLoading, fetchUserData }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = () => {
      if (query.length > 1) {
        const filteredSuggestions = allUsers.filter(
          suggestionUser =>
            suggestionUser.username !== user.username &&
            (suggestionUser.username.toLowerCase().includes(query.toLowerCase()) ||
            suggestionUser.email.toLowerCase().includes(query.toLowerCase()))
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 500); // Adjust delay for debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query, allUsers, user]);

  const handleFollow = async (targetUserId) => {
    setLoading(prev => ({ ...prev, [targetUserId]: true }));

    try {
      const response = await fetch('http://localhost:5000/api/user/add_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ target_user_id: targetUserId })
      });
      const data = await response.json();
      if (response.ok) {
        fetchUserData(); // Re-fetch current user data
      } else {
        console.error(`Error following user: ${data.error}`);
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleUnfollow = async (targetUserId) => {
    setLoading(prev => ({ ...prev, [targetUserId]: true }));

    try {
      const response = await fetch('http://localhost:5000/api/user/remove_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ target_user_id: targetUserId })
      });
      const data = await response.json();
      if (response.ok) {
        fetchUserData(); // Re-fetch current user data
      } else {
        console.error(`Error unfollowing user: ${data.error}`);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className='w-full relative'>
      <div className='relative flex items-center'>
        <BiSearchAlt className='absolute left-3 text-gray-400' size={24} />
        <input
          type="text"
          placeholder='Search users...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-full lg:w-96 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none'
        />
      </div>
      {suggestions.length > 0 && (
        <div className='absolute top-full mt-1 w-full bg-white shadow-lg rounded-md z-10'>
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion._id} 
              className='flex items-center justify-between p-2 border-b last:border-none cursor-pointer'
              onClick={() => handleUserClick(suggestion.username)}
            >
              <div className='flex items-center'>
                <img 
                  src={suggestion.avatar_url || '/user_default.png'} 
                  alt={suggestion.username} 
                  className='w-10 h-10 rounded-full mr-2' 
                />
                <div className='flex flex-col'>
                  <p className='font-bold'>{suggestion.username}</p>
                  <p className='text-gray-500 text-xs mt-auto'>{suggestion.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                {user && user.friends.following.includes(suggestion._id) ? (
                  <button 
                    className='text-xs px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-500 flex items-center justify-center'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnfollow(suggestion._id);
                    }}
                    disabled={loading && loading[suggestion._id]}
                  >
                    {loading && loading[suggestion._id] ? (
                      <MDBSpinner color='light' size='sm' />
                    ) : (
                      'Unfollow'
                    )}
                  </button>
                ) : (
                  <button 
                    className='text-xs px-3 py-1 rounded-md bg-yellow-500 text-gray-800 hover:bg-yellow-400 flex items-center justify-center'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(suggestion._id);
                    }}
                    disabled={loading && loading[suggestion._id]}
                  >
                    {loading && loading[suggestion._id] ? (
                      <MDBSpinner color='dark' size='sm' />
                    ) : (
                      'Follow'
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
