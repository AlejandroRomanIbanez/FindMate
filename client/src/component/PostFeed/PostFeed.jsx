import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";
import Ad from "../Ad/Ad";

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

function PostFeed({ posts, onDeletePost, allUsers, currentUser }) {
  const [itemsToShow, setItemsToShow] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [currentAds, setCurrentAds] = useState([]); // State to keep track of ads inserted

  const loadMorePosts = () => {
    if (itemsToShow >= posts.length) {
      setHasMore(false);
    } else {
      setItemsToShow((prev) => prev + 10);

      // Insert 2 ads for every 10 posts loaded
      const newAds = [];
      for (let i = 0; i < 2; i++) {
        const ad = mockAds[(currentAds.length + i) % mockAds.length];
        newAds.push({ ...ad, isAd: true });
      }
      setCurrentAds((prev) => [...prev, ...newAds]);
    }
  };

  const getPostsAndAds = () => {
    const combined = [];
    let postCounter = 0;
    let adCounter = 0;

    for (let i = 0; i < itemsToShow && i < posts.length; i++) {
      combined.push(posts[i]);
      postCounter++;

      // Insert ads at the appropriate points
      if (postCounter % 5 === 0 && adCounter < currentAds.length) {
        combined.push(currentAds[adCounter]);
        adCounter++;
      }
    }

    return combined;
  };

  const postsAndAds = getPostsAndAds();

  return (
    <div className="w-full lg:w-4/5 my-2 lg:px-3 py-2 flex items-center justify-center flex-col">
      <InfiniteScroll
        dataLength={postsAndAds.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={<PostSkeleton />}
        endMessage={
          <p style={{ textAlign: 'center', color: 'white' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {postsAndAds.map((item, index) => (
          item.isAd ? (
            <Ad key={item.id || index} ad={item} />
          ) : (
            <Post
              key={item._id || index} // Fallback to index if _id is not available
              post={item}
              allUsers={allUsers}
              onDeletePost={onDeletePost}
              currentUser={currentUser}
            />
          )
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default PostFeed;