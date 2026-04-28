import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { AppTextInput } from '../../components/AppTextInput';
import { GlassPanel } from '../../components/GlassPanel';
import { Screen } from '../../components/Screen';
import { useThemeStore } from '../../store/themeStore';
import { useWalletStore } from '../../store/walletStore';
import { getThemeColors } from '../../theme/colors';
import { formatCurrency } from '../../utils/format';
import type { AddFundsScreenProps } from '../../types/navigation';

const presetAmounts = [10, 20, 50, 100];

export function AddFundsScreen({navigation}: AddFundsScreenProps) {
  const balance = useWalletStore(state => state.balance);
  const addFunds = useWalletStore(state => state.addFunds);
  const mode = useThemeStore(state => state.mode);
  const palette = getThemeColors(mode);
  const [amount, setAmount] = useState('20');

  const submit = () => {
    const parsed = Number(amount);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }

    addFunds(parsed);
    navigation.goBack();
  };

  return (
    <Screen style={styles.screen}>
      <GlassPanel style={styles.balanceCard}>
        <Text style={[styles.label, {color: palette.textMuted}]}>Saldo local</Text>
        <Text style={[styles.balance, {color: palette.text}]}>
          {formatCurrency(balance)}
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
        <AppButton onPress={submit} title="Agregar saldo" />
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
});
