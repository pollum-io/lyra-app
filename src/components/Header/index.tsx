"use client";

import { useConnectWallet } from "@/stores/connectWallet";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BiWallet } from "react-icons/bi";

import { useAccount } from "wagmi";
import { useStore } from "zustand";

export const Header = () => {
  const pathname = usePathname();

  const { onOpen } = useStore(useConnectWallet);

  const { address, isConnected } = useAccount();

  const [isClient, setIsClient] = useState(false);

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  return (
    <header
      className={`header top-0 z-40 flex h-[105px] w-full items-center justify-center bg-transparent ${
        sticky
          ? "shadow-sticky dark:!bg-primary !fixed !bg-gray-900 !bg-opacity-80 backdrop-blur-sm !transition dark:!bg-opacity-20"
          : "absolute"
      }`}
    >
      <div className="relative flex w-full max-w-[1280px] items-center justify-center px-0 max-[1279px]:px-[32px] lg:justify-between">
        <div className="w-52 max-w-full">
          <Link
            href="/"
            className={`header-logo block w-full ${
              sticky ? "py-5 lg:py-2" : "py-8"
            } `}
          >
            <Image src="/images/lyra.png" alt="logo" width={120} height={30} />
          </Link>
        </div>

        <button
          type="button"
          className="bg-brandBlue-200 font-size-[14px] flex h-[45px] max-w-[212px] items-center justify-center gap-4 rounded-[5px] py-4 pl-4 pr-6"
          onClick={!isConnected ? onOpen : undefined}
        >
          <BiWallet size={"1.5rem"} />
          <div className="text-lg font-bold text-white">
            {isClient && address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Connect Wallet"}
          </div>
        </button>
      </div>
    </header>
  );
};
