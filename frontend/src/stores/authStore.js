import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  hasFetchedUser: false,
  error: null,

  isAuthOpen: false,
  showLogin: true,

  openLogin: () => set({ isAuthOpen: true, showLogin: true }),
  openSignup: () => set({ isAuthOpen: true, showLogin: false }),
  closeAuth: () => set({ isAuthOpen: false }),

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      await api.post('/auth/register', userData);
      await get().fetchUser();
      set({ loading: false, isAuthOpen: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      await api.post('/auth/login', credentials);
      await get().fetchUser();
      set({ loading: false, isAuthOpen: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/auth/me');
      const userData = res.data.user || res.data;
      set({ user: userData, loading: false, hasFetchedUser: true });
      return userData;
    } catch (err) {
      set({ user: null, loading: false, hasFetchedUser: true });
      return null;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ user: null, loading: false, hasFetchedUser: false });
    }
  },

  clearError: () => set({ error: null }),
}));
