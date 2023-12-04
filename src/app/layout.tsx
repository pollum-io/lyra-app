"use client";

import { Mulish } from "next/font/google";
import * as React from "react";

import "@/styles/globals.css";
import "@/styles/colors.css";
import "@/styles/backgroundStars.css";

import { Header } from "@/components/Header";

import { Providers } from "./provider";
import { ConnectWallet } from "@/components/ConnectWallet";
import { LendingManage } from "@/components/LendingManage";
import ToastNotification from "@/components/Toast";
import { useToastStore } from "@/stores/toast";
const mulish = Mulish({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toast = useToastStore();

  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${mulish.className} m-0 h-screen p-0`}>
        <Providers>
          <div className="bg-primary radial-gradient-bg flex min-h-screen flex-col">
            <>
              <div id="starsLightMode"></div>
              <div id="starsLightMode2"></div>
              <div id="starsLightMode3"></div>
            </>
            <Header />
            <main className="mt-[105px] flex-grow">{children}</main>
            <ConnectWallet />
            <LendingManage />
            {toast.type && (
              <ToastNotification
                message={toast.message || ""}
                type={toast.type || "success"}
                onClose={toast.hideToast}
              />
            )}
          </div>
        </Providers>
      </body>
    </html>
  );
}
