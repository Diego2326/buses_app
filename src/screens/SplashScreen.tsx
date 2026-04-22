import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StateView } from '../components/StateView';
import { colors } from '../theme/colors';

export function SplashScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.brand}>
        <Text style={styles.logo}>BusPay</Text>
        <Text style={styles.subtitle}>Pagos rápidos para transporte público</Text>
      </View>
      <StateView loading title="Preparando tu sesión" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 24,
  },
  brand: {
    gap: 8,
    marginTop: 48,
  },
  logo: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
  },
});
