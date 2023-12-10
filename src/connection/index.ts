import { createConfig, configureChains } from "wagmi"

import { publicProvider } from "wagmi/providers/public"

import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

const mumbai = {
  id: 80001,
  network: "Mumbai",
  name: "Mumbai",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  blockExplorers: {
    default: { name: "Mumbai", url: "https://mumbai.polygonscan.com/" },
  },
  rpcUrls: {
    default: {
      http: ["https://polygon-mumbai-bor.publicnode.com/"],
      webSocket: ["wss://polygon-mumbai-bor.publicnode.com/"],
    },
    public: {
      http: ["https://polygon-mumbai-bor.publicnode.com/"],
      webSocket: ["wss://polygon-mumbai-bor.publicnode.com/"],
    },
  },
  testnet: false,
}
const xrp = {
  id: 1440002,
  network: "Mumbai",
  name: "XRPL EVM Sidechain",
  nativeCurrency: { name: "XRP", symbol: "XRP", decimals: 18 },
  blockExplorers: {
    default: { name: "XRP", url: "https://evm-sidechain.xrpl.org/" },
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-evm-sidechain.xrpl.org"],
      webSocket: ["wss://rpc-evm-sidechain.xrpl.org"],
    },
    public: {
      http: ["https://rpc-evm-sidechain.xrpl.org"],
      webSocket: ["wss://rpc-evm-sidechain.xrpl.org"],
    },
  },
  testnet: false,
} // TODO

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [xrp],
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
