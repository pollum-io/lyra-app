import Image from "next/image";
import { Button } from "../Button";

export const Lending = ({ title }: { title: string }) => {
  return (
    <div className="flex h-full w-full flex-col items-start justify-center">
      <div className="text-xl font-semibold leading-7">{title}</div>
      <div className="flex h-full w-full flex-col items-start justify-center">
        <div className="flex h-[58px] w-[535px] items-center justify-between px-4">
          <div className="text-sm font-semibold">Asset</div>
          <div className="text-sm font-semibold">APR / Earned</div>
          <div className="text-sm font-semibold">Liquidity</div>
          <div className="text-sm font-semibold">Balance</div>
          <div className="h-5 w-[34px]" />
        </div>
        <div className="border-brandBlue-300 bg-primary flex h-[58px] w-[535px] items-center justify-between rounded-xl border border-opacity-30 px-4">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9">
              <Image
                src={"/images/prana.png"}
                alt="logo"
                width={200}
                height={150}
                className="rounded-[15px]"
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col items-start justify-start">
              <div className="text-sm font-semibold text-white">WETH</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm font-medium text-white">14.65%</div>
            <div className="text-xs text-white">TBD</div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm font-medium text-white">$18.91</div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm font-medium text-white">$18.91</div>
            <div className="text-xs text-white">18.91 WETH</div>
          </div>

          <div className="flex flex-col items-end">
            <Button
              text={"Manage"}
              height="h-[16px]"
              maxWidth="max-w-[45px]"
              textSize="text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
