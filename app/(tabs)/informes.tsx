import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../../src/constants/theme';
import StatusBadge from '../../src/components/StatusBadge';
import api from '../../src/services/api';

export default function Informes() {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInformes = async () => {
    try {
      const res = await api.get('/informes');
      if (res.data?.data) setInformes(res.data.data);
    } catch (error) {
      console.log("Error cargando informes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInformes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInformes();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.titulo || 'Proyecto sin título'}</Text>
      <Text style={styles.autor}>Por: {item.autor?.nombre || 'Desconocido'}</Text>
      <View style={styles.footer}>
        <StatusBadge status={item.estado || 'borrador'} />
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={[COLORS.bgGradientStart, COLORS.bgGradientEnd]} style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={informes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={<Text style={styles.empty}>No hay trabajos registrados.</Text>}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: SIZES.padding, gap: SIZES.gap },
  card: {
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { fontSize: SIZES.font.md, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4 },
  autor: { fontSize: SIZES.font.sm, color: COLORS.textSecondary, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 12, color: COLORS.textSecondary },
  empty: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 40 }
});