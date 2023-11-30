
import { create } from "zustand"

type LendingModalState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useLendingModalSupplyDrex = create<LendingModalState>((set) => {
  return {
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
  }
})


export const useLendingModalSupplyTSelic = create<LendingModalState>((set) => {
  return {
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
  }
})

export const useLendingModalBorrowDrex = create<LendingModalState>((set) => {
  return {
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
  }
})