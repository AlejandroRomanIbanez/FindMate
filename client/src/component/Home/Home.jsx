import React, { useEffect } from "react";
import NewPost from "../NewPost/NewPost";
import PostFeed from "../PostFeed/PostFeed"
import ProfileCard from "../ProfileCard/ProfileCard";
import Hobbies from "../Hobbies/Hobbies";
import PossibleFriends from "../PossibleFriends/PossibleFriends";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full flex items-start justify-center" style={{ background: 'linear-gradient(to right, white, black)', minHeight: '100vh' }}>
      {/* Left side components */}
      <div className="hidden xl:flex items-center justify-center flex-col p-4 w-0 md:w-1/4 sticky left-0 top-16">
        <ProfileCard />
        <Hobbies />
      </div>

      {/* Center side components */}
      <div className="flex items-center justify-center flex-col p-3 w-full xl:w-1/2">
        <NewPost />
        <PostFeed />
      </div>

      {/* Right side components */}
      <div className="hidden 2xl:flex items-center justify-center flex-col p-3 w-1/4 sticky right-0 top-16">
        <PossibleFriends />
      </div>
    </div>
  );
}

export default Home;
