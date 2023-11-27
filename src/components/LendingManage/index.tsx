"use client";

import { useLendingModal } from "@/stores/lendingModal";
import { useEffect } from "react";
import { useStore } from "zustand";
import Modal from "../Modal";
import Tabs, { TabContent } from "../Tabs";
import Image from "next/image";
import { Button } from "../Button";

export function LendingManage() {
  const { isOpen, onClose } = useStore(useLendingModal);

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
      <div className="bg-primary h-[440px] w-[392px] rounded-lg p-6">
        <Tabs>
          <TabContent title="Supply">
            <div className="flex h-[300px] w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex h-full w-full items-start justify-start  gap-3">
                <div className="border-brandBlue-300 flex h-16 w-20 rounded-full">
                  <Image
                    src={"/images/prana.png"}
                    alt="logo"
                    width={64}
                    height={64}
                    className="rounded-full"
                    objectFit="cover"
                  />
                </div>
                <div className=" flex h-full w-full flex-col items-start justify-start gap-1">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Wallet Balance: 96.29 ETH
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-start justify-start rounded-lg border border-opacity-20 bg-gray-700">
                    <div className="flex h-10 shrink grow basis-0 items-center justify-start gap-2.5 px-[22px] py-2">
                      <div className="min-w-[50px] text-base font-normal leading-normal text-white">
                        1
                      </div>
                    </div>
                    <div className="flex w-16 items-center justify-center gap-2.5 px-4 py-2">
                      <div className="text-brandBlue-300 text-base font-normal leading-normal">
                        max
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button text="Supply [name]" />
            </div>
          </TabContent>
          <TabContent title="Withdraw">
            {/* Conteúdo da aba Withdraw */}
          </TabContent>
        </Tabs>
      </div>
    </Modal>
  );
}
