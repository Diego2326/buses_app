import { apiClient } from './apiClient';
import { getErrorMessage } from './apiErrors';
import type {
  PageResponse,
  PaymentMethod,
  Wallet,
  WalletTransaction,
  WalletTransactionType,
} from '../types/domain';

type WalletResponse = {
  balance: number;
  currency: string;
};

type WalletTopUpInput = {
  amount: number;
  method: Extract<PaymentMethod, 'CARD' | 'CASH' | 'WALLET'>;
};

type WalletTransactionResponse = {
  id: string;
  type: WalletTransactionType;
  amount: number;
  date: string;
  status: WalletTransaction['status'];
};

function mapWallet(wallet: WalletResponse): Wallet {
  return {
    balance: wallet.balance,
    currency: wallet.currency,
  };
}

function mapWalletTransaction(transaction: WalletTransactionResponse): WalletTransaction {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: transaction.amount,
    date: transaction.date,
    status: transaction.status,
  };
}

export async function getWallet() {
  try {
    const {data} = await apiClient.get<WalletResponse>('/wallet');
    return mapWallet(data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar la billetera.'));
  }
}

export async function topUpWallet(input: WalletTopUpInput) {
  try {
    const {data} = await apiClient.post<WalletTransactionResponse>('/wallet/top-ups', input);
    return mapWalletTransaction(data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible agregar saldo.'));
  }
}

export async function listWalletTransactions(page = 0, size = 20) {
  try {
    const {data} = await apiClient.get<PageResponse<WalletTransactionResponse>>(
      '/wallet/transactions',
      {
        params: {
          page,
          size,
          sort: 'date,desc',
        },
      },
    );

    return {
      ...data,
      content: data.content.map(mapWalletTransaction),
    } satisfies PageResponse<WalletTransaction>;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar los movimientos.'));
  }
}
