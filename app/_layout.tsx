// app/_layout.tsx
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  const { token, isLoading, hydrate } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // 1) Hidratar una vez
  useEffect(() => {
    hydrate();
  }, []);

  // 2) Guard de rutas
  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, isLoading, segments]);

  // 3) ⚠️ GATE — no montar nada hasta hidratar
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgGradientStart,
  },
});