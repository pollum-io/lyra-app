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

  const [depositedTSELIC, setDepositedTSELIC] = useState(null);
  const [suppliedDREX, setSuppliedDREX] = useState(null);
  const [borrowedAmount, setBorrowedAmount] = useState(null);

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
    const allDataLoaded = [
      dataDepositedTSELIC,
      dataSuppliedDREX,
      dataBorrowedAmount,
    ].every((data) => data !== null);

    setLoading(!allDataLoaded);
  }, [dataDepositedTSELIC, dataSuppliedDREX, dataBorrowedAmount]);

  useEffect(() => {
    if (address) {
      setDepositedTSELIC(dataDepositedTSELIC);
      setSuppliedDREX(dataSuppliedDREX);
      setBorrowedAmount(dataBorrowedAmount);
    }
  }, [address, dataDepositedTSELIC, dataSuppliedDREX, dataBorrowedAmount]);

  const safeNumber = (value: BigNumberish | null) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const tselicMultiplier =
    (safeNumber(depositedTSELIC) * safeNumber(dataUnitValue as BigNumberish)) /
    1e18;
  const borrowedAmountNum = safeNumber(borrowedAmount);

  // Validação para divisão por zero
  const availableToBorrow =
    tselicMultiplier === 0 ? 0 : (tselicMultiplier - borrowedAmountNum) / 1e18;

  const borrowPercentual =
    tselicMultiplier === 0
      ? 0
      : (Number((borrowedAmountNum / tselicMultiplier) * 100).toLocaleString('pt-BR',{minimumFractionDigits: 2,
        maximumFractionDigits:2, }));

  // Balanços
  const tselicBalance = tselicMultiplier / 1e18;
  const drexBalance = safeNumber(suppliedDREX) / 1e18;

  // APRs
  const tselicApr = safeNumber(dataInterestRate as BigNumberish) / 10e5;
  const drexSupplyApr =
    ((safeNumber(dataSupplyInterestRate as BigNumberish) / 1e6) * 99) / 100;
  const drexBorrowApr =
    safeNumber(dataSupplyInterestRate as BigNumberish) / 1e6;

  // Valores Emprestados
  const borrowedDrex = borrowedAmountNum / 1e18;

  // Ganhos
  const tselicYearlyGain = (tselicBalance * tselicApr) / 100;
  const drexYearlyGain = (drexBalance * drexSupplyApr) / 100;

  // Custo
  const borrowedYearlyCost = (borrowedDrex * drexBorrowApr) / 100;

  // Ganho Líquido
  const yearlySuppliedGains = tselicYearlyGain + drexYearlyGain;
  const netYearlyGain = yearlySuppliedGains - borrowedYearlyCost;

  // Saldo Total
  const totalDeposited = tselicBalance + drexBalance;
  const maxAPR =
    totalDeposited === 0 ? 0 : (yearlySuppliedGains / totalDeposited) * 100;

  // Cálculo final do APR
  const netApr =
    totalDeposited === 0 ? 0 : (netYearlyGain / totalDeposited) * 100;

  useEffect(() => {
    const isAnyLoading = [
      isLoadingTotalSupplied,
      isLoadingTotalBorrowed,
      isLoadingDepositedTSELIC,
      isLoadingSuppliedDREX,
      isLoadingBorrowedAmount,
      isLoadingTotalDepositedTSELIC,
      isLoadingUnitValue,
      isLoadingInterestRate,
      isLoadingSupplyInterestRate,
    ].some((loading) => loading);

    setLoading(isAnyLoading);
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

  const calculateValue = () => {
    if (
      isLoading ||
      depositedTSELIC === null ||
      suppliedDREX === null ||
      dataUnitValue === null
    ) {
      return "R$ 0";
    } else {
      const drexBalance = Number(suppliedDREX) / 1e18;
      const tselicBalance =
        (Number(depositedTSELIC) * Number(dataUnitValue)) / 1e36;
      return `R$ ${(drexBalance + tselicBalance).toLocaleString('pt-BR',{minimumFractionDigits: 2,
        maximumFractionDigits:2, })}`;
    }
  };

  const calculateLoanBalance = () => {
    if (isLoading || borrowedAmount === null) {
      return "R$ 0";
    } else {
      const loanBalance = Number(borrowedAmount) / 1e18;
      return `R$ ${loanBalance.toLocaleString('pt-BR',{minimumFractionDigits: 2,
        maximumFractionDigits:2, })}`;
    }
  };

  return (
    <main>
      <section>
        <div className="layout relative flex min-h-screen flex-col items-center justify-start gap-20 py-12 text-center">
          {address ? (
            <div className="flex h-full w-full flex-col items-center justify-between gap-10 lg:flex-row lg:items-end">
              <div className="flex h-full w-full flex-col items-center justify-center lg:hidden">
                <Apr aprPercent={Number(netApr)} aprMax={Number(maxAPR)} />
                <div className="relative mt-6 h-10 w-[382px] lg:w-[482px]">
                  <ProgressBar progress={Number(borrowPercentual)} />
                  <div className="absolute top-[0px] w-full text-right text-sm font-normal leading-tight text-white lg:left-[412px] lg:top-[20px]">
                    {!isLoading
                      ? `R$ ${Number(availableToBorrow).toLocaleString('pt-BR',{minimumFractionDigits: 2,
        maximumFractionDigits:2, })}`
                      : "R$ 0"}
                  </div>
                  <div className="absolute left-0 top-0 text-sm font-normal leading-tight text-white">
                    Limite de Empréstimo: {!isLoading ? borrowPercentual : 0}%
                  </div>
                </div>
              </div>
              <Card text={"Saldo em Depósito"} value={calculateValue()} />
              <div className="hidden h-full w-full flex-col items-center justify-center lg:flex">
                <Apr aprPercent={Number(netApr)} aprMax={Number(maxAPR)} />
                <div className="relative mt-6 h-10 w-[482px]">
                  <ProgressBar progress={Number(borrowPercentual)} />
                  <div className="absolute left-[20px] top-[20px] w-full text-right text-sm font-normal leading-tight text-white">
                    {" "}
                    {!isLoading
                      ? `R$ ${Number(availableToBorrow).toLocaleString()}`
                      : "R$ 0"}
                  </div>
                  <div className="absolute left-0 top-0 text-sm font-normal leading-tight text-white">
                    Limite de Empréstimo: {!isLoading ? borrowPercentual : 0}%
                  </div>
                </div>
              </div>
              <Card
                text={"Saldo em Empréstimo"}
                value={calculateLoanBalance()}
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
                    apr: `${(
                      ((Number(dataSupplyInterestRate) / 1e6) * 99) /
                      100
                    ).toLocaleString('pt-BR',{minimumFractionDigits: 2,
        maximumFractionDigits:2, })}%`,
                    liquidity: `R$ ${(Number(dataTotalSupplied) / 1e18).toLocaleString('pt-BR',{minimumFractionDigits: 2,
                      maximumFractionDigits:2, })}`,
                    balance: `R$ ${(Number(suppliedDREX) / 1e18).toLocaleString('pt-BR',{minimumFractionDigits: 2,
        maximumFractionDigits:2, })}`,
                    onManageClick: onOpenSD,
                    imageUrl: "/images/drex.png",
                  },
                  {
                    title: "TSELIC",
                    apr: `${(Number(dataInterestRate || 0) / 10e5).toLocaleString('pt-BR',{minimumFractionDigits: 2,
                      maximumFractionDigits:2, })}%`,
                    liquidity: `R$ ${(
                      (Number(dataTotalDepositedTSELIC) *
                        Number(dataUnitValue)) /
                      1e36
                    ).toLocaleString('pt-BR',{minimumFractionDigits: 2,
        maximumFractionDigits:2, })}`,
                    balance: `R$ ${(
                      (Number(depositedTSELIC) * Number(dataUnitValue)) /
                      1e36
                    ).toLocaleString('pt-BR',{minimumFractionDigits: 2,
        maximumFractionDigits:2, })}`,
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
                    apr: `${(Number(dataSupplyInterestRate) / 1e6).toLocaleString('pt-BR',{minimumFractionDigits: 2,
                      maximumFractionDigits:2, })}%`,
                    liquidity: `R$ ${(Number(dataTotalBorrowed) / 1e18).toLocaleString('pt-BR',{minimumFractionDigits: 2,
                      maximumFractionDigits:2, })}`,
                    balance: `R$ ${(Number(borrowedAmount) / 1e18).toLocaleString('pt-BR',{minimumFractionDigits: 2,
        maximumFractionDigits:2, })}`,
                    onManageClick: onOpenBD,
                    imageUrl: "/images/drex.png",
                  },
                ]}
              />
            </div>
          ) : (
            <div className="text-3xl">Por favor conecte sua carteira</div>
          )}
        </div>
      </section>
    </main>
  );
}
