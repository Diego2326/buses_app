import { useQuery } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { InfoRow } from '../../components/InfoRow';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { getUserById } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';

export function ProfileScreen() {
  const user = useAuthStore(state => state.user);
  const signOut = useAuthStore(state => state.signOut);
  const {data: profile, isLoading, error} = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getUserById(user!.id),
    enabled: Boolean(user?.id),
    initialData: user,
  });

  if (!user && !profile) {
    return (
      <Screen scroll={false}>
        <StateView title="Sesión no disponible" description="Inicia sesión nuevamente." />
      </Screen>
    );
  }

  if (isLoading && !profile) {
    return (
      <Screen scroll={false}>
        <StateView loading title="Cargando perfil" description="Consultando tu información." />
      </Screen>
    );
  }

  if (error && !profile) {
    return (
      <Screen scroll={false}>
        <StateView
          title="No se pudo cargar el perfil"
          description={error instanceof Error ? error.message : 'Intenta nuevamente.'}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.card}>
        <InfoRow label="Nombre" value={profile?.name ?? user?.name ?? 'No disponible'} />
        <InfoRow label="Correo" value={profile?.email ?? user?.email ?? 'No disponible'} />
        <InfoRow label="Rol" value={profile?.role ?? user?.role ?? 'No disponible'} />
        <InfoRow
          label="Estado"
          value={profile?.status ?? user?.status ?? 'No disponible'}
        />
      </View>

      <AppButton onPress={signOut} title="Cerrar sesión" variant="secondary" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
});
