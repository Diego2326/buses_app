import type { Bus, Fare, Payment, User } from '../types/domain';

export const mockUser: User = {
  id: 'USR-001',
  name: 'Ana Rodriguez',
  email: 'ana.rodriguez@example.com',
  role: 'PASSENGER',
  status: 'ACTIVE',
};

export const mockBuses: Bus[] = [
  {
    id: 'BUS-ID-001',
    plate: 'P-123FGH',
    code: 'BUS-001',
    route: {
      id: 'RUTA-01',
      name: 'Centro - Terminal Norte',
      origin: 'Parque Central',
      destination: 'Terminal Norte',
      status: 'ACTIVE',
    },
    status: 'ACTIVE',
  },
  {
    id: 'BUS-ID-002',
    plate: 'P-456JKL',
    code: 'BUS-002',
    route: {
      id: 'RUTA-02',
      name: 'Zona 10 - Universidad',
      origin: 'Zona 10',
      destination: 'Ciudad Universitaria',
      status: 'ACTIVE',
    },
    status: 'ACTIVE',
  },
];

export const mockFare: Fare = {
  id: 'FARE-REGULAR-2026',
  name: 'Tarifa urbana regular',
  amount: 5,
  validFrom: '2026-01-01',
  validTo: '2026-12-31',
  status: 'ACTIVE',
};

export const initialPayments: Payment[] = [
  {
    id: 'PAY-001',
    userId: mockUser.id,
    userName: mockUser.name,
    busId: mockBuses[0].id,
    busCode: mockBuses[0].code,
    busPlate: mockBuses[0].plate,
    routeId: mockBuses[0].route?.id,
    routeName: mockBuses[0].route?.name,
    routeOrigin: mockBuses[0].route?.origin,
    routeDestination: mockBuses[0].route?.destination,
    amount: 5,
    date: new Date(Date.now() - 86_400_000).toISOString(),
    status: 'COMPLETED',
    method: 'WALLET',
  },
];
