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

  if (Platform.OS === 'android') {
    return (
      <View pointerEvents={pointerEvents} style={containerStyle}>
        {children}
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View
        pointerEvents={pointerEvents}
        style={[containerStyle, styles.webBlur]}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      pointerEvents={pointerEvents}
      intensity={50}
      tint={isDark ? 'dark' : 'light'}
      style={containerStyle}
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
    </BlurView>
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
    backgroundColor: darkColors.glassBg,
    borderColor: darkColors.glassBorder,
  },
  light: {
    backgroundColor: lightColors.glassBg,
    borderColor: lightColors.glassBorderStrong,
  },
  webBlur: {
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  } as ViewStyle,
});
