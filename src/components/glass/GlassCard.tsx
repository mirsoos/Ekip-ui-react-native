import React, { type ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../lib/theme';
import {
  DARK_CARD_GRADIENT_COLORS,
  LIGHT_CARD_GRADIENT_COLORS,
  CARD_GRADIENT_START,
  CARD_GRADIENT_END,
} from './theme';

export interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'thick' | 'thin';
  glow?: boolean;
  onPress?: () => void;
  onClick?: () => void;
}

export function GlassCardComponent({
  children,
  style,
  variant = 'default',
  glow = false,
  onPress,
  onClick,
}: GlassCardProps) {
  const { isDark, colors } = useTheme();
  const handlePress = onPress ?? onClick;

  const bg =
    variant === 'thick'
      ? colors.glassThickBg
      : variant === 'thin'
      ? colors.glassThinBg
      : colors.glassCardBg;

  const cardStyle = React.useMemo<ViewStyle>(
    () => ({
      backgroundColor: bg,
      borderColor: colors.glassBorder,
      borderWidth: 1,
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative',
      ...(Platform.OS === 'ios'
        ? {
            shadowColor: colors.cardShadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: glow ? 0.35 : 0.18,
            shadowRadius: glow ? 16 : 8,
          }
        : Platform.OS === 'android'
        ? {
            elevation: 0,
          }
        : {
            shadowColor: colors.cardShadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: glow ? 0.35 : 0.18,
            shadowRadius: glow ? 16 : 8,
            elevation: glow ? 8 : 4,
          }),
    }),
    [bg, colors.cardShadow, colors.glassBorder, glow]
  );
  const containerStyle = React.useMemo(() => [cardStyle, style], [cardStyle, style]);
  const gradientColors = isDark ? DARK_CARD_GRADIENT_COLORS : LIGHT_CARD_GRADIENT_COLORS;

  const content = (
    <>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={gradientColors}
          start={CARD_GRADIENT_START}
          end={CARD_GRADIENT_END}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {children}
    </>
  );

  if (handlePress) {
    return (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={handlePress}
        style={containerStyle}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{content}</View>;
}

export const GlassCard = React.memo(GlassCardComponent);
