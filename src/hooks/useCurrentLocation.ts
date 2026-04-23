import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { zacapaCenter } from '../mocks/liveBuses';

export type CurrentLocation = {
  latitude: number;
  longitude: number;
  source: 'gps' | 'fallback';
};

export function useCurrentLocation() {
  const [location, setLocation] = useState<CurrentLocation>({
    ...zacapaCenter,
    source: 'fallback',
  });

  useEffect(() => {
    const webNavigator =
      Platform.OS === 'web'
        ? (globalThis as {
            navigator?: {
              geolocation?: {
                getCurrentPosition: (
                  success: (position: {
                    coords: {latitude: number; longitude: number};
                  }) => void,
                  error?: () => void,
                  options?: {
                    enableHighAccuracy?: boolean;
                    maximumAge?: number;
                    timeout?: number;
                  },
                ) => void;
                watchPosition?: (
                  success: (position: {
                    coords: {latitude: number; longitude: number};
                  }) => void,
                  error?: () => void,
                  options?: {
                    enableHighAccuracy?: boolean;
                    maximumAge?: number;
                    timeout?: number;
                  },
                ) => number;
                clearWatch?: (watchId: number) => void;
              };
            };
          }).navigator
        : undefined;

    const geolocation = webNavigator?.geolocation;

    if (!geolocation) {
      return;
    }

    const updateLocation = (position: {
      coords: {latitude: number; longitude: number};
    }) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        source: 'gps',
      });
    };

    geolocation.getCurrentPosition(updateLocation, undefined, {
      enableHighAccuracy: true,
      maximumAge: 20_000,
      timeout: 10_000,
    });

    const watchId = geolocation.watchPosition?.(
      updateLocation,
      undefined,
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
        timeout: 15_000,
      },
    );

    return () => {
      if (watchId != null && geolocation.clearWatch) {
        geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return location;
}
