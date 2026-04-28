export type OperationalStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'MAINTENANCE'
  | 'SUSPENDED';

export type PaymentStatus =
  | 'COMPLETED'
  | 'PENDING'
  | 'FAILED'
  | 'REVERSED';

export type PaymentMethod = 'CARD' | 'QR' | 'CASH' | 'WALLET';

export type UserRole = 'ADMIN' | 'OPERATOR' | 'INSPECTOR' | 'PASSENGER';

export type Coordinates = [number, number];

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: OperationalStatus;
};

export type BusRoute = {
  id: string;
  name: string;
  origin?: string;
  destination?: string;
  status?: OperationalStatus;
};

export type Bus = {
  id: string;
  plate: string;
  code: string;
  capacity?: number;
  route?: BusRoute | null;
  status: OperationalStatus;
};

export type Fare = {
  id: string;
  name: string;
  amount: number;
  validFrom: string;
  validTo: string;
  status: OperationalStatus;
};

export type Payment = {
  id: string;
  userId?: string;
  userName: string;
  busId?: string;
  busCode: string;
  busPlate?: string;
  routeId?: string;
  routeName?: string;
  routeOrigin?: string;
  routeDestination?: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  method: PaymentMethod;
  externalReference?: string;
};

export type PaymentPreview = {
  bus: Bus;
  fare: Fare;
  amount: number;
};

export type DashboardMetrics = {
  activeBuses: number;
  registeredRoutes: number;
  paymentsToday: number;
  revenueToday: number;
};

export type MapMarker = {
  id: string;
  label: string;
  position: Coordinates;
  status: OperationalStatus;
};

export type DashboardResponse = {
  metrics: DashboardMetrics;
  mapMarkers: MapMarker[];
};

export type RoutePath = {
  id: string;
  name: string;
  color: string;
  points: Coordinates[];
};

export type OperationsMapResponse = {
  busMarkers: MapMarker[];
  stopMarkers: MapMarker[];
  routePaths: RoutePath[];
};
