import { create } from 'zustand';

import type { ThemeMode } from '../theme/colors';

type ThemeState = {
  mode: ThemeMode;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>(set => ({
  mode: 'light',
  toggleTheme: () =>
    set(state => ({mode: state.mode === 'dark' ? 'light' : 'dark'})),
}));
