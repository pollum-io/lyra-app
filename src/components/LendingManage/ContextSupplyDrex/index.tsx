"use client";

import { Button } from "@/components/Button";
import Tabs, { TabContent } from "@/components/Tabs";
import { EthereumAddress, useBalanceOfDREX, useAllowanceDREX, useApproveDREX } from "@/hooks/useErc20";
import {
  getSupplyInterestRate,
  useGetSuppliedDREX,
  useSupplyDREX,
} from "@/hooks/useRBLLPoolContract";
import { BigNumberish } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ContextSupplyDrex = ({
  address,
  dataTotalSupplied,
  dataTotalBorrowed,
}: {
  address: string;
  dataTotalSupplied: BigNumberish;
  dataTotalBorrowed: BigNumberish;
}) => {
  const {
    data: dataAllowanceDREX,
    isError: isErrorAllowanceDREX,
    isLoading: isLoadingAllowanceDREX,
  } = useAllowanceDREX(address as EthereumAddress);
  const [approvedAmountDREX, setApprovedAmountDREX] = useState(dataAllowanceDREX);
  const {
    data: dataDrexBalance,
    isError: isDrexError,
    isLoading: isLoadingDrex,
  } = useBalanceOfDREX(address as EthereumAddress);
  const formattedTotalSupply = (Number(dataTotalSupplied) / 10 ** 18).toFixed(2);
  const formattedTotalBorrowed = (Number(dataTotalBorrowed) / 10 ** 18).toFixed(2);
  const {
    data: dataSuppliedDREX,
    isError: isErrorSuppliedDREX,
    isLoading: isLoadingSuppliedDREX,
  } = useGetSuppliedDREX(address as EthereumAddress);
  const [dataSupplied, setDataSupplied] = useState(Number(dataSuppliedDREX)/10**18);

  const drexBalance = Number(dataDrexBalance) / 10 ** 6;
  const drexamountsupply = 100 * 1e6;
  const [valueDREX, setValueDREX] = useState("");
  const [valueRBLL, setValueRBLL] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(true);

  const {
    data: dataSupplyInterestRate,
    isError: isErrorSupplyInterestRate,
    isLoading: isLoadingSupplyInterestRate,
  } = getSupplyInterestRate(dataTotalSupplied || 0, dataTotalBorrowed || 0);

  const handleApproveDREX = async () => {
    const { data, isError, isSuccess } = await useApproveDREX();
    if(isError) {
      //TODO return error
      alert("use rejected Transaction");
    }
    console.log('Check what comes as data', data);
    if(isSuccess) {
      const {data } = useAllowanceDREX(address as EthereumAddress)
      setApprovedAmountDREX(Number(data)/10**6);
    }
  }
  const handleDepositDREX = async () => {
     await useSupplyDREX(Number(valueDREX)*10**6);
     //TODO update user deposited and wallet balance after write is sucesfull 
  }


  useEffect(() => {
    const loading = [
      isLoadingDrex,
      isLoadingSupplyInterestRate,
      isLoadingSuppliedDREX,
    ].every((loading) => loading === false);

    setLoading(!loading);
  }, [isLoadingDrex, isLoadingSupplyInterestRate, isLoadingSuppliedDREX]);

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
                  value={valueDREX}
                  onChange={(e) => {
                    const enteredValue = Number(e.target.value);
                    if (enteredValue > drexBalance) {
                      setError("Entered value is greater than current balance");
                    } else {
                      setError("");
                      setValueDREX(e.target.value);
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
                    onClick={() => setValueDREX(drexBalance.toString())}
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
              <span>APY de Deposito:</span>
              <span>{Number(dataSupplyInterestRate || 0) / 10e5}%</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Total Depositado:</span>
              <span>{!isLoading ? `R$ ${formattedTotalSupply}` : "R$ 0"}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Total Emprestado:</span>
              <span>{!isLoading ? `R$ ${formattedTotalBorrowed}` : "R$ 0"}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Taxa de Utilização:</span>
              <span>
                {!isLoading
                  ? `${
                      ((Number(dataTotalBorrowed) / Number(dataTotalSupplied)) *
                      100).toFixed(2)
                    }`
                  : "0"}
                %
              </span>
            </div>
          </div>
        {Number(approvedAmountDREX) < Number(valueDREX) ? (
          <Button
            text="Depositar"
            onClick={handleDepositDREX}
            isLoading={false}
          />
        ) : (
          <Button
            text="Aprovar"
            onClick={handleApproveDREX}
            isLoading={false}
          />
        )}
        </div>
      </TabContent>
      <TabContent title="Sacar">
        <div className="flex h-[400px] w-full flex-col items-center justify-center gap-6 pt-5">
          <div className="flex w-full items-start justify-start gap-3">
            <div className="flex h-full w-full flex-col items-start justify-start gap-4">
              <div className="inline-flex items-start justify-start gap-6">
                <div className="text-base font-normal leading-normal text-gray-400">
                  Balanço: {!isLoading ? `${dataSupplied}` : "0"} rBRLL
                </div>
              </div>
              <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                <input
                  type="number"
                  className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder={"0"}
                  value={valueRBLL}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
                <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                  <button
                    className="text-brandBlue-300 text-base font-normal leading-normal"
                    onClick={() => setValueRBLL(dataSupplied.toString())}
                  >
                    max
                  </button>
                  <div className="relative h-6 w-6">
                    <Image
                      src={"/images/brll.png"}
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
                  value={valueRBLL} // Set this value to be the same as the first input
                  readOnly // Makes this input read-only
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
                      ((Number(dataTotalSupplied) - Number(dataTotalBorrowed))/10**18).toFixed(2)
                    }`
                  : "R$ 0"}
              </span>
            </div>
            <div className="flex justify-between text-white">
              <span>Total Depositado:</span>
              <span>{!isLoading ? `R$ ${formattedTotalSupply}` : "R$ 0"}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Total Emprestado:</span>
              <span>{!isLoading ? `R$ ${formattedTotalBorrowed}` : "R$ 0"}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Taxa de Utilização:</span>
              <span>
                {!isLoading
                  ? `${
                      ((Number(dataTotalBorrowed) / Number(dataTotalSupplied)) *
                      100).toFixed(2)
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
                  Balanço: {!isLoading ? `${dataSupplied}` : "0"} rBRLL
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
                      src={"/images/brll.png"}
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
            O recall instantâneo facilita a troca de garantias em TSELIC por
            DREX através da Uniswap.
          </div>

          <Button text="Recall" onClick={() => null} isLoading={false} />
        </div>
      </TabContent>
    </Tabs>
  );
};
