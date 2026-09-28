import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../../src/constants/theme';
import StatusBadge from '../../src/components/StatusBadge';
import { academicService } from '../../src/services/academic.service';

export default function Informes() {
  const [informes, setInformes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInformes = useCallback(async () => {
    try {
      const res = await academicService.listInformes();
      // El MS responde { success: true, data: [...] } — pero validamos ambos formatos
      const lista = res?.data ?? res ?? [];
      setInformes(Array.isArray(lista) ? lista : []);
    } catch (error: any) {
      console.log(
        '❌ Error cargando informes:',
        error?.response?.status,
        error?.message,
        error?.response?.data
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInformes();
  }, [fetchInformes]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInformes();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.titulo || 'Sin título'}</Text>
      <Text style={styles.autor}>
        Por: {item.autor?.nombre ?? item.creador?.nombre ?? 'Desconocido'}
      </Text>
      <View style={styles.footer}>
        <StatusBadge status={item.estado || 'borrador'} />
        <Text style={styles.date}>
          {item.created_at || item.creado_en
            ? new Date(item.created_at ?? item.creado_en).toLocaleDateString()
            : '—'}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[COLORS.bgGradientStart, COLORS.bgGradientEnd]}
      style={styles.container}
    >
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={informes}
          keyExtractor={(item, idx) => String(item.id ?? idx)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: SIZES.gap }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No hay informes registrados.</Text>
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: SIZES.padding },
  card: {
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: SIZES.font.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  autor: {
    fontSize: SIZES.font.sm,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { fontSize: 12, color: COLORS.textSecondary },
  empty: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 40 },
});