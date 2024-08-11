import React from "react";
import { ProfileCardSkeleton } from "../Skeleton/Skeleton"; // Adjust the import path as needed

function ProfileCard({ user, onOpenFriendsModal }) {
  if (!user) {
    return <ProfileCardSkeleton />;
  }

  return (
    <div className="w-full max-w-sm bg-gray-800 shadow-md rounded-3xl overflow-hidden relative flex items-center justify-center flex-col p-4">
      <img
        src={user?.avatar_url || "user_default.png"}
        alt="userPic"
        className="w-full h-24 object-cover rounded-t-lg"
      />
      <img
        src={user?.avatar_url || "user_default.png"}
        alt="userPic"
        className="w-20 h-20 object-cover rounded-full border-4 border-gray-700 absolute top-16 shadow-2xl"
      />

      <div className="mt-14 w-full flex items-center justify-between px-4">
        <div 
          className="flex items-center justify-center flex-col cursor-pointer" 
          onClick={() => onOpenFriendsModal('followers')}
        >
          <h1 className="font-bold text-gray-300">{user?.friends.followers.length}</h1>
          <h2 className="text-sm text-gray-500 font-semibold">Followers</h2>
        </div>
        <div 
          className="flex items-center justify-center flex-col cursor-pointer" 
          onClick={() => onOpenFriendsModal('following')}
        >
          <h1 className="font-bold text-gray-300">{user?.friends.following.length}</h1>
          <h2 className="text-sm text-gray-500 font-semibold">Following</h2>
        </div>
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <div className="flex items-center justify-center flex-col">
          <h1 className="font-bold text-xl capitalize text-gray-300">
            {user?.username}
          </h1>
          <h2 className="text-sm text-gray-500 font-semibold mt-1">
            {user?.email}
          </h2>
        </div>
      </div>

      <div className="w-full text-center capitalize px-4 text-gray-300 mt-2 break-words">
        {user?.bio}
      </div>
      <button
        className="text-center font-semibold w-4/5 rounded-xl bg-gray-700 hover:bg-gray-600 py-2 mt-2 text-gray-300"
        onClick={() => window.location.href = "/profile/" + user.username}
      >
        My Profile
      </button>
    </div>
  );
}

export default ProfileCard;
