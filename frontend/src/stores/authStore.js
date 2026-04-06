import { create } from 'zustand';
import api from '../services/api';
import Cookies from 'js-cookie';

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
      console.log('[Auth] Registering user:', userData.email);
      const res = await api.post('/auth/register', userData);
      const { token } = res.data;
      console.log('[Auth] Register response:', res.data);
      
      if (token) {
        Cookies.set('token', token, { expires: 7 });
        console.log('[Auth] Token stored, fetching user...');
        // Fetch user after register
        await get().fetchUser();
      }
      
      set({ loading: false, isAuthOpen: false });
      console.log('[Auth] Register complete, user:', get().user);
      return res.data;
    } catch (err) {
      console.error('[Auth] Register error:', err.response?.data || err.message);
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      console.log('[Auth] Logging in:', credentials.email);
      const res = await api.post('/auth/login', credentials);
      const { token } = res.data;
      console.log('[Auth] Login response:', res.data);
      
      if (token) {
        Cookies.set('token', token, { expires: 7 });
        console.log('[Auth] Token stored, fetching user...');
        // Fetch user after login
        await get().fetchUser();
      }
      
      set({ loading: false, isAuthOpen: false });
      console.log('[Auth] Login complete, user:', get().user);
      return res.data;
    } catch (err) {
      console.error('[Auth] Login error:', err.response?.data || err.message);
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const token = Cookies.get('token');
      console.log('[Auth] Fetch user - token exists:', !!token);
      
      if (!token) {
        console.log('[Auth] No token, setting user to null');
        set({ user: null, loading: false, hasFetchedUser: true });
        return null;
      }
      
      console.log('[Auth] Calling /auth/me with token:', token.substring(0, 20) + '...');
      const res = await api.get('/auth/me');
      console.log('[Auth] /auth/me response:', res.data);
      
      // Backend returns { user: {...} }
      const userData = res.data.user || res.data;
      set({ user: userData, loading: false, hasFetchedUser: true });
      console.log('[Auth] User fetched:', userData?.name);
      return res.data;
    } catch (err) {
      console.error('[Auth] Fetch user error:', err.response?.status, err.response?.data || err.message);
      Cookies.remove('token');
      set({ user: null, loading: false, hasFetchedUser: true });
      return null;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await api.post('/auth/logout');
      console.log('[Auth] Logout successful');
    } catch (err) {
      console.error('[Auth] Logout error:', err.response?.data || err.message);
    } finally {
      Cookies.remove('token');
      set({ user: null, loading: false, hasFetchedUser: false });
    }
  },

  clearError: () => set({ error: null }),
}));
