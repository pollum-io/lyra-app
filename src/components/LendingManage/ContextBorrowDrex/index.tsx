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
import { BigNumberish } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ContextBorrowDrex = ({
  address,
  dataTotalSupplied,
  dataTotalBorrowed,
}: {
  address: string;
  dataTotalSupplied: BigNumberish;
  dataTotalBorrowed: BigNumberish;
}) => {

  const [borrowValue, setBorrowValue] = useState("");
  const [repayValue, setRepayValue] = useState("");
  const [error, setError] = useState("");

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
  const [approvedAmountDREX, setApprovedAmountDREX] = useState(dataAllowanceDREX);
  
  const handleBorrowDREX = () => {
    useBorrowDREX(borrowValue);
   //TODO update user deposited and wallet balance after write is sucesfull 
 }
  const handleRepayDREX = () => {
    useRepayDREX(borrowValue);
    //TODO update user deposited and wallet balance after write is sucesfull 
 }
 
  const [isLoading, setLoading] = useState(true);

  const handleApproveDREX =  () => {
    const { data, isError, isSuccess } = useApproveDREX();
    if(isError) {
      //TODO return error
      alert("use rejected Transaction");
    }
    console.log('Check what comes as data', data);
    if(isSuccess) {
      const {data } = useAllowanceDREX(address as EthereumAddress)
      setApprovedAmountDREX(String(data));
    }
  }

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
                  Balanço: {!isLoading ? `${(Number(dataDrexBalance) /1e6).toFixed(2)}` : "0"} DREX
                </div>
              </div>
              <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                <input
                  type="number"
                  className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder={"0"}
                  value={Number(borrowValue)} 
                  onChange={(e) => {
                    const enteredValue = Number(e.target.value);
                    if (enteredValue > Number(dataDrexBalance) /1e6) {
                      setError("Entered value is greater than current balance");
                    } else {
                      setError("");
                      setBorrowValue(e.target.value);
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
                    onClick={() => (
                      (Number(dataDepositedTSELIC) *
                        Number(dataUnitValue)) /
                      1e36 
                    ) - (Number(dataBorrowedAmount) / 1e18) > ((Number(dataTotalSupplied) - Number(dataTotalBorrowed))/1e18) ? 
                      setBorrowValue(((Number(dataTotalSupplied) - Number(dataTotalBorrowed))/1e12).toString()) 
                      : setBorrowValue(((Number(dataDepositedTSELIC) * Number(dataUnitValue)) / 1e18 - (Number(dataBorrowedAmount)) / 1e12).toString())
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

          <div className="flex h-full w-full flex-col gap-2">
            <div className=" flex justify-between text-white">
              <span>TSELIC Depositado:</span>
              <span>{!isLoading ? `${(Number(dataDepositedTSELIC) / 1e18).toFixed(2)}` : "0"} TSELIC</span>
            </div>
            <div className=" flex justify-between text-white">
              <span>Valor em Reais:</span>
              <span>{!isLoading ? `R$ ${(
                      (Number(dataDepositedTSELIC) *
                        Number(dataUnitValue)) /
                      1e36
                    ).toFixed(2)}` : "R$ 0"}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>DREX em Emprestado:</span>
              <span>{!isLoading ? `${(Number(dataBorrowedAmount) / 1e18).toFixed(2)}` : "0"} DREX</span>
            </div>
            <div className=" flex justify-between text-white">
              <span>Liquidez Disponível:</span>
              <span>
                {!isLoading
                  ? `${
                      ((Number(dataTotalSupplied) - Number(dataTotalBorrowed))/1e18).toFixed(2)
                    }`
                  : "R$ 0"} DREX
              </span>
            </div>
          </div>
          <Button
            text="Tomar Emprestimo"
            onClick={handleBorrowDREX}
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
                  Balanço: {!isLoading ? `${(Number(dataDrexBalance) / 1e6).toFixed(2)}` : "0"} DREX
                </div>
              </div>
              <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                <input
                  type="number"
                  className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder={"0"}
                  value={Number(repayValue)} 
                  onChange={(e) => {
                    const enteredValue = Number(e.target.value);
                    if (enteredValue > Number(dataDrexBalance)) {
                      setError("Entered value is greater than current balance");
                    } else {
                      setError("");
                      setRepayValue(e.target.value);
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
                    onClick={() => setRepayValue((Number(dataBorrowedAmount)/1e12).toFixed())}
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
              <span>{!isLoading ? `${(Number(dataBorrowedAmount) / 1e18).toFixed(2)}` : "0"} DREX</span>
            </div>
          </div>

          {Number(approvedAmountDREX) < Number(dataDrexBalance) ? (
          <Button
            text="Depositar"
            onClick={handleRepayDREX}
            isLoading={false}
          />
        ) : (
          <Button
            text="Quitar Emprestimo"
            onClick={handleApproveDREX}
            isLoading={false}
          />
        )}
        </div>
      </TabContent>
    </Tabs>
  );
};
