import { mockBuses, mockFare } from '../mocks/domain';
import type { PaymentPreview } from '../types/domain';

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export async function getPaymentPreview(busCode: string): Promise<PaymentPreview> {
  await delay(450);

  const bus = mockBuses.find(item => item.codigo === busCode.trim().toUpperCase());

  if (!bus || bus.estado !== 'ACTIVE') {
    throw new Error('No encontramos un bus activo para este QR.');
  }

  return {
    bus,
    tarifa: mockFare,
    monto: mockFare.monto,
  };
}
