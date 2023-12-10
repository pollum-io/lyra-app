"use client";

import { Button } from "@/components/Button";
import Tabs, { TabContent } from "@/components/Tabs";
import {
  EthereumAddress,
  useBalanceOfDREX,
  useAllowanceDREX,
  useApproveDREX,
} from "@/hooks/useErc20";
import {
  useBorrowDREX,
  useGetBorrowedAmount,
  useGetDepositedTSELIC,
  useGetUnitValue,
  useRepayDREX,
} from "@/hooks/useRBLLPoolContract";
import { useToastStore } from "@/stores/toast";
import { BigNumberish, parseUnits, formatUnits } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWaitForTransaction } from "wagmi";

export const ContextBorrowDrex = ({
  address,
  dataTotalSupplied,
  dataTotalBorrowed,
}: {
  address: string;
  dataTotalSupplied: BigNumberish;
  dataTotalBorrowed: BigNumberish;
}) => {
  const [borrowValue, setBorrowValue] = useState(0);
  const [repayValue, setRepayValue] = useState(0);
  const [error, setError] = useState("");
  const [isLoadingTx, setLoadingTx] = useState(false);
  const [transactionHash, setTransactionHash] = useState<
    EthereumAddress | undefined
  >(undefined);

  const transaction = useWaitForTransaction({
    hash: transactionHash,
  });

  const {
    data: dataDrexBalance,
    isError: isDrexError,
    isLoading: isLoadingDrex,
  } = useBalanceOfDREX(address as EthereumAddress);

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
    data: dataUnitValue,
    isError: isErrorUnitValue,
    isLoading: isLoadingUnitValue,
  } = useGetUnitValue();

  const {
    data: dataAllowanceDREX,
    isError: isErrorAllowanceDREX,
    isLoading: isLoadingAllowanceDREX,
  } = useAllowanceDREX(address as EthereumAddress);

  const {
    write: writeBorrowDREX,
    data: dataBorrowDREX,
    isLoading: isLoadingBorrowDREX,
    isSuccess: isSuccessBorrowDREX,
    isError: isErrorBorrowDREX,
  } = useBorrowDREX(parseUnits(borrowValue.toFixed(6), 6).toString());

  const {
    write: writeRepayDREX,
    data: dataRepayDREX,
    isLoading: isLoadingRepayDREX,
    isSuccess: isSuccessRepayDREX,
    isError: isErrorRepayDREX,
  } = useRepayDREX(parseUnits(repayValue.toFixed(6), 6).toString());

  const {
    write: writeApproveDREX,
    data: dataApproveDREX,
    isLoading: isLoadingApproveDREX,
    isSuccess: isSuccessApproveDREX,
    isError: isErrorApproveDREX,
  } = useApproveDREX();

  useEffect(() => {
    if (transaction.isSuccess) {
      useToastStore
        .getState()
        .showToast("Transaction successfully completed", "success");
    }
    if (transaction.isError && transactionHash !== "0x") {
      useToastStore
        .getState()
        .showToast(`Erro on TX: ${transaction.error}`, "error");
    }
    setTransactionHash(undefined);
    setLoadingTx(false);
  }, [transaction.isSuccess, transaction.isError]);

  useEffect(() => {
    if (isSuccessApproveDREX) {
      setTransactionHash(dataApproveDREX.hash);
      setLoadingTx(true);
      useToastStore
        .getState()
        .showToast("DREX approval successful", "success");
    }
    if (isErrorApproveDREX) {
      useToastStore.getState().showToast("Error approving DREX", "error");
    }
  }, [isErrorApproveDREX, isSuccessApproveDREX]);

  useEffect(() => {
    if (isSuccessBorrowDREX) {
      setTransactionHash(dataBorrowDREX.hash);
      setLoadingTx(true);
      useToastStore
        .getState()
        .showToast("Successful Borrowed", "success");
    }
    if (isErrorBorrowDREX) {
      useToastStore.getState().showToast("DREX Borrowed Error", "error");
    }
  }, [isErrorBorrowDREX, isSuccessBorrowDREX]);

  useEffect(() => {
    if (isSuccessRepayDREX) {
      setTransactionHash(dataRepayDREX.hash);
      setLoadingTx(true);
      useToastStore
        .getState()
        .showToast("Successfully repaying debt", "success");
    }
    if (isErrorRepayDREX) {
      useToastStore.getState().showToast("Error when depositing DREX", "error");
    }
  }, [isErrorRepayDREX, isSuccessRepayDREX]);

  const [isLoading, setLoading] = useState(true);

  const drexBalance = Number(formatUnits(dataDrexBalance, 6)) || 0;
  const depositedTSELIC = Number(formatUnits(dataDepositedTSELIC, 18)) || 0;
  const borrowedAmount = Number(formatUnits(dataBorrowedAmount, 18)) || 0;
  const unitValue = Number(formatUnits(dataUnitValue, 18)) || 0;
  const allowanceDREX = Number(formatUnits(dataAllowanceDREX, 6)) || 0;
  const totalSupplied = Number(formatUnits(dataTotalSupplied, 18)) || 0;
  const totalBorrowed = Number(formatUnits(dataTotalBorrowed, 18)) || 0;

  useEffect(() => {
    const loading = [
      isLoadingDrex,
      isLoadingDepositedTSELIC,
      isLoadingBorrowedAmount,
      isLoadingUnitValue,
    ].every((loading) => loading === false);

    setLoading(!loading);
  }, [
    isLoadingDrex,
    isLoadingDepositedTSELIC,
    isLoadingBorrowedAmount,
    isLoadingUnitValue,
  ]);

  useEffect(() => {
    if (error) {
      useToastStore.getState().showToast(`${error}`, "error");
    }

    if (isLoadingTx) {
      useToastStore
        .getState()
        .showToast(
          `Hash transaction ${transactionHash &&
          `${transactionHash.slice(0, 6)}...${transactionHash.slice(-4)}`
          } is being processed`,
          "success"
        );
    }
  }, [error, isLoadingTx]);

  return (
    <Tabs>
      <TabContent title="Borrowing">
        <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
          <div className="flex w-full items-start justify-start gap-3">
            <div className="flex h-full w-full flex-col items-start justify-start gap-1">
              <div className="inline-flex items-start justify-start gap-6">
                <div className="text-base font-normal leading-normal text-gray-400">
                  Balance:{" "}
                  {!isLoading
                    ? `${drexBalance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                    : "0"}{" "}
                  DREX
                </div>
              </div>
              <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                <input
                  type="number"
                  className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                  value={borrowValue}
                  onChange={(e) => {
                    const enteredValue = Number(e.target.value);
                    if (enteredValue > (depositedTSELIC * unitValue - borrowedAmount >
                      totalSupplied - totalBorrowed
                      ? totalSupplied - totalBorrowed
                      : (
                        ((depositedTSELIC * unitValue - borrowedAmount) *
                          99) /
                        100
                      ))) {
                      setError("The amount entered is greater than the current balance.");
                    } else {
                      setError("");
                      setBorrowValue(enteredValue);
                    }
                  }}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
                <div className="flex w-[130px] items-center justify-center gap-2.5 p-2">
                  <button
                    className="text-brandBlue-300 text-base font-normal leading-normal"
                    onClick={() =>
                      depositedTSELIC * unitValue - borrowedAmount >
                        totalSupplied - totalBorrowed
                        ? setBorrowValue(totalSupplied - totalBorrowed)
                        : setBorrowValue(
                          ((depositedTSELIC * unitValue - borrowedAmount) *
                            99) /
                          100
                        )
                    }
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
                  <div className="text-xs">DREX</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-col gap-2">
            <div className=" flex justify-between text-white">
              <span>TSELIC Supplied:</span>
              <span>
                {!isLoading
                  ? `${depositedTSELIC.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                  : "0"}{" "}
                TSELIC
              </span>
            </div>
            <div className=" flex justify-between text-white">
              <span>Dollar amount:</span>
              <span>
                {!isLoading
                  ? `$ ${(depositedTSELIC * unitValue).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}`
                  : "$ 0"}
              </span>
            </div>
            <div className="flex justify-between text-white">
              <span>DREX in Borrowing:</span>
              <span>
                {!isLoading
                  ? `${borrowedAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                  : "0"}{" "}
                DREX
              </span>
            </div>
            <div className=" flex justify-between text-white">
              <span>Available Liquidity:</span>
              <span>
                {!isLoading
                  ? `${(totalSupplied - totalBorrowed).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                  : "$ 0"}{" "}
                DREX
              </span>
            </div>
          </div>
          <Button
            text="Borrowing"
            onClick={writeBorrowDREX}
            disabled={
              borrowValue > totalSupplied - totalBorrowed ||
              borrowValue >
              ((depositedTSELIC * unitValue - borrowedAmount) * 99) / 100 ||
              isLoadingTx
            }
            isLoading={isLoadingBorrowDREX}
          />
        </div>
      </TabContent>
      <TabContent title="Repay">
        <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
          <div className="flex w-full items-start justify-start gap-3">
            <div className="flex h-full w-full flex-col items-start justify-start gap-1">
              <div className="inline-flex items-start justify-start gap-6">
                <div className="text-base font-normal leading-normal text-gray-400">
                  Balance:{" "}
                  {!isLoading
                    ? `${drexBalance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                    : "0"}{" "}
                  DREX
                </div>
              </div>
              <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                <input
                  type="number"
                  className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                  value={repayValue}
                  onChange={(e) => {
                    const enteredValue = Number(e.target.value);
                    if (enteredValue > drexBalance) {
                      setError("The amount entered is greater than the current balance.");
                    } else {
                      setError("");
                      setRepayValue(enteredValue);
                    }
                  }}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
                <div className="flex w-[130px] items-center justify-center gap-2.5 p-2">
                  <button
                    className="text-brandBlue-300 text-base font-normal leading-normal"
                    onClick={() => setRepayValue(borrowedAmount)}
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
                  <div className="text-xs">DREX</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-col gap-2">
            <div className="flex justify-between text-white">
              <span>Liability:</span>
              <span>
                {!isLoading
                  ? `${borrowedAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                  : "0"}{" "}
                DREX
              </span>
            </div>
          </div>

          {allowanceDREX <= repayValue ? (
            <Button
              text="Approve"
              onClick={writeApproveDREX}
              isLoading={isLoadingApproveDREX}
            />
          ) : (
            <Button
              text="Repay"
              onClick={writeRepayDREX}
              isLoading={isLoadingRepayDREX}
              disabled={
                repayValue > drexBalance ||
                repayValue > borrowedAmount ||
                isLoadingTx
              }
            />
          )}
        </div>
      </TabContent>
    </Tabs>
  );
};
