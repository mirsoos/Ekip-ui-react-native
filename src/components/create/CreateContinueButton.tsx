import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FrostedGlass } from '../FrostedGlass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export function CreateContinueButtonComponent({
  step,
  totalSteps,
  disabled,
  onPress,
}: {
  step: number;
  totalSteps: number;
  disabled: boolean;
  onPress: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const isFinal = step === totalSteps - 1;
  const IconComp = getIcon(isFinal ? 'Check' : isRTL ? 'ArrowLeft' : 'ArrowRight');

  const bottomOffset = Platform.OS === 'web' ? 74 : 74 + Math.max(0, insets.bottom);

  return (
    <View style={[styles.outerContainer, { bottom: bottomOffset }]} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.continueButton,
          {
            backgroundColor: isDark ? 'rgba(11, 14, 23, 0.88)' : 'rgba(255, 255, 255, 0.88)',
            borderColor: colors.glassBorderStrong,
            opacity: disabled ? 0.45 : 1,
          },
        ]}
      >
        {/* 360° Frosted Glass */}
        <FrostedGlass
          borderRadius={36}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        <View style={[styles.buttonContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.continueText, { color: colors.textPrimary }]}>
            {isFinal ? t('create.deployOperation') : t('create.continue')}
          </Text>
          <IconComp
            size={18}
            color={colors.textPrimary}
            strokeWidth={2.4}
            style={{ marginHorizontal: 8 }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export const CreateContinueButton = React.memo(CreateContinueButtonComponent);

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 900,
  },
  continueButton: {
    position: 'relative',
    height: 54,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
          elevation: 14,
        }),
    overflow: 'visible',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
