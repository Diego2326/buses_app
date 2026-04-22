import type { Bus, Fare, Payment, User } from '../types/domain';

export const mockUser: User = {
  id: 'USR-001',
  nombre: 'Ana Rodriguez',
  correo: 'ana.rodriguez@example.com',
  rol: 'PASSENGER',
  estado: 'ACTIVE',
};

export const mockBuses: Bus[] = [
  {
    id: 'BUS-ID-001',
    placa: 'P-123FGH',
    codigo: 'BUS-001',
    ruta: {
      id: 'RUTA-01',
      nombre: 'Centro - Terminal Norte',
      origen: 'Parque Central',
      destino: 'Terminal Norte',
    },
    estado: 'ACTIVE',
  },
  {
    id: 'BUS-ID-002',
    placa: 'P-456JKL',
    codigo: 'BUS-002',
    ruta: {
      id: 'RUTA-02',
      nombre: 'Zona 10 - Universidad',
      origen: 'Zona 10',
      destino: 'Ciudad Universitaria',
    },
    estado: 'ACTIVE',
  },
];

export const mockFare: Fare = {
  id: 'FARE-REGULAR-2026',
  nombre: 'Tarifa urbana regular',
  monto: 5,
  vigencia: '2026-12-31',
  estado: 'ACTIVE',
};

export const initialPayments: Payment[] = [
  {
    id: 'PAY-001',
    usuario: mockUser,
    bus: mockBuses[0],
    monto: 5,
    fecha: new Date(Date.now() - 86_400_000).toISOString(),
    estado: 'COMPLETED',
    metodoPago: 'WALLET',
  },
];
