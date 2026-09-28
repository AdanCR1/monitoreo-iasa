import { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MetricCard from '../../src/components/MetricCard';
import { COLORS, SIZES } from '../../src/constants/theme';
import { reviewsService } from '../../src/services/reviews.service';

type Metrics = {
  total: number;
  aprobados: number;
  observados: number;
  rechazados: number;
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    total: 0,
    aprobados: 0,
    observados: 0,
    rechazados: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await reviewsService.dashboard();
        const data = res?.data ?? res;

        if (data) {
          setMetrics({
            total: data.total_revisiones ?? 0,
            aprobados: data.aprobados ?? 0,
            observados: data.observados ?? 0,
            rechazados: data.rechazados ?? 0,
          });
        }
      } catch (error: any) {
        console.log(
          '❌ Error cargando métricas:',
          error?.response?.status ?? error?.code,
          error?.response?.data?.error ?? error?.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={[COLORS.bgGradientStart, COLORS.bgGradientEnd]}
        style={styles.loaderContainer}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.bgGradientStart, COLORS.bgGradientEnd]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Resumen Global</Text>
          <Text style={styles.sub}>
            {metrics.total} revisiones registradas
          </Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.row}>
            <MetricCard title="Total" value={metrics.total} />
            <View style={{ width: SIZES.gap }} />
            <MetricCard title="Aprobados" value={metrics.aprobados} />
          </View>

          <View style={{ height: SIZES.gap }} />

          <View style={styles.row}>
            <MetricCard title="Observados" value={metrics.observados} />
            <View style={{ width: SIZES.gap }} />
            <MetricCard title="Rechazados" value={metrics.rechazados} />
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
  greeting: {
    fontSize: SIZES.font.md * 1.2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sub: {
    fontSize: SIZES.font.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  grid: { width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});