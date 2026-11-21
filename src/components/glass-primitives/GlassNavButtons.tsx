import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Icons } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { FrostedGlass } from '../FrostedGlass';
import { GLASS_THEME_STYLES } from './theme';

export function GlassBackButtonComponent({
  onPress,
  onClick,
  style,
}: {
  onPress?: () => void;
  onClick?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const { isRTL } = useI18n();
  const handlePress = onPress ?? onClick;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={[
        styles.backButton,
        themeStyles.backButton,
        style,
      ]}
    >
      <FrostedGlass
        borderRadius={21}
        marginWidth={9}
        scale={21}
        blurDeviation={1.6}
        overlayOpacity={isDark ? 0.1 : 0.22}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.iconWrap}>
        {isRTL ? (
          <Icons.ArrowRight size={20} color={colors.textPrimary} strokeWidth={2.4} />
        ) : (
          <Icons.ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2.4} />
        )}
      </View>
    </TouchableOpacity>
  );
}

export function GlassCloseButtonComponent({
  onPress,
  onClick,
  size = 32,
  style,
}: {
  onPress?: () => void;
  onClick?: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const handlePress = onPress ?? onClick;
  const radius = size / 2;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={[
        styles.closeButton,
        {
          width: size,
          height: size,
          borderRadius: radius,
          ...themeStyles.closeButton,
        },
        style,
      ]}
    >
      <FrostedGlass
        borderRadius={radius}
        marginWidth={Math.max(6, Math.round(size * 0.22))}
        scale={Math.max(14, Math.round(size * 0.55))}
        blurDeviation={1.5}
        overlayOpacity={isDark ? 0.1 : 0.22}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.iconWrap}>
        <Icons.X size={Math.round(size * 0.5)} color={colors.textPrimary} strokeWidth={2.4} />
      </View>
    </TouchableOpacity>
  );
}

export const GlassBackButton = React.memo(GlassBackButtonComponent);
export const GlassCloseButton = React.memo(GlassCloseButtonComponent);

const styles = StyleSheet.create({
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 4,
        }),
    overflow: 'hidden',
    position: 'relative',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 4,
        }),
    overflow: 'hidden',
    position: 'relative',
  },
  iconWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
