import { MDBCard, MDBCol, MDBRow } from "mdb-react-ui-kit";
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

const HobbiesSkeleton = () => (
    <div className="w-full max-w-sm bg-gray-800 shadow-md rounded-3xl overflow-hidden relative flex items-center justify-center flex-col p-4 my-5">
      <span className="w-full px-5 font-bold text-xl text-gray-300 flex items-center justify-center">
        <Skeleton className="w-1/2 h-6" />
      </span>
      <Skeleton className="w-11/12 h-8 mt-3" />
      <span className="w-full h-auto flex items-center justify-center flex-wrap p-2 mt-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="w-16 h-6 mx-1 my-1" />
        ))}
      </span>
    </div>
  );

const NewPostSkeleton = () => (
    <div className="w-full lg:w-4/5 rounded-xl px-3 py-2 bg-gray-800 flex items-center justify-center flex-col animate-pulse">
        <span className="flex items-center justify-center w-full">
        <div className="lg:w-12 lg:h-12 w-10 h-10 rounded-2xl border-2 border-gray-500 bg-gray-600"></div>
        <div className="w-3/4 lg:w-3/4 lg:h-9 h-8 bg-gray-600 mx-2 rounded-lg"></div>
        </span>
        <span className="flex flex-wrap items-center justify-end w-full lg:w-4/5 my-3">
        <div className="flex items-center justify-center bg-gray-700 px-3 rounded-lg py-2 m-1">
            <div className="text-green-600 mx-1 bg-gray-600 rounded-full w-5 h-5"></div>
            <div className="text-white text-xs bg-gray-600 rounded-md px-3 py-1"></div>
        </div>
        </span>
    </div>
);

const HeaderSkeleton = () => (
    <div className="w-full flex items-center justify-around py-2 sticky top-0 z-50 bg-black animate-pulse">
        <span className="w-auto lg:w-1/4 flex items-center justify-start relative">
        <span className="lg:w-10 lg:h-8 w-6 h-6 bg-gray-600 rounded-full shadow-md mx-2"></span>
        <span className="lg:mx-3 lg:flex w-full relative">
            <div className="lg:w-96 w-32  h-8 bg-gray-600 rounded-lg"></div>
        </span>
        </span>
        <span className="w-auto lg:w-1/2 flex items-center justify-center">
        <span className="text-lg mx-2 bg-gray-600 rounded-full w-8 h-8"></span>
        <span className="text-lg mx-2 bg-gray-600 rounded-full w-8 h-8"></span>
        </span>
        <span className="w-auto lg:w-1/4 flex items-center justify-end cursor-pointer p-1 relative">
        <span className="w-10 lg:w-32 h-8 shadow-md bg-gray-600 flex items-center justify-center rounded-md"></span>
        </span>
    </div>
);


const ProfileSkeleton = () => (
    <MDBRow className="justify-content-center align-items-center h-100">
      <MDBCol lg="9" xl="7">
        <MDBCard>
          <div className="rounded-top text-white d-flex flex-row animate-pulse" style={{ backgroundColor: '#000', height: '200px' }}>
            <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
              <div className="mt-4 mb-2 bg-gray-600 img-thumbnail" style={{ width: '150px', height: '150px' }}></div>
            </div>
            <div className="ms-3" style={{ marginTop: '90px' }}>
              <div className="h-6 bg-gray-600 rounded-md w-32 mb-2"></div>
              <div className="h-6 bg-gray-600 rounded-md w-40 mb-2"></div>
              <div className="h-6 bg-gray-600 rounded-md w-24"></div>
            </div>
          </div>
          <div className="p-4 animate-pulse" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="d-flex justify-content-end text-center py-1">
              <div className="h-6 bg-gray-600 rounded-md w-16 mx-2"></div>
              <div className="h-6 bg-gray-600 rounded-md w-16 mx-2"></div>
              <div className="h-6 bg-gray-600 rounded-md w-16 mx-2"></div>
            </div>
          </div>
          <div className="p-4 animate-pulse">
            <div className="d-flex flex-column align-items-center mb-4">
              <div className="h-10 bg-gray-600 rounded-md mt-2 w-32 mb-4"></div>
            </div>
            <div className="h-6 bg-gray-600 rounded-md w-32 mb-4"></div>
            <div className="h-20 bg-gray-600 rounded-md mb-4"></div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="h-6 bg-gray-600 rounded-md w-32"></div>
              <div className="h-6 bg-gray-600 rounded-md w-16"></div>
            </div>
            <MDBRow className="g-2">
              <MDBCol md="6">
                <div className="h-40 bg-gray-600 rounded-md mb-2"></div>
              </MDBCol>
              <MDBCol md="6">
                <div className="h-40 bg-gray-600 rounded-md mb-2"></div>
              </MDBCol>
              <MDBCol md="6">
                <div className="h-40 bg-gray-600 rounded-md mb-2"></div>
              </MDBCol>
              <MDBCol md="6">
                <div className="h-40 bg-gray-600 rounded-md mb-2"></div>
              </MDBCol>
            </MDBRow>
          </div>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );

  

export { Skeleton, SVGSkeleton, SkeletonPossibleFriends, ProfileCardSkeleton, HobbiesSkeleton, NewPostSkeleton, HeaderSkeleton, ProfileSkeleton };
