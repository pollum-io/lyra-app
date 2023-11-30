/* eslint-disable no-console */
"use client";

import React from "react";

import "react-toastify/dist/ReactToastify.css";

import { Card } from "@/components/Card";
import { Apr } from "@/components/Apr";
import { ProgressBar } from "@/components/ProgressBar";
import { Lending } from "@/components/Lending";
import { useStore } from "zustand";
import {
  useLendingModalBorrowDrex,
  useLendingModalSupplyDrex,
  useLendingModalSupplyTSelic,
} from "@/stores/lendingModal";

export default function HomePage() {
  const { onOpen: onOpenSD } = useStore(useLendingModalSupplyDrex);
  const { onOpen: onOpenST } = useStore(useLendingModalSupplyTSelic);
  const { onOpen: onOpenBD } = useStore(useLendingModalBorrowDrex);

  return (
    <main>
      <section>
        <div className="layout relative flex min-h-screen flex-col items-center justify-start gap-20 py-12 text-center">
          <div className="flex h-full w-full items-end justify-between">
            <Card text={"Supply Balance"} value={"16,818.992"} />
            <div className="flex h-full w-full flex-col items-center justify-center">
              <Apr aprPercent={75} />
              <div className="relative mt-6 h-10 w-[482px]">
                <ProgressBar progress={30} />
                <div className="absolute left-[412px] top-[20px] text-sm font-normal leading-tight text-white">
                  $12,614.18
                </div>
                <div className="absolute left-0 top-0 text-sm font-normal leading-tight text-white">
                  Borrow Limit: 19%
                </div>
              </div>
            </div>
            <Card text={"Borrow Balance"} value={"16,818.992"} isLeft />
          </div>
          <div className="flex w-full flex-col items-start justify-center gap-7 lg:flex-row">
            <Lending
              title="Supplied"
              items={[
                {
                  title: "DREX",
                  apr: "14.65%",
                  liquidity: "$18.91",
                  balance: "18.91 DREX",
                  onManageClick: onOpenSD,
                  imageUrl: "/images/drex.png",
                },
                {
                  title: "TSELIC",
                  apr: "14.65%",
                  liquidity: "$18.91",
                  balance: "18.91 TSELIC",
                  onManageClick: onOpenST,
                  imageUrl: "/images/tesouroSelic.png",
                },
              ]}
            />
            <Lending
              title="Borrowed"
              items={[
                {
                  title: "DREX",
                  apr: "14.65%",
                  liquidity: "$18.91",
                  balance: "18.91 DREX",
                  onManageClick: onOpenBD,
                  imageUrl: "/images/drex.png",
                },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
