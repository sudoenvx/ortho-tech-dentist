import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string, variant: ToastVariant, duration?: number) => void
  removeToast: (id: string) => void
}

let toastId = 0

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, variant, duration = 4000) => {
    const id = `toast-${toastId++}`
    set((state) => ({
      toasts: [...state.toasts, { id, message, variant, duration }],
    }))
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }
  },
  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))

export function toast(message: string, variant: ToastVariant = 'info', duration?: number) {
  useToastStore.getState().addToast(message, variant, duration)
}

toast.success = (message: string, duration?: number) => toast(message, 'success', duration)
toast.error = (message: string, duration?: number) => toast(message, 'error', duration)
toast.info = (message: string, duration?: number) => toast(message, 'info', duration)
