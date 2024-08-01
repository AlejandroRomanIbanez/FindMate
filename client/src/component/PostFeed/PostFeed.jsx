import React from "react";
import Post from "./Post";

function PostFeed() {
  const mockPosts = [
    {
      id: 1,
      userPhoto: "https://via.placeholder.com/100",
      userEmail: "johndoe@example.com",
      displayName: "John Doe",
      description: "This is the content of the first post.",
      imageUrl: "https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp",
    },
    {
      id: 2,
      userPhoto: "https://via.placeholder.com/100",
      userEmail: "janedoe@example.com",
      displayName: "Jane Doe",
      description: "This is the content of the second post.",
      imageUrl: "https://via.placeholder.com/600x300",
    },
  ];

  return (
    <div className="w-full lg:w-4/5 my-2 lg:px-3 py-2 flex items-center justify-center flex-col-reverse">
      {mockPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostFeed;
