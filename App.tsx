import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { useThemeStore } from './src/store/themeStore';
import { getThemeColors } from './src/theme/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  const systemColorScheme = useColorScheme();
  const setMode = useThemeStore(state => state.setMode);
  const mode = useThemeStore(state => state.mode);
  const palette = getThemeColors(mode);

  useEffect(() => {
    setMode(systemColorScheme === 'dark' ? 'dark' : 'light');
  }, [setMode, systemColorScheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar
            backgroundColor={palette.background}
            style={mode === 'dark' ? 'light' : 'dark'}
          />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
