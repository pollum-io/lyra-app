/* eslint-disable no-console */
"use client";

import React from "react";

import "react-toastify/dist/ReactToastify.css";

import { Card } from "@/components/Card";
import { Apr } from "@/components/Apr";
import { ProgressBar } from "@/components/ProgressBar";
import { Lending } from "@/components/Lending";
import { useStore } from "zustand";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import {
  useLendingModalBorrowDrex,
  useLendingModalSupplyDrex,
  useLendingModalSupplyTSelic,
} from "@/stores/lendingModal";
import {
  useGetTotalSupplied,
  useGetTotalBorrowed,
  useGetBorrowedAmount,
  useGetDepositedTSELIC,
  useGetSuppliedDREX,
  useGetTotalDepositedTSELIC,
  useGetUnitValue,
  useGetInterestRate,
  getSupplyInterestRate,
} from "../hooks/useRBLLPoolContract";

import { BigNumberish } from "ethers";
import { InfoHeaderSkeleton } from "@/components/Skeletons/InfoHeaderSkeleton";
import { EthereumAddress } from "@/hooks/useErc20";

export default function HomePage() {
  const { onOpen: onOpenSD } = useStore(useLendingModalSupplyDrex);
  const { onOpen: onOpenST } = useStore(useLendingModalSupplyTSelic);
  const { onOpen: onOpenBD } = useStore(useLendingModalBorrowDrex);

  const [depositedTSELIC, setDepositedTSELIC] = useState("0");
  const [suppliedDREX, setSuppliedDREX] = useState("0");
  const [borrowedAmount, setBorrowedAmount] = useState("0");

  const [isLoading, setLoading] = useState(true);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const desiredChainId = 80001;

  useEffect(() => {
    if (chain?.id !== desiredChainId && switchNetwork) {
      switchNetwork(desiredChainId);
    }
  }, [chain, desiredChainId]);

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
    data: dataTotalDepositedTSELIC,
    isError: isErrorTotalDepositedTSELIC,
    isLoading: isLoadingTotalDepositedTSELIC,
  } = useGetTotalDepositedTSELIC();

  const {
    data: dataDepositedTSELIC,
    isError: isErrorDepositedTSELIC,
    isLoading: isLoadingDepositedTSELIC,
  } = useGetDepositedTSELIC(address as EthereumAddress);

  const {
    data: dataSuppliedDREX,
    isError: isErrorSuppliedDREX,
    isLoading: isLoadingSuppliedDREX,
  } = useGetSuppliedDREX(address as EthereumAddress);

  const {
    data: dataBorrowedAmount,
    isError: isErrorBorrowedAmount,
    isLoading: isLoadingBorrowedAmount,
  } = useGetBorrowedAmount(address as EthereumAddress);

  const {
    data: dataUnitValue,
    isError: isErrorUnitValue,
    isLoading: isLoadingUnitValue,
  } = useGetUnitValue();

  const {
    data: dataInterestRate,
    isError: isErrorInterestRate,
    isLoading: isLoadingInterestRate,
  } = useGetInterestRate();

  const {
    data: dataSupplyInterestRate,
    isError: isErrorSupplyInterestRate,
    isLoading: isLoadingSupplyInterestRate,
  } = getSupplyInterestRate(dataTotalSupplied || 0, dataTotalBorrowed || 0);

  useEffect(() => {
    if (address) {
      
      setDepositedTSELIC(dataDepositedTSELIC);
      setSuppliedDREX(dataSuppliedDREX);
      setBorrowedAmount(dataBorrowedAmount);
    }
  }, [address, dataDepositedTSELIC, dataSuppliedDREX, dataBorrowedAmount]);

  const availableToBorrow = (Number(depositedTSELIC) * Number(dataUnitValue) / 1e18 - Number(borrowedAmount)) / 1e18
  const borrowPercentual =  (Number(borrowedAmount) /(Number(depositedTSELIC) * Number(dataUnitValue)  / 1e18)).toFixed(2);

  useEffect(() => {
    const loading = [
      isLoadingTotalSupplied,
      isLoadingTotalBorrowed,
      isLoadingDepositedTSELIC,
      isLoadingSuppliedDREX,
      isLoadingBorrowedAmount,
      isLoadingTotalDepositedTSELIC,
      isLoadingUnitValue,
      isLoadingInterestRate,
      isLoadingSupplyInterestRate,
    ].every((loading) => loading === false);

    setLoading(!loading);
  }, [
    isLoadingTotalSupplied,
    isLoadingTotalBorrowed,
    isLoadingDepositedTSELIC,
    isLoadingSuppliedDREX,
    isLoadingBorrowedAmount,
    isLoadingTotalDepositedTSELIC,
    isLoadingUnitValue,
    isLoadingInterestRate,
    isLoadingSupplyInterestRate,
  ]);

  return (
    <main>
      <section>
        <div className="layout relative flex min-h-screen flex-col items-center justify-start gap-20 py-12 text-center">
          {address ? (
            <div className="flex h-full w-full items-end justify-between">
              <Card
                text={"Saldo em Depósito"}
                value={!isLoading ? `R$ ${(Number(suppliedDREX) / 1e18).toFixed(2)}` : "R$ 0"}
              />
              <div className="flex h-full w-full flex-col items-center justify-center">
                <Apr aprPercent={75} />
                <div className="relative mt-6 h-10 w-[482px]">
                  <ProgressBar progress={Number(borrowPercentual)} />
                  <div className="absolute left-[412px] top-[20px] text-sm font-normal leading-tight text-white">
                    {" "}
                    {!isLoading ? `R$ ${Number(availableToBorrow).toFixed(2)}` : "R$ 0"}
                  </div>
                  <div className="absolute left-0 top-0 text-sm font-normal leading-tight text-white">
                    Limite de Empréstimo: {!isLoading ? borrowPercentual : 0}%
                  </div>
                </div>
              </div>
              <Card
                text={"Saldo em Empréstimo"}
                value={!isLoading ? `R$ ${(Number(borrowedAmount) / 1e18).toFixed(2)}` : "R$ 0"}
                isLeft
              />
            </div>
          ) : (
            <InfoHeaderSkeleton />
          )}
          {address ? (
            <div className="flex w-full flex-col items-start justify-center gap-7 lg:flex-row">
              <Lending
                title="Depositado"
                items={[
                  {
                    title: "DREX",
                    apr: `${(Number(dataSupplyInterestRate) /1e6).toFixed(2) }%`,
                    liquidity: `R$ ${(Number(dataTotalSupplied) / 1e18).toFixed(2)}`,
                    balance: `R$ ${(Number(suppliedDREX) / 1e18).toFixed(2)}`,
                    onManageClick: onOpenSD,
                    imageUrl: "/images/drex.png",
                  },
                  {
                    title: "TSELIC",
                    apr: `${Number(dataInterestRate || 0) / 10e5}%`,
                    liquidity: `R$ ${(Number(dataTotalDepositedTSELIC) * Number(dataUnitValue) / 1e36).toFixed(2)}`,
                    balance: `R$ ${(Number(depositedTSELIC)  * Number(dataUnitValue) / 1e36).toFixed(2)}`,
                    onManageClick: onOpenST,
                    imageUrl: "/images/tesouroSelic.png",
                  },
                ]}
              />
              <Lending
                title="Emprestado"
                items={[
                  {
                    title: "DREX",
                    apr: `${(Number(dataSupplyInterestRate)/1e6).toFixed(2) }%`,
                    liquidity: `R$ ${(Number(dataTotalBorrowed)/1e18).toFixed(2)}`,
                    balance: `R$ ${(Number(borrowedAmount)/1e18).toFixed(2)}`,
                    onManageClick: onOpenBD,
                    imageUrl: "/images/drex.png",
                  },
                ]}
              />
            </div>
          ) : (
            <div className="text-3xl">Por favor Connect sua wallet</div>
          )}
        </div>
      </section>
    </main>
  );
}
