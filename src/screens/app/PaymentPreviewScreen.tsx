import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { InfoRow } from '../../components/InfoRow';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { usePaymentPreview } from '../../hooks/usePaymentPreview';
import { useAuthStore } from '../../store/authStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useWalletStore } from '../../store/walletStore';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/format';
import type { PaymentPreviewScreenProps } from '../../types/navigation';

export function PaymentPreviewScreen({navigation, route}: PaymentPreviewScreenProps) {
  const user = useAuthStore(state => state.user);
  const addPayment = usePaymentStore(state => state.addPaymentFromPreview);
  const debit = useWalletStore(state => state.debit);
  const {data, error, isLoading, refetch} = usePaymentPreview(route.params.busCode);
  const balance = useWalletStore(state => state.balance);
  const [paymentError, setPaymentError] = useState('');

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
    const debited = debit(data.monto);

    if (!debited) {
      setPaymentError('Saldo insuficiente. Agrega fondos para completar el pago.');
      return;
    }

    const payment = addPayment(data, user);
    navigation.replace('PaymentConfirmation', {paymentId: payment.id});
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Confirma tu viaje</Text>
        <Text style={styles.subtitle}>La API validará este QR en backend cuando se integre.</Text>
      </View>

      <View style={styles.card}>
        <InfoRow label="Bus" value={`${data.bus.codigo} · ${data.bus.placa}`} />
        <InfoRow label="Ruta" value={data.bus.ruta.nombre} />
        <InfoRow label="Origen" value={data.bus.ruta.origen} />
        <InfoRow label="Destino" value={data.bus.ruta.destino} />
        <InfoRow label="Tarifa" value={data.tarifa.nombre} />
        <InfoRow label="Saldo disponible" value={formatCurrency(balance)} />
        <InfoRow label="Monto" strong value={formatCurrency(data.monto)} />
      </View>

      {paymentError ? <Text style={styles.error}>{paymentError}</Text> : null}
      <AppButton onPress={confirm} title="Confirmar pago" />
      {paymentError ? (
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
