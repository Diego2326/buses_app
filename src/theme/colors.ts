export type ThemeMode = 'light' | 'dark';

export const lightColors = {
  background: '#F7F8FA',
  mapBackground: '#DDEBD9',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF2F6',
  text: '#17202A',
  textMuted: '#65758B',
  primary: '#0F766E',
  primaryDark: '#0B5F59',
  accent: '#D97706',
  border: '#DDE3EA',
  danger: '#B42318',
  success: '#15803D',
  warning: '#A16207',
  glass: 'rgba(255,255,255,0.78)',
  glassStrong: 'rgba(255,255,255,0.86)',
  glassBorder: 'rgba(255,255,255,0.72)',
  glassMuted: 'rgba(255,255,255,0.58)',
  mapOverlay: 'rgba(255,255,255,0.18)',
};

export const darkColors = {
  background: '#071111',
  mapBackground: '#0E1B18',
  surface: '#12201E',
  surfaceMuted: '#1A2D2A',
  text: '#EEF8F5',
  textMuted: '#9DB3AD',
  primary: '#2DD4BF',
  primaryDark: '#14B8A6',
  accent: '#F59E0B',
  border: '#28423D',
  danger: '#F87171',
  success: '#4ADE80',
  warning: '#FACC15',
  glass: 'rgba(8,22,20,0.72)',
  glassStrong: 'rgba(14,32,29,0.84)',
  glassBorder: 'rgba(255,255,255,0.16)',
  glassMuted: 'rgba(14,32,29,0.58)',
  mapOverlay: 'rgba(0,0,0,0.18)',
};

export const colors = lightColors;

export type AppColors = typeof lightColors;

export function getThemeColors(mode: ThemeMode): AppColors {
  return mode === 'dark' ? darkColors : lightColors;
}
