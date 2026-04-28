import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { AppTextInput } from '../../components/AppTextInput';
import { Screen } from '../../components/Screen';
import { register } from '../../services/authService';
import { colors } from '../../theme/colors';
import type { RegisterScreenProps } from '../../types/navigation';

export function RegisterScreen(_: RegisterScreenProps) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const mutation = useMutation({
    mutationFn: register,
    onError: error =>
      setFormError(error instanceof Error ? error.message : 'No fue posible registrar la cuenta.'),
  });

  const submit = () => {
    setFormError('');
    if (nombre.trim().length < 2 || !correo.includes('@') || password.length < 6) {
      setFormError('Completa tus datos con un correo válido y contraseña segura.');
      return;
    }
    mutation.mutate({
      name: nombre.trim(),
      email: correo.trim().toLowerCase(),
      password,
    });
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Crea tu cuenta de pasajero</Text>
        <Text style={styles.subtitle}>
          El backend actual no expone registro público. Usa esta pantalla para validar tus
          datos y luego solicita la creación del usuario al equipo de operaciones.
        </Text>
      </View>

      <View style={styles.form}>
        <AppTextInput
          autoCapitalize="words"
          label="Nombre"
          onChangeText={setNombre}
          placeholder="Nombre completo"
          value={nombre}
        />
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
        <AppButton
          loading={mutation.isPending}
          onPress={submit}
          title="Validar disponibilidad"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
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
