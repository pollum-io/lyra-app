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
  getSupplyInterestRate,
  useGetSuppliedDREX,
  useSupplyDREX,
  useWithdrawDREX,
  useFlashLiquidateBorrow,
  hasRole,
} from "@/hooks/useRBLLPoolContract";
import { BigNumberish } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BORROWER, POOL_MANAGER_ROLE } from "@/constant/roles";
import { useWaitForTransaction } from "wagmi";
import ToastNotification from "@/components/Toast";
import { useToastStore } from "@/stores/toast";
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

  const [approvedAmountDREX, setApprovedAmountDREX] = useState(
    Number(dataAllowanceDREX) / 10 ** 6
  );

  const {
    data: dataDrexBalance,
    isError: isDrexError,
    isLoading: isLoadingDrex,
  } = useBalanceOfDREX(address as EthereumAddress);

  const formattedTotalSupply = (Number(dataTotalSupplied) / 10 ** 18).toFixed(
    2
  );

  const formattedTotalBorrowed = (Number(dataTotalBorrowed) / 10 ** 18).toFixed(
    2
  );

  const {
    data: dataSuppliedDREX,
    isError: isErrorSuppliedDREX,
    isLoading: isLoadingSuppliedDREX,
  } = useGetSuppliedDREX(address as EthereumAddress);

  const { data: canRecall } = hasRole(
    POOL_MANAGER_ROLE,
    address as EthereumAddress
  );

  const drexBalance = Number(dataDrexBalance) / 10 ** 6;

  const [valueDREX, setValueDREX] = useState("");
  const [valueRBLL, setValueRBLL] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isLoadingTx, setLoadingTx] = useState(false);
  const [transactionHash, setTransactionHash] = useState<
    EthereumAddress | undefined
  >(undefined);

  const {
    write: writeApprove,
    data: dataApprove,
    isError: isErrorApprove,
    isSuccess: isSuccessApprove,
    isLoading: isLoadingApproval,
  } = useApproveDREX();

  const {
    write: writeDeposit,
    data: dataDeposit,
    isError: isErrorDeposit,
    isSuccess: isSuccessDeposit,
    isLoading: isLoadingDeposit,
  } = useSupplyDREX(Number(valueDREX) == 0 ? 1 : Number(valueDREX) * 10 ** 6);

  const {
    write: writeWithdrawal,
    data: dataWithdrawal,
    isError: isErrorWithdrawal,
    isSuccess: isSucessWithdrawal,
    isLoading: isLoadingWithDrawal,
  } = useWithdrawDREX((Number(valueRBLL) * 10 ** 6).toFixed());

  const {
    write: writeRecall,
    data: dataRecall,
    isError: isErrorRecall,
    isSuccess: isSucessRecall,
    isLoading: isLoadingRecall,
  } = useFlashLiquidateBorrow(
    BORROWER,
    (Number(valueRBLL) * 10 ** 6).toFixed(),
    4 * 10 ** 6
  );

  const {
    data: dataSupplyInterestRate,
    isError: isErrorSupplyInterestRate,
    isLoading: isLoadingSupplyInterestRate,
  } = getSupplyInterestRate(dataTotalSupplied || 0, dataTotalBorrowed || 0);

  const transaction = useWaitForTransaction({
    hash: transactionHash,
  });

  useEffect(() => {
    if (transaction.isSuccess) {
      useToastStore
        .getState()
        .showToast("Transação feita com sucesso", "success");
    } else if (transaction.isError && transactionHash !== "0x") {
      useToastStore
        .getState()
        .showToast(`Erro na TX: ${transaction.error}`, "error");
    }
    setTransactionHash(undefined);
    setLoadingTx(false);
  }, [transaction.isSuccess, transaction.isError]);

  useEffect(() => {
    if (isSuccessApprove) {
      setTransactionHash(dataApprove.hash);
      setLoadingTx(true);
      useToastStore
        .getState()
        .showToast("Aprovação feita com sucesso DREX", "success");
    }
    if (isErrorApprove) {
      useToastStore.getState().showToast("Erro ao aprovar DREX", "error");
    }
  }, [isErrorApprove, isSuccessApprove]);

  useEffect(() => {
    if (isSuccessApprove) {
      setTransactionHash(dataRecall.hash);
      setLoadingTx(true);
      useToastStore
        .getState()
        .showToast("Aprovação feita com sucesso", "success");
    }
    if (isErrorApprove) {
      useToastStore.getState().showToast("Erro ao aprovar DREX", "error");
    }
  }, [isErrorRecall, isSucessRecall]);

  useEffect(() => {
    if (isSucessWithdrawal) {
      setTransactionHash(dataWithdrawal.hash);
      setLoadingTx(true);
      useToastStore.getState().showToast("Saque feito com sucesso", "success");
    }
    if (isErrorWithdrawal) {
      useToastStore.getState().showToast("Erro ao sacar DREX", "error");
    }
  }, [isErrorWithdrawal, isSucessWithdrawal]);

  useEffect(() => {
    if (isSuccessDeposit) {
      setTransactionHash(dataDeposit.hash);
      setLoadingTx(true);
      useToastStore
        .getState()
        .showToast("Deposito feito com sucesso", "success");
    }
    if (isErrorDeposit) {
      useToastStore.getState().showToast("Erro ao depositar DREX", "error");
    }
  }, [isErrorDeposit, isSuccessDeposit]);

  useEffect(() => {
    if (Number(dataAllowanceDREX) !== approvedAmountDREX * 10 ** 6) {
      setApprovedAmountDREX(Number(dataAllowanceDREX) / 10 ** 6);
    }
  }, [dataAllowanceDREX]);

  useEffect(() => {
    const loading = [
      isLoadingDrex,
      isLoadingSupplyInterestRate,
      isLoadingSuppliedDREX,
    ].every((loading) => loading === false);

    setLoading(!loading);
  }, [isLoadingDrex, isLoadingSupplyInterestRate, isLoadingSuppliedDREX]);

  useEffect(() => {
    if (error) {
      useToastStore.getState().showToast(`${error}`, "error");
    }

    if (isLoadingTx) {
      useToastStore
        .getState()
        .showToast(
          `Transação com hash ${
            transactionHash &&
            `${transactionHash.slice(0, 6)}...${transactionHash.slice(-4)}`
          } esta sendo processada`,
          "success"
        );
    }
  }, [error, isLoadingTx]);

  return (
    <Tabs>
      <TabContent title="Depositar">
        <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
          <div className="flex w-full items-start justify-start gap-3">
            <div className="flex h-full w-full flex-col items-start justify-start gap-1">
              <div className="inline-flex items-start justify-start gap-6">
                <div className="text-base font-normal leading-normal text-gray-400">
                  Balanço:{" "}
                  {drexBalance.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  DREX
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
                      setError("O valor inserido é maior que o saldo atual.");
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
                <div className="flex w-[130px] items-center justify-center gap-2.5 p-2">
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
                  <div className="text-xs">DREX</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-full w-full flex-col gap-2">
            <div className=" flex justify-between text-white">
              <span>APR de Deposito:</span>
              <span>
                {(Number(dataSupplyInterestRate || 0) / 10e5).toLocaleString(
                  "pt-BR",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}
                %
              </span>
            </div>
            <div className="flex justify-between text-white">
              <span>Total Depositado:</span>
              <span>
                {!isLoading
                  ? `R$ ${Number(formattedTotalSupply).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "R$ 0"}
              </span>
            </div>
            <div className="flex justify-between text-white">
              <span>Total Emprestado:</span>
              <span>
                {!isLoading
                  ? `R$ ${Number(formattedTotalBorrowed).toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}`
                  : "R$ 0"}
              </span>
            </div>
            <div className="flex justify-between text-white">
              <span>Taxa de Utilização:</span>
              <span>
                {!isLoading
                  ? `${(
                      (Number(dataTotalBorrowed) / Number(dataTotalSupplied)) *
                      100
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "0"}
                %
              </span>
            </div>
          </div>
          {Number(approvedAmountDREX) >= Number(valueDREX) ? (
            <Button
              text="Depositar"
              onClick={writeDeposit}
              isLoading={isLoadingDeposit}
              disabled={
                valueDREX === "" || Number(valueDREX) === 0 || isLoadingTx
              }
            />
          ) : (
            <Button
              text="Aprovar"
              onClick={writeApprove}
              isLoading={isLoadingApproval}
              disabled={
                valueDREX === "" || Number(valueDREX) === 0 || isLoadingTx
              }
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
                  Balanço:{" "}
                  {!isLoading
                    ? `${(Number(dataSuppliedDREX) / 10 ** 18).toLocaleString(
                        "pt-BR",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}`
                    : "0"}{" "}
                  rBRLL
                </div>
              </div>
              <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                <input
                  type="number"
                  className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder={"0"}
                  value={valueRBLL}
                  onChange={(e) => {
                    const enteredValue = Number(e.target.value);
                    if (enteredValue > Number(dataSuppliedDREX) / 10 ** 18) {
                      setError("O valor inserido é maior que o saldo atual.");
                    } else {
                      setError("");
                      setValueRBLL(e.target.value);
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
                      setValueRBLL(
                        (Number(dataSuppliedDREX) / 10 ** 18).toString()
                      )
                    }
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
                  <div className="text-xs">rBRLL</div>
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
                <div className="flex w-[130px] items-center justify-end gap-2.5 p-2">
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
              <span>Liquidez Disponível:</span>
              <span>
                {!isLoading
                  ? `R$ ${(
                      (Number(dataTotalSupplied) - Number(dataTotalBorrowed)) /
                      10 ** 18
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "R$ 0"}
              </span>
            </div>
            <div className="flex justify-between text-white">
              <span>Total Depositado:</span>
              <span>
                {!isLoading
                  ? `R$ ${Number(formattedTotalSupply).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "R$ 0"}
              </span>
            </div>
            <div className="flex justify-between text-white">
              <span>Total Emprestado:</span>
              <span>
                {!isLoading
                  ? `R$ ${Number(formattedTotalBorrowed).toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}`
                  : "R$ 0"}
              </span>
            </div>
            <div className="flex justify-between text-white">
              <span>Taxa de Utilização:</span>
              <span>
                {!isLoading
                  ? `${(
                      (Number(dataTotalBorrowed) / Number(dataTotalSupplied)) *
                      100
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "0"}
                %
              </span>
            </div>
          </div>

          <Button
            text="Sacar"
            onClick={writeWithdrawal}
            isLoading={isLoadingWithDrawal}
            disabled={valueRBLL === "" || Number(valueRBLL) === 0}
          />
        </div>
      </TabContent>
      <TabContent title="Recall">
        <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
          <div className="flex w-full items-start justify-start gap-3">
            <div className="flex h-full w-full flex-col items-start justify-start gap-4">
              <div className="inline-flex items-start justify-start gap-6">
                <div className="text-base font-normal leading-normal text-gray-400">
                  Balanço:{" "}
                  {!isLoading
                    ? `${(Number(dataSuppliedDREX) / 10 ** 18).toLocaleString(
                        "pt-BR",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}`
                    : "0"}{" "}
                  rBRLL
                </div>
              </div>
              <div className="border-brandBlue-300 inline-flex w-full items-center justify-between rounded-lg border border-opacity-20 bg-gray-700 px-3">
                <input
                  type="number"
                  className="h-full min-w-[50px] border-none bg-transparent text-base font-normal leading-normal text-white shadow outline-none focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder={"0"}
                  value={valueRBLL}
                  onChange={(e) => {
                    const enteredValue = Number(e.target.value);
                    if (enteredValue > Number(dataSuppliedDREX) / 10 ** 18) {
                      setError("O valor inserido é maior que o saldo atual.");
                    } else {
                      setError("");
                      setValueRBLL(e.target.value);
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
                      setValueRBLL(
                        (Number(dataSuppliedDREX) / 10 ** 18).toString()
                      )
                    }
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
                  <div className="text-xs">rBRLL</div>
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
                <div className="flex w-[130px] items-center justify-end gap-2.5 p-2">
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
          <div className="flex h-full w-full  text-white">
            O recall instantâneo facilita a troca de garantias em TSELIC por
            DREX através da Uniswap.
          </div>

          <Button
            text="Recall"
            onClick={writeRecall}
            isLoading={isLoadingRecall}
            disabled={!canRecall || valueRBLL === "" || Number(valueRBLL) === 0}
          />
        </div>
      </TabContent>
    </Tabs>
  );
};
