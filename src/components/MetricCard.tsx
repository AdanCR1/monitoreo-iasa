import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface Props {
  title: string;
  value: string | number;
}

export default function MetricCard({ title, value }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    flex: 1,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  value: {
    fontSize: SIZES.font.xl,
    fontWeight: '300', 
    color: COLORS.primary,
  },
  title: {
    fontSize: SIZES.font.sm,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});