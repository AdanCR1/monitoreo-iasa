import { createClient, RealtimeChannel } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  { realtime: { params: { eventsPerSecond: 5 } } }
);

const CHANNEL = 'presence:instituto';

let channel: RealtimeChannel | null = null;

export type UsuarioActivo = {
  user_id: string;
  nombre: string;
  rol: string;
  pantalla: string;
  ts: number;
};

export const realtimeService = {
  subscribe(onUpdate: (users: UsuarioActivo[]) => void) {
    channel = supabase.channel(CHANNEL, {
      config: { presence: { key: 'movil-directivo' } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel!.presenceState();
        const users = Object.values(state)
          .flat()
          .filter((u: any) => u.rol !== 'movil-directivo') as UsuarioActivo[];
        onUpdate(users);
      })
      .subscribe();
  },

  unsubscribe() {
    if (channel) supabase.removeChannel(channel);
    channel = null;
  },
};