import { useQuery } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { PaymentCard } from '../../components/PaymentCard';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { listPayments } from '../../services/paymentService';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';
import type { PaymentHistoryScreenProps } from '../../types/navigation';

export function PaymentHistoryScreen({navigation}: PaymentHistoryScreenProps) {
  const user = useAuthStore(state => state.user);
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['payments', user?.id],
    queryFn: () => listPayments({userId: user?.id, size: 20}),
    enabled: Boolean(user?.id),
  });
  const payments = data?.content ?? [];

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de pagos</Text>
        <Text style={styles.subtitle}>Consulta tus viajes pagados y sus detalles.</Text>
      </View>

      {isLoading ? (
        <StateView loading title="Cargando pagos" description="Consultando el historial." />
      ) : error ? (
        <>
          <StateView
            description={error instanceof Error ? error.message : 'Intenta nuevamente.'}
            title="No se pudo cargar el historial"
          />
          <View style={styles.actions}>
            <AppButton onPress={() => refetch()} title="Reintentar" variant="secondary" />
          </View>
        </>
      ) : payments.length === 0 ? (
        <StateView
          description="Escanea un QR para generar tu primer pago."
          title="No hay pagos registrados"
        />
      ) : (
        <View style={styles.list}>
          {payments.map(payment => (
            <PaymentCard
              key={payment.id}
              onPress={() =>
                navigation.navigate('PaymentDetail', {
                  paymentId: payment.id,
                  payment,
                })
              }
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
  actions: {
    gap: 12,
  },
});
