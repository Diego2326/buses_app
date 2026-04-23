import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { PaymentPreview } from './domain';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Scanner: undefined;
  AddFunds: undefined;
  PaymentPreview: { busCode: string };
  PaymentConfirmation: { paymentId: string };
  PaymentHistory: undefined;
  PaymentDetail: { paymentId: string };
  Profile: undefined;
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;
export type HomeScreenProps = NativeStackScreenProps<AppStackParamList, 'Home'>;
export type ScannerScreenProps = NativeStackScreenProps<AppStackParamList, 'Scanner'>;
export type AddFundsScreenProps = NativeStackScreenProps<AppStackParamList, 'AddFunds'>;
export type PaymentPreviewScreenProps = NativeStackScreenProps<
  AppStackParamList,
  'PaymentPreview'
>;
export type PaymentConfirmationScreenProps = NativeStackScreenProps<
  AppStackParamList,
  'PaymentConfirmation'
>;
export type PaymentHistoryScreenProps = NativeStackScreenProps<
  AppStackParamList,
  'PaymentHistory'
>;
export type PaymentDetailScreenProps = NativeStackScreenProps<
  AppStackParamList,
  'PaymentDetail'
>;
export type ProfileScreenProps = NativeStackScreenProps<AppStackParamList, 'Profile'>;

export type PaymentPreviewRouteData = PaymentPreview;
