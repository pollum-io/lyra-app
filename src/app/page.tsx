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

export default function HomePage() {
  const { onOpen: onOpenSD } = useStore(useLendingModalSupplyDrex);
  const { onOpen: onOpenST } = useStore(useLendingModalSupplyTSelic);
  const { onOpen: onOpenBD } = useStore(useLendingModalBorrowDrex);

  const [depositedTSELIC, setDepositedTSELIC] = useState(null);
  const [suppliedDREX, setSuppliedDREX] = useState(null);
  const [borrowedAmount, setBorrowedAmount] = useState(null);

  const [isLoadingDepositedTSELIC, setIsLoadingDepositedTSELIC] =
    useState(false);
  const [isLoadingSuppliedDREX, setIsLoadingSuppliedDREX] = useState(false);
  const [isLoadingBorrowedAmount, setIsLoadingBorrowedAmount] = useState(false);

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

  useEffect(() => {
    if (address) {
      setIsLoadingDepositedTSELIC(true);
      setIsLoadingSuppliedDREX(true);
      setIsLoadingBorrowedAmount(true);

      const {
        data: dataDepositedTSELIC,
        isError: isErrorDepositedTSELIC,
        isLoading: isLoadingDepositedTSELIC,
      } = useGetDepositedTSELIC(address as `0x${string}`);

      const {
        data: dataSuppliedDREX,
        isError: isErrorSuppliedDREX,
        isLoading: isLoadingSuppliedDREX,
      } = useGetSuppliedDREX(address as `0x${string}`);

      const {
        data: dataBorrowedAmount,
        isError: isErrorBorrowedAmount,
        isLoading: isLoadingBorrowedAmount,
      } = useGetBorrowedAmount(address as `0x${string}`);

      setDepositedTSELIC(dataDepositedTSELIC);
      setSuppliedDREX(dataSuppliedDREX);
      setBorrowedAmount(dataBorrowedAmount);
      setIsLoadingDepositedTSELIC(isLoadingDepositedTSELIC);
      setIsLoadingSuppliedDREX(isLoadingSuppliedDREX);
      setIsLoadingBorrowedAmount(isLoadingBorrowedAmount);
    }
  }, [address]);

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
  } = getSupplyInterestRate(
    (dataTotalSupplied) || 0,
    dataTotalBorrowed || 0) ;

  const totalBorrowed = safeParseFloat(dataTotalBorrowed);
  const localDepositedTSELIC = safeParseFloat(depositedTSELIC);
  const unitValue = safeParseFloat(dataUnitValue);
  const localBorrowedAmount = safeParseFloat(borrowedAmount);

  const availableToBorrow =
    localDepositedTSELIC * unitValue - localBorrowedAmount || 0;

  const borrowPercentual =
    100 - totalBorrowed / (localBorrowedAmount * unitValue) || 0;

  function safeParseFloat(value: unknown): number {
    if (typeof value === "string") {
      return parseFloat(value) || 0;
    }
    return 0;
  }

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
                value={!isLoading ? `R$ ${suppliedDREX}` : "R$ 0"}
              />
              <div className="flex h-full w-full flex-col items-center justify-center">
                <Apr aprPercent={75} />
                <div className="relative mt-6 h-10 w-[482px]">
                  <ProgressBar progress={Number(borrowPercentual)} />
                  <div className="absolute left-[412px] top-[20px] text-sm font-normal leading-tight text-white">
                    {" "}
                    {!isLoading ? `R$ ${availableToBorrow}` : "R$ 0"}
                  </div>
                  <div className="absolute left-0 top-0 text-sm font-normal leading-tight text-white">
                    Limite de Empréstimo: {!isLoading ? borrowPercentual : 0}%
                  </div>
                </div>
              </div>
              <Card
                text={"Saldo em Empréstimo"}
                value={!isLoading ? `R$ ${borrowedAmount}` : "R$ 0"}
                isLeft
              />
            </div>
          ) : (
            <InfoHeaderSkeleton />
          )}
          {address ? (
            <div className="flex w-full flex-col items-start justify-center gap-7 lg:flex-row">
              <Lending
                title="Saldo em Empréstimo"
                items={[
                  {
                    title: "DREX",
                    apr: `${dataSupplyInterestRate}%`,
                    liquidity: `R$ ${dataTotalSupplied}`,
                    balance: `R$ ${suppliedDREX}`,
                    onManageClick: onOpenSD,
                    imageUrl: "/images/drex.png",
                  },
                  {
                    title: "TSELIC",
                    apr: `${Number(dataInterestRate || 0) / 10e5}%`,
                    liquidity: `R$ ${dataTotalDepositedTSELIC}`,
                    balance: `R$ ${depositedTSELIC}`,
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
                    apr: `${dataSupplyInterestRate}%`,
                    liquidity: `R$ ${dataTotalBorrowed}`,
                    balance: `R$ ${borrowedAmount}`,
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
