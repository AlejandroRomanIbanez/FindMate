import React, { useState, useEffect } from "react";
import NewPost from "../NewPost/NewPost";
import PostFeed from "../PostFeed/PostFeed";
import ProfileCard from "../ProfileCard/ProfileCard";
import Hobbies from "../Hobbies/Hobbies";
import PossibleFriends from "../PossibleFriends/PossibleFriends";
import Friends from "../Friends/Friends";

function Home({ user, setUser, allUsers, setAllUsers, fetchUserData, loading, setLoading }) {
  const [posts, setPosts] = useState([]);
  const [newPostAdded, setNewPostAdded] = useState(false); // State to track new post addition
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState('followers');

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/post/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      } else {
        console.error('Error fetching posts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
    fetchPosts();
  }, [fetchUserData]);

  useEffect(() => {
    if (newPostAdded) {
      fetchPosts();
      setNewPostAdded(false); // Reset the flag after fetching new posts
    }
  }, [newPostAdded]);

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setNewPostAdded(true); // Trigger fetch for new posts
  };

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const handleOpenFriendsModal = (tab) => {
    setInitialTab(tab);
    setIsFriendsModalOpen(true);
  };

  const handleCloseFriendsModal = () => {
    setIsFriendsModalOpen(false);
  };

  const handleUserChange = async () => {
    await fetchUserData();
    setLoading({});
  };

  return (
    <div className="w-full flex items-start justify-center" style={{ background: 'linear-gradient(to right, white, black)', minHeight: '100vh' }}>
      {/* Left side components */}
      <div className="hidden xl:flex items-center justify-center flex-col p-4 w-0 md:w-1/4 sticky left-0 top-16">
        <ProfileCard user={user} onOpenFriendsModal={handleOpenFriendsModal} />
        <Hobbies />
      </div>

      {/* Center side components */}
      <div className="flex items-center justify-center flex-col p-3 w-full xl:w-1/2">
        <NewPost onNewPost={handleNewPost} allUsers={allUsers} currentUser={user} />
        <PostFeed posts={posts} currentUser={user} onDeletePost={handleDeletePost} />
      </div>

      {/* Right side components */}
      <div className="hidden 2xl:flex items-center justify-center flex-col p-3 w-1/4 sticky right-0 top-16">
        {allUsers.length > 0 && user && <PossibleFriends allUsers={allUsers} currentUser={user} fetchCurrentUser={fetchUserData} loading={loading} setLoading={setLoading} />}
      </div>
      <Friends 
        isOpen={isFriendsModalOpen} 
        onClose={handleCloseFriendsModal} 
        initialTab={initialTab} 
        currentUser={user} 
        allUsers={allUsers}
        fetchCurrentUser={fetchUserData} 
        onUserChange={handleUserChange} 
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}

export default Home;
