import React, { type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  ThemeContext,
  darkColors,
  lightColors,
  type ThemeColors,
} from '../lib/theme';

interface FrostedThemeStyles {
  borderColor: string;
  webContainer: ViewStyle;
  nativeContainer: ViewStyle;
  overlay: ViewStyle;
  webOverlay: ViewStyle;
}

const androidSurfaceStyles = StyleSheet.create({
  dark: {
    backgroundColor: darkColors.glassBg,
    borderColor: darkColors.glassBorder,
  },
  light: {
    backgroundColor: lightColors.glassBg,
    borderColor: lightColors.glassBorderStrong,
  },
});

const frostedStyleCache = new Map<string, FrostedThemeStyles>();

function getFrostedStyles(
  isDark: boolean,
  colors: ThemeColors,
  borderRadius: number,
  overlayOpacity: number
): FrostedThemeStyles {
  const borderColor = isDark ? colors.glassBorder : colors.glassBorderStrong;
  const key = `${isDark}:${borderRadius}:${overlayOpacity}:${borderColor}`;
  const cached = frostedStyleCache.get(key);
  if (cached) return cached;

  const overlay = {
    borderRadius,
    backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})`,
  };
  const result: FrostedThemeStyles = {
    borderColor,
    webContainer: {
      borderRadius,
      borderColor,
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      boxShadow:
        'inset 0 1px 1px rgba(255, 255, 255, 0.55), inset 0 -1px 1px rgba(255, 255, 255, 0.1), 0 6px 6px rgba(0, 0, 0, 0.2)',
    } as ViewStyle,
    nativeContainer: { borderRadius, borderColor },
    overlay,
    webOverlay: { ...overlay },
  };
  frostedStyleCache.set(key, result);
  return result;
}

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
  const themeContext = React.useContext(ThemeContext);
  const isDarkMode = tint !== undefined ? tint === 'dark' : themeContext?.isDark ?? true;
  const themeColors =
    themeContext?.colors.isDark === isDarkMode
      ? themeContext.colors
      : isDarkMode ? darkColors : lightColors;

  if (Platform.OS === 'android') {
    return (
      <View
        pointerEvents={pointerEvents}
        style={[
          styles.container,
          isDarkMode ? androidSurfaceStyles.dark : androidSurfaceStyles.light,
          { borderRadius },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  const themedStyles = getFrostedStyles(
    isDarkMode,
    themeColors,
    borderRadius,
    overlayOpacity
  );

  if (Platform.OS === 'web') {
    return (
      <View
        pointerEvents={pointerEvents}
        style={[styles.container, themedStyles.webContainer, style]}
      >
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, themedStyles.webOverlay]}
        />
        {children}
      </View>
    );
  }

  // iOS retains native blur; Android uses the flat surface above.
  return (
    <BlurView
      pointerEvents={pointerEvents}
      intensity={50}
      tint={isDarkMode ? 'dark' : 'light'}
      style={[styles.container, themedStyles.nativeContainer, style]}
    >
      {/* Top sheen overlay */}
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, themedStyles.overlay]}
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
