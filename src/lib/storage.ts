// src/lib/storage.ts
// Adapter de almacenamiento seguro cross-platform.
// - Nativo (iOS/Android): expo-secure-store (Keychain/Keystore)
// - Web: localStorage (SecureStore no existe en web)

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      try {
        return typeof window !== 'undefined'
          ? window.localStorage.getItem(key)
          : null;
      } catch {
        return null;
      }
    }
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
      } catch {
        // ignorar
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
      } catch {
        // ignorar
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};