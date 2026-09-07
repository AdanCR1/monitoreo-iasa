import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../src/store/useAuthStore';
import { COLORS, SIZES } from '../../src/constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Completa los campos');
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      console.log("❌ DETALLE DEL ERROR:", error.message, error.response?.data);
      Alert.alert('Error', 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[COLORS.bgGradientStart, COLORS.bgGradientEnd]} style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>DataReport</Text>
          <Text style={styles.subtitle}>Monitoreo Institucional</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={COLORS.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.bgGradientStart} /> : <Text style={styles.buttonText}>Acceder</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.padding * 2,
  },
  header: { marginBottom: 40, alignItems: 'center' },
  title: {
    fontSize: SIZES.font.xl,
    fontWeight: '300',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: SIZES.font.sm,
    color: COLORS.textSecondary,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  form: { gap: SIZES.gap },
  input: {
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: SIZES.font.md,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.bgGradientStart,
    fontWeight: 'bold',
    fontSize: SIZES.font.md,
    letterSpacing: 1,
  },
});