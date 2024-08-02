import React, { useEffect, useState } from "react";
import NewPost from "../NewPost/NewPost";
import PostFeed from "../PostFeed/PostFeed";
import ProfileCard from "../ProfileCard/ProfileCard";
import Hobbies from "../Hobbies/Hobbies";
import PossibleFriends from "../PossibleFriends/PossibleFriends";

function Home() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
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
          console.error('Error fetching user data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

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

    fetchUserData();
    fetchPosts();
  }, []);

  return (
    <div className="w-full flex items-start justify-center" style={{ background: 'linear-gradient(to right, white, black)', minHeight: '100vh' }}>
      {/* Left side components */}
      <div className="hidden xl:flex items-center justify-center flex-col p-4 w-0 md:w-1/4 sticky left-0 top-16">
        <ProfileCard user={user} />
        <Hobbies />
      </div>

      {/* Center side components */}
      <div className="flex items-center justify-center flex-col p-3 w-full xl:w-1/2">
        <NewPost />
        <PostFeed posts={posts} currentUser={user} />
      </div>

      {/* Right side components */}
      <div className="hidden 2xl:flex items-center justify-center flex-col p-3 w-1/4 sticky right-0 top-16">
        <PossibleFriends />
      </div>
    </div>
  );
}

export default Home;
