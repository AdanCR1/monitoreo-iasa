import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.bgGradientStart },
        headerShadowVisible: false,
        headerTintColor: COLORS.textPrimary,
        tabBarStyle: {
          backgroundColor: COLORS.bgGradientStart,
          borderTopColor: COLORS.border,
          height: 90 + insets.bottom,
          paddingBottom: insets.bottom + 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Métricas',
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="informes"
        options={{
          title: 'Trabajos',
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="presencia"
        options={{
          title: 'En Línea',
          tabBarIcon: ({ color }) => (
            <Ionicons name="pulse" size={32} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}