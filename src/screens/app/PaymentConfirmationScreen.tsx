import { useQuery } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { InfoRow } from '../../components/InfoRow';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { getPaymentById } from '../../services/paymentService';
import { usePaymentStore } from '../../store/paymentStore';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/format';
import type { PaymentConfirmationScreenProps } from '../../types/navigation';

export function PaymentConfirmationScreen({
  navigation,
  route,
}: PaymentConfirmationScreenProps) {
  const storedPayment = usePaymentStore(state => state.getPaymentById(route.params.paymentId));
  const initialPayment = route.params.payment ?? storedPayment;
  const {data: payment, isLoading, error} = useQuery({
    queryKey: ['payment', route.params.paymentId],
    queryFn: () => getPaymentById(route.params.paymentId),
    initialData: initialPayment,
  });

  if (isLoading && !payment) {
    return (
      <Screen scroll={false}>
        <StateView loading title="Cargando pago" description="Consultando la transacción." />
      </Screen>
    );
  }

  if (error || !payment) {
    return (
      <Screen scroll={false}>
        <StateView
          title="Pago no encontrado"
          description={error instanceof Error ? error.message : 'Vuelve al inicio para continuar.'}
        />
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
        <InfoRow
          label="Bus"
          value={`${payment.busCode}${payment.busPlate ? ` · ${payment.busPlate}` : ''}`}
        />
        <InfoRow label="Ruta" value={payment.routeName ?? 'Ruta sin asignar'} />
        <InfoRow label="Monto" strong value={formatCurrency(payment.amount)} />
      </View>

      <AppButton
        onPress={() =>
          navigation.replace('PaymentDetail', {
            paymentId: payment.id,
            payment,
          })
        }
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
