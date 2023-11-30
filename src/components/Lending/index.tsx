"use client";

import Image from "next/image";
import { Button } from "../Button";

interface LendingItem {
  title: string;
  apr: string;
  liquidity: string;
  balance: string;
  onManageClick: () => void;
  imageUrl: string;
}

interface LendingProps {
  title: string;
  items: LendingItem[];
}

export const Lending = ({ title, items }: LendingProps) => {
  return (
    <div className="flex h-full w-full flex-col items-start justify-center">
      <div className="text-xl font-semibold leading-7">{title}</div>
      <div className="flex h-full w-full flex-col items-start justify-center gap-2">
        <div className="flex h-[58px] w-[535px] items-center justify-between px-4">
          <div className="text-sm font-semibold">Asset</div>
          <div className="text-sm font-semibold">APR</div>
          <div className="text-sm font-semibold">Liquidity</div>
          <div className="text-sm font-semibold">Balance</div>
          <div className="h-5 w-[34px]" />
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className="border-brandBlue-300 bg-primary flex h-[58px] w-[535px] items-center justify-between rounded-xl border border-opacity-30 px-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-9 w-9">
                <Image
                  src={item.imageUrl}
                  alt="logo"
                  layout="fill"
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col items-start justify-start">
                <div className="text-sm font-semibold text-white">
                  {item.title}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm font-medium text-white">{item.apr}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm font-medium text-white">
                {item.liquidity}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm font-medium text-white">
                {item.balance}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Button
                text={"Manage"}
                height="h-[16px]"
                maxWidth="max-w-[55px]"
                textSize="text-xs"
                onClick={item.onManageClick}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
