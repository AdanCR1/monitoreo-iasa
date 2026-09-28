import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { realtimeService, UsuarioActivo } from '../../src/services/realtime.service';
import { COLORS, SIZES } from '../../src/constants/theme';
import React from 'react';

export default function Presencia() {
  const [activos, setActivos] = useState<UsuarioActivo[]>([]);

  useEffect(() => {
    realtimeService.subscribe(setActivos);
    return () => realtimeService.unsubscribe();
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.bgGradientStart, COLORS.bgGradientEnd]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Usuarios Activos</Text>
        <View style={styles.badge}>
          <View style={styles.pulse} />
          <Text style={styles.badgeText}>{activos.length} en línea</Text>
        </View>
      </View>

      <FlatList
        data={activos}
        keyExtractor={(u) => u.user_id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: SIZES.gap }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.nombre?.charAt(0).toUpperCase() ?? '?'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nombre} numberOfLines={1}>
                {item.nombre}
              </Text>
              <Text style={styles.meta} numberOfLines={1}>
                {item.rol} · {item.pantalla}
              </Text>
            </View>
            <View style={styles.dot} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.empty}>Nadie conectado en este momento</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.padding },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.gap,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: SIZES.font.xl,
    fontWeight: '600',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  pulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: SIZES.font.sm,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 222, 128, 0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: SIZES.font.md,
  },
  nombre: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: SIZES.font.md,
  },
  meta: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font.sm,
    marginTop: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  empty: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: SIZES.font.md,
  },
});