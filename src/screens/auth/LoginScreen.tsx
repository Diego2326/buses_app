import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { AppTextInput } from '../../components/AppTextInput';
import { Screen } from '../../components/Screen';
import { login } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';
import type { LoginScreenProps } from '../../types/navigation';

export function LoginScreen({navigation}: LoginScreenProps) {
  const signIn = useAuthStore(state => state.signIn);
  const [correo, setCorreo] = useState('ana.rodriguez@example.com');
  const [password, setPassword] = useState('123456');
  const [formError, setFormError] = useState('');

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: result => signIn(result.user, result.token),
    onError: error => setFormError(error.message),
  });

  const submit = () => {
    setFormError('');
    if (!correo.includes('@') || password.length < 6) {
      setFormError('Ingresa un correo válido y una contraseña de al menos 6 caracteres.');
      return;
    }
    mutation.mutate({correo, password});
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.logo}>BusPay</Text>
        <Text style={styles.title}>Inicia sesión</Text>
        <Text style={styles.subtitle}>Escanea el QR del bus y paga tu viaje en segundos.</Text>
      </View>

      <View style={styles.form}>
        <AppTextInput
          keyboardType="email-address"
          label="Correo"
          onChangeText={setCorreo}
          placeholder="tu@email.com"
          value={correo}
        />
        <AppTextInput
          label="Contraseña"
          onChangeText={setPassword}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          value={password}
        />
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        <AppButton loading={mutation.isPending} onPress={submit} title="Entrar" />
        <AppButton
          onPress={() => navigation.navigate('Register')}
          title="Crear cuenta"
          variant="ghost"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
  },
  header: {
    gap: 8,
  },
  logo: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 23,
  },
  form: {
    gap: 16,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
});
