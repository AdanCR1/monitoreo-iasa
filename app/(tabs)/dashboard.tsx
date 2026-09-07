import { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MetricCard from '../../src/components/MetricCard';
import { COLORS, SIZES } from '../../src/constants/theme';
import api from '../../src/services/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    activos: 0,
    en_revision: 0,
    observados: 0,
    aprobados: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/metrics/dashboard'); 
        
        const data = res.data.data;
        if (data) {
          setMetrics({
            activos: data.total_proyectos_activos || 0,
            en_revision: data.informes_por_estado?.en_revision || 0,
            observados: data.informes_por_estado?.observado || 0,
            aprobados: data.informes_por_estado?.aprobado || 0
          });
        }
      } catch (error) {
        console.log("Error cargando métricas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={[COLORS.bgGradientStart, COLORS.bgGradientEnd]} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[COLORS.bgGradientStart, COLORS.bgGradientEnd]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Resumen Global</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.row}>
            <MetricCard title="Activos" value={metrics.activos} />
            <View style={{ width: SIZES.gap }} />
            <MetricCard title="Revisión" value={metrics.en_revision} />
          </View>
          
          <View style={{ height: SIZES.gap }} />
          
          <View style={styles.row}>
            <MetricCard title="Observados" value={metrics.observados} />
            <View style={{ width: SIZES.gap }} />
            <MetricCard title="Aprobados" value={metrics.aprobados} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: SIZES.padding, justifyContent: 'center' },
  header: { marginBottom: SIZES.padding * 1.5 },
  greeting: { fontSize: SIZES.font.lg * 1.2, fontWeight: 'bold', color: COLORS.textPrimary },
  grid: { width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between' }
});