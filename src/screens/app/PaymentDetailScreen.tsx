import { useQuery } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { InfoRow } from '../../components/InfoRow';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { getPaymentById } from '../../services/paymentService';
import { usePaymentStore } from '../../store/paymentStore';
import { colors } from '../../theme/colors';
import { formatCurrency, formatDateTime } from '../../utils/format';
import type { PaymentDetailScreenProps } from '../../types/navigation';

export function PaymentDetailScreen({navigation, route}: PaymentDetailScreenProps) {
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
        <StateView loading title="Cargando pago" description="Consultando el detalle." />
      </Screen>
    );
  }

  if (error || !payment) {
    return (
      <Screen scroll={false}>
        <StateView
          title="Pago no encontrado"
          description={error instanceof Error ? error.message : 'El registro ya no está disponible.'}
        />
        <AppButton onPress={() => navigation.navigate('PaymentHistory')} title="Ver historial" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.card}>
        <InfoRow label="Transacción" value={payment.id} />
        <InfoRow label="Estado" value={payment.status} />
        <InfoRow label="Fecha" value={formatDateTime(payment.date)} />
        <InfoRow label="Método de pago" value={payment.method} />
        <InfoRow label="Pasajero" value={payment.userName} />
        <InfoRow
          label="Bus"
          value={`${payment.busCode}${payment.busPlate ? ` · ${payment.busPlate}` : ''}`}
        />
        <InfoRow label="Ruta" value={payment.routeName ?? 'Ruta sin asignar'} />
        <InfoRow label="Origen" value={payment.routeOrigin ?? 'No disponible'} />
        <InfoRow label="Destino" value={payment.routeDestination ?? 'No disponible'} />
        <InfoRow label="Monto" strong value={formatCurrency(payment.amount)} />
      </View>
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
