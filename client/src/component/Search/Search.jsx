import React, { useState, useEffect } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { MDBSpinner } from 'mdb-react-ui-kit';

const Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchSuggestions = () => {
      if (query.length > 1) {
        const filteredSuggestions = allUsers.filter(user =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
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
  }, [query, allUsers]);

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
        if (currentUser) {
          setCurrentUser(prevUser => ({
            ...prevUser,
            friends: {
              ...prevUser.friends,
              following: [...prevUser.friends.following, targetUserId]
            }
          }));

          setSuggestions(prevSuggestions => 
            prevSuggestions.map(suggestion =>
              suggestion._id === targetUserId 
                ? { ...suggestion, friends: { ...suggestion.friends, followers: [...suggestion.friends.followers, currentUser._id] } }
                : suggestion
            )
          );
        }
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
        if (currentUser) {
          setCurrentUser(prevUser => ({
            ...prevUser,
            friends: {
              ...prevUser.friends,
              following: prevUser.friends.following.filter(id => id !== targetUserId)
            }
          }));

          setSuggestions(prevSuggestions => 
            prevSuggestions.map(suggestion =>
              suggestion._id === targetUserId 
                ? { ...suggestion, friends: { ...suggestion.friends, followers: suggestion.friends.followers.filter(id => id !== currentUser._id) } }
                : suggestion
            )
          );
        }
      } else {
        console.error(`Error unfollowing user: ${data.error}`);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
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
          className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none'
        />
      </div>
      {suggestions.length > 0 && (
        <div className='absolute top-full mt-1 w-full bg-white shadow-lg rounded-md z-10'>
          {suggestions.map((suggestion) => (
            <div key={suggestion._id} className='flex items-center justify-between p-2 border-b last:border-none'>
              <div className='flex items-center'>
                <img 
                  src={suggestion.avatar_url || '/user_default.png'} 
                  alt={suggestion.username} 
                  className='w-10 h-10 rounded-full mr-2' 
                />
                <div className='flex flex-col'>
                  <p className='font-bold'>{suggestion.username}</p>
                  <p className='text-gray-500 text-xs'>{suggestion.email}</p>
                </div>
              </div>
              {currentUser && currentUser.friends.following.includes(suggestion._id) ? (
                <button 
                  className='text-xs px-3 py-1 rounded-md bg-gray-500 text-white flex items-center'
                  onClick={() => handleUnfollow(suggestion._id)}
                  disabled={loading[suggestion._id]}
                >
                  {loading[suggestion._id] ? (
                    <MDBSpinner color='light' size='sm' />
                  ) : (
                    'Unfollow'
                  )}
                </button>
              ) : (
                <button 
                  className='text-xs px-3 py-1 rounded-md bg-yellow-500 text-gray-800 flex items-center'
                  onClick={() => handleFollow(suggestion._id)}
                  disabled={loading[suggestion._id]}
                >
                  {loading[suggestion._id] ? (
                    <MDBSpinner color='dark' size='sm' />
                  ) : (
                    'Follow'
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
