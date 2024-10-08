// Ad.js
import React from "react";
import { MDBTooltip } from "mdb-react-ui-kit";
import { FaAd } from 'react-icons/fa';

function Ad({ ad, isProfile }) {
  return (
    <div className="bg-gray-800 w-full lg:px-4 py-2 my-3 rounded-3xl flex items-center justify-center flex-col relative">
      {/* ad top section */}
      <span className="w-full flex items-center justify-center my-2">
        <span className="w-1/12 flex items-center justify-center">
          <img
            src={ad.logo_url}
            alt="adLogo"
            className="lg:w-10 lg:h-10 w-8 h-8 rounded-2xl object-cover border-2 border-gray-500"
          />
        </span>
        <span className="w-3/4 flex items-start justify-center flex-col">
          <h3 className="mx-2 text-gray-400 text-sm lg:text-base font-semibold my-1">
            {ad.company || "Ad"}
          </h3>
          <h3 className="mx-2 text-gray-200 text-sm lg:text-lg font-semibold flex items-center justify-center">
            {ad.title || "Advertisement"}
          </h3>
        </span>
        <span className="w-1/12 flex items-center justify-center">
          <MDBTooltip tag='span' wrapperClass='d-inline-block' title='This is an ad'>
            <FaAd fontSize={20} className="text-yellow-500 cursor-pointer" />
          </MDBTooltip>
        </span>
      </span>
      <span className="text-white text-sm lg:text-base w-full px-5 my-2 font-light tracking-wider">
        {ad.description}
      </span>
      {/* ad image section */}
      <span className="w-full px-5 my-4 relative">
        <img
          src={ad.img_url}
          alt="ad"
          className="w-full h-72 md:h-96 lg:h-[36rem] object-cover rounded-2xl"
        />
        {isProfile && (
          <span className="absolute top-2 right-2">
            <MDBTooltip tag='span' wrapperClass='d-inline-block' title='This is an ad'>
              <FaAd fontSize={20} className="text-yellow-500 cursor-pointer" />
            </MDBTooltip>
          </span>
        )}
      </span>
    </div>
  );
}

export default Ad;
