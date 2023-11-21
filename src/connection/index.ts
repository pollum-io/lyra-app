import { createConfig, configureChains } from "wagmi"

import { publicProvider } from "wagmi/providers/public"

import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

const bedrock = {
  id: 57000,
  network: "Bedrock",
  name: "Bedrock",
  nativeCurrency: { name: "SYS", symbol: "TSYS", decimals: 18 },
  blockExplorers: {
    default: { name: "Bedrock", url: "https://rollux.tanenbaum.io/" },
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-tanenbaum.rollux.com/"],
      webSocket: ["wss://rpc-tanenbaum.rollux.com/wss"],
    },
    public: {
      http: ["https://rpc-tanenbaum.rollux.com/"],
      webSocket: ["wss://rpc-tanenbaum.rollux.com/wss"],
    },
  },
  testnet: true,
}

const rollux = {
  id: 570,
  network: "Rollux",
  name: "Rollux",
  nativeCurrency: { name: "SYS", symbol: "SYS", decimals: 18 },
  blockExplorers: {
    default: { name: "Rollux", url: "https://explorer.rollux.com/" },
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.rollux.com"],
      webSocket: ["wss://rpc.rollux.com/wss"],
    },
    public: {
      http: ["https://rpc.rollux.com"],
      webSocket: ["wss://rpc.rollux.com/wss"],
    },
  },
  testnet: false,
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bedrock, rollux],
  [publicProvider()],
)

export const connectionConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "7d4d4bcd74915500431c20f675eda851",
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})
