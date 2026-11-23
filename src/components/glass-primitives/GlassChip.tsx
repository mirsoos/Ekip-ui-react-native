import React, { type ReactNode } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import {
  GLASS_THEME_STYLES,
  GRADIENT_START,
  GRADIENT_END,
  CHIP_GRADIENT,
  SMALL_CHIP_ICON_STYLE,
} from './theme';

export interface GlassChipProps {
  children: ReactNode;
  active?: boolean;
  onPress?: () => void;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}

export function GlassChipComponent({
  children,
  active,
  onPress,
  icon,
  style,
}: GlassChipProps) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];

  if (active) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={style}>
        <LinearGradient
          colors={CHIP_GRADIENT}
          start={GRADIENT_START}
          end={GRADIENT_END}
          style={styles.chip}
        >
          {icon && (
            <Icon name={icon} size={14} color="#ffffff" style={SMALL_CHIP_ICON_STYLE} />
          )}
          {typeof children === 'string' ? (
            <Text style={styles.activeChipText}>
              {children}
            </Text>
          ) : (
            children
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={style ? [styles.chip, themeStyles.chip, style] : [styles.chip, themeStyles.chip]}
    >
      {icon && (
        <Icon
          name={icon}
          size={14}
          color={colors.textSecondary}
          style={SMALL_CHIP_ICON_STYLE}
        />
      )}
      {typeof children === 'string' ? (
        <Text style={[styles.chipText, themeStyles.chipText]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export const GlassChip = React.memo(GlassChipComponent);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
