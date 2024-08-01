import React, { useState, useEffect } from 'react';
import { BiSearchAlt } from 'react-icons/bi';

// Mock data for users
const mockUsers = [
  { _id: '1', name: 'John Doe', username: 'johndoe', avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp' },
  { _id: '2', name: 'Jane Smith', username: 'janesmith', avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp' },
  { _id: '3', name: 'Alice Johnson', username: 'alicejohnson', avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-3.webp' },
  { _id: '4', name: 'Robert Brown', username: 'robertbrown', avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-4.webp' },
  { _id: '5', name: 'Emma Wilson', username: 'emmawilson', avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-5.webp' },
  { _id: '6', name: 'James Williams', username: 'jameswilliams', avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-6.webp' },
  { _id: '7', name: 'Olivia Martinez', username: 'oliviamartinez', avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-7.webp' },
  { _id: '8', name: 'Liam Garcia', username: 'liamgarcia', avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-8.webp' },
];

const Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = () => {
      if (query.length > 1) {
        const filteredSuggestions = mockUsers.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
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
  }, [query]);

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
                <img src={suggestion.avatar} alt={suggestion.name} className='w-10 h-10 rounded-full mr-2' />
                <div className='flex flex-col'>
                  <p className='font-bold'>{suggestion.name}</p>
                  <p className='text-gray-500 text-xs'>@{suggestion.username}</p>
                </div>
              </div>
              <button className='bg-yellow-500 text-xs text-gray-800 px-3 py-1 rounded-md'>Follow</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
