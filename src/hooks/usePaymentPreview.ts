import { useQuery } from '@tanstack/react-query';

import { getPaymentPreview } from '../services/paymentService';

export function usePaymentPreview(busCode: string) {
  return useQuery({
    queryKey: ['payment-preview', busCode],
    queryFn: () => getPaymentPreview(busCode),
    enabled: busCode.trim().length > 0,
  });
}
