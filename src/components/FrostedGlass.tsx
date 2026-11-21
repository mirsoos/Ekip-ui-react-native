// --- START OF FILE FrostedGlass.tsx ---

import React, { type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  ThemeContext,
  darkColors,
  lightColors,
} from '../lib/theme';

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

/**
 * Liquid Glass Standard Surface (NO BLUR EVER):
 * Pure layered RGBA tokens, borders, and native platform shadows.
 */
export const FrostedGlass = React.memo(function FrostedGlass({
  children,
  style,
  borderRadius = 22,
  overlayOpacity = 0.08,
  tint,
  pointerEvents = 'none',
}: FrostedGlassProps) {
  const theme = React.useContext(ThemeContext);
  const isDark = tint === undefined ? theme?.isDark ?? true : tint === 'dark';
  const colors =
    theme?.colors.isDark === isDark
      ? theme.colors
      : isDark
      ? darkColors
      : lightColors;
  const themedStyle = isDark ? styles.dark : styles.light;
  const containerStyle = [
    styles.container,
    themedStyle,
    { borderColor: isDark ? colors.glassBorder : colors.glassBorderStrong, borderRadius },
    style,
  ];

  return (
    <View pointerEvents={pointerEvents} style={containerStyle}>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            backgroundColor: isDark
              ? `rgba(255, 255, 255, ${overlayOpacity})`
              : `rgba(255, 255, 255, ${Math.min(overlayOpacity * 2, 0.25)})`,
          },
        ]}
      />
      {children}
    </View>
  );
});

export const LiquidLens = FrostedGlass;
export type LiquidLensProps = FrostedGlassProps;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
  },
  dark: {
    backgroundColor: darkColors.glassHeaderBg,
    borderColor: darkColors.glassBorderStrong,
  },
  light: {
    backgroundColor: lightColors.glassHeaderBg,
    borderColor: lightColors.glassBorderStrong,
  },
});
