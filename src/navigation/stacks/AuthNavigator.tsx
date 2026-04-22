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
        headerShadowVisible: false,
        headerStyle: {backgroundColor: '#F7F8FA'},
        headerTitleStyle: {fontWeight: '800'},
      }}>
      <Stack.Screen
        component={LoginScreen}
        name="Login"
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={RegisterScreen}
        name="Register"
        options={{title: 'Crear cuenta'}}
      />
    </Stack.Navigator>
  );
}
