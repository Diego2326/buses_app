import type { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddFundsScreen } from '../../screens/app/AddFundsScreen';
import { HomeScreen } from '../../screens/app/HomeScreen';
import { PaymentConfirmationScreen } from '../../screens/app/PaymentConfirmationScreen';
import { PaymentDetailScreen } from '../../screens/app/PaymentDetailScreen';
import { PaymentHistoryScreen } from '../../screens/app/PaymentHistoryScreen';
import { PaymentPreviewScreen } from '../../screens/app/PaymentPreviewScreen';
import { ProfileScreen } from '../../screens/app/ProfileScreen';
import { ScannerScreen } from '../../screens/app/ScannerScreen';
import type { AppStackParamList } from '../../types/navigation';

type AppNavigatorProps = {
  Stack: ReturnType<typeof createNativeStackNavigator<AppStackParamList>>;
};

export function AppNavigator({Stack}: AppNavigatorProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {backgroundColor: '#F7F8FA'},
        headerTitleStyle: {fontWeight: '800'},
      }}>
      <Stack.Screen component={HomeScreen} name="Home" options={{title: 'Inicio'}} />
      <Stack.Screen component={ScannerScreen} name="Scanner" options={{title: 'Escanear QR'}} />
      <Stack.Screen
        component={AddFundsScreen}
        name="AddFunds"
        options={{title: 'Agregar saldo'}}
      />
      <Stack.Screen
        component={PaymentPreviewScreen}
        name="PaymentPreview"
        options={{title: 'Vista previa'}}
      />
      <Stack.Screen
        component={PaymentConfirmationScreen}
        name="PaymentConfirmation"
        options={{headerBackVisible: false, title: 'Pago confirmado'}}
      />
      <Stack.Screen
        component={PaymentHistoryScreen}
        name="PaymentHistory"
        options={{title: 'Historial'}}
      />
      <Stack.Screen
        component={PaymentDetailScreen}
        name="PaymentDetail"
        options={{title: 'Detalle del pago'}}
      />
      <Stack.Screen component={ProfileScreen} name="Profile" options={{title: 'Perfil'}} />
    </Stack.Navigator>
  );
}
