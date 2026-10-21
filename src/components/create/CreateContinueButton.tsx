import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export function CreateContinueButton({
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
  const { colors, isDark } = useTheme();
  const isFinal = step === totalSteps - 1;
  const IconComp = getIcon(isFinal ? 'Check' : 'ArrowRight');

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.continueButton,
          {
            borderColor: colors.glassBorderStrong,
            opacity: disabled ? 0.45 : 1,
          },
        ]}
      >
        {/* 360° Liquid Glass Lens */}
        <LiquidLens
          borderRadius={36}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.buttonContent}>
          <Text style={[styles.continueText, { color: colors.textPrimary }]}>
            {isFinal ? 'Deploy Operation' : 'Continue'}
          </Text>
          <IconComp
            size={18}
            color={colors.textPrimary}
            strokeWidth={2.4}
            style={{ marginLeft: 8 }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 104 : 94,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 900,
  },
  continueButton: {
    position: 'relative',
    height: 52,
    borderRadius: 36,
    borderWidth: 1,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
    justifyContent: 'center',
    alignItems: 'center',
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
