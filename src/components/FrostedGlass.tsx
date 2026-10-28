import React, { type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, type ThemeColors } from '../lib/theme';

export interface FrostedGlassProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  marginWidth?: number;
  scale?: number;
  blurDeviation?: number;
  overlayOpacity?: number;
  tint?: 'dark' | 'light';
  pointerEvents?: 'none' | 'box-none' | 'box-only' | 'auto';
}

export const FrostedGlass = React.memo(function FrostedGlass({
  children,
  style,
  borderRadius = 22,
  overlayOpacity = 0.08,
  tint,
  pointerEvents = 'none',
}: FrostedGlassProps) {
  let isDarkMode = true;
  let themeColors: ThemeColors | null = null;
  try {
    const themeContext = useTheme();
    isDarkMode = tint !== undefined ? tint === 'dark' : themeContext.isDark;
    themeColors = themeContext.colors;
  } catch {
    isDarkMode = tint !== undefined ? tint === 'dark' : true;
  }
  const isLight = !isDarkMode;

  const borderColor = isLight
    ? (themeColors?.glassBorderStrong || 'rgba(255, 255, 255, 0.85)')
    : (themeColors?.glassBorder || 'rgba(255, 255, 255, 0.28)');

  if (Platform.OS === 'web') {
    return (
      <View
        pointerEvents={pointerEvents}
        style={[
          styles.container,
          {
            borderRadius,
            borderColor,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            boxShadow:
              'inset 0 1px 1px rgba(255, 255, 255, 0.55), inset 0 -1px 1px rgba(255, 255, 255, 0.1), 0 6px 6px rgba(0, 0, 0, 0.2)',
          } as any,
          style,
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius,
              backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})`,
            },
          ]}
        />
        {children}
      </View>
    );
  }

  // ANDROID & iOS: Pure BlurView directly as the container with solid frosted tint layer
  return (
    <BlurView
      pointerEvents={pointerEvents}
      intensity={50}
      tint={isDarkMode ? 'dark' : 'light'}
      blurMethod={Platform.OS === 'android' ? 'none' : undefined}
      style={[
        styles.container,
        {
          borderRadius,
          borderColor,
        },
        style,
      ]}
    >
      {/* Top sheen overlay */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})`,
          },
        ]}
      />
      {children}
    </BlurView>
  );
});

// Legacy aliases for backward compatibility
export const LiquidLens = FrostedGlass;
export type LiquidLensProps = FrostedGlassProps;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
  },
});
