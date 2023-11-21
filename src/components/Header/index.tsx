'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// import { useAccount } from 'wagmi';
// import { useStore } from 'zustand';
// import { useConnectWallet } from '@/stores/connectWallet';
import { menuData } from './menuData';

export const Header = () => {
  const pathname = usePathname();

  // const { onOpen } = useStore(useConnectWallet);

  // const { address, isConnected } = useAccount();

  // const [isClient, setIsClient] = useState(false);

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleStickyNavbar);
  });

  return (
    <header
      className={`header top-0 z-40 flex h-[105px] w-full items-center justify-center bg-transparent ${
        sticky
          ? 'shadow-sticky dark:!bg-primary !fixed !bg-gray-900 !bg-opacity-80 backdrop-blur-sm !transition dark:!bg-opacity-20'
          : 'absolute'
      }`}
    >
      <div className='relative flex w-full max-w-[1280px] items-center justify-center px-0 max-[1279px]:px-[32px] lg:justify-between'>
        <div className='w-52 max-w-full'>
          <Link
            href='/'
            className={`header-logo block w-full ${
              sticky ? 'py-5 lg:py-2' : 'py-8'
            } `}
          >
            <Image src='/images/prana.png' alt='logo' width={60} height={30} />
          </Link>
        </div>
        <div className='flex items-center justify-center lg:gap-3 xl:gap-6'>
          <nav
            id='navbarCollapse'
            className='navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark visible static right-0 top-[120%] z-30 w-auto rounded border-none bg-transparent p-0 px-6 py-4 opacity-100 duration-300'
          >
            <ul className='flex space-x-6'>
              {menuData.map((menuItem) => (
                <li key={menuItem.id} className='group relative'>
                  <Link
                    href={menuItem.path || '/'}
                    className='text-dark mr-0 inline-flex px-0 text-xl font-semibold leading-relaxed group-hover:opacity-70 dark:text-black'
                  >
                    {menuItem.title}
                  </Link>
                  {pathname === menuItem.path && (
                    <div className='border-whiteAlpha-600 shrink grow basis-0 self-stretch border-2' />
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className='flex max-w-[212px] items-center justify-center'>
          <Image src='/images/swing.png' alt='logo' width={160} height={100} />
        </div>
        {/* <button
          type="button"
          className="hidden lg:flex max-w-[212px] h-[45px] pl-4 pr-6 py-4 bg-brandBlue-200 rounded-[5px] justify-center items-center gap-4 font-size-[14px]"
          onClick={!isConnected ? onOpen : undefined}
        >
          <BiWallet size={"1.5rem"} />
          <div className="text-white text-lg font-bold">
            {isClient && address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Connect Wallet"}
          </div>
        </button> */}
      </div>
    </header>
  );
};
