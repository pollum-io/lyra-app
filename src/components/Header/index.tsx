"use client";

import { useConnectWallet } from "@/stores/connectWallet";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiWallet } from "react-icons/bi";
import { RiLogoutBoxLine, RiUserLine } from "react-icons/ri";

import { useAccount, useDisconnect } from "wagmi";
import { useStore } from "zustand";
import { Button } from "../Button";
import {
  useFaucetWrite
} from "@/hooks/useRBLLPoolContract";
import { useToastStore } from "@/stores/toast";
import { useWaitForTransaction } from "wagmi";
import {
  EthereumAddress
} from "@/hooks/useErc20";

export const Header = () => {
  const { disconnect } = useDisconnect();
  const { onOpen } = useStore(useConnectWallet);

  const { address, isConnected } = useAccount();

  const [isClient, setIsClient] = useState(false);

  const [isLoadingTx, setLoadingTx] = useState(false);
  const [transactionHash, setTransactionHash] = useState<
  EthereumAddress | undefined
>(undefined);

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

  const {
    write: writeFaucet,
    data: dataFaucet,
    isLoading: isLoadingFaucet,
    isSuccess: isSuccessFaucet,
    isError: isErrorFaucet,
  } = useFaucetWrite();

  const transaction = useWaitForTransaction({
    hash: transactionHash,
  });
  console.log(isErrorFaucet)
  useEffect(() => {
    if (transaction.isSuccess) {
      useToastStore
        .getState()
        .showToast("Claim Successfully Completed", "success");
    }
    if (transaction.isError && transactionHash !== "0x") {
      useToastStore
        .getState()
        .showToast(`Error: Need to Wait 1 hour`, "error");
    }
    setTransactionHash(undefined);
    setLoadingTx(false);
  }, [transaction.isSuccess, transaction.isError]);
  useEffect(() => {
    if (isSuccessFaucet) {
      setTransactionHash(dataFaucet.hash);
      setLoadingTx(true);
      useToastStore
        .getState()
        .showToast("Faucet Initiated", "success");
    }
    if (isErrorFaucet) {
      useToastStore.getState().showToast("Transaction Rejected", "error");
    }
  }, [isErrorFaucet, isSuccessFaucet]);

  return (
    <header
      className={`header top-0 z-10 flex h-[105px] w-full items-center justify-center bg-transparent ${
        sticky
          ? "shadow-sticky !fixed !bg-gray-900 !bg-opacity-20 backdrop-blur-sm !transition"
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

        <div className="flex min-w-[212px]">
          {isClient &&
            (!isConnected ? (
              <button
                type="button"
                className="bg-brandBlue-300 flex h-[45px] max-w-[212px] items-center justify-center gap-4 rounded-[5px] py-4 pl-4 pr-6 text-sm"
                onClick={onOpen}
              >
                <BiWallet size={"1.5rem"} />
                <div className="text-lg font-bold text-white">
                  Connect Wallet
                </div>
              </button>
            ) : (
              <div className="flex cursor-pointer">
              <Button
                text={"Faucet"}
                height="h-[16px]"
                maxWidth="max-w-[60px]"
                textSize="text-xs"
                onClick={writeFaucet} />
              <div className="group relative ml-2">
                <div className="bg-brandBlue-300 flex h-[45px] max-w-[212px] items-center justify-center gap-4 rounded-[5px] py-4 pl-4 pr-6 text-sm">
                  <div className="w-30 h-30 bg-brandBlue-300 flex items-center justify-center rounded-full p-2">
                    <RiUserLine size={18} color="white" />
                  </div>
                  {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
                </div>
                <div className="z-10 absolute bottom-[-50px] left-0 right-0 flex opacity-0 group-hover:flex group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => disconnect()}
                    className="mt-2 flex h-[45px] w-full items-center justify-center gap-2 rounded-[5px] bg-gray-500"
                  >
                    <RiLogoutBoxLine size={18} color="white" />
                    <div>Disconnect</div>
                  </button>
                </div>
              </div>
            </div>
            
                  
            ))}
        </div>
      </div>
    </header>
  );
};
