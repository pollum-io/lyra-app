"use client";

import { ThemeProvider } from "next-themes";
import { WagmiConfig, useConfig } from "wagmi";
import { ApolloProvider } from "@apollo/client";

import { connectionConfig } from "@/connection";
import { apolloClient } from "@/Apollo/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
      <WagmiConfig config={connectionConfig}>
        <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}
