import React from "react";

const Skeleton = ({ className }) => (
  <div aria-live="polite" aria-busy="true" className={className}>
    <span className="inline-flex w-full animate-pulse select-none rounded-md bg-gray-300 leading-none">
      ‌
    </span>
    <br />
  </div>
);

const SVGSkeleton = ({ className }) => (
  <svg
    className={
      className + " animate-pulse rounded bg-gray-300"
    }
  />
);

const ProfileCardSkeleton = () => (
    <div className="flex justify-center w-full h-full p-10">
      <Skeleton className="w-full h-24 mb-4" />
      <div className="w-20 h-20 bg-gray-300 rounded-full border-4 border-gray-700 absolute top-16 shadow-2xl mb-4"></div>
      <div className="w-full flex justify-between px-4 mt-14">
        <Skeleton className="w-1/4 h-6 mb-2" />
        <Skeleton className="w-1/4 h-6 mb-2" />
      </div>
      <Skeleton className="w-3/4 h-6 mt-4 mb-2" />
      <Skeleton className="w-full h-4 mt-2 mb-4" />
      <Skeleton className="w-4/5 h-10 mt-4 mb-2" />
    </div>
  );

const SkeletonPossibleFriends = () => (
  <div className="w-full px-5">
    <div className="w-full h-16 bg-gray-900 rounded-lg shadow-lg my-2 flex items-center justify-between p-2">
      <span className="flex items-center">
        <div className="w-10 h-10 border-2 border-gray-300 mx-2 rounded-lg bg-gray-600" />
        <div className="h-4 bg-gray-600 rounded w-1/3 mx-2" />
      </span>
      <span className="flex items-center">
        <div className="h-4 bg-gray-600 rounded w-16 mx-2" />
        <div className="h-4 bg-gray-600 rounded w-6 mx-2" />
      </span>
    </div>
  </div>
);

export { Skeleton, SVGSkeleton, SkeletonPossibleFriends, ProfileCardSkeleton };
