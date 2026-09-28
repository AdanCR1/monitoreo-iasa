// src/services/http.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authToken } from '../store/authToken';

// Handler global de 401 — el store lo registra para hacer logout
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

function makeClient(baseURL: string | undefined, name: string): AxiosInstance {
  if (!baseURL) {
    console.warn(`[http] Falta baseURL para ${name}. Revisa tu .env`);
  }

  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authToken.get();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      // Solo logueamos errores reales (no 401 de token expirado)
      if (error.response?.status !== 401) {
        console.warn(
          `[http:${name}] ${error.config?.method?.toUpperCase()} ${error.config?.url} → ${error.response?.status ?? error.code}`
        );
      }

      if (error.response?.status === 401) {
        authToken.set(null);
        onUnauthorized?.();
      }

      return Promise.reject(error);
    }
  );

  return client;
}

export const authHttp = makeClient(
  process.env.EXPO_PUBLIC_MS_AUTH_URL,
  'ms-auth'
);
export const academicHttp = makeClient(
  process.env.EXPO_PUBLIC_MS_ACADEMIC_URL,
  'ms-academic'
);
export const reviewsHttp = makeClient(
  process.env.EXPO_PUBLIC_MS_REVIEWS_URL,
  'ms-reviews'
);