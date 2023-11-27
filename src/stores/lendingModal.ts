
import { create } from "zustand"

type LendingModalState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useLendingModal = create<LendingModalState>((set) => {
  return {
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
  }
})