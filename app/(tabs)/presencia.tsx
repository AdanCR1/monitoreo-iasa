import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../../src/constants/theme';
import UserRow from '../../src/components/UserRow';
import { supabase } from '../../src/services/supabase';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function Presencia() {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!currentUser) return;

    const roomOne = supabase.channel('room-1');

    roomOne
      .on('presence', { event: 'sync' }, () => {
        const newState = roomOne.presenceState();
        const users = Object.values(newState).map((u: any) => u[0]);
        
        const uniqueUsers = Array.from(new Map(users.map(u => [u.id, u])).values());
        setOnlineUsers(uniqueUsers);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await roomOne.track({
            id: currentUser.id,
            nombre: currentUser.nombre || currentUser.email,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(roomOne);
    };
  }, [currentUser]);

  return (
    <LinearGradient colors={[COLORS.bgGradientStart, COLORS.bgGradientEnd]} style={styles.container}>
      <FlatList
        data={onlineUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <UserRow name={item.nombre} isOnline={true} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Personal Activo</Text>
            <Text style={styles.subtitle}>{onlineUsers.length} usuario(s) conectados ahora</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: SIZES.padding, gap: SIZES.gap / 2 },
  header: { marginBottom: SIZES.padding },
  title: { fontSize: SIZES.font.lg, fontWeight: 'bold', color: COLORS.textPrimary },
  subtitle: { fontSize: SIZES.font.sm, color: COLORS.primary, marginTop: 4 },
});