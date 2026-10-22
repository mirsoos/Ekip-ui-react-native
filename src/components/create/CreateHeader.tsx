import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated, Easing } from 'react-native';
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

  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enterAnim.setValue(0);
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: false,
    }).start();
  }, []);

  const enterTranslateY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });
  const enterOpacity = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const enterScale = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.985, 1],
  });

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.container,
          {
            borderColor: colors.glassBorderStrong,
            opacity: enterOpacity,
            transform: [
              { translateY: enterTranslateY },
              { scale: enterScale },
            ],
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
      </Animated.View>
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
