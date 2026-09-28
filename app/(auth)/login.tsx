import { useState } from 'react';
import { Image } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../src/store/useAuthStore';
import { COLORS, SIZES } from '../../src/constants/theme';
import React from 'react';

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
      const detail =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Error desconocido';
      Alert.alert('Error', detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.bgGradientStart, COLORS.bgGradientEnd]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.header}>
              <Image source={require('../../assets/logo_IASA_1.png')} style={styles.logo} />
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
                autoCorrect={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.bgGradientStart} />
                ) : (
                  <Text style={styles.buttonText}>Acceder</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 180,
    height: 60,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: SIZES.padding * 2,
  },
  header: { marginBottom: 40, alignItems: 'center'},
  title: {
    fontSize: SIZES.font.xxl,
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