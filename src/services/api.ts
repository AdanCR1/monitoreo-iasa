import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const envUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');

const API_URL = envUrl.endsWith('/api/v1') ? envUrl : `${envUrl}/api/v1`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;