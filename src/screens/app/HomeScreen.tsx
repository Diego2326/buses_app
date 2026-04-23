/* eslint-disable react-native/no-inline-styles */

import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { AppButton } from '../../components/AppButton';
import { GlassPanel } from '../../components/GlassPanel';
import { LiveMapBackground } from '../../components/LiveMapBackground';
import { PaymentCard } from '../../components/PaymentCard';
import { StateView } from '../../components/StateView';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { liveBusMarkers } from '../../mocks/liveBuses';
import { useAuthStore } from '../../store/authStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useThemeStore } from '../../store/themeStore';
import { useWalletStore } from '../../store/walletStore';
import { getThemeColors } from '../../theme/colors';
import { formatCurrency } from '../../utils/format';
import type { HomeScreenProps } from '../../types/navigation';

export function HomeScreen({navigation}: HomeScreenProps) {
  const {height, width} = useWindowDimensions();
  const user = useAuthStore(state => state.user);
  const payments = usePaymentStore(state => state.payments);
  const latestPayment = payments[0];
  const balance = useWalletStore(state => state.balance);
  const mode = useThemeStore(state => state.mode);
  const palette = getThemeColors(mode);
  const isDark = mode === 'dark';
  const currentLocation = useCurrentLocation();
  const isLandscape = width > height;

  const compactProgress = useRef(new Animated.Value(0)).current;
  const [sheetSnap, setSheetSnap] = useState<'expanded' | 'compact'>('expanded');
  const [mapRecenterSignal, setMapRecenterSignal] = useState(0);
  const expandedHiddenOffset = useMemo(() => Math.max(410, height * 0.66), [height]);

  const expandedTranslateY = useMemo(
    () =>
      compactProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, expandedHiddenOffset],
      }),
    [compactProgress, expandedHiddenOffset],
  );
  const expandedOpacity = useMemo(
    () =>
      compactProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    [compactProgress],
  );
  const compactTranslateY = useMemo(
    () =>
      compactProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [115, 0],
      }),
    [compactProgress],
  );
  const compactOpacity = useMemo(
    () =>
      compactProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    [compactProgress],
  );

  const animateToSnap = (nextSnap: 'expanded' | 'compact') => {
    setSheetSnap(nextSnap);

    Animated.timing(compactProgress, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
      toValue: nextSnap === 'compact' ? 1 : 0,
      useNativeDriver: true,
    }).start();
  };

  const compactPanel = () => {
    if (sheetSnap === 'expanded') {
      animateToSnap('compact');
    }
  };

  const expandPanel = () => {
    if (sheetSnap === 'compact') {
      animateToSnap('expanded');
    }
  };

  const togglePanel = () => {
    animateToSnap(sheetSnap === 'expanded' ? 'compact' : 'expanded');
  };

  const mapBottomOffsetPx = isLandscape
    ? sheetSnap === 'compact'
      ? height * 0.22
      : height * 0.34
    : sheetSnap === 'compact'
      ? height * 0.32
      : height * 0.46;
  const targetScreenRatio = isLandscape
    ? sheetSnap === 'compact'
      ? 0.42
      : 0.37
    : sheetSnap === 'compact'
      ? 0.46
      : 0.4;

  return (
    <View style={[styles.container, {backgroundColor: palette.mapBackground}]}>
      <LiveMapBackground
        bottomOffsetPx={mapBottomOffsetPx}
        currentLocation={currentLocation}
        onMapInteract={compactPanel}
        recenterSignal={mapRecenterSignal}
        targetScreenRatio={targetScreenRatio}
      />

      <View style={styles.topBar}>
        <GlassPanel style={styles.locationPill}>
          <Text style={[styles.locationLabel, {color: palette.textMuted}]}>
            {currentLocation.source === 'gps' ? 'Ubicación actual' : 'Zacapa, Guatemala'}
          </Text>
          <Text style={[styles.locationValue, {color: palette.text}]}>
            {currentLocation.source === 'gps'
              ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`
              : 'Buses en vivo'}
          </Text>
        </GlassPanel>
        <View style={styles.topBarActions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Profile')}
            style={({pressed}) => [
              styles.avatar,
              {
                backgroundColor: palette.glass,
                borderColor: palette.glassBorder,
                shadowColor: palette.text,
              },
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.avatarText, {color: palette.primary}]}>
              {(user?.nombre ?? 'P').slice(0, 1).toUpperCase()}
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Centrar en mi ubicación"
            accessibilityRole="button"
            onPress={() => setMapRecenterSignal(value => value + 1)}
            style={({pressed}) => [
              styles.locationButton,
              {
                backgroundColor: palette.glass,
                borderColor: palette.glassBorder,
                shadowColor: palette.text,
              },
              pressed && styles.pressed,
            ]}>
            <View style={[styles.locationIconOuter, {borderColor: palette.primary}]}>
              <View style={[styles.locationIconInner, {backgroundColor: palette.primary}]} />
            </View>
          </Pressable>
        </View>
      </View>

      <Animated.View
        pointerEvents={sheetSnap === 'expanded' ? 'auto' : 'none'}
        style={[
          styles.sheetWrapper,
          {
            opacity: expandedOpacity,
            transform: [{translateY: expandedTranslateY}],
          },
        ]}>
        <GlassPanel style={styles.sheet}>
          <Pressable
            accessibilityRole="button"
            onPress={togglePanel}
            style={({pressed}) => [styles.grabberArea, pressed && styles.pressed]}>
            <View style={styles.handle} />
          </Pressable>
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, {color: palette.text}]}>
                Hola, {user?.nombre ?? 'pasajero'}
              </Text>
              <Text style={[styles.subtitle, {color: palette.textMuted}]}>
                Elige un bus, escanea y paga tu viaje.
              </Text>
            </View>
            <View
              style={[
                styles.liveBadge,
                {
                  backgroundColor: isDark
                    ? 'rgba(74,222,128,0.14)'
                    : 'rgba(21,128,61,0.12)',
                  borderColor: isDark
                    ? 'rgba(74,222,128,0.22)'
                    : 'rgba(21,128,61,0.18)',
                },
              ]}>
              <Text style={[styles.liveDot, {color: palette.success}]}>●</Text>
              <Text style={[styles.liveText, {color: palette.success}]}>Live</Text>
            </View>
          </View>

          <View
            style={[
              styles.summaryBlock,
              isLandscape && styles.summaryBlockLandscape,
            ]}>
            <View style={[styles.balanceCard, isLandscape && styles.balanceCardLandscape]}>
              <View>
                <Text style={[styles.balanceLabel, {color: palette.textMuted}]}>
                  Saldo actual
                </Text>
                <Text style={[styles.balanceValue, {color: palette.text}]}>
                  {formatCurrency(balance)}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('AddFunds')}
                style={({pressed}) => [
                  styles.addFundsButton,
                  {backgroundColor: palette.primary},
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.addFundsText,
                    {color: isDark ? '#06211E' : '#FFFFFF'},
                  ]}>
                  +
                </Text>
              </Pressable>
            </View>

            <View style={[styles.actions, isLandscape && styles.actionsLandscape]}>
              <AppButton onPress={() => navigation.navigate('Scanner')} title="Escanear QR" />
              <View style={styles.secondaryActions}>
                <AppButton
                  onPress={() => navigation.navigate('PaymentHistory')}
                  style={styles.secondaryButton}
                  title="Historial"
                  variant="glass"
                />
                <AppButton
                  onPress={() => navigation.navigate('Profile')}
                  style={styles.secondaryButton}
                  title="Perfil"
                  variant="glass"
                />
              </View>
            </View>
          </View>

          <ScrollView
            bounces={false}
            contentContainerStyle={styles.detailsScrollContent}
            showsVerticalScrollIndicator={false}
            style={styles.detailsScroll}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, {color: palette.text}]}>Cerca de ti</Text>
              <View style={styles.busList}>
                {liveBusMarkers.map(bus => (
                  <View
                    key={bus.id}
                    style={[
                      styles.busChip,
                      {
                        backgroundColor: palette.glassMuted,
                        borderColor: palette.glassBorder,
                      },
                    ]}>
                    <View style={[styles.busIcon, {backgroundColor: palette.primary}]}>
                      <Text
                        style={[styles.busIconText, {color: isDark ? '#06211E' : '#FFFFFF'}]}>
                        {bus.codigo.replace('BUS-', '')}
                      </Text>
                    </View>
                    <View style={styles.busInfo}>
                      <Text style={[styles.busCode, {color: palette.text}]}>{bus.codigo}</Text>
                      <Text
                        numberOfLines={1}
                        style={[styles.busRoute, {color: palette.textMuted}]}>
                        {bus.routeName}
                      </Text>
                    </View>
                    <Text style={[styles.eta, {color: palette.accent}]}>
                      {bus.etaMinutes} min
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, {color: palette.text}]}>Último pago</Text>
              {latestPayment ? (
                <PaymentCard
                  onPress={() =>
                    navigation.navigate('PaymentDetail', {paymentId: latestPayment.id})
                  }
                  payment={latestPayment}
                />
              ) : (
                <StateView
                  description="Cuando confirmes tu primer pago, aparecerá aquí."
                  title="Sin pagos todavía"
                />
              )}
            </View>
          </ScrollView>
        </GlassPanel>
      </Animated.View>

      <Animated.View
        pointerEvents={sheetSnap === 'compact' ? 'auto' : 'none'}
        style={[
          styles.compactSheetWrapper,
          {
            opacity: compactOpacity,
            transform: [{translateY: compactTranslateY}],
          },
        ]}>
        <GlassPanel style={styles.compactSheet}>
          <Pressable
            accessibilityRole="button"
            onPress={expandPanel}
            style={({pressed}) => [styles.grabberAreaCompact, pressed && styles.pressed]}>
            <View style={styles.handle} />
          </Pressable>

          <View style={styles.compactRow}>
            <AppButton
              onPress={() => navigation.navigate('Scanner')}
              style={styles.compactScanButton}
              title="Escanear QR"
            />

            <View
              style={[
                styles.compactBalanceCard,
                {
                  backgroundColor: palette.glassMuted,
                  borderColor: palette.glassBorder,
                },
              ]}>
              <View style={styles.compactBalanceContent}>
                <Text style={[styles.compactBalanceLabel, {color: palette.textMuted}]}>
                  Saldo actual
                </Text>
                <Text style={[styles.compactBalanceValue, {color: palette.text}]}>
                  {formatCurrency(balance)}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('AddFunds')}
                style={({pressed}) => [
                  styles.compactAddButton,
                  {backgroundColor: palette.primary},
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.compactAddText,
                    {color: isDark ? '#06211E' : '#FFFFFF'},
                  ]}>
                  +
                </Text>
              </Pressable>
            </View>
          </View>
        </GlassPanel>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 18,
    position: 'absolute',
    right: 18,
    top: 18,
    zIndex: 2,
  },
  locationPill: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topBarActions: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 10,
  },
  locationButton: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.14,
    shadowRadius: 22,
    width: 40,
  },
  locationIconOuter: {
    alignItems: 'center',
    borderRadius: 9,
    borderWidth: 2.2,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  locationIconInner: {
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    height: 60,
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 14},
    shadowOpacity: 0.16,
    shadowRadius: 24,
    width: 60,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.72,
  },
  sheetWrapper: {
    bottom: 16,
    left: 14,
    position: 'absolute',
    right: 14,
    zIndex: 3,
  },
  sheet: {
    gap: 18,
    maxHeight: '84%',
    padding: 18,
  },
  compactSheetWrapper: {
    bottom: 16,
    left: 14,
    position: 'absolute',
    right: 14,
    zIndex: 4,
  },
  compactSheet: {
    paddingBottom: 14,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  grabberArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -18,
    marginTop: -8,
    paddingBottom: 8,
    paddingTop: 4,
  },
  grabberAreaCompact: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 2,
    paddingBottom: 6,
    paddingTop: 4,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: 'rgba(23,32,42,0.18)',
    borderRadius: 3,
    height: 5,
    width: 46,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  liveBadge: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  liveDot: {
    fontSize: 10,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '900',
  },
  balanceCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  balanceCardLandscape: {
    flex: 0.95,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  addFundsButton: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  addFundsText: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 30,
  },
  actions: {
    gap: 12,
  },
  actionsLandscape: {
    flex: 1.05,
  },
  summaryBlock: {
    gap: 12,
  },
  summaryBlockLandscape: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 10,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsScroll: {
    minHeight: 0,
  },
  detailsScrollContent: {
    gap: 18,
    paddingBottom: 6,
  },
  secondaryButton: {
    flex: 1,
  },
  section: {
    gap: 12,
  },
  compactRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 10,
  },
  compactScanButton: {
    flex: 1,
    minHeight: 52,
  },
  compactBalanceCard: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  compactBalanceContent: {
    flex: 1,
  },
  compactBalanceLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  compactBalanceValue: {
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2,
  },
  compactAddButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  compactAddText: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  busList: {
    gap: 10,
  },
  busChip: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  busIcon: {
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  busIconText: {
    fontSize: 11,
    fontWeight: '900',
  },
  busInfo: {
    flex: 1,
  },
  busCode: {
    fontSize: 13,
    fontWeight: '900',
  },
  busRoute: {
    fontSize: 12,
  },
  eta: {
    fontSize: 13,
    fontWeight: '900',
  },
});
