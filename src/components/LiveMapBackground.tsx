/* eslint-disable react-native/no-inline-styles */

import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CurrentLocation } from '../hooks/useCurrentLocation';
import { liveBusMarkers, zacapaCenter } from '../mocks/liveBuses';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../theme/colors';

type LiveMapBackgroundProps = {
  currentLocation: CurrentLocation;
  bottomOffsetPx?: number;
  targetScreenRatio?: number;
  onMapInteract?: () => void;
  recenterSignal?: number;
};

export function LiveMapBackground({
  currentLocation,
  bottomOffsetPx: _bottomOffsetPx = 320,
  targetScreenRatio = 0.42,
  onMapInteract,
  recenterSignal: _recenterSignal,
}: LiveMapBackgroundProps) {
  const mode = useThemeStore(state => state.mode);
  const palette = getThemeColors(mode);
  const currentTop = Math.min(62, Math.max(36, targetScreenRatio * 100));
  const currentLabelTop = currentTop + 8;
  const markerPalette =
    mode === 'dark'
      ? ['#2DD4BF', '#60A5FA', '#F59E0B']
      : ['#0F766E', '#2563EB', '#D97706'];

  return (
    <Pressable
      onPress={onMapInteract}
      style={[styles.map, {backgroundColor: palette.mapBackground}]}>
      <View style={[styles.gridOverlay, {backgroundColor: palette.mapOverlay}]} />
      <View
        style={[
          styles.routeA,
          {
            backgroundColor:
              mode === 'dark'
                ? 'rgba(96,165,250,0.68)'
                : 'rgba(37,99,235,0.62)',
          },
        ]}
      />
      <View
        style={[
          styles.routeB,
          {
            backgroundColor:
              mode === 'dark'
                ? 'rgba(34,211,238,0.54)'
                : 'rgba(20,184,166,0.54)',
          },
        ]}
      />
      <View
        style={[
          styles.routeC,
          {
            backgroundColor:
              mode === 'dark'
                ? 'rgba(245,158,11,0.44)'
                : 'rgba(217,119,6,0.48)',
          },
        ]}
      />
      <View
        style={[
          styles.centerPin,
          {backgroundColor: palette.glassStrong, borderColor: palette.primary},
        ]}>
        <Text style={[styles.centerText, {color: palette.text}]}>Zacapa</Text>
      </View>
      {liveBusMarkers.map((bus, index) => (
        <View
          key={bus.id}
          style={[
            styles.busMarker,
            {
              left: `${28 + index * 20}%`,
              top: `${34 + (index % 2) * 16}%`,
              backgroundColor: markerPalette[index % markerPalette.length],
              borderColor: mode === 'dark' ? '#091420' : '#FFFFFF',
              shadowColor: palette.text,
            },
          ]}>
          <Text
            style={[
              styles.busText,
              {color: mode === 'dark' ? '#06211E' : '#FFFFFF'},
            ]}>
            {bus.codigo.replace('BUS-', '')}
          </Text>
        </View>
      ))}
      <Text style={[styles.coordinates, {color: palette.textMuted}]}>
        {zacapaCenter.latitude.toFixed(4)}, {zacapaCenter.longitude.toFixed(4)}
      </Text>
      <View
        style={[
          styles.currentLocation,
          {
            left:
              currentLocation.source === 'gps'
                ? '51%'
                : '48%',
            top: `${currentTop}%`,
            backgroundColor: '#3B82F6',
            borderColor: '#FFFFFF',
          },
        ]}>
        <Text style={styles.currentLocationText}>•</Text>
      </View>
      <Text
        style={[
          styles.currentLocationLabel,
          {color: palette.text, top: `${currentLabelTop}%`},
        ]}>
        {currentLocation.source === 'gps' ? 'Tu ubicación' : 'Referencia'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  routeA: {
    height: 10,
    left: '-10%',
    position: 'absolute',
    top: '49%',
    transform: [{rotate: '-16deg'}],
    width: '130%',
  },
  routeB: {
    height: 8,
    left: '-20%',
    position: 'absolute',
    top: '65%',
    transform: [{rotate: '22deg'}],
    width: '145%',
  },
  routeC: {
    height: 6,
    left: '-8%',
    position: 'absolute',
    top: '41%',
    transform: [{rotate: '11deg'}],
    width: '126%',
  },
  centerPin: {
    borderRadius: 18,
    borderWidth: 1,
    left: '42%',
    paddingHorizontal: 12,
    paddingVertical: 7,
    position: 'absolute',
    top: '55%',
  },
  centerText: {
    fontSize: 13,
    fontWeight: '900',
  },
  busMarker: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 3,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.22,
    shadowRadius: 14,
    width: 36,
  },
  busText: {
    fontSize: 12,
    fontWeight: '900',
  },
  coordinates: {
    bottom: 24,
    fontSize: 12,
    fontWeight: '700',
    left: 24,
    position: 'absolute',
  },
  currentLocation: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 4,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    width: 24,
  },
  currentLocationText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 18,
  },
  currentLocationLabel: {
    fontSize: 12,
    fontWeight: '800',
    left: '42%',
    position: 'absolute',
  },
});
