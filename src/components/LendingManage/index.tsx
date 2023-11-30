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
  EthereumAddress,
  useBalanceOfDREX,
  useBalanceOfTSELIC,
  useApproveDREX,
  useApproveTSELIC,
  useAllowanceDREX,
  useAllowanceTSELIC,
} from "../../hooks/useErc20";
import {
  useGetTotalSupplied,
  useGetTotalBorrowed,
  useGetBorrowedAmount,
  useGetDepositedTSELIC,
  useGetSuppliedDREX,
  // useGetTotalDepositedTSELIC,
  // useGetUnitValue,
  // useGetInterestRate,
  getSupplyInterestRate,
  useSupplyDREX,
} from "../../hooks/useRBLLPoolContract";

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
    data: dataSupplyInterestRate,
    isError: isErrorSupplyInterestRate,
    isLoading: isLoadingSupplyInterestRate,
  } = getSupplyInterestRate(dataTotalSupplied || 0, dataTotalBorrowed || 0);
  const {
    data: dataSuppliedDREX,
    isError: isErrorSuppliedDREX,
    isLoading: isLoadingSuppliedDREX,
  } = useGetSuppliedDREX(address as EthereumAddress);

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
    write: writeApproveDREX,
    data: dataApproveDREX,
    isLoading: isLoadingApproveDREX,
    isSuccess: isSuccessApproveDREX,
    isError: isErrorApproveDREX,
  } = useApproveDREX();

  const {
    write: writeApproveTSELIC,
    data: dataApproveTSELIC,
    isLoading: isLoadingApproveTSELIC,
    isSuccess: isSuccessApproveTSELIC,
    isError: isErrorApproveTSELIC,
  } = useApproveTSELIC();

  // const {
  //   write: writeSupplyDREX,
  //   data: dataSupplyDREX,
  //   isLoading: isLoadingSupplyDREX,
  //   isSuccess: isSuccessSupplyDREX,
  //   isError: isErrorSupplyDREX,
  // } = useSupplyDREX();

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
          <TabContent title="Depositar">
            <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex w-full items-start justify-start gap-3">
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
                  <span>APY de Deposito:</span>
                  <span>{Number(dataSupplyInterestRate || 0) / 10e5}%</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Depositado:</span>
                  <span>{!isLoading ? `R$ ${dataTotalSupplied}` : "R$ 0"}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Emprestado:</span>
                  <span>{!isLoading ? `R$ ${dataTotalBorrowed}` : "R$ 0"}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Taxa de Utilização:</span>
                  <span>
                    {!isLoading
                      ? `${
                          (Number(dataTotalSupplied) /
                            Number(dataTotalBorrowed)) *
                          100
                        }`
                      : "0"}
                    %
                  </span>
                </div>
              </div>

              <Button text="Depositar" onClick={() => null} isLoading={false} />
            </div>
          </TabContent>
          <TabContent title="Sacar">
            <div className="flex h-[400px] w-full flex-col items-center justify-center gap-6 pt-5">
              <div className="flex w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-4">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Balanço: {!isLoading ? `${dataSuppliedDREX}` : "0"} rBRLL
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
                  <span>Liquidez Disponível em DREX:</span>
                  <span>
                    {!isLoading
                      ? `R$ ${
                          Number(dataTotalSupplied) - Number(dataTotalBorrowed)
                        }`
                      : "R$ 0"}
                  </span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Depositado:</span>
                  <span>{!isLoading ? `R$ ${dataTotalSupplied}` : "R$ 0"}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Emprestado:</span>
                  <span>{!isLoading ? `R$ ${dataTotalBorrowed}` : "R$ 0"}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Taxa de Utilização:</span>
                  <span>
                    {!isLoading
                      ? `${
                          (Number(dataTotalSupplied) /
                            Number(dataTotalBorrowed)) *
                          100
                        }`
                      : "0"}
                    %
                  </span>
                </div>
              </div>

              <Button text="Sacar" onClick={() => null} isLoading={false} />
            </div>
          </TabContent>
          <TabContent title="Recall">
            <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
              <div className="flex w-full items-start justify-start gap-3">
                <div className="flex h-full w-full flex-col items-start justify-start gap-4">
                  <div className="inline-flex items-start justify-start gap-6">
                    <div className="text-base font-normal leading-normal text-gray-400">
                      Balanço: {!isLoading ? `${dataSuppliedDREX}` : "0"} rBRLL
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

              <div className="flex h-full w-full  text-white">
                O recall instantâneo facilita a troca de garantias TSELIC por
                DREX através do pool da Uniswap.
              </div>

              <Button text="Recall" onClick={() => null} isLoading={false} />
            </div>
          </TabContent>
        </Tabs>
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
              </div>

              <Button text="Depositar" onClick={() => null} isLoading={false} />
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
                  <span>DREX Emprestado:</span>
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
                  <span>DREX Emprestado:</span>
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
                onClick={() => null}
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
                  <span>DREX Emprestado:</span>
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
