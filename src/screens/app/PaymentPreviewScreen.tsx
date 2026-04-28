import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { InfoRow } from '../../components/InfoRow';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { usePaymentPreview } from '../../hooks/usePaymentPreview';
import { createPayment } from '../../services/paymentService';
import { getWallet } from '../../services/walletService';
import { useAuthStore } from '../../store/authStore';
import { usePaymentStore } from '../../store/paymentStore';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/format';
import type { PaymentPreviewScreenProps } from '../../types/navigation';

export function PaymentPreviewScreen({navigation, route}: PaymentPreviewScreenProps) {
  const user = useAuthStore(state => state.user);
  const savePayment = usePaymentStore(state => state.savePayment);
  const queryClient = useQueryClient();
  const {data, error, isLoading, refetch} = usePaymentPreview(route.params.busCode);
  const {data: wallet} = useQuery({
    queryKey: ['wallet'],
    queryFn: getWallet,
  });
  const [paymentError, setPaymentError] = useState('');
  const mutation = useMutation({
    mutationFn: async () => {
      if (!user || !data) {
        throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
      }

      if ((wallet?.balance ?? 0) < data.amount) {
        throw new Error('Saldo insuficiente. Agrega fondos para completar el pago.');
      }

      return createPayment({
        userId: user.id,
        busId: data.bus.id,
        amount: data.amount,
        method: 'WALLET',
        externalReference: `mobile-${Date.now()}`,
      });
    },
    onSuccess: async payment => {
      savePayment(payment);
      await queryClient.invalidateQueries({queryKey: ['payments']});
      await queryClient.invalidateQueries({queryKey: ['wallet']});
      navigation.replace('PaymentConfirmation', {
        paymentId: payment.id,
        payment,
      });
    },
    onError: mutationError =>
      setPaymentError(
        mutationError instanceof Error
          ? mutationError.message
          : 'No fue posible registrar el pago.',
      ),
  });

  if (isLoading) {
    return (
      <Screen scroll={false}>
        <StateView loading title="Consultando tarifa" description="Validando el bus del QR." />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen scroll={false}>
        <StateView
          title="No se pudo consultar el pago"
          description={error?.message ?? 'Intenta escanear el QR nuevamente.'}
        />
        <AppButton onPress={() => refetch()} title="Reintentar" />
      </Screen>
    );
  }

  const confirm = () => {
    if (!user) {
      return;
    }

    setPaymentError('');
    mutation.mutate();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Confirma tu viaje</Text>
        <Text style={styles.subtitle}>
          El pago se registrará en backend usando tu billetera de pasajero.
        </Text>
      </View>

      <View style={styles.card}>
        <InfoRow label="Bus" value={`${data.bus.code} · ${data.bus.plate}`} />
        <InfoRow label="Ruta" value={data.bus.route?.name ?? 'Ruta sin asignar'} />
        <InfoRow label="Origen" value={data.bus.route?.origin ?? 'No disponible'} />
        <InfoRow label="Destino" value={data.bus.route?.destination ?? 'No disponible'} />
        <InfoRow label="Tarifa" value={data.fare.name} />
        <InfoRow label="Método" value="WALLET" />
        <InfoRow label="Saldo disponible" value={formatCurrency(wallet?.balance ?? 0)} />
        <InfoRow label="Monto" strong value={formatCurrency(data.amount)} />
      </View>

      {paymentError ? <Text style={styles.error}>{paymentError}</Text> : null}
      <AppButton loading={mutation.isPending} onPress={confirm} title="Confirmar pago" />
      {(wallet?.balance ?? 0) < data.amount || paymentError.includes('Saldo insuficiente') ? (
        <AppButton
          onPress={() => navigation.navigate('AddFunds')}
          title="Agregar saldo"
          variant="secondary"
        />
      ) : null}
      <AppButton onPress={() => navigation.goBack()} title="Cancelar" variant="ghost" />
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
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
});
