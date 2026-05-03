import { create } from 'zustand';

let toastId = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: (message, type = 'error', duration = 4000) => {
    const id = ++toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  error: (message, duration) => {
    return get().addToast(message, 'error', duration);
  },

  success: (message, duration) => {
    return get().addToast(message, 'success', duration);
  },

  info: (message, duration) => {
    return get().addToast(message, 'info', duration);
  },

  warning: (message, duration) => {
    return get().addToast(message, 'warning', duration);
  },
}));
