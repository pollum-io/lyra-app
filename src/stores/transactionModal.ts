import { create } from "zustand"

export type TransactionModalState = {
  isOpen: boolean
  currentStep: number
  maxStep: number
  onOpen: () => void
  onClose: () => void
  dispatchStep: (action: StepsAction) => void
}

type StepsState = {
  currentStep: number
  maxStep: number
}

type StepsAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" }
  | { type: "SET_MAX_STEP"; payload: number }

export const useTransactionModal = create<TransactionModalState>(
  (set, get) => ({
    isOpen: false,
    maxStep: 0,
    currentStep: 0,
    onOpen: () => set({ isOpen: true, currentStep: 0 }),
    onClose: () => set({ isOpen: false }),
    dispatchStep: (action: StepsAction) => {
      set(stepsReducer(get(), action))
    },
  }),
)

function stepsReducer(state: StepsState, action: StepsAction) {
  switch (action.type) {
    case "NEXT_STEP":
      if (state.maxStep === state.currentStep + 1) return state

      return {
        currentStep: state.currentStep + 1,
      }
    case "PREV_STEP":
      if (state.currentStep === 0) return state

      return {
        currentStep: state.currentStep - 1,
      }
    case "SET_MAX_STEP":
      return {
        maxStep: action.payload,
      }
    case "RESET":
      return {
        currentStep: 0,
      }
    default:
      throw new Error("Unhandled action type")
  }
}
