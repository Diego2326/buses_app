import type { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../../screens/auth/LoginScreen';
import { RegisterScreen } from '../../screens/auth/RegisterScreen';
import type { AuthStackParamList } from '../../types/navigation';

type AuthNavigatorProps = {
  Stack: ReturnType<typeof createNativeStackNavigator<AuthStackParamList>>;
};

export function AuthNavigator({Stack}: AuthNavigatorProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        fullScreenGestureEnabled: true,
        gestureEnabled: true,
        headerShown: false,
      }}>
      <Stack.Screen component={LoginScreen} name="Login" />
      <Stack.Screen
        component={RegisterScreen}
        name="Register"
      />
    </Stack.Navigator>
  );
}
