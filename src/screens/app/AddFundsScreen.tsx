import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { AppTextInput } from '../../components/AppTextInput';
import { GlassPanel } from '../../components/GlassPanel';
import { Screen } from '../../components/Screen';
import { getWallet, topUpWallet } from '../../services/walletService';
import { useThemeStore } from '../../store/themeStore';
import { colors, getThemeColors } from '../../theme/colors';
import { formatCurrency } from '../../utils/format';
import type { AddFundsScreenProps } from '../../types/navigation';

const presetAmounts = [10, 20, 50, 100];

export function AddFundsScreen({navigation}: AddFundsScreenProps) {
  const queryClient = useQueryClient();
  const mode = useThemeStore(state => state.mode);
  const palette = getThemeColors(mode);
  const [amount, setAmount] = useState('20');
  const [formError, setFormError] = useState('');
  const {data: wallet} = useQuery({
    queryKey: ['wallet'],
    queryFn: getWallet,
  });
  const mutation = useMutation({
    mutationFn: (parsedAmount: number) =>
      topUpWallet({
        amount: parsedAmount,
        method: 'CARD',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['wallet']});
      await queryClient.invalidateQueries({queryKey: ['wallet-transactions']});
      navigation.goBack();
    },
    onError: error =>
      setFormError(error instanceof Error ? error.message : 'No fue posible agregar saldo.'),
  });

  const submit = () => {
    setFormError('');
    const parsed = Number(amount);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      setFormError('Ingresa un monto válido.');
      return;
    }

    mutation.mutate(parsed);
  };

  return (
    <Screen style={styles.screen}>
      <GlassPanel style={styles.balanceCard}>
        <Text style={[styles.label, {color: palette.textMuted}]}>Saldo disponible</Text>
        <Text style={[styles.balance, {color: palette.text}]}>
          {formatCurrency(wallet?.balance ?? 0)}
        </Text>
      </GlassPanel>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: palette.text}]}>Montos rápidos</Text>
        <View style={styles.presetGrid}>
          {presetAmounts.map(value => (
            <AppButton
              key={value}
              onPress={() => setAmount(String(value))}
              style={styles.presetButton}
              title={formatCurrency(value)}
              variant="glass"
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppTextInput
          keyboardType="numeric"
          label="Monto a agregar"
          onChangeText={setAmount}
          placeholder="20"
          value={amount}
        />
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        <AppButton loading={mutation.isPending} onPress={submit} title="Agregar saldo" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 18,
  },
  balanceCard: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  balance: {
    fontSize: 30,
    fontWeight: '900',
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetButton: {
    minWidth: '47%',
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
});
