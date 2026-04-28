import { create } from 'zustand';

import type { Payment } from '../types/domain';

type PaymentState = {
  recentPayments: Record<string, Payment>;
  savePayment: (payment: Payment) => void;
  getPaymentById: (paymentId: string) => Payment | undefined;
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
  recentPayments: {},
  savePayment: payment =>
    set(state => ({
      recentPayments: {
        ...state.recentPayments,
        [payment.id]: payment,
      },
    })),
  getPaymentById: paymentId => get().recentPayments[paymentId],
}));
