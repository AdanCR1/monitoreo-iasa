import { http } from './http';
import { useAuthStore } from '../store/useAuthStore';

export const authService = {
  async login(email: string, password: string) {
    const { data } = await http.post('/api/v1/auth/login', { email, password });
    // Esperado: { token, user: { id, nombre, rol, correo } }
    await useAuthStore.getState().setSession(data.token, data.user);
    return data;
  },
  async me() {
    const { data } = await http.get('/api/v1/auth/me');
    return data;
  },
  async logout() {
    await useAuthStore.getState().logout();
  },
};