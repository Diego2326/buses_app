import type { ReactNode } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  showBackButton?: boolean;
  style?: ViewStyle;
};

export function Screen({
  children,
  scroll = true,
  showBackButton = true,
  style,
}: ScreenProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const shouldShowBackButton = showBackButton && navigation.canGoBack();
  const content = (
    <View
      style={[
        styles.content,
        shouldShowBackButton && styles.contentWithBackButton,
        style,
      ]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safe}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {shouldShowBackButton ? (
        <Pressable
          accessibilityLabel="Volver"
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={({pressed}) => [
            styles.backButton,
            {top: insets.top + 12},
            pressed && styles.backButtonPressed,
          ]}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    padding: spacing.xl,
  },
  contentWithBackButton: {
    paddingTop: spacing.xl + 52,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    left: 16,
    position: 'absolute',
    width: 40,
    zIndex: 3,
  },
  backButtonPressed: {
    opacity: 0.72,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 24,
    marginLeft: -1,
  },
});
