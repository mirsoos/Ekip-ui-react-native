import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Platform, Animated, Easing } from 'react-native';
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

export function OnboardingSlide({ slide, step }: { slide: SlideData; step: number }) {
  const { colors } = useTheme();
  const IconComp = getIcon(slide.icon);
  const [entrance] = useState(() => new Animated.Value(0));

  useEffect(() => {
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

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={[hexToRgba(slide.color, 0.28), hexToRgba(slide.color, 0.08)]}
        style={styles.iconBox}
      >
        <IconComp size={54} color={colors.textPrimary} strokeWidth={1.8} />
      </LinearGradient>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {slide.title}
      </Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>
        {slide.desc}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconBox: {
    width: 110,
    height: 110,
    borderRadius: 36,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
        }),
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
