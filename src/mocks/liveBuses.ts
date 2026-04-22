import type { LiveBusMarker } from '../types/map';

export const zacapaCenter = {
  latitude: 14.9722,
  longitude: -89.5306,
};

export const liveBusMarkers: LiveBusMarker[] = [
  {
    id: 'live-bus-001',
    codigo: 'BUS-001',
    routeName: 'Centro - Terminal Norte',
    plate: 'P-123FGH',
    latitude: 14.9729,
    longitude: -89.5331,
    heading: 'Hacia Terminal',
    etaMinutes: 4,
  },
  {
    id: 'live-bus-002',
    codigo: 'BUS-002',
    routeName: 'Zona 10 - Universidad',
    plate: 'P-456JKL',
    latitude: 14.9696,
    longitude: -89.5286,
    heading: 'Hacia Centro',
    etaMinutes: 7,
  },
  {
    id: 'live-bus-003',
    codigo: 'BUS-003',
    routeName: 'Mercado - Colonia Banvi',
    plate: 'P-789MNP',
    latitude: 14.9752,
    longitude: -89.5264,
    heading: 'Hacia Mercado',
    etaMinutes: 11,
  },
];
