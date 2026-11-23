import React, { type ReactNode } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import {
  GLASS_THEME_STYLES,
  GRADIENT_START,
  GRADIENT_END,
  PRIMARY_BUTTON_GRADIENT,
  DANGER_BUTTON_GRADIENT,
  BUTTON_ICON_LEFT_STYLE,
  BUTTON_ICON_RIGHT_STYLE,
  BUTTON_TEXT_SIZE_STYLES,
} from './theme';

export interface GlassButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function GlassButtonComponent({
  children,
  onPress,
  onClick,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  icon,
  iconRight,
  disabled,
  fullWidth,
}: GlassButtonProps) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const handlePress = onPress ?? onClick;

  const padVertical = size === 'sm' ? 8 : size === 'lg' ? 15 : 12;
  const padHorizontal = size === 'sm' ? 14 : size === 'lg' ? 24 : 18;
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  const baseStyle = React.useMemo<ViewStyle>(
    () => ({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9999,
      paddingVertical: padVertical,
      paddingHorizontal: padHorizontal,
      opacity: disabled ? 0.45 : 1,
      width: fullWidth ? '100%' : undefined,
    }),
    [disabled, fullWidth, padHorizontal, padVertical]
  );
  const gradColors = variant === 'danger' ? DANGER_BUTTON_GRADIENT : PRIMARY_BUTTON_GRADIENT;
  const fullWidthStyle = fullWidth ? styles.fullWidth : undefined;
  const primaryGradientStyle = React.useMemo(
    () => [
      baseStyle,
      {
        shadowColor: gradColors[0],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 4,
      },
    ],
    [baseStyle, gradColors]
  );
  const secondaryStyle = React.useMemo(
    () => [baseStyle, variant === 'secondary' ? themeStyles.buttonSecondary : styles.buttonGhost, style],
    [baseStyle, style, themeStyles.buttonSecondary, variant]
  );

  if (variant === 'primary' || variant === 'danger') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        disabled={disabled}
        style={fullWidthStyle ? [fullWidthStyle, style] : style}
      >
        <LinearGradient
          colors={gradColors}
          start={GRADIENT_START}
          end={GRADIENT_END}
          style={primaryGradientStyle}
        >
          {icon && (
            <Icon
              name={icon}
              size={iconSize}
              color="#ffffff"
              style={BUTTON_ICON_LEFT_STYLE}
            />
          )}
          {typeof children === 'string' ? (
            <Text
              style={[styles.primaryButtonText, BUTTON_TEXT_SIZE_STYLES[size], textStyle]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {iconRight && (
            <Icon
              name={iconRight}
              size={iconSize}
              color="#ffffff"
              style={BUTTON_ICON_RIGHT_STYLE}
            />
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const isSecondary = variant === 'secondary';
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      disabled={disabled}
      style={secondaryStyle}
    >
      {icon && (
        <Icon
          name={icon}
          size={iconSize}
          color={isSecondary ? colors.textPrimary : colors.textSecondary}
          style={BUTTON_ICON_LEFT_STYLE}
        />
      )}
      {typeof children === 'string' ? (
        <Text
          style={[
            isSecondary ? themeStyles.buttonTextPrimary : themeStyles.buttonTextSecondary,
            BUTTON_TEXT_SIZE_STYLES[size],
            styles.secondaryButtonText,
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {iconRight && (
        <Icon
          name={iconRight}
          size={iconSize}
          color={isSecondary ? colors.textPrimary : colors.textSecondary}
          style={BUTTON_ICON_RIGHT_STYLE}
        />
      )}
    </TouchableOpacity>
  );
}

export const GlassButton = React.memo(GlassButtonComponent);

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
});
