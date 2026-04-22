import { StyleSheet, Text, View } from 'react-native';

import { liveBusMarkers, zacapaCenter } from '../mocks/liveBuses';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../theme/colors';

export function LiveMapBackground() {
  const mode = useThemeStore(state => state.mode);
  const palette = getThemeColors(mode);

  return (
    <View style={[styles.map, {backgroundColor: palette.mapBackground}]}>
      <View style={[styles.gridOverlay, {backgroundColor: palette.mapOverlay}]} />
      <View
        style={[
          styles.routeA,
          {
            backgroundColor:
              mode === 'dark'
                ? 'rgba(45,212,191,0.54)'
                : 'rgba(15,118,110,0.68)',
          },
        ]}
      />
      <View
        style={[
          styles.routeB,
          {
            backgroundColor:
              mode === 'dark'
                ? 'rgba(245,158,11,0.48)'
                : 'rgba(217,119,6,0.62)',
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
              top: `${42 + (index % 2) * 16}%`,
              backgroundColor: palette.primary,
              borderColor: mode === 'dark' ? '#071111' : '#FFFFFF',
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
    </View>
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
});
