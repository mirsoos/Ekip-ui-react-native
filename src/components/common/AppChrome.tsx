import React, { useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../lib/theme';

export const AppChrome = React.memo(function AppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark } = useTheme();
  const [darkOverlayOpacity] = useState(() => new Animated.Value(0));
  const [lightOverlayOpacity] = useState(() => new Animated.Value(0));
  const prevThemeRef = useRef(isDark);

  useLayoutEffect(() => {
    if (prevThemeRef.current === isDark) return;
    const wasDark = prevThemeRef.current;
    prevThemeRef.current = isDark;

    if (Platform.OS === 'web') {
      return;
    }

    darkOverlayOpacity.stopAnimation();
    lightOverlayOpacity.stopAnimation();

    if (wasDark) {
      lightOverlayOpacity.setValue(0);
      darkOverlayOpacity.setValue(0.65);
      Animated.timing(darkOverlayOpacity, {
        toValue: 0,
        duration: 450,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }).start();
    } else {
      darkOverlayOpacity.setValue(0);
      lightOverlayOpacity.setValue(0.65);
      Animated.timing(lightOverlayOpacity, {
        toValue: 0,
        duration: 450,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }).start();
    }
  }, [darkOverlayOpacity, lightOverlayOpacity, isDark]);

  return (
    <SafeAreaView
      edges={Platform.OS === 'web' ? undefined : ['left', 'right']}
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#020306' : '#dde2ec' },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {Platform.OS === 'web' && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? '#020306' : '#dde2ec',
              backgroundImage: isDark
                ? 'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.6) 0%, rgba(2, 3, 6, 0.98) 100%)'
                : 'radial-gradient(ellipse at 50% 50%, rgba(241, 245, 249, 0.6) 0%, rgba(220, 226, 238, 0.98) 100%)',
            } as any,
          ]}
          pointerEvents="none"
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isDark ? 'rgba(2, 3, 6, 0.45)' : 'rgba(220, 226, 238, 0.45)',
              },
            ]}
          />
        </View>
      )}
      {children}
      {Platform.OS !== 'web' && (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.themeCurtain,
              {
                backgroundColor: '#04060c',
                opacity: darkOverlayOpacity,
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.themeCurtain,
              {
                backgroundColor: '#dde2ec',
                opacity: lightOverlayOpacity,
              },
            ]}
          />
        </>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  themeCurtain: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
});
