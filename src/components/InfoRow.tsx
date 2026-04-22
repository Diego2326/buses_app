import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type InfoRowProps = {
  label: string;
  value: string;
  strong?: boolean;
};

export function InfoRow({label, value, strong = false}: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, strong && styles.strong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 6,
    paddingVertical: 12,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  strong: {
    fontSize: 20,
    fontWeight: '800',
  },
});
