import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  nombre: string;
  rol: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  hydrate: async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('token');
      if (storedToken) {
        set({ token: storedToken });
        const res = await api.get('/auth/me');
        set({ user: res.data.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      await SecureStore.deleteItemAsync('token');
      set({ token: null, user: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user } = res.data.data;
    
    await SecureStore.setItemAsync('token', access_token);
    set({ token: access_token, user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ token: null, user: null });
  },
}));