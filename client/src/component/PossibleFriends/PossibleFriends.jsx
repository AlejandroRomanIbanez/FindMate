import React, { useState, useEffect, useMemo, useCallback } from "react";
import { RxCross2 } from "react-icons/rx";
import { MDBSpinner } from 'mdb-react-ui-kit';
import { SkeletonPossibleFriends } from "../Skeleton/Skeleton";

function PossibleFriends({ allUsers, currentUser, fetchCurrentUser, loading, setLoading }) {
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);

  const filterUsers = useCallback((allUsers, currentUser) => {
    return allUsers
      .filter(user => user.username !== currentUser.username && !currentUser.friends.following.includes(user._id))
      .sort(() => 0.5 - Math.random());
  }, []);
  
  const memoizedFilteredUsers = useMemo(() => filterUsers(allUsers, currentUser), [allUsers, currentUser]);

  useEffect(() => {
    if (memoizedFilteredUsers.length > 0 && filteredUsers.length === 0) {
      setFilteredUsers(memoizedFilteredUsers);
      setLoadingFriends(false);
    }
  }, [memoizedFilteredUsers, filteredUsers]);

  useEffect(() => {
    const updateCurrentUsers = () => {
      const indexOfLastUser = currentPage * usersPerPage;
      const indexOfFirstUser = indexOfLastUser - usersPerPage;
      setCurrentUsers(filteredUsers.slice(indexOfFirstUser, indexOfLastUser));
    };

    if (!loadingFriends) {
      updateCurrentUsers();
    }
  }, [currentPage, usersPerPage, filteredUsers, loadingFriends]);

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
        fetchCurrentUser();
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
        fetchCurrentUser();
      } else {
        console.error(`Error unfollowing user: ${data.error}`);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleRemove = (targetUserId) => {
    setFilteredUsers(prevUsers => prevUsers.filter(user => user._id !== targetUserId));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const isLastPage = currentPage === Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="w-full max-w-lg bg-gray-800 shadow-md rounded-3xl overflow-hidden relative flex items-center justify-center flex-col p-4 my-5">
      <span className="w-full px-5 font-bold text-xl text-gray-300 flex items-center justify-center">
        <span>Possible Friends</span>
      </span>

      {loadingFriends ? (
        Array.from({ length: usersPerPage }).map((_, index) => (
          <SkeletonPossibleFriends key={index} />
        ))
      ) : (
        currentUsers.map((item) => (
          <div key={item._id} className="w-full px-5">
            <span className="w-full h-16 bg-gray-900 rounded-lg shadow-lg my-2 flex items-center justify-between p-2">
              <span className="flex items-center">
                <img
                  src={item.avatar_url || '/user_default.png'}
                  alt=""
                  className="w-10 h-10 border-2 border-gray-300 mx-2 rounded-lg cursor-pointer"
                />
                <h1 className="text-sm text-gray-300 font-semibold cursor-pointer mx-2">
                  {item.username}
                </h1>
              </span>
              <span className="flex items-center">
                {currentUser && currentUser.friends.following.includes(item._id) ? (
                  <button 
                    className="text-xs px-3 py-1 rounded-md bg-gray-500 text-white flex items-center justify-center"
                    onClick={() => handleUnfollow(item._id)}
                    disabled={loading[item._id]}
                  >
                    {loading[item._id] ? (
                      <MDBSpinner color='light' size='sm' />
                    ) : (
                      'Unfollow'
                    )}
                  </button>
                ) : (
                  <button 
                    className="text-xs px-3 py-1 rounded-md bg-yellow-500 text-gray-800 hover:bg-yellow-400 flex items-center justify-center"
                    onClick={() => handleFollow(item._id)}
                    disabled={loading[item._id]}
                  >
                    {loading[item._id] ? (
                      <MDBSpinner color='dark' size='sm' />
                    ) : (
                      'Follow'
                    )}
                  </button>
                )}
                <RxCross2 className="text-white cursor-pointer ml-2" onClick={() => handleRemove(item._id)} />
              </span>
            </span>
          </div>
        ))
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 text-white'}`}
        >
          Prev
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={isLastPage}
          className={`mx-1 px-3 py-1 rounded ${isLastPage ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PossibleFriends;
