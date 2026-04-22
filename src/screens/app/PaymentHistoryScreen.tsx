import { StyleSheet, Text, View } from 'react-native';

import { PaymentCard } from '../../components/PaymentCard';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { usePaymentStore } from '../../store/paymentStore';
import { colors } from '../../theme/colors';
import type { PaymentHistoryScreenProps } from '../../types/navigation';

export function PaymentHistoryScreen({navigation}: PaymentHistoryScreenProps) {
  const payments = usePaymentStore(state => state.payments);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de pagos</Text>
        <Text style={styles.subtitle}>Consulta tus viajes pagados y sus detalles.</Text>
      </View>

      {payments.length === 0 ? (
        <StateView
          description="Escanea un QR para generar tu primer pago."
          title="No hay pagos registrados"
        />
      ) : (
        <View style={styles.list}>
          {payments.map(payment => (
            <PaymentCard
              key={payment.id}
              onPress={() => navigation.navigate('PaymentDetail', {paymentId: payment.id})}
              payment={payment}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
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
  list: {
    gap: 12,
  },
});
