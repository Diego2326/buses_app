import { apiClient } from './apiClient';
import { getErrorMessage } from './apiErrors';
import type {
  Bus,
  BusRoute,
  Fare,
  OperationalStatus,
  PageResponse,
} from '../types/domain';

type BusRouteSummaryResponse = {
  id: string;
  name: string;
};

type BusResponse = {
  id: string;
  plate: string;
  code: string;
  capacity?: number;
  route?: BusRouteSummaryResponse | null;
  status: OperationalStatus;
};

type RouteResponse = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  status: OperationalStatus;
};

type FareResponse = {
  id: string;
  name: string;
  amount: number;
  validFrom: string;
  validTo: string;
  status: OperationalStatus;
};

const routeCache = new Map<string, Promise<BusRoute>>();
const busByCodeCache = new Map<string, Promise<Bus | null>>();

function mapRoute(route: RouteResponse): BusRoute {
  return {
    id: route.id,
    name: route.name,
    origin: route.origin,
    destination: route.destination,
    status: route.status,
  };
}

async function getRoute(routeId: string) {
  let cachedRoute = routeCache.get(routeId);

  if (!cachedRoute) {
    cachedRoute = apiClient
      .get<RouteResponse>(`/routes/${routeId}`)
      .then(({data}) => mapRoute(data))
      .catch(error => {
        routeCache.delete(routeId);
        throw new Error(getErrorMessage(error, 'No fue posible cargar la ruta.'));
      });

    routeCache.set(routeId, cachedRoute);
  }

  return cachedRoute;
}

async function enrichBus(bus: BusResponse): Promise<Bus> {
  const route = bus.route ? await getRoute(bus.route.id) : null;

  return {
    id: bus.id,
    plate: bus.plate,
    code: bus.code,
    capacity: bus.capacity,
    route: route
      ? route
      : bus.route
        ? {
            id: bus.route.id,
            name: bus.route.name,
          }
        : null,
    status: bus.status,
  };
}

function mapFare(fare: FareResponse): Fare {
  return {
    id: fare.id,
    name: fare.name,
    amount: fare.amount,
    validFrom: fare.validFrom,
    validTo: fare.validTo,
    status: fare.status,
  };
}

export async function findBusByCode(busCode: string) {
  const normalizedCode = busCode.trim().toUpperCase();
  let cachedBus = busByCodeCache.get(normalizedCode);

  if (!cachedBus) {
    cachedBus = apiClient
      .get<PageResponse<BusResponse>>('/buses', {
        params: {
          search: normalizedCode,
          size: 20,
        },
      })
      .then(async ({data}) => {
        const match =
          data.content.find(bus => bus.code.trim().toUpperCase() === normalizedCode) ??
          data.content[0];

        if (!match) {
          return null;
        }

        return enrichBus(match);
      })
      .catch(error => {
        busByCodeCache.delete(normalizedCode);
        throw new Error(getErrorMessage(error, 'No fue posible consultar el bus.'));
      });

    busByCodeCache.set(normalizedCode, cachedBus);
  }

  return cachedBus;
}

export async function listActiveBuses(limit = 6) {
  try {
    const {data} = await apiClient.get<PageResponse<BusResponse>>('/buses', {
      params: {
        status: 'ACTIVE',
        size: limit,
        sort: 'code,asc',
      },
    });

    return Promise.all(data.content.map(enrichBus));
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar los buses activos.'));
  }
}

export async function getActiveFare() {
  try {
    const {data} = await apiClient.get<PageResponse<FareResponse>>('/fares', {
      params: {
        status: 'ACTIVE',
        size: 20,
        sort: 'validFrom,desc',
      },
    });

    if (data.content.length === 0) {
      throw new Error('No hay tarifas activas disponibles.');
    }

    const today = new Date().toISOString().slice(0, 10);
    const currentFare =
      data.content.find(fare => fare.validFrom <= today && fare.validTo >= today) ??
      data.content[0];

    return mapFare(currentFare);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar la tarifa.'));
  }
}
