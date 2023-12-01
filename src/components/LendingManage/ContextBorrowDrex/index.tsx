import { Button } from "@/components/Button";
import Tabs, { TabContent } from "@/components/Tabs";
import { EthereumAddress, useBalanceOfDREX } from "@/hooks/useErc20";
import {
  
  useBorrowDREX,
  useGetBorrowedAmount,
  useGetDepositedTSELIC,
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
  const drexamountsupply = 100 * 1e6;

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
    write: writeBorrowDREX,
    data: dataBorrowDREX,
    isLoading: isLoadingBorrowDREX,
    isSuccess: isSuccessBorrowDREX,
    isError: isErrorBorrowDREX,
  } = useBorrowDREX(drexamountsupply / 2);

  const drexBalance = Number(dataDrexBalance) / 10 ** 6;
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const loading = [isLoadingDrex, isLoadingDepositedTSELIC].every(
      (loading) => loading === false
    );

    setLoading(!loading);
  }, [isLoadingDrex, isLoadingDepositedTSELIC]);

  return (
    <Tabs>
      <TabContent title="Emprestar">
        <div className="flex h-[400px] w-full flex-col items-center justify-start gap-6 pt-5">
          <div className="flex w-full items-start justify-start gap-3">
            <div className="flex h-full w-full flex-col items-start justify-start gap-1">
              <div className="inline-flex items-start justify-start gap-6">
                <div className="text-base font-normal leading-normal text-gray-400">
                  Balanço: {!isLoading ? `${drexBalance}` : "0"} DREX
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
              <span>TSELIC Depositado:</span>
              <span>{!isLoading ? `${dataDepositedTSELIC}` : "0"} TSELIC</span>
            </div>
            <div className="flex justify-between text-white">
              <span>DREX em Empréstimo:</span>
              <span>{!isLoading ? `${dataBorrowedAmount}` : "0"} DREX</span>
            </div>
            <div className=" flex justify-between text-white">
              <span>Liquidez Disponível em DREX:</span>
              <span>
                {!isLoading
                  ? `R$ ${
                      Number(dataTotalSupplied) - Number(dataTotalBorrowed)
                    }`
                  : "R$ 0"}
              </span>
            </div>
          </div>
          <Button
            text="Tomar Emprestimo"
            onClick={writeBorrowDREX}
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
                  Balanço: {!isLoading ? `${drexBalance}` : "0"} DREX
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
              <span>{!isLoading ? `${dataBorrowedAmount}` : "0"} DREX</span>
            </div>
          </div>

          <Button
            text="Quitar Emprestimo"
            onClick={() => null}
            isLoading={false}
          />
        </div>
      </TabContent>
    </Tabs>
  );
};
