import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { InfoRow } from '../../components/InfoRow';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { usePaymentStore } from '../../store/paymentStore';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/format';
import type { PaymentConfirmationScreenProps } from '../../types/navigation';

export function PaymentConfirmationScreen({
  navigation,
  route,
}: PaymentConfirmationScreenProps) {
  const payment = usePaymentStore(state => state.getPaymentById(route.params.paymentId));

  if (!payment) {
    return (
      <Screen scroll={false}>
        <StateView title="Pago no encontrado" description="Vuelve al inicio para continuar." />
        <AppButton onPress={() => navigation.replace('Home')} title="Ir al inicio" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.success}>
        <Text style={styles.badge}>✓</Text>
        <Text style={styles.title}>Pago confirmado</Text>
        <Text style={styles.subtitle}>Tu viaje quedó registrado en el historial.</Text>
      </View>

      <View style={styles.card}>
        <InfoRow label="Transacción" value={payment.id} />
        <InfoRow label="Bus" value={`${payment.bus.codigo} · ${payment.bus.placa}`} />
        <InfoRow label="Ruta" value={payment.bus.ruta.nombre} />
        <InfoRow label="Monto" strong value={formatCurrency(payment.monto)} />
      </View>

      <AppButton
        onPress={() => navigation.replace('PaymentDetail', {paymentId: payment.id})}
        title="Ver detalle"
      />
      <AppButton onPress={() => navigation.popToTop()} title="Volver al inicio" variant="ghost" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  success: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  badge: {
    backgroundColor: colors.success,
    borderRadius: 28,
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    height: 56,
    lineHeight: 56,
    textAlign: 'center',
    width: 56,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
});
