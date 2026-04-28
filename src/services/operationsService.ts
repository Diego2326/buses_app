import { apiClient } from './apiClient';
import { getErrorMessage } from './apiErrors';
import { listActiveBuses } from './busService';
import type {
  DashboardResponse,
  MapMarker,
  OperationsMapResponse,
  OperationalStatus,
  RoutePath,
} from '../types/domain';
import type { LiveBusMarker } from '../types/map';

type MarkerResponse = {
  id: string;
  label: string;
  position: [number, number];
  status: OperationalStatus;
};

type RoutePathResponse = {
  id: string;
  name: string;
  color: string;
  points: [number, number][];
};

type DashboardApiResponse = {
  metrics: DashboardResponse['metrics'];
  mapMarkers: MarkerResponse[];
};

type OperationsMapApiResponse = {
  busMarkers: MarkerResponse[];
  stopMarkers: MarkerResponse[];
  routePaths: RoutePathResponse[];
};

function mapMarker(marker: MarkerResponse): MapMarker {
  return {
    id: marker.id,
    label: marker.label,
    position: marker.position,
    status: marker.status,
  };
}

function mapRoutePath(routePath: RoutePathResponse): RoutePath {
  return {
    id: routePath.id,
    name: routePath.name,
    color: routePath.color,
    points: routePath.points,
  };
}

export async function getDashboard() {
  try {
    const {data} = await apiClient.get<DashboardApiResponse>('/dashboard');

    return {
      metrics: data.metrics,
      mapMarkers: data.mapMarkers.map(mapMarker),
    } satisfies DashboardResponse;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar el dashboard.'));
  }
}

export async function getOperationsMap() {
  try {
    const {data} = await apiClient.get<OperationsMapApiResponse>('/operations-map');

    return {
      busMarkers: data.busMarkers.map(mapMarker),
      stopMarkers: data.stopMarkers.map(mapMarker),
      routePaths: data.routePaths.map(mapRoutePath),
    } satisfies OperationsMapResponse;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar el mapa operativo.'));
  }
}

export async function getLiveBusMarkers() {
  try {
    const [operationsMap, activeBuses] = await Promise.all([
      getOperationsMap(),
      listActiveBuses(12),
    ]);
    const activeBusByCode = new Map(
      activeBuses.map(bus => [bus.code.trim().toUpperCase(), bus]),
    );

    return operationsMap.busMarkers.map(marker => {
      const bus = activeBusByCode.get(marker.label.trim().toUpperCase());

      return {
        id: marker.id,
        code: marker.label,
        routeName: bus?.route?.name ?? 'Ruta sin asignar',
        plate: bus?.plate,
        latitude: marker.position[0],
        longitude: marker.position[1],
        status: marker.status,
      } satisfies LiveBusMarker;
    });
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar los buses en vivo.'));
  }
}
