import React from 'react';
import {
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import {
  GLASS_THEME_STYLES,
  PROGRESS_GRADIENTS,
  PROGRESS_LTR_START,
  PROGRESS_LTR_END,
  PROGRESS_RTL_START,
  PROGRESS_RTL_END,
  PROGRESS_DIRECTION_STYLES,
} from './theme';

export interface GlassProgressProps {
  value: number;
  max: number;
  color?: 'accent' | 'success' | 'warning';
  style?: StyleProp<ViewStyle>;
}

export function GlassProgressComponent({
  value,
  max,
  color = 'accent',
  style,
}: GlassProgressProps) {
  const { isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const { isRTL } = useI18n();
  const pct = Math.min(100, Math.max(0, (value / (max || 1)) * 100));

  const gradColors = PROGRESS_GRADIENTS[color];

  return (
    <View
      style={[
        styles.progressTrack,
        PROGRESS_DIRECTION_STYLES[isRTL ? 'rtl' : 'ltr'],
        themeStyles.progress,
        style,
      ]}
    >
      <LinearGradient
        colors={gradColors}
        start={isRTL ? PROGRESS_RTL_START : PROGRESS_LTR_START}
        end={isRTL ? PROGRESS_RTL_END : PROGRESS_LTR_END}
        style={[styles.progressBar, { width: `${pct}%` }]}
      />
    </View>
  );
}

export const GlassProgress = React.memo(GlassProgressComponent);

const styles = StyleSheet.create({
  progressTrack: {
    height: 9,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
  },
});
