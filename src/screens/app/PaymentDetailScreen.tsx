import { StyleSheet, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { InfoRow } from '../../components/InfoRow';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { usePaymentStore } from '../../store/paymentStore';
import { colors } from '../../theme/colors';
import { formatCurrency, formatDateTime } from '../../utils/format';
import type { PaymentDetailScreenProps } from '../../types/navigation';

export function PaymentDetailScreen({navigation, route}: PaymentDetailScreenProps) {
  const payment = usePaymentStore(state => state.getPaymentById(route.params.paymentId));

  if (!payment) {
    return (
      <Screen scroll={false}>
        <StateView title="Pago no encontrado" description="El registro ya no está disponible." />
        <AppButton onPress={() => navigation.navigate('PaymentHistory')} title="Ver historial" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.card}>
        <InfoRow label="Transacción" value={payment.id} />
        <InfoRow label="Estado" value={payment.estado} />
        <InfoRow label="Fecha" value={formatDateTime(payment.fecha)} />
        <InfoRow label="Método de pago" value={payment.metodoPago} />
        <InfoRow label="Pasajero" value={payment.usuario.nombre} />
        <InfoRow label="Bus" value={`${payment.bus.codigo} · ${payment.bus.placa}`} />
        <InfoRow label="Ruta" value={payment.bus.ruta.nombre} />
        <InfoRow label="Origen" value={payment.bus.ruta.origen} />
        <InfoRow label="Destino" value={payment.bus.ruta.destino} />
        <InfoRow label="Monto" strong value={formatCurrency(payment.monto)} />
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
