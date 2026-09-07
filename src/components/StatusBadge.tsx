import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function StatusBadge({ status }: { status: keyof typeof COLORS.status }) {
  const bgColor = COLORS.status[status] || COLORS.status.borrador;
  
  return (
    <View style={[styles.badge, { backgroundColor: `${bgColor}20` }]}>
      <Text style={[styles.text, { color: bgColor }]}>
        {status.replace('_', ' ').toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});