import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { AppTextInput } from '../../components/AppTextInput';
import { Screen } from '../../components/Screen';
import { useThemeStore } from '../../store/themeStore';
import { getThemeColors } from '../../theme/colors';
import type { ScannerScreenProps } from '../../types/navigation';

export function ScannerScreen({navigation}: ScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [busCode, setBusCode] = useState('');
  const [error, setError] = useState('');
  const [scanned, setScanned] = useState(false);
  const mode = useThemeStore(state => state.mode);
  const palette = getThemeColors(mode);
  const {width} = useWindowDimensions();
  const frameSize = Math.min(width * 0.78, 300);

  const openPreview = (value: string) => {
    const normalized = value.trim().toUpperCase();
    setError('');

    if (!normalized.startsWith('BUS-') || normalized.length < 6) {
      setError('Usa un código de bus válido, por ejemplo BUS-102.');
      return;
    }

    navigation.navigate('PaymentPreview', {busCode: normalized});
  };

  const submit = () => openPreview(busCode);

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) {
      return;
    }

    setScanned(true);
    openPreview(result.data);
  };

  const canUseCamera = permission?.granted;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.kicker, {color: palette.primary}]}>Pago rápido</Text>
        <Text style={[styles.title, {color: palette.text}]}>Escanea el QR del bus</Text>
        <Text style={[styles.description, {color: palette.textMuted}]}>
          Apunta al código dentro del marco para obtener la tarifa al instante.
        </Text>
      </View>

      <View
        style={[
          styles.scannerCard,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}>
        <View
          style={[
            styles.scanFrame,
            {
              backgroundColor: palette.surfaceMuted,
              borderColor: palette.primary,
              width: frameSize,
              height: frameSize,
            },
          ]}>
          {canUseCamera ? (
            <CameraView
              barcodeScannerSettings={{barcodeTypes: ['qr']}}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              style={styles.camera}
            />
          ) : (
            <Text style={[styles.scanText, {color: palette.primary}]}>QR</Text>
          )}
          <View pointerEvents="none" style={styles.scanOverlay}>
            <View
              style={[styles.corner, styles.cornerTopLeft, {borderColor: palette.primary}]}
            />
            <View
              style={[styles.corner, styles.cornerTopRight, {borderColor: palette.primary}]}
            />
            <View
              style={[styles.corner, styles.cornerBottomLeft, {borderColor: palette.primary}]}
            />
            <View
              style={[styles.corner, styles.cornerBottomRight, {borderColor: palette.primary}]}
            />
          </View>
        </View>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {backgroundColor: canUseCamera ? palette.success : palette.warning},
            ]}
          />
          <Text style={[styles.statusText, {color: palette.textMuted}]}>
            {canUseCamera
              ? scanned
                ? 'Escaneo pausado. Toca "Escanear nuevamente".'
                : 'Cámara activa y lista para escanear.'
              : 'Cámara sin permiso. Habilítala para escanear.'}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.formCard,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}>
        <Text style={[styles.formTitle, {color: palette.text}]}>Ingreso manual</Text>
        <Text style={[styles.formDescription, {color: palette.textMuted}]}>
          Si el QR no se lee, escribe el código con formato BUS-102.
        </Text>
        {!permission?.granted ? (
          <AppButton
            onPress={requestPermission}
            title="Permitir cámara"
            variant="secondary"
          />
        ) : null}
        <AppTextInput
          autoCapitalize="characters"
          error={error}
          label="Código del bus"
          onChangeText={setBusCode}
          placeholder="BUS-102"
          value={busCode}
        />
        <AppButton onPress={submit} title="Consultar tarifa" />
        {scanned ? (
          <AppButton
            onPress={() => setScanned(false)}
            title="Escanear nuevamente"
            variant="secondary"
          />
        ) : null}
        <AppButton
          onPress={() => {
            setBusCode('BUS-102');
            navigation.navigate('PaymentPreview', {busCode: 'BUS-102'});
          }}
          title="Usar ejemplo BUS-102"
          variant="ghost"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  scannerCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  scanFrame: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  camera: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scanText: {
    fontSize: 42,
    fontWeight: '900',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  corner: {
    borderRadius: 10,
    borderWidth: 4,
    height: 36,
    position: 'absolute',
    width: 36,
  },
  cornerTopLeft: {
    borderBottomWidth: 0,
    borderRightWidth: 0,
    left: 14,
    top: 14,
  },
  cornerTopRight: {
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    right: 14,
    top: 14,
  },
  cornerBottomLeft: {
    borderRightWidth: 0,
    borderTopWidth: 0,
    bottom: 14,
    left: 14,
  },
  cornerBottomRight: {
    borderLeftWidth: 0,
    borderTopWidth: 0,
    bottom: 14,
    right: 14,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  statusDot: {
    borderRadius: 99,
    height: 8,
    width: 8,
  },
  statusText: {
    fontSize: 15,
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  formTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
  formDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
