import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { SplashScreen } from '../screens/SplashScreen';
import { useAuthStore } from '../store/authStore';
import type { AppStackParamList, AuthStackParamList } from '../types/navigation';
import { AppNavigator } from './stacks/AppNavigator';
import { AuthNavigator } from './stacks/AuthNavigator';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

export function RootNavigator() {
  const {hydrate, hydrated, token} = useAuthStore();

  useEffect(() => {
    hydrate().catch(() => undefined);
  }, [hydrate]);

  if (!hydrated) {
    return <SplashScreen />;
  }

  if (!token) {
    return <AuthNavigator Stack={AuthStack} />;
  }

  return <AppNavigator Stack={AppStack} />;
}
