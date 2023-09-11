import React from "react";
import Image from "next/image";
import ethereumLogo from "@/assets/img/ethereumLogo.png";

const Loader = ({ title }) => {
  return (
    <div className="flex justify-center items-center flex-col w-full min-h-full">
      <Image
        src={ethereumLogo}
        alt="ethereum logo"
        className="w-56 h-56 object-contain"
        width={56}
        height={56}
      />
      <p className="font-poppins font-normal text-white text-lg text-center mt-10">
        {title}
      </p>
    </div>
  );
};

export default Loader;
