import type { OperationalStatus } from './domain';

export type LiveBusMarker = {
  id: string;
  code: string;
  routeName: string;
  plate?: string;
  latitude: number;
  longitude: number;
  status: OperationalStatus;
};
