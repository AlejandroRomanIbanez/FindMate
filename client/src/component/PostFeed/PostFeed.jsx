import React from "react";
import Post from "./Post";
import Ad from "../Ad/Ad";


const mockAds = [
  {
    id: "ad1",
    logo_url: "https://cdn.pixabay.com/photo/2023/07/04/07/25/self-consciousness-8105584_960_720.jpg",
    company: "Company A",
    title: "Check out our product",
    description: "This is an amazing product that you should check out!",
    img_url: "https://images.pexels.com/photos/6771243/pexels-photo-6771243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "ad2",
    logo_url: "https://cdn.pixabay.com/photo/2015/12/09/13/44/vector-1084755_960_720.png",
    company: "Company B",
    title: "Our services",
    description: "We provide excellent services that you can rely on.",
    img_url: "https://images.pexels.com/photos/3671145/pexels-photo-3671145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];

function PostFeed({ posts, allUsers, onDeletePost }) {
  // Combine posts and ads
  const combinedFeed = [...posts, ...mockAds].sort(() => 0.5 - Math.random());

  return (
    <div className="w-full lg:w-4/5 my-2 lg:px-3 py-2 flex items-center justify-center flex-col-reverse">
      {combinedFeed.map((item) =>
        item._id ? (
          <Post key={item._id} post={item} allUsers={allUsers} onDeletePost={onDeletePost} />
        ) : (
          <Ad key={item.id} ad={item} />
        )
      )}
    </div>
  );
}

export default PostFeed;
