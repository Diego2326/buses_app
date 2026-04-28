import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import type { Payment } from '../types/domain';
import { formatCurrency, formatDateTime } from '../utils/format';

type PaymentCardProps = {
  payment: Payment;
  onPress: () => void;
};

export function PaymentCard({payment, onPress}: PaymentCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <Text style={styles.route}>{payment.routeName ?? 'Ruta sin asignar'}</Text>
        <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
      </View>
      <Text style={styles.meta}>
        {payment.busCode}
        {payment.busPlate ? ` · ${payment.busPlate}` : ''}
      </Text>
      <Text style={styles.meta}>{formatDateTime(payment.date)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderColor: 'rgba(255,255,255,0.78)',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
    shadowColor: colors.text,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  pressed: {
    opacity: 0.72,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  route: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },
  amount: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
