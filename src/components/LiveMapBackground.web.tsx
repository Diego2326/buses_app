import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { StyleSheet, View } from 'react-native';

import { liveBusMarkers, zacapaCenter } from '../mocks/liveBuses';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../theme/colors';

const busIcon = L.divIcon({
  className: 'buspay-marker',
  html: '<div class="buspay-marker-dot">BUS</div>',
  iconAnchor: [22, 22],
  popupAnchor: [0, -18],
});

export function LiveMapBackground() {
  const mode = useThemeStore(state => state.mode);
  const palette = getThemeColors(mode);
  const visualCenter: [number, number] = [
    zacapaCenter.latitude + 0.0032,
    zacapaCenter.longitude,
  ];

  return (
    <View style={[styles.container, {backgroundColor: palette.mapBackground}]}>
      <style>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: ${palette.mapBackground};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .buspay-map-dark .leaflet-tile {
          filter: brightness(0.55) contrast(1.18) saturate(0.72) hue-rotate(145deg);
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
        .buspay-marker-dot {
          align-items: center;
          background: ${mode === 'dark' ? 'rgba(45, 212, 191, 0.94)' : 'rgba(15, 118, 110, 0.94)'};
          border: 3px solid ${mode === 'dark' ? 'rgba(7,17,17,0.92)' : 'rgba(255,255,255,0.96)'};
          border-radius: 22px;
          box-shadow: 0 16px 30px rgba(23,32,42,0.26);
          color: ${mode === 'dark' ? '#06211E' : '#fff'};
          display: flex;
          font-size: 10px;
          font-weight: 900;
          height: 44px;
          justify-content: center;
          width: 44px;
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
        className={mode === 'dark' ? 'buspay-map-dark' : ''}
        maxZoom={18}
        minZoom={13}
        scrollWheelZoom
        style={styles.map}
        zoom={15}
        zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {liveBusMarkers.map(bus => (
          <Marker
            icon={busIcon}
            key={bus.id}
            position={[bus.latitude, bus.longitude]}>
            <Popup>
              <strong>{bus.codigo}</strong>
              <br />
              {bus.routeName}
              <br />
              {bus.heading} · {bus.etaMinutes} min
            </Popup>
          </Marker>
        ))}
      </MapContainer>
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
});
