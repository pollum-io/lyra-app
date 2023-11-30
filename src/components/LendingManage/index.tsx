"use client";

import {
  useLendingModalBorrowDrex,
  useLendingModalSupplyDrex,
  useLendingModalSupplyTSelic,
} from "@/stores/lendingModal";
import { use, useEffect, useState } from "react";
import { useStore } from "zustand";
import Modal from "../Modal";
import Tabs, { TabContent } from "../Tabs";
import Image from "next/image";
import { Button } from "../Button";
import { useAccount } from "wagmi";
import {
  useBalanceOfDREX,
  useBalanceOfTSELIC,
  useApproveDREX,
} from "../../hooks/useErc20";
export function LendingManage() {
  const { isOpen: isOpenSD, onClose: onCloseSD } = useStore(
    useLendingModalSupplyDrex
  );
  const { isOpen: isOpenST, onClose: onCloseST } = useStore(
    useLendingModalSupplyTSelic
  );
  const { isOpen: isOpenBD, onClose: onCloseBD } = useStore(
    useLendingModalBorrowDrex
  );
  const [isLoading, setLoading] = useState(true);
  const { address } = useAccount();
  const {
    data: dataDrexBalance,
    isError: isDrexError,
    isLoading: isLoadingDrex,
  } = useBalanceOfDREX(address as `0x${string}`);
  const {
    data: dataTselicBalance,
    isError: isTselicError,
    isLoading: isLoadingTselic,
  } = useBalanceOfTSELIC(address as `0x${string}`);

  const {
    write: writeApproveDREX,
    data: dataApproveDREX,
    isLoading: isLoadingApproveDREX,
    isSuccess: isSuccessApproveDREX,
    isError: isErrorApproveDREX,
  } = useApproveDREX();

  const drexBalance = Number(dataDrexBalance) / 10 ** 6;
  const TselicBalance = Number(dataTselicBalance) / 10 ** 18;

  useEffect(() => {
    const loading = [isLoadingDrex, isLoadingTselic].every(
      (loading) => loading === false
    );

    setLoading(!loading);
  }, [isLoadingDrex, isLoadingTselic]);

  const renderContent = () => {
    if (isOpenSD) {
      return (
        <Tabs>
          <TabContent title="Supply">
            <div className="flex h-full w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex h-full w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-1">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Balanço: {drexBalance} DREX
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                    <input
                      type="number"
                      className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={"0"}
                      // value={value} TODO: change props to use control on input
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                      <button
                        className="text-brandBlue-300 text-base font-normal leading-normal"
                        onClick={writeApproveDREX}
                      >
                        max
                      </button>
                      <div className="relative h-6 w-6">
                        <Image
                          src={"/images/drex.png"}
                          alt="logo"
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className=" flex justify-between text-white">
                  <span>Supply APY:</span>
                  <span>4.749%</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Supplied:</span>
                  <span>3712765.889</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Borrowed:</span>
                  <span>3711651.918</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Utilization Rate:</span>
                  <span>99.970%</span>
                </div>
              </div>

              <Button
                text="Supply DREX"
                onClick={() => null}
                isLoading={false}
              />
            </div>
          </TabContent>
          <TabContent title="Withdraw">
            <div className="flex h-full w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex h-full w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-4">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Wallet Balance: {drexBalance} DREX
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                    <input
                      type="number"
                      className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={"0"}
                      // value={value} TODO: change props to use control on input
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                      <button
                        className="text-brandBlue-300 text-base font-normal leading-normal"
                        onClick={() => null}
                      >
                        max
                      </button>
                      <div className="relative h-6 w-6">
                        <Image
                          src={"/images/drex.png"}
                          alt="logo"
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                    <input
                      type="number"
                      className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={"0"}
                      // value={value} TODO: change props to use control on input
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                      <button
                        className="text-brandBlue-300 text-base font-normal leading-normal"
                        onClick={() => null}
                      >
                        max
                      </button>
                      <div className="relative h-6 w-6">
                        <Image
                          src={"/images/drex.png"}
                          alt="logo"
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className=" flex justify-between text-white">
                  <span>Current Available USDC Liquidity:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Supplied:</span>
                  <span>3712765.889</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Borrowed:</span>
                  <span>3711651.918</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Utilization Rate:</span>
                  <span>99.970%</span>
                </div>
              </div>

              <Button text="Withdraw" onClick={() => null} isLoading={false} />
            </div>
          </TabContent>
          <TabContent title="Recall">
            <div className="flex h-full w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex h-full w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-4">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Wallet Balance: {drexBalance} DREX
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                    <input
                      type="number"
                      className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={"0"}
                      // value={value} TODO: change props to use control on input
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                      <button
                        className="text-brandBlue-300 text-base font-normal leading-normal"
                        onClick={() => null}
                      >
                        max
                      </button>
                      <div className="relative h-6 w-6">
                        <Image
                          src={"/images/drex.png"}
                          alt="logo"
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                    <input
                      type="number"
                      className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={"0"}
                      // value={value} TODO: change props to use control on input
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                      <button
                        className="text-brandBlue-300 text-base font-normal leading-normal"
                        onClick={() => null}
                      >
                        max
                      </button>
                      <div className="relative h-6 w-6">
                        <Image
                          src={"/images/drex.png"}
                          alt="logo"
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full  text-white">Some text on here</div>

              <Button text="Recall" onClick={() => null} isLoading={false} />
            </div>
          </TabContent>
        </Tabs>
      );
    } else if (isOpenST) {
      // Renderizar conteúdo para SupplyTSelic
      return (
        <Tabs>
          <TabContent title="Supply">
            <div className="flex h-full w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex h-full w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-1">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Wallet Balance: {TselicBalance} TSELIC
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                    <input
                      type="number"
                      className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={"0"}
                      // value={value} TODO: change props to use control on input
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                      <button
                        className="text-brandBlue-300 text-base font-normal leading-normal"
                        onClick={() => null}
                      >
                        max
                      </button>
                      <div className="relative h-6 w-6">
                        <Image
                          src={"/images/tesouroSelic.png"}
                          alt="logo"
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className=" flex justify-between text-white">
                  <span>Supply APY:</span>
                  <span>4.749%</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Supplied:</span>
                  <span>3712765.889</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Borrowed:</span>
                  <span>3711651.918</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Utilization Rate:</span>
                  <span>99.970%</span>
                </div>
              </div>

              <Button
                text="Supply TSELIC"
                onClick={() => null}
                isLoading={false}
              />
            </div>
          </TabContent>
          <TabContent title="Withdraw">
            <div className="flex h-full w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex h-full w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-4">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Wallet Balance: {TselicBalance} TSELIC
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                    <input
                      type="number"
                      className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={"0"}
                      // value={value} TODO: change props to use control on input
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                      <button
                        className="text-brandBlue-300 text-base font-normal leading-normal"
                        onClick={() => null}
                      >
                        max
                      </button>
                      <div className="relative h-6 w-6">
                        <Image
                          src={"/images/tesouroSelic.png"}
                          alt="logo"
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                    <input
                      type="number"
                      className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={"0"}
                      // value={value} TODO: change props to use control on input
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                      <button
                        className="text-brandBlue-300 text-base font-normal leading-normal"
                        onClick={() => null}
                      >
                        max
                      </button>
                      <div className="relative h-6 w-6">
                        <Image
                          src={"/images/tesouroSelic.png"}
                          alt="logo"
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className=" flex justify-between text-white">
                  <span>Current Available USDC Liquidity:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Supplied:</span>
                  <span>3712765.889</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Borrowed:</span>
                  <span>3711651.918</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Utilization Rate:</span>
                  <span>99.970%</span>
                </div>
              </div>

              <Button text="Withdraw" onClick={() => null} isLoading={false} />
            </div>
          </TabContent>
        </Tabs>
      );
    } else if (isOpenBD) {
      // Renderizar conteúdo para BorrowDrex
      return (
        <Tabs>
          <TabContent title="Borrow">
            <div className="flex h-full w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex h-full w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-1">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Wallet Balance: {drexBalance} DREX
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                    <input
                      type="number"
                      className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={"0"}
                      // value={value} TODO: change props to use control on input
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                      <button
                        className="text-brandBlue-300 text-base font-normal leading-normal"
                        onClick={() => null}
                      >
                        max
                      </button>
                      <div className="relative h-6 w-6">
                        <Image
                          src={"/images/drex.png"}
                          alt="logo"
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className=" flex justify-between text-white">
                  <span>Supply DREX:</span>
                  <span>4.749</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Borrowed USDC:</span>
                  <span>3712765.889</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>USDC Liquidity:</span>
                  <span>3711651.918</span>
                </div>
              </div>

              <Button text="Borrow" onClick={() => null} isLoading={false} />
            </div>
          </TabContent>

          <TabContent title="Repay">
            <div className="flex h-full w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex h-full w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-1">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Wallet Balance: {drexBalance} DREX
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                    <input
                      type="number"
                      className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={"0"}
                      // value={value} TODO: change props to use control on input
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                      <button
                        className="text-brandBlue-300 text-base font-normal leading-normal"
                        onClick={() => null}
                      >
                        max
                      </button>
                      <div className="relative h-6 w-6">
                        <Image
                          src={"/images/drex.png"}
                          alt="logo"
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className="flex justify-between text-white">
                  <span>Borrowed:</span>
                  <span>3712765.889</span>
                </div>
              </div>

              <Button text="Repay" onClick={() => null} isLoading={false} />
            </div>
          </TabContent>
        </Tabs>
      );
    }
  };

  const isOpen = isOpenSD || isOpenST || isOpenBD;
  const onClose = isOpenSD ? onCloseSD : isOpenST ? onCloseST : onCloseBD;

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-primary h-full w-full rounded-lg px-10 py-6">
        {renderContent()}
      </div>
    </Modal>
  );
}
