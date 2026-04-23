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
        fullScreenGestureEnabled: true,
        gestureEnabled: true,
        headerShown: false,
      }}>
      <Stack.Screen component={HomeScreen} name="Home" />
      <Stack.Screen component={ScannerScreen} name="Scanner" />
      <Stack.Screen component={AddFundsScreen} name="AddFunds" />
      <Stack.Screen component={PaymentPreviewScreen} name="PaymentPreview" />
      <Stack.Screen component={PaymentConfirmationScreen} name="PaymentConfirmation" />
      <Stack.Screen component={PaymentHistoryScreen} name="PaymentHistory" />
      <Stack.Screen component={PaymentDetailScreen} name="PaymentDetail" />
      <Stack.Screen component={ProfileScreen} name="Profile" />
    </Stack.Navigator>
  );
}
