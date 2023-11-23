import { Metadata } from "next";
import { Mulish } from "next/font/google";
import * as React from "react";

import "@/styles/globals.css";
import "@/styles/colors.css";
import "@/styles/backgroundStars.css";

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
          <div className="bg-primary radial-gradient-bg flex min-h-screen flex-col">
            <>
              <div id="starsLightMode"></div>
              <div id="starsLightMode2"></div>
              <div id="starsLightMode3"></div>
            </>
            <Header />
            <main className="mt-[105px] flex-grow">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
