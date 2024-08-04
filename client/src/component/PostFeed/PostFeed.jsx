import React from "react";
import Post from "./Post";
import Ad from "../Ad/Ad";
import { useState, useMemo, useEffect } from "react";

const mockAds = [
  {
    id: "ad1",
    logo_url: "https://cdn.pixabay.com/photo/2023/07/04/07/25/self-consciousness-8105584_960_720.jpg",
    company: "Crypto Bro",
    title: "Check out our product",
    description: "This is an amazing product that you should check out!",
    img_url: "https://images.pexels.com/photos/6771243/pexels-photo-6771243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "ad2",
    logo_url: "https://cdn.pixabay.com/photo/2015/12/09/13/44/vector-1084755_960_720.png",
    company: "Prolos",
    title: "Bring order to chaos",
    description: "We provide excellent services that you can rely on.",
    img_url: "https://images.pexels.com/photos/3671145/pexels-photo-3671145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];

const PostSkeleton = () => (
  <div className="bg-gray-800 w-full lg:px-4 py-2 my-3 rounded-3xl flex items-center justify-center flex-col">
    <div className="w-full flex items-center justify-center my-2">
      <div className="w-1/12 flex items-center justify-center">
        <div className="lg:w-10 lg:h-10 w-8 h-8 rounded-2xl bg-gray-600"></div>
      </div>
      <div className="w-3/4 flex items-start justify-center flex-col">
        <div className="mx-2 bg-gray-600 h-4 w-1/2 my-1"></div>
        <div className="mx-2 bg-gray-600 h-4 w-3/4 my-1"></div>
      </div>
    </div>
    <div className="text-white text-sm lg:text-base w-full px-5 my-2 font-light tracking-wider">
      <div className="bg-gray-600 h-4 w-full my-1"></div>
      <div className="bg-gray-600 h-4 w-full my-1"></div>
      <div className="bg-gray-600 h-4 w-full my-1"></div>
    </div>
    <div className="w-full px-5 my-4">
      <div className="bg-gray-600 h-72 md:h-96 lg:h-[36rem] rounded-2xl"></div>
    </div>
  </div>
);

function PostFeed({ posts, allUsers, onDeletePost, loading, currentUser }) {
  const [combinedFeed, setCombinedFeed] = useState([]);

  // Memoize the ad integration logic
  const integrateAdsWithPosts = useMemo(() => (postsToIntegrate) => {
    const combined = [...postsToIntegrate];
    const adCount = Math.min(mockAds.length, Math.floor(postsToIntegrate.length / 2));
    for (let i = 0; i < adCount; i++) {
      const adIndex = Math.floor(Math.random() * (combined.length + 1));
      combined.splice(adIndex, 0, mockAds[i]);
    }
    return combined;
  }, []);

  useEffect(() => {
    if (!loading && posts.length > 0) {
      const integrated = integrateAdsWithPosts(posts);
      setCombinedFeed(integrated);
    }
  }, [posts, loading, integrateAdsWithPosts]);

  if (loading) {
    return (
      <div className="w-full lg:w-4/5 my-2 lg:px-3 py-2 flex items-center justify-center flex-col-reverse">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full lg:w-4/5 my-2 lg:px-3 py-2 flex items-center justify-center flex-col-reverse">
      {combinedFeed.map((item) =>
        item._id ? (
          <Post key={item._id} post={item} allUsers={allUsers} onDeletePost={onDeletePost} currentUser={currentUser} />
        ) : (
          <Ad key={item.id} ad={item} isProfile={false} />
        )
      )}
    </div>
  );
}


export default PostFeed;
