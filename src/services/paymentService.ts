import { apiClient } from './apiClient';
import { getErrorMessage } from './apiErrors';
import { findBusByCode, getActiveFare } from './busService';
import type {
  PageResponse,
  Payment,
  PaymentMethod,
  PaymentPreview,
  PaymentStatus,
  User,
} from '../types/domain';

type PaymentResponse = {
  id: string;
  user: string;
  bus: string;
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
    userName: payment.user,
    busCode: payment.bus,
    amount: payment.amount,
    date: payment.date,
    status: payment.status,
    method: payment.method,
  };
}

async function enrichPayment(payment: Payment) {
  const bus = await findBusByCode(payment.busCode);

  if (!bus) {
    return payment;
  }

  return {
    ...payment,
    busId: bus.id,
    busCode: bus.code,
    busPlate: bus.plate,
    routeId: bus.route?.id,
    routeName: bus.route?.name,
    routeOrigin: bus.route?.origin,
    routeDestination: bus.route?.destination,
  } satisfies Payment;
}

export async function getPaymentPreview(busCode: string): Promise<PaymentPreview> {
  try {
    const [bus, fare] = await Promise.all([
      findBusByCode(busCode),
      getActiveFare(),
    ]);

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

export async function createPayment(
  input: CreatePaymentInput,
  options?: {
    currentUser?: User;
    preview?: PaymentPreview;
  },
) {
  try {
    const {data} = await apiClient.post<PaymentResponse>('/payments', input);
    const mappedPayment = mapPaymentResponse(data);
    const previewBus = options?.preview?.bus;

    return {
      ...mappedPayment,
      userId: options?.currentUser?.id ?? input.userId,
      userName: options?.currentUser?.name ?? mappedPayment.userName,
      busId: previewBus?.id ?? input.busId,
      busCode: previewBus?.code ?? mappedPayment.busCode,
      busPlate: previewBus?.plate,
      routeId: previewBus?.route?.id,
      routeName: previewBus?.route?.name,
      routeOrigin: previewBus?.route?.origin,
      routeDestination: previewBus?.route?.destination,
      externalReference: input.externalReference,
    } satisfies Payment;
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

    const content = await Promise.all(
      data.content.map(payment => enrichPayment(mapPaymentResponse(payment))),
    );

    return {
      ...data,
      content,
    } satisfies PageResponse<Payment>;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar los pagos.'));
  }
}

export async function getPaymentById(paymentId: string) {
  try {
    const {data} = await apiClient.get<PaymentResponse>(`/payments/${paymentId}`);
    return enrichPayment(mapPaymentResponse(data));
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar el detalle del pago.'));
  }
}
