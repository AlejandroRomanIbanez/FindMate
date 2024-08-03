import React from "react";
import Post from "./Post";

function PostFeed({ posts, currentUser, onDeletePost }) {
  return (
    <div className="w-full lg:w-4/5 my-2 lg:px-3 py-2 flex items-center justify-center flex-col-reverse">
      {posts.map((post) => (
        <Post key={post._id} post={post} currentUser={currentUser} onDeletePost={onDeletePost} />
      ))}
    </div>
  );
}

export default PostFeed;
