// src/store/useAuthStore.ts
import { create } from 'zustand';
import { authHttp } from '../services/http';
import { authToken } from './authToken';
import { storage } from '../lib/storage';

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
      const storedToken = await storage.getItem('token');
      if (!storedToken) {
        set({ isLoading: false });
        return;
      }

      authToken.set(storedToken);
      set({ token: storedToken });

      const res = await authHttp.get('/api/v1/auth/me');
      const user = res.data?.user ?? res.data?.data ?? res.data;
      set({ user, isLoading: false });
    } catch (error) {
      console.log('[auth] hydrate falló:', error);
      authToken.set(null);
      await storage.removeItem('token');
      set({ token: null, user: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await authHttp.post('/api/v1/auth/login', { email, password });

    const access_token = res.data?.access_token ?? res.data?.data?.access_token;
    const user = res.data?.user ?? res.data?.data?.user;

    if (!access_token || !user) {
      throw new Error('Respuesta de login inválida');
    }

    await storage.setItem('token', access_token);
    authToken.set(access_token);
    set({ token: access_token, user });
  },

  logout: async () => {
    await storage.removeItem('token');
    authToken.set(null);
    set({ token: null, user: null });
  },
}));