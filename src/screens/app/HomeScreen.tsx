import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { GlassPanel } from '../../components/GlassPanel';
import { LiveMapBackground } from '../../components/LiveMapBackground';
import { PaymentCard } from '../../components/PaymentCard';
import { StateView } from '../../components/StateView';
import { liveBusMarkers } from '../../mocks/liveBuses';
import { useAuthStore } from '../../store/authStore';
import { usePaymentStore } from '../../store/paymentStore';
import { useThemeStore } from '../../store/themeStore';
import { getThemeColors } from '../../theme/colors';
import type { HomeScreenProps } from '../../types/navigation';

export function HomeScreen({navigation}: HomeScreenProps) {
  const user = useAuthStore(state => state.user);
  const payments = usePaymentStore(state => state.payments);
  const latestPayment = payments[0];
  const mode = useThemeStore(state => state.mode);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const palette = getThemeColors(mode);
  const isDark = mode === 'dark';

  return (
    <View style={[styles.container, {backgroundColor: palette.mapBackground}]}>
      <LiveMapBackground />

      <View style={styles.topBar}>
        <GlassPanel style={styles.locationPill}>
          <Text style={[styles.locationLabel, {color: palette.textMuted}]}>
            Zacapa, Guatemala
          </Text>
          <Text style={[styles.locationValue, {color: palette.text}]}>
            Buses en vivo
          </Text>
        </GlassPanel>
        <View style={styles.topActions}>
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{checked: isDark}}
            onPress={toggleTheme}
            style={({pressed}) => [
              styles.themeButton,
              {
                backgroundColor: palette.glass,
                borderColor: palette.glassBorder,
                shadowColor: palette.text,
              },
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.themeButtonText, {color: palette.text}]}>
              {isDark ? '☾' : '☀'}
            </Text>
          </Pressable>
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
        </View>
      </View>

      <GlassPanel style={styles.sheet}>
        <View style={styles.handle} />
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

        <View style={styles.actions}>
          <AppButton
            onPress={() => navigation.navigate('Scanner')}
            title="Escanear QR"
          />
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
                    style={[
                      styles.busIconText,
                      {color: isDark ? '#06211E' : '#FFFFFF'},
                    ]}>
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
      </GlassPanel>
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
  topActions: {
    flexDirection: 'row',
    gap: 10,
  },
  locationPill: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  themeButton: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.14,
    shadowRadius: 22,
    width: 48,
  },
  themeButtonText: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.14,
    shadowRadius: 22,
    width: 48,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.72,
  },
  sheet: {
    bottom: 16,
    gap: 18,
    left: 14,
    padding: 18,
    position: 'absolute',
    right: 14,
    zIndex: 2,
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
  actions: {
    gap: 12,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
  },
  section: {
    gap: 12,
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
