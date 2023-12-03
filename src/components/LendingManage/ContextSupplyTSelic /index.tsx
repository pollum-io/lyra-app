"use Client";
import { Button } from "@/components/Button";
import Tabs, { TabContent } from "@/components/Tabs";
import ToastNotification from "@/components/Toast";
import {
  EthereumAddress,
  useAllowanceTSELIC,
  useApproveTSELIC,
  useBalanceOfTSELIC,
} from "@/hooks/useErc20";
import {
  useGetBorrowedAmount,
  useGetDepositedTSELIC,
  useSupplyTSELIC,
  useWithdrawTSELIC,
} from "@/hooks/useRBLLPoolContract";
import { BigNumberish } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWaitForTransaction } from "wagmi";

export const ContextSupplyTSelic = ({ address }: { address: string }) => {
  const [isLoading, setLoading] = useState(true);
  const [valueTselic, setValueTselic] = useState("");
  const [valueWithdrawlTselic, setValueWithdrawlTselic] = useState("");
  const [error, setError] = useState("");
  const [isLoadingTx, setLoadingTx] = useState(false);
  const [transactionHash, setTransactionHash] = useState<
    EthereumAddress | undefined
  >(undefined);

  const {
    data: dataTselicBalance,
    isError: isTselicError,
    isLoading: isLoadingTselic,
  } = useBalanceOfTSELIC(address as EthereumAddress);
  const formattedTselicBalance = Number(dataTselicBalance) / 10 ** 18;

  const {
    data: dataDepositedTSELIC,
    isError: isErrorDepositedTSELIC,
    isLoading: isLoadingDepositedTSELIC,
  } = useGetDepositedTSELIC(address as EthereumAddress);
  const formattedDepositedTSELIC = Number(dataDepositedTSELIC) / 10 ** 18;

  const {
    data: dataBorrowedAmount,
    isError: isErrorBorrowedAmount,
    isLoading: isLoadingBorrowedAmount,
  } = useGetBorrowedAmount(address as EthereumAddress);
  const formattedBorrowed = Number(dataBorrowedAmount) / 10 ** 18;

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

  const {
    write: writeSupplyTSELIC,
    data: dataSupplyTSELIC,
    isLoading: isLoadingSupplyTSELIC,
    isSuccess: isSuccessSupplyTSELIC,
    isError: isErrorSupplyTSELIC,
  } = useSupplyTSELIC(
    Number(valueTselic) == 0 ? 1 : Number(valueTselic) * 10 ** 18
  );

  const {
    write: writeWithdrawTSELIC,
    data: dataWithdrawTSELIC,
    isLoading: isLoadingWithdrawTSELIC,
    isSuccess: isSuccessWithdrawTSELIC,
    isError: isErrorWithdrawTSELIC,
  } = useWithdrawTSELIC(
    Number(valueTselic) == 0 ? 1 : Number(valueWithdrawlTselic) * 10 ** 18
  );

  const [approvedAmountTselic, setApprovedAmountTselic] = useState(
    Number(dataAllowanceTSELIC) / 10 ** 18
  );
  const transaction = useWaitForTransaction({
    hash: transactionHash,
  });

  useEffect(() => {
    if (transaction.isSuccess) {
      // alert("Transaction is successfull");
      <ToastNotification
        message={"Transaction is successfull"}
        type="success"
      />;
    }
    if (transaction.isError && transactionHash !== "0x") {
      // alert(`Error in TX ${transaction.error}`);
      <ToastNotification
        message={`Error in TX ${transaction.error}`}
        type="error"
      />;
    }
    setTransactionHash(undefined);
    setLoadingTx(false);
  }, [transaction.isSuccess, transaction.isError]);

  useEffect(() => {
    if (isSuccessApproveTSELIC) {
      setTransactionHash(dataApproveTSELIC.hash);
      setLoadingTx(true);
    }
    if (isErrorApproveTSELIC) {
      // alert("Error in approving TSELIC");
      <ToastNotification message={"Error in approving TSELIC"} type="error" />;
    }
  }, [isErrorApproveTSELIC, isSuccessApproveTSELIC]);

  useEffect(() => {
    if (Number(dataAllowanceTSELIC) !== approvedAmountTselic * 10 ** 18) {
      setApprovedAmountTselic(Number(dataAllowanceTSELIC) / 10 ** 18);
    }
  }, [dataAllowanceTSELIC]);

  useEffect(() => {
    if (isSuccessSupplyTSELIC) {
      setTransactionHash(dataSupplyTSELIC.hash);
      setLoadingTx(true);
    }
    if (isErrorSupplyTSELIC) {
      // alert("Error in depositing TSELIC");
      <ToastNotification message={"Error in depositing TSELIC"} type="error" />;
    }
  }, [isErrorSupplyTSELIC, isSuccessSupplyTSELIC]);

  useEffect(() => {
    if (isSuccessWithdrawTSELIC) {
      setTransactionHash(dataWithdrawTSELIC.hash);
      setLoadingTx(true);
    }
    if (isErrorWithdrawTSELIC) {
      // alert("Error in withdrawal DREX");
      <ToastNotification message={"Error in withdrawal DREX"} type="error" />;
    }
  }, [isErrorWithdrawTSELIC, isSuccessWithdrawTSELIC]);

  useEffect(() => {
    const loading = [
      isLoadingTselic,
      isLoadingDepositedTSELIC,
      isLoadingBorrowedAmount,
      isLoadingAllowanceTSELIC,
    ].every((loading) => loading === false);

    setLoading(!loading);
  }, [
    isLoadingTselic,
    isLoadingDepositedTSELIC,
    isLoadingBorrowedAmount,
    isLoadingAllowanceTSELIC,
  ]);

  return (
    <Tabs>
      <TabContent title="Depositar">
        <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
          <div className="flex w-full items-start justify-start gap-3">
            <div className="flex h-full w-full flex-col items-start justify-start gap-1">
              <div className="inline-flex items-start justify-start gap-6">
                <div className="text-base font-normal leading-normal text-gray-400">
                  Balanço: {!isLoading ? `${formattedTselicBalance}` : "0"}{" "}
                  TSELIC
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
                    if (enteredValue > formattedTselicBalance) {
                      setError("O valor inserido é maior que o saldo atual.");
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
                <div className="flex w-[130px] items-center justify-center gap-2.5 p-2">
                  <button
                    className="text-brandBlue-300 text-base font-normal leading-normal"
                    onClick={() =>
                      setValueTselic(formattedTselicBalance.toString())
                    }
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
                  <div className="text-xs">TSELIC</div>
                </div>
              </div>

              {error && <ToastNotification message={`${error}`} type="error" />}
              {isLoadingTx && (
                <ToastNotification
                  message={`Transação com hash ${
                    transactionHash &&
                    `${transactionHash.slice(0, 6)}...${transactionHash.slice(
                      -4
                    )}`
                  } esta sendo processada`}
                  type="success"
                />
              )}
            </div>
          </div>

          <div className="flex h-full w-full flex-col gap-2">
            <div className=" flex justify-between text-white">
              <span>TSELIC Depositado:</span>
              <span>
                {!isLoading ? `${formattedDepositedTSELIC}` : "0"} TSELIC
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
              isLoading={isLoadingSupplyTSELIC}
            />
          )}
        </div>
      </TabContent>
      <TabContent title="Sacar">
        <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
          <div className="flex w-full items-start justify-start gap-3">
            <div className="flex h-full w-full flex-col items-start justify-start gap-1">
              <div className="inline-flex items-start justify-start gap-6">
                <div className="text-base font-normal leading-normal text-gray-400">
                  Balanço: {!isLoading ? `${formattedTselicBalance}` : "0"}{" "}
                  TSELIC
                </div>
              </div>
              <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                <input
                  type="number"
                  className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder={"0"}
                  value={valueWithdrawlTselic}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
                <div className="flex w-[130px] items-center justify-center gap-2.5 p-2">
                  <button
                    className="text-brandBlue-300 text-base font-normal leading-normal"
                    onClick={() =>
                      setValueWithdrawlTselic(
                        formattedDepositedTSELIC.toString()
                      )
                    }
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
                  <div className="text-xs">TSELIC</div>
                </div>
              </div>
            </div>
          </div>
          {isLoadingTx && (
            <ToastNotification
              message={`Transação com hash ${
                transactionHash &&
                `${transactionHash.slice(0, 6)}...${transactionHash.slice(-4)}`
              } esta sendo processada`}
              type="success"
            />
          )}

          <div className="flex h-full w-full flex-col gap-2">
            <div className=" flex justify-between text-white">
              <span>TSELIC Depositado:</span>
              <span>
                {!isLoading ? `${formattedDepositedTSELIC}` : "0"} TSELIC
              </span>
            </div>
            <div className="flex justify-between text-white">
              <span>DREX em Empréstimo:</span>
              <span>{!isLoading ? `${formattedBorrowed}` : "0"} DREX</span>
            </div>
          </div>
          <Button
            text="Sacar"
            onClick={writeWithdrawTSELIC}
            isLoading={isLoadingWithdrawTSELIC}
          />
        </div>
      </TabContent>
    </Tabs>
  );
};
