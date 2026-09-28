// src/store/authToken.ts
// Holder de token en memoria — SIN dependencias para romper el ciclo
// entre useAuthStore y http.ts

let _token: string | null = null;

export const authToken = {
  get: (): string | null => _token,
  set: (token: string | null) => {
    _token = token;
  },
};