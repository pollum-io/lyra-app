"use Client";
import { Button } from "@/components/Button";
import Tabs, { TabContent } from "@/components/Tabs";
import {
  EthereumAddress,
  useAllowanceTSELIC,
  useApproveTSELIC,
} from "@/hooks/useErc20";
import {
  useGetBorrowedAmount,
  useGetDepositedTSELIC,
  useSupplyTSELIC,
} from "@/hooks/useRBLLPoolContract";
import { BigNumberish } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ContextSupplyTSelic = ({
  address,
  dataTselicBalance,
}: {
  address: string;
  dataTselicBalance: BigNumberish;
}) => {
  const tselicamountsupply = 3 * 1e18;
  const TselicBalance = Number(dataTselicBalance) / 10 ** 18;
  const [isLoading, setLoading] = useState(true);
  const [valueTselic, setValueTselic] = useState("");
  const [error, setError] = useState("");

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
  } = useSupplyTSELIC(tselicamountsupply);

  const [approvedAmountTselic, setApprovedAmountTselic] = useState(
    Number(dataAllowanceTSELIC)
  );

  useEffect(() => {
    const loading = [isSuccessApproveTSELIC, isLoadingAllowanceTSELIC].every(
      (loading) => loading === false
    );

    setLoading(!loading);
  }, [isSuccessApproveTSELIC, isLoadingAllowanceTSELIC]);

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
                  value={valueTselic}
                  onChange={(e) => {
                    const enteredValue = Number(e.target.value);
                    if (enteredValue > TselicBalance) {
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
                <div className="flex w-[100px] items-center justify-center gap-2.5 px-4 py-2">
                  <button
                    className="text-brandBlue-300 text-base font-normal leading-normal"
                    onClick={() => setValueTselic(TselicBalance.toString())}
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
              {error && <div className="text-sm text-red-500">{error}</div>}
            </div>
          </div>

          <div className="flex h-full w-full flex-col gap-2">
            <div className=" flex justify-between text-white">
              <span>TSELIC Depositado:</span>
              <span>{!isLoading ? `${dataDepositedTSELIC}` : "0"} TSELIC</span>
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
              isLoading={false}
            />
          )}
          {/* <Button text="Depositar" onClick={writeSupplyTSELIC} isLoading={false} /> */}
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
              <span>{!isLoading ? `${dataDepositedTSELIC}` : "0"} TSELIC</span>
            </div>
            <div className="flex justify-between text-white">
              <span>DREX em Empréstimo:</span>
              <span>{!isLoading ? `${dataBorrowedAmount}` : "0"} DREX</span>
            </div>
          </div>
          <Button text="Sacar" onClick={() => null} isLoading={false} />
        </div>
      </TabContent>
    </Tabs>
  );
};
