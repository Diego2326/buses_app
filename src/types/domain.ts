export type UserRole = 'PASSENGER';
export type EntityStatus = 'ACTIVE' | 'INACTIVE';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type PaymentMethod = 'WALLET' | 'CARD' | 'CASHLESS_ACCOUNT';

export type User = {
  id: string;
  nombre: string;
  correo: string;
  rol: UserRole;
  estado: EntityStatus;
};

export type BusRoute = {
  id: string;
  nombre: string;
  origen: string;
  destino: string;
};

export type Bus = {
  id: string;
  placa: string;
  codigo: string;
  ruta: BusRoute;
  estado: EntityStatus;
};

export type Fare = {
  id: string;
  nombre: string;
  monto: number;
  vigencia: string;
  estado: EntityStatus;
};

export type Payment = {
  id: string;
  usuario: User;
  bus: Bus;
  monto: number;
  fecha: string;
  estado: PaymentStatus;
  metodoPago: PaymentMethod;
};

export type PaymentPreview = {
  bus: Bus;
  tarifa: Fare;
  monto: number;
};
