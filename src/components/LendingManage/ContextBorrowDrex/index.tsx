"use client";

import { Button } from "@/components/Button";
import Tabs, { TabContent } from "@/components/Tabs";
import { EthereumAddress, useBalanceOfDREX, useAllowanceDREX, useApproveDREX } from "@/hooks/useErc20";
import {
  useBorrowDREX,
  useGetBorrowedAmount,
  useGetDepositedTSELIC,
  useGetUnitValue,
  useRepayDREX,
} from "@/hooks/useRBLLPoolContract";
import { BigNumberish, parseUnits, formatUnits} from "ethers";
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
  const [transactionHash, setTransactionHash] = useState<EthereumAddress | undefined>(undefined);

  const transaction = useWaitForTransaction({
    hash: transactionHash
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
    if(transaction.isSuccess) {
      alert('Transaction is successfull');
    }
    if(transaction.isError && transactionHash !== "0x") {
      alert(`Error in TX ${transaction.error}`);
    }
    setTransactionHash(undefined);
    setLoadingTx(false);
  }, [transaction.isSuccess,transaction.isError]);

useEffect(() => {
  if(isSuccessApproveDREX) {
    setTransactionHash(dataApproveDREX.hash);
    setLoadingTx(true);
    
  }
  if(isErrorApproveDREX) {
    alert('Error in approving DREX');
  }
}
, [isErrorApproveDREX, isSuccessApproveDREX]);


useEffect(() => {
  if(isSuccessBorrowDREX) {
    setTransactionHash(dataBorrowDREX.hash);
    setLoadingTx(true);
    
  }
  if(isErrorBorrowDREX) {
    alert('Error in withdrawal DREX');
  }
}
, [isErrorBorrowDREX, isSuccessBorrowDREX]);

useEffect(() => {
  if(isSuccessRepayDREX) {
    setTransactionHash(dataRepayDREX.hash);
    setLoadingTx(true); 
  }
  if(isErrorRepayDREX) {
    alert('Error in depositing DREX');
  }
} , [isErrorRepayDREX, isSuccessRepayDREX]);

  const [isLoading, setLoading] = useState(true);

  const drexBalance =  Number(formatUnits(dataDrexBalance, 6)) || 0
  const depositedTSELIC = Number(formatUnits(dataDepositedTSELIC,18) )|| 0
  const borrowedAmount = Number(formatUnits(dataBorrowedAmount,18)) || 0
  const unitValue = Number(formatUnits(dataUnitValue ,18)) || 0
  const allowanceDREX = Number(formatUnits(dataAllowanceDREX,6)) || 0
  const totalSupplied = Number(formatUnits(dataTotalSupplied ,18)) || 0
  const totalBorrowed = Number(formatUnits(dataTotalBorrowed ,18)) || 0

  useEffect(() => {
    const loading = [isLoadingDrex, isLoadingDepositedTSELIC,isLoadingBorrowedAmount,isLoadingUnitValue].every(
      (loading) => loading === false
    );

    setLoading(!loading);
  }, [isLoadingDrex, isLoadingDepositedTSELIC,isLoadingBorrowedAmount,isLoadingUnitValue]);

  return (
    <Tabs>
      <TabContent title="Emprestar">
        <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
          <div className="flex w-full items-start justify-start gap-3">
            <div className="flex h-full w-full flex-col items-start justify-start gap-1">
              <div className="inline-flex items-start justify-start gap-6">
                <div className="text-base font-normal leading-normal text-gray-400">
                  Balanço: {!isLoading ? `${drexBalance.toFixed(2)}` : "0"} DREX
                </div>
              </div>
              <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                <input
                  type="number"
                  className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                  value={borrowValue} 
                  onChange={(e) => {
                    const enteredValue = Number(e.target.value);
                    if (enteredValue > drexBalance) {
                      setError("Entered value is greater than current balance");
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
                <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                  <button
                    className="text-brandBlue-300 text-base font-normal leading-normal"
                    onClick={() => 
                      ((depositedTSELIC *
                        unitValue) 
                     - borrowedAmount) > (totalSupplied - totalBorrowed) ? 
                      setBorrowValue((totalSupplied - totalBorrowed)) 
                      : setBorrowValue((((depositedTSELIC *
                        unitValue) 
                     - borrowedAmount) * 99/100))
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
                </div>
              </div>
              {error && <div className="text-sm text-red-500">{error}</div>}
            </div>
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
              {isLoadingTx && <div className="text-sm text-green-500">Transaction of hash {transactionHash} is being processed</div>}
          <div className="flex h-full w-full flex-col gap-2">
            <div className=" flex justify-between text-white">
              <span>TSELIC Depositado:</span>
              <span>{!isLoading ? `${(depositedTSELIC).toFixed(2)}` : "0"} TSELIC</span>
            </div>
            <div className=" flex justify-between text-white">
              <span>Valor em Reais:</span>
              <span>{!isLoading ? `R$ ${(
                      depositedTSELIC *
                        unitValue
                    ).toFixed(2)}` : "R$ 0"}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>DREX em Emprestado:</span>
              <span>{!isLoading ? `${(borrowedAmount).toFixed(2)}` : "0"} DREX</span>
            </div>
            <div className=" flex justify-between text-white">
              <span>Liquidez Disponível:</span>
              <span>
                {!isLoading
                  ? `${
                      (totalSupplied - totalBorrowed).toFixed(2)
                    }`
                  : "R$ 0"} DREX
              </span>
            </div>
          </div>
          <Button
            text="Tomar Emprestimo"
            onClick={writeBorrowDREX}
            disabled={(borrowValue > (totalSupplied - totalBorrowed) || borrowValue > (((depositedTSELIC * unitValue) - borrowedAmount) * 99/100) || isLoadingTx)}
            isLoading={isLoadingBorrowDREX}
          />
        </div>
      </TabContent>
      <TabContent title="Quitar">
        <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
          <div className="flex w-full items-start justify-start gap-3">
            <div className="flex h-full w-full flex-col items-start justify-start gap-1">
              <div className="inline-flex items-start justify-start gap-6">
                <div className="text-base font-normal leading-normal text-gray-400">
                  Balanço: {!isLoading ? `${(drexBalance).toFixed(2)}` : "0"} DREX
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
                      setError("Entered value is greater than current balance");
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
                <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
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
                </div>
              </div>
            </div>
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
              {isLoadingTx && <div className="text-sm text-green-500">Transaction of hash {transactionHash} is being processed</div>}
          <div className="flex h-full w-full flex-col gap-2">
            <div className="flex justify-between text-white">
              <span>Passivo em DREX:</span>
              <span>{!isLoading ? `${(borrowedAmount).toFixed(2)}` : "0"} DREX</span>
            </div>
          </div>

          {(allowanceDREX < drexBalance) ? (
          <Button
            text="Approvar"
            onClick={writeApproveDREX}
            isLoading={isLoadingApproveDREX}
          />
        ) : (
          <Button
            text="Quitar Emprestimo"
            onClick={writeRepayDREX}
            isLoading={isLoadingRepayDREX}
            disabled={repayValue > drexBalance || repayValue > borrowedAmount || isLoadingTx}
          />
        )}
        </div>
      </TabContent>
    </Tabs>
  );
};