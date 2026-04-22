import { create } from 'zustand';

import { initialPayments } from '../mocks/domain';
import type { Payment, PaymentMethod, PaymentPreview, User } from '../types/domain';
import { createId } from '../utils/ids';

type PaymentState = {
  payments: Payment[];
  addPaymentFromPreview: (
    preview: PaymentPreview,
    user: User,
    method?: PaymentMethod,
  ) => Payment;
  getPaymentById: (paymentId: string) => Payment | undefined;
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: initialPayments,
  addPaymentFromPreview: (preview, user, method = 'WALLET') => {
    const payment: Payment = {
      id: createId('PAY'),
      usuario: user,
      bus: preview.bus,
      monto: preview.monto,
      fecha: new Date().toISOString(),
      estado: 'COMPLETED',
      metodoPago: method,
    };

    set(state => ({payments: [payment, ...state.payments]}));
    return payment;
  },
  getPaymentById: paymentId =>
    get().payments.find(payment => payment.id === paymentId),
}));
