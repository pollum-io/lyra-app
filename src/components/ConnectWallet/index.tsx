"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Connector, useConnect } from "wagmi";
import { useStore } from "zustand";

import { useConnectWallet } from "@/stores/connectWallet";
import Modal from "../Modal";

export function ConnectWallet() {
  const { connectors, connectAsync } = useConnect();
  const { isOpen, onClose } = useStore(useConnectWallet);

  const metamask = connectors.find((c) => c.id === "metaMask");
  const walletConnect = connectors.find((c) => c.id === "walletConnect");

  const connect = async (connector: Connector<any, any> | undefined) => {
    try {
      await connectAsync({ connector });
      setTimeout(onClose, 2500);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    });

    return () => {
      addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          onClose();
        }
      });
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full rounded-[20px] bg-gray-700">
        <div className="flex h-[370px] w-full  items-start">
          <div className="flex h-full max-w-[400px] flex-col justify-center px-[48px] text-left max-[639px]:px-[30px]">
            <h3 className="text-2xl font-bold">Connect Wallet</h3>
            <p className="mt-4 text-gray-300">
              By connecting a wallet, you agree to the LYRA LOANS{" "}
              <a href="#" className="underline">
                Terms of Use
              </a>
              .
            </p>

            <button
              type="button"
              disabled={!metamask?.ready}
              className="hover:bg-brandBlue-200 transition:all mt-6 flex w-full items-center gap-4 rounded-[5px] border-[1px] border-gray-600 bg-gray-900 p-[8px] duration-300"
              onClick={() => connect(metamask)}
            >
              <Image
                src={`/images/metamask.svg`}
                width={30}
                height={30}
                alt=""
              />
              <p>{"Metamask"}</p>
            </button>

            <button
              type="button"
              className="hover:bg-brandBlue-200 transition:all mt-2 flex w-full items-center gap-4 rounded-[5px] border-[1px] border-gray-600 bg-gray-900 p-[8px] duration-300"
              onClick={() => connect(walletConnect)}
            >
              <Image
                src={"/images/walletconnect.svg"}
                width={30}
                height={30}
                alt=""
              />
              <p>Wallet Connect</p>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="border-brandBlue-50 hover:bg-whiteAlpha-100 mt-6 w-full rounded-[5px] border-[1px] bg-gray-900 p-[8px] text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
