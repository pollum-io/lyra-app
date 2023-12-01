"use client";

import {
  useLendingModalBorrowDrex,
  useLendingModalSupplyDrex,
  useLendingModalSupplyTSelic,
} from "@/stores/lendingModal";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import Modal from "../Modal";
import Tabs, { TabContent } from "../Tabs";
import Image from "next/image";
import { Button } from "../Button";
import { useAccount } from "wagmi";
import {
  EthereumAddress,
  useBalanceOfDREX,
  useBalanceOfTSELIC,
  useApproveTSELIC,
  useAllowanceDREX,
  useAllowanceTSELIC,
} from "../../hooks/useErc20";
import {
  useGetTotalSupplied,
  useGetTotalBorrowed,
  useGetBorrowedAmount,
  useGetDepositedTSELIC,
  useSupplyTSELIC,
  useBorrowDREX,
} from "../../hooks/useRBLLPoolContract";
import { ContextSupplyDrex } from "./ContextSupplyDrex";

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
  } = useBalanceOfDREX(address as EthereumAddress);

  const {
    data: dataTselicBalance,
    isError: isTselicError,
    isLoading: isLoadingTselic,
  } = useBalanceOfTSELIC(address as EthereumAddress);

  const {
    data: dataTotalSupplied,
    isError: isErrorTotalSupplied,
    isLoading: isLoadingTotalSupplied,
  } = useGetTotalSupplied();

  const {
    data: dataTotalBorrowed,
    isError: isErrorTotalBorrowed,
    isLoading: isLoadingTotalBorrowed,
  } = useGetTotalBorrowed();

  const {
    data: dataDepositedTSELIC,
    isError: isErrorDepositedTSELIC,
    isLoading: isLoadingDepositedTSELIC,
  } = useGetDepositedTSELIC(address as EthereumAddress);

  const {
    data: dataBorrowedAmount,
    isError: isErrorBorrowedAmount,
    isLoading: isLoadingBorrowedAmount,
  } = useGetBorrowedAmount(address as EthereumAddress);

  const {
    data: dataAllowanceDREX,
    isError: isErrorAllowanceDREX,
    isLoading: isLoadingAllowanceDREX,
  } = useAllowanceDREX(address as EthereumAddress);

  const {
    data: dataAllowanceTSELIC,
    isError: isErrorAllowanceTSELIC,
    isLoading: isLoadingAllowanceTSELIC,
  } = useAllowanceTSELIC(address as EthereumAddress);

  const {
    write: writeApproveTSELIC,
    data: dataApproveTSELIC,
    isLoading: isLoadingApproveTSELIC,
    isSuccess: isSuccessApproveTSELIC,
    isError: isErrorApproveTSELIC,
  } = useApproveTSELIC();

  const drexamountsupply = 100 * 1e6;
  const tselicamountsupply = 3 * 1e18;

  const {
    write: writeSupplyTSELIC,
    data: dataSupplyTSELIC,
    isLoading: isLoadingSupplyTSELIC,
    isSuccess: isSuccessSupplyTSELIC,
    isError: isErrorSupplyTSELIC,
  } = useSupplyTSELIC(tselicamountsupply);

  const {
    write: writeBorrowDREX,
    data: dataBorrowDREX,
    isLoading: isLoadingBorrowDREX,
    isSuccess: isSuccessBorrowDREX,
    isError: isErrorBorrowDREX,
  } = useBorrowDREX(drexamountsupply / 2);

  const drexBalance = Number(dataDrexBalance) / 10 ** 6;
  const TselicBalance = Number(dataTselicBalance) / 10 ** 18;

  const [valueTselic, setValueTselic] = useState("");
  const [valueDREX, setValueDREX] = useState("");
  const [error, setError] = useState("");

  const [approvedAmountTselic, setApprovedAmountTselic] = useState(
    Number(dataAllowanceTSELIC)
  );

  // console.log("Validando", approvedAmountTselic);
  // console.log(
  //   "Check check",
  //   Number(approvedAmountTselic) < Number(valueTselic)
  // );
  // console.log("ValueTselic", valueTselic);
  useEffect(() => {
    // console.log("ApprovedAmountTselic", Number(approvedAmountTselic));
    // console.log("ValueTSelic", Number(valueTselic));
    setApprovedAmountTselic(Number(dataAllowanceTSELIC));
  }, [dataAllowanceTSELIC, isSuccessApproveTSELIC]);

  useEffect(() => {
    const loading = [
      isLoadingDrex,
      isLoadingTselic,
      isSuccessApproveTSELIC,
      isLoadingTotalSupplied,
      isLoadingTotalBorrowed,
      isLoadingDepositedTSELIC,
      isLoadingBorrowedAmount,
      isLoadingAllowanceDREX,
      isLoadingAllowanceTSELIC,
    ].every((loading) => loading === false);

    setLoading(!loading);
  }, [
    isLoadingDrex,
    isLoadingTselic,
    isSuccessApproveTSELIC,
    isLoadingTotalSupplied,
    isLoadingTotalBorrowed,
    isLoadingDepositedTSELIC,
    isLoadingBorrowedAmount,
    isLoadingAllowanceDREX,
    isLoadingAllowanceTSELIC,
  ]);

  const renderContent = () => {
    if (isOpenSD) {
      return (
        <ContextSupplyDrex
          address={address as EthereumAddress}
          dataTotalSupplied={dataTotalSupplied}
          dataTotalBorrowed={dataTotalBorrowed}
        />
      );
    } else if (isOpenST) {
      // Renderizar conteúdo para SupplyTSelic
      return (
        <Tabs>
          <TabContent title="Depositar">
            <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-1">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Balanço: {!isLoading ? `${TselicBalance}` : "0"} TSELIC
                    </div>
                  </div>
                  <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                    <input
                      type="number"
                      className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={"0"}
                      value={valueTselic}
                      onChange={(e) => {
                        const enteredValue = Number(e.target.value);
                        if (enteredValue > TselicBalance) {
                          setError(
                            "Entered value is greater than current balance"
                          );
                        } else {
                          setError("");
                          setValueTselic(e.target.value);
                        }
                      }}
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                    <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                      <button
                        className="text-brandBlue-300 text-base font-normal leading-normal"
                        onClick={() => setValueTselic(TselicBalance.toString())}
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
                  {error && <div className="text-sm text-red-500">{error}</div>}
                </div>
              </div>

              <div className="flex h-full w-full flex-col gap-2">
                <div className=" flex justify-between text-white">
                  <span>TSELIC Depositado:</span>
                  <span>
                    {!isLoading ? `${dataDepositedTSELIC}` : "0"} TSELIC
                  </span>
                </div>
              </div>

              {Number(approvedAmountTselic) < Number(valueTselic) ? (
                <Button
                  text="Approve"
                  onClick={writeApproveTSELIC}
                  isLoading={isLoadingApproveTSELIC}
                />
              ) : (
                <Button
                  text="Depositar"
                  onClick={writeSupplyTSELIC}
                  isLoading={false}
                />
              )}
              {/* <Button text="Depositar" onClick={writeSupplyTSELIC} isLoading={false} /> */}
            </div>
          </TabContent>
          <TabContent title="Sacar">
            <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-4">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Balanço: {!isLoading ? `${TselicBalance}` : "0"} TSELIC
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

              <div className="flex h-full w-full flex-col gap-2">
                <div className=" flex justify-between text-white">
                  <span>TSELIC Depositado:</span>
                  <span>
                    {!isLoading ? `${dataDepositedTSELIC}` : "0"} TSELIC
                  </span>
                </div>
                <div className="flex justify-between text-white">
                  <span>DREX em Empréstimo:</span>
                  <span>{!isLoading ? `${dataBorrowedAmount}` : "0"} DREX</span>
                </div>
              </div>
              <Button text="Sacar" onClick={() => null} isLoading={false} />
            </div>
          </TabContent>
        </Tabs>
      );
    } else if (isOpenBD) {
      // Renderizar conteúdo para BorrowDrex
      return (
        <Tabs>
          <TabContent title="Emprestar">
            <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-1">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Balanço: {!isLoading ? `${drexBalance}` : "0"} DREX
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

              <div className="flex h-full w-full flex-col gap-2">
                <div className=" flex justify-between text-white">
                  <span>TSELIC Depositado:</span>
                  <span>
                    {!isLoading ? `${dataDepositedTSELIC}` : "0"} TSELIC
                  </span>
                </div>
                <div className="flex justify-between text-white">
                  <span>DREX em Empréstimo:</span>
                  <span>{!isLoading ? `${dataBorrowedAmount}` : "0"} DREX</span>
                </div>
                <div className=" flex justify-between text-white">
                  <span>Liquidez Disponível em DREX:</span>
                  <span>
                    {!isLoading
                      ? `R$ ${
                          Number(dataTotalSupplied) - Number(dataTotalBorrowed)
                        }`
                      : "R$ 0"}
                  </span>
                </div>
              </div>
              <Button
                text="Tomar Emprestimo"
                onClick={writeBorrowDREX}
                isLoading={false}
              />
            </div>
          </TabContent>

          <TabContent title="Quitar">
            <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-1">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Balanço: {!isLoading ? `${drexBalance}` : "0"} DREX
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

              <div className="flex h-full w-full flex-col gap-2">
                <div className="flex justify-between text-white">
                  <span>Passivo em DREX:</span>
                  <span>{!isLoading ? `${dataBorrowedAmount}` : "0"} DREX</span>
                </div>
              </div>

              <Button
                text="Quitar Emprestimo"
                onClick={() => null}
                isLoading={false}
              />
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
      <div className="bg-primary h-full w-full max-w-[400px] rounded-lg px-10 py-6 ">
        {renderContent()}
      </div>
    </Modal>
  );
}
