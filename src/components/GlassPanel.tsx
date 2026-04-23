import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../theme/colors';

type GlassPanelProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function GlassPanel({children, style}: GlassPanelProps) {
  const palette = getThemeColors(useThemeStore(state => state.mode));

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: palette.glass,
          borderColor: palette.glassBorder,
          shadowColor: palette.text,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 28,
    borderWidth: 1,
    shadowOffset: {width: 0, height: 18},
    shadowOpacity: 0.18,
    shadowRadius: 34,
  },
});
