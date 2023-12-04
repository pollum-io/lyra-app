// store/toastStore.js
import { create } from 'zustand';

export type ToastState = {
  message: string | null;
  type: 'success' | 'error' | 'attention' | null;
  showToast: (message: string, type: 'success' | 'error' | 'attention') => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastState>((set) => {
  return {
    message: null,
    type: null,
    showToast: (message, type) => set({ message, type }),
    hideToast: () => set({ message: null, type: null }),
  }
});
