// --- START OF FILE OnboardingSlide.tsx ---

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getIcon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export interface SlideData {
  icon: IconName;
  title: string;
  desc: string;
  color: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const OnboardingSlide = React.memo(function OnboardingSlide({
  slide,
  step,
}: {
  slide: SlideData;
  step: number;
}) {
  const { colors } = useTheme();
  const IconComp = getIcon(slide.icon);
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    entrance.stopAnimation();
    entrance.setValue(0);
    const animation = Animated.timing(entrance, {
      toValue: 1,
      duration: 260,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start();

    return () => animation.stop();
  }, [step, entrance]);

  const translateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <Animated.View
      renderToHardwareTextureAndroid={true}
      style={[
        styles.container,
        {
          opacity: entrance,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.iconShadowWrap}>
        <LinearGradient
          colors={[hexToRgba(slide.color, 0.28), hexToRgba(slide.color, 0.08)]}
          style={styles.iconBox}
        >
          <IconComp size={54} color={colors.textPrimary} strokeWidth={1.8} />
        </LinearGradient>
      </View>

      {/* باکس متن با ارتفاع ثابت از بالا تا با کم و زیاد شدن خطوط توضیحات، آیکون هرگز بالا و پایین نپرد */}
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {slide.title}
        </Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          {slide.desc}
        </Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconShadowWrap: {
    marginBottom: 28,
    borderRadius: 36,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
        }
      : Platform.OS === 'web'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
        }
      : {}),
  },
  iconBox: {
    width: 110,
    height: 110,
    borderRadius: 36,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    minHeight: 116,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  desc: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 280,
    lineHeight: 20,
  },
});