import { create } from 'zustand';

type WalletState = {
  balance: number;
  addFunds: (amount: number) => void;
  debit: (amount: number) => boolean;
};

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 42.5,
  addFunds: amount =>
    set(state => ({
      balance: Number((state.balance + amount).toFixed(2)),
    })),
  debit: amount => {
    const {balance} = get();

    if (balance < amount) {
      return false;
    }

    set({
      balance: Number((balance - amount).toFixed(2)),
    });
    return true;
  },
}));
