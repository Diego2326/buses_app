import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { Fragment, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { liveBusMarkers, zacapaCenter } from '../mocks/liveBuses';
import type { CurrentLocation } from '../hooks/useCurrentLocation';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../theme/colors';
import type { LiveBusMarker } from '../types/map';

const busIcon = L.divIcon({
  className: 'buspay-marker',
  html: '<div class="buspay-marker-dot">BUS</div>',
  iconAnchor: [22, 22],
  popupAnchor: [0, -18],
});

const currentLocationIcon = L.divIcon({
  className: 'buspay-user-marker',
  html: '<div class="buspay-user-dot"></div>',
  iconAnchor: [14, 14],
});

const routePrimary: [number, number][] = [
  [14.9688, -89.536],
  [14.9714, -89.5337],
  [14.9737, -89.5315],
  [14.9759, -89.5293],
  [14.9772, -89.5268],
];

const routeSecondary: [number, number][] = [
  [14.9672, -89.5324],
  [14.9691, -89.5301],
  [14.9718, -89.5282],
  [14.9746, -89.5266],
];

const routeTraffic: [number, number][] = [
  [14.9704, -89.5352],
  [14.9728, -89.5328],
  [14.9742, -89.5302],
  [14.9755, -89.5279],
];
const DEFAULT_MAP_ZOOM = 17;

type LiveMapBackgroundProps = {
  currentLocation: CurrentLocation;
  bottomOffsetPx?: number;
  targetScreenRatio?: number;
  onMapInteract?: () => void;
  recenterSignal?: number;
  markers?: LiveBusMarker[];
};

function MapInteractionLayer({onMapInteract}: {onMapInteract?: () => void}) {
  useMapEvents({
    click: () => onMapInteract?.(),
    dragstart: () => onMapInteract?.(),
    zoomstart: () => onMapInteract?.(),
  });

  return null;
}

function RecenterMap({
  currentLocation,
  bottomOffsetPx = 320,
  recenterSignal = 0,
}: {
  currentLocation: CurrentLocation;
  bottomOffsetPx?: number;
  recenterSignal?: number;
}) {
  const map = useMap();
  const lastRecenterSignal = useRef(recenterSignal);
  const lat = currentLocation.latitude;
  const lng = currentLocation.longitude;

  useEffect(() => {
    const shouldResetZoom = recenterSignal !== lastRecenterSignal.current;
    lastRecenterSignal.current = recenterSignal;
    const targetZoom = shouldResetZoom ? DEFAULT_MAP_ZOOM : map.getZoom();
    const mapSize = map.getSize();
    const menuTopY = mapSize.y - bottomOffsetPx;
    const gapAboveMenu = 1000;
    const minTargetY = mapSize.y * 0.34;
    const maxTargetY = mapSize.y * 0.60;
    const desiredY = Math.max(
      minTargetY,
      Math.min(maxTargetY, menuTopY - gapAboveMenu),
    );

    // Move map center so current location appears at desiredY on screen.
    const offset = mapSize.y * 0.5 - desiredY;

    const point = map.project([lat, lng], targetZoom);
    const adjustedPoint = point.add([0, offset]);
    const adjustedLatLng = map.unproject(adjustedPoint, targetZoom);

    map.setView(adjustedLatLng, targetZoom, {
      animate: true,
      duration: 0.85,
    });
  }, [bottomOffsetPx, lat, lng, map, recenterSignal]);

  return null;
}

export function LiveMapBackground({
  currentLocation,
  bottomOffsetPx,
  targetScreenRatio: _targetScreenRatio,
  onMapInteract,
  recenterSignal,
  markers = liveBusMarkers,
}: LiveMapBackgroundProps) {
  const mode = useThemeStore(state => state.mode);
  const palette = getThemeColors(mode);
  const visualCenter: [number, number] = [zacapaCenter.latitude, zacapaCenter.longitude];
  const tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <View style={[styles.container, {backgroundColor: palette.mapBackground}]}>
      <style>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: ${palette.mapBackground};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .buspay-map-blue-dark .leaflet-tile {
          filter: brightness(0.82) saturate(1.1) contrast(1.04) hue-rotate(8deg);
        }
        .buspay-map-blue-light .leaflet-tile {
          filter: saturate(1.06) contrast(1.01);
        }
        .leaflet-control-attribution {
          font-size: 10px;
          background: ${mode === 'dark' ? 'rgba(8,22,20,0.70)' : 'rgba(255,255,255,0.58)'} !important;
          color: ${palette.textMuted};
          backdrop-filter: blur(18px);
        }
        .leaflet-control-attribution a {
          color: ${palette.primary};
        }
        .buspay-marker {
          background: transparent;
          border: 0;
        }
        .buspay-user-marker {
          background: transparent;
          border: 0;
        }
        .buspay-marker-dot {
          align-items: center;
          background: ${mode === 'dark'
            ? 'linear-gradient(150deg, rgba(62,168,255,0.98), rgba(45,212,191,0.98))'
            : 'linear-gradient(150deg, rgba(37,99,235,0.95), rgba(15,118,110,0.95))'};
          border: 3px solid ${mode === 'dark' ? 'rgba(8,12,24,0.92)' : 'rgba(255,255,255,0.96)'};
          border-radius: 22px;
          box-shadow: ${mode === 'dark'
            ? '0 14px 30px rgba(14,56,110,0.52)'
            : '0 16px 30px rgba(23,32,42,0.26)'};
          color: #fff;
          display: flex;
          font-size: 10px;
          font-weight: 900;
          height: 44px;
          justify-content: center;
          width: 44px;
        }
        .buspay-user-dot {
          background: ${mode === 'dark' ? 'rgba(88,176,255,0.98)' : 'rgba(59,130,246,0.96)'};
          border: 4px solid rgba(255,255,255,0.96);
          border-radius: 14px;
          box-shadow: ${mode === 'dark'
            ? '0 0 0 12px rgba(88,176,255,0.28)'
            : '0 0 0 10px rgba(59,130,246,0.18)'};
          height: 28px;
          width: 28px;
        }
        .leaflet-popup-content-wrapper {
          background: ${palette.glassStrong};
          backdrop-filter: blur(24px);
          border: 1px solid ${palette.glassBorder};
          border-radius: 18px;
          box-shadow: 0 18px 40px rgba(23,32,42,0.18);
          color: ${palette.text};
        }
        .leaflet-popup-tip {
          background: ${palette.glassStrong};
        }
      `}</style>
      <MapContainer
        center={visualCenter}
        className={mode === 'dark' ? 'buspay-map-blue-dark' : 'buspay-map-blue-light'}
        maxZoom={19}
        minZoom={14}
        scrollWheelZoom
        style={styles.map}
        zoom={DEFAULT_MAP_ZOOM}
        zoomDelta={0.25}
        zoomSnap={0.25}
        zoomControl={false}>
        <RecenterMap
          bottomOffsetPx={bottomOffsetPx}
          currentLocation={currentLocation}
          recenterSignal={recenterSignal}
        />
        <MapInteractionLayer onMapInteract={onMapInteract} />
        <TileLayer
          attribution={attribution}
          key={`tiles-${mode}`}
          url={tileUrl}
        />
        <Polyline
          pathOptions={{
            color: mode === 'dark' ? '#2B87FF' : '#3B82F6',
            lineCap: 'round',
            lineJoin: 'round',
            opacity: mode === 'dark' ? 0.22 : 0.16,
            weight: mode === 'dark' ? 14 : 11,
          }}
          positions={routePrimary}
        />
        <Polyline
          pathOptions={{
            color: mode === 'dark' ? '#60A5FA' : '#1D4ED8',
            lineCap: 'round',
            lineJoin: 'round',
            opacity: mode === 'dark' ? 0.92 : 0.78,
            weight: 5,
          }}
          positions={routePrimary}
        />
        <Polyline
          pathOptions={{
            color: mode === 'dark' ? '#1EE3CF' : '#0EA5A0',
            lineCap: 'round',
            lineJoin: 'round',
            opacity: mode === 'dark' ? 0.78 : 0.64,
            weight: 4,
          }}
          positions={routeSecondary}
        />
        <Polyline
          pathOptions={{
            color: mode === 'dark' ? '#F7B955' : '#D97706',
            dashArray: '8 10',
            lineCap: 'round',
            lineJoin: 'round',
            opacity: mode === 'dark' ? 0.9 : 0.78,
            weight: 3,
          }}
          positions={routeTraffic}
        />
        <CircleMarker
          center={[currentLocation.latitude, currentLocation.longitude]}
          pathOptions={{
            color: mode === 'dark' ? 'rgba(96,165,250,0.58)' : 'rgba(59,130,246,0.45)',
            fillColor: mode === 'dark' ? 'rgba(96,165,250,0.26)' : 'rgba(59,130,246,0.18)',
            fillOpacity: 1,
            weight: 2,
          }}
          radius={mode === 'dark' ? 19 : 16}
        />
        <Marker
          icon={currentLocationIcon}
          position={[currentLocation.latitude, currentLocation.longitude]}>
          <Popup>Ubicación actual</Popup>
        </Marker>
        {markers.map((bus, index) => (
          <Fragment key={bus.id}>
            <CircleMarker
              center={[bus.latitude, bus.longitude]}
              pathOptions={{
                color:
                  index % 3 === 0
                    ? mode === 'dark'
                      ? 'rgba(45,212,191,0.72)'
                      : 'rgba(15,118,110,0.58)'
                    : index % 3 === 1
                      ? mode === 'dark'
                        ? 'rgba(96,165,250,0.78)'
                        : 'rgba(37,99,235,0.62)'
                      : mode === 'dark'
                        ? 'rgba(245,158,11,0.78)'
                        : 'rgba(217,119,6,0.62)',
                fillColor: 'transparent',
                fillOpacity: 0,
                weight: 2,
              }}
              radius={mode === 'dark' ? 24 : 20}
            />
            <Marker
              icon={busIcon}
              position={[bus.latitude, bus.longitude]}>
              <Popup>
                <strong>{bus.code}</strong>
                <br />
                {bus.routeName}
                <br />
                {bus.plate ?? 'Sin placa'} · {bus.status}
              </Popup>
            </Marker>
          </Fragment>
        ))}
      </MapContainer>
      <View
        pointerEvents="none"
        style={[
          styles.blueTintOverlay,
          mode === 'dark'
            ? styles.blueTintOverlayDark
            : styles.blueTintOverlayLight,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  blueTintOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  blueTintOverlayDark: {
    backgroundColor: 'rgba(28, 74, 134, 0.18)',
  },
  blueTintOverlayLight: {
    backgroundColor: 'rgba(58, 124, 212, 0.06)',
  },
});
