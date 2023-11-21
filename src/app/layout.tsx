import { Metadata } from "next";
import { Mulish } from "next/font/google";
import * as React from "react";

import "@/styles/globals.css";
import "@/styles/colors.css";

import { Header } from "@/components/Header";

import { siteConfig } from "@/constant/config";
import { Providers } from "./provider";
const mulish = Mulish({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: `/favicon/site.webmanifest`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${mulish.className} m-0 h-screen p-0`}>
        <Providers>
          <div className="bg-primary flex min-h-screen flex-col  bg-[url('/svg/background.svg')] bg-cover bg-repeat-x">
            <Header />
            <main className="mt-[105px] flex-grow">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
