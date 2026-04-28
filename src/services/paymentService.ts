import { apiClient } from './apiClient';
import { getErrorMessage } from './apiErrors';
import { findBusByCode, getActiveFare } from './busService';
import type {
  PageResponse,
  Payment,
  PaymentMethod,
  PaymentPreview,
  PaymentStatus,
} from '../types/domain';

type PaymentResponse = {
  id: string;
  userId?: string;
  user: string;
  busId?: string;
  bus: string;
  busPlate?: string;
  routeName?: string;
  routeOrigin?: string;
  routeDestination?: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  method: PaymentMethod;
};

export type CreatePaymentInput = {
  userId: string;
  busId: string;
  amount: number;
  method: PaymentMethod;
  externalReference?: string;
};

export type PaymentListFilters = {
  userId?: string;
  page?: number;
  size?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
};

function mapPaymentResponse(payment: PaymentResponse): Payment {
  return {
    id: payment.id,
    userId: payment.userId,
    userName: payment.user,
    busId: payment.busId,
    busCode: payment.bus,
    busPlate: payment.busPlate,
    routeName: payment.routeName,
    routeOrigin: payment.routeOrigin,
    routeDestination: payment.routeDestination,
    amount: payment.amount,
    date: payment.date,
    status: payment.status,
    method: payment.method,
  };
}

export async function getPaymentPreview(busCode: string): Promise<PaymentPreview> {
  try {
    const [bus, fare] = await Promise.all([findBusByCode(busCode), getActiveFare()]);

    if (!bus || bus.status !== 'ACTIVE') {
      throw new Error('No encontramos un bus activo para este QR.');
    }

    return {
      bus,
      fare,
      amount: fare.amount,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible consultar la tarifa.'));
  }
}

export async function createPayment(input: CreatePaymentInput) {
  try {
    const {data} = await apiClient.post<PaymentResponse>('/payments', input);
    return mapPaymentResponse(data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible registrar el pago.'));
  }
}

export async function listPayments(filters: PaymentListFilters = {}) {
  try {
    const {data} = await apiClient.get<PageResponse<PaymentResponse>>('/payments', {
      params: {
        userId: filters.userId,
        page: filters.page ?? 0,
        size: filters.size ?? 20,
        status: filters.status,
        method: filters.method,
        sort: 'date,desc',
      },
    });

    return {
      ...data,
      content: data.content.map(mapPaymentResponse),
    } satisfies PageResponse<Payment>;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar los pagos.'));
  }
}

export async function getPaymentById(paymentId: string) {
  try {
    const {data} = await apiClient.get<PaymentResponse>(`/payments/${paymentId}`);
    return mapPaymentResponse(data);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar el detalle del pago.'));
  }
}
