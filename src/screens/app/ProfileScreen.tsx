import { StyleSheet, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { InfoRow } from '../../components/InfoRow';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';

export function ProfileScreen() {
  const user = useAuthStore(state => state.user);
  const signOut = useAuthStore(state => state.signOut);

  if (!user) {
    return (
      <Screen scroll={false}>
        <StateView title="Sesión no disponible" description="Inicia sesión nuevamente." />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.card}>
        <InfoRow label="Nombre" value={user.nombre} />
        <InfoRow label="Correo" value={user.correo} />
        <InfoRow label="Rol" value={user.rol} />
        <InfoRow label="Estado" value={user.estado} />
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
