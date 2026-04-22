import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { AppTextInput } from '../../components/AppTextInput';
import { Screen } from '../../components/Screen';
import { colors } from '../../theme/colors';
import type { ScannerScreenProps } from '../../types/navigation';

export function ScannerScreen({navigation}: ScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [busCode, setBusCode] = useState('BUS-001');
  const [error, setError] = useState('');
  const [scanned, setScanned] = useState(false);

  const openPreview = (value: string) => {
    const normalized = value.trim().toUpperCase();
    setError('');

    if (!/^BUS-\d{3}$/.test(normalized)) {
      setError('Usa un código de bus válido, por ejemplo BUS-001.');
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
      <View style={styles.scanner}>
        <View style={styles.scanFrame}>
          {canUseCamera ? (
            <CameraView
              barcodeScannerSettings={{barcodeTypes: ['qr']}}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              style={styles.camera}
            />
          ) : (
            <Text style={styles.scanText}>QR</Text>
          )}
        </View>
        <Text style={styles.title}>Escáner QR</Text>
        <Text style={styles.description}>
          El QR contiene solo el identificador del bus. También puedes escribirlo
          manualmente para probar el flujo.
        </Text>
      </View>

      <View style={styles.form}>
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
          placeholder="BUS-001"
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
            setBusCode('BUS-002');
            navigation.navigate('PaymentPreview', {busCode: 'BUS-002'});
          }}
          title="Simular BUS-002"
          variant="secondary"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scanner: {
    alignItems: 'center',
    gap: 12,
  },
  scanFrame: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    maxWidth: 260,
    overflow: 'hidden',
    width: '78%',
  },
  camera: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scanText: {
    color: colors.primary,
    fontSize: 42,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  form: {
    gap: 14,
  },
});
