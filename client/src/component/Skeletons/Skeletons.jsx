import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function ProfileCardSkeleton() {
  return (
    <div className="w-full max-w-sm bg-gray-800 shadow-md rounded-3xl overflow-hidden relative flex items-center justify-center flex-col p-4 my-5">
      <Skeleton circle={true} height={150} width={150} />
      <Skeleton height={30} width={`80%`} style={{ marginTop: 20 }} />
      <Skeleton count={3} width={`90%`} style={{ marginTop: 10 }} />
    </div>
  );
}

export function HobbiesSkeleton() {
  return (
    <div className="w-full max-w-sm bg-gray-800 shadow-md rounded-3xl overflow-hidden relative flex items-center justify-center flex-col p-4 my-5">
      <Skeleton height={30} width={`80%`} />
      <Skeleton count={4} width={`90%`} style={{ marginTop: 10 }} />
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div className="bg-gray-800 w-full lg:px-4 py-2 my-3 rounded-3xl flex items-center justify-center flex-col">
      <Skeleton height={50} width={`90%`} />
      <Skeleton height={200} width={`90%`} style={{ marginTop: 10 }} />
      <Skeleton count={2} width={`90%`} style={{ marginTop: 10 }} />
    </div>
  );
}
