import { create } from "zustand"

type ConnectWalletState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useConnectWallet = create<ConnectWalletState>((set) => {
  return {
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
  }
})
