import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../lib/theme';

const LOGO_IMG = require('../../assets/Ekip-Logo-256.png');

export interface LoadingProps {
  onFinish?: () => void;
  minDuration?: number;
}

export function Loading({ onFinish, minDuration = 1000 }: LoadingProps) {
  const { isDark } = useTheme();
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    // 1. Entrance animation (fade in & subtle scale settle)
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    // 2. Pre-warm duration timer: smooth dissolve of container
    const timer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        onFinish?.();
      });
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onFinish, containerOpacity, logoOpacity, logoScale]);

  return (
    <Animated.View
      pointerEvents="auto"
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#04060c' : '#ebf0fa',
          opacity: containerOpacity,
        },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Animated.View
        style={[
          styles.logoBox,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={LOGO_IMG}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(StyleSheet.absoluteFill as any),
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});
