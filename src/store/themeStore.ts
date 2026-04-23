import { create } from 'zustand';
import { Appearance } from 'react-native';

import type { ThemeMode } from '../theme/colors';

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>(set => ({
  mode: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  setMode: mode => set({mode}),
}));
