import React from "react";

const Error = ({ error }) => {
  return (
    <div className="w-full text-left mt-2 ml-2">
      <p className="font-poppins font-normal text-red-600">
        <>
          <span className="font-semibold text-red-500">{error?.reason} </span>
          {error?.description}
        </>
      </p>
    </div>
  );
};

export default Error;
