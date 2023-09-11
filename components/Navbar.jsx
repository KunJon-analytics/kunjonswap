import React from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

import logo from "@/assets/img/uniswapLogo.png";

const Navbar = () => {
  return (
    <header className="flex flex-row justify-between items-center w-full sm:py-10 py-6">
      <Link href={"/"}>
        <Image
          src={logo}
          alt="KunJon Swap Logo"
          className="w-16 h-16 object-contain"
        />
      </Link>

      <ConnectButton />
    </header>
  );
};

export default Navbar;
