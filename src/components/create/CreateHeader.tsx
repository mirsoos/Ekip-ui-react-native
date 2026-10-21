import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { GlassBackButton } from '../Glass';
import { StepProgressBar } from '../common/StepProgressBar';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export function CreateHeader({
  step,
  totalSteps,
  onBack,
  onOpenAI,
}: {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onOpenAI: () => void;
}) {
  const { colors, isDark } = useTheme();
  const Sparkles = getIcon('Sparkles');

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View
        style={[
          styles.container,
          {
            borderColor: colors.glassBorderStrong,
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

        <GlassBackButton onPress={onBack} style={{ zIndex: 10 }} />

        <View style={{ flex: 1, marginHorizontal: 12, zIndex: 10 }}>
          <StepProgressBar currentStep={step} totalSteps={totalSteps} />
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onOpenAI}
          style={[
            styles.aiBtn,
            { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder, zIndex: 10 },
          ]}
        >
          <Sparkles size={16} color="#f472b6" strokeWidth={2.4} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    zIndex: 900,
  },
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 36,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
    overflow: 'visible',
  },
  aiBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
