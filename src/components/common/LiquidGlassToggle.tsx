import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../lib/theme';

const SIZE = {
  sm: { width: 62, height: 28, knob: 20, fontSize: 10 },
  md: { width: 78, height: 32, knob: 24, fontSize: 11 },
  lg: { width: 106, height: 40, knob: 32, fontSize: 13 },
} as const;

export interface LiquidGlassToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  width?: number;
  height?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  label?: string;
  labelStyle?: StyleProp<ViewStyle>;
  labels?: { on: string; off: string };
  theme?: 'light' | 'dark';
}

export const LiquidGlassToggleComponent = React.memo(function LiquidGlassToggleComponent({
  checked,
  onChange,
  size = 'sm',
  width,
  height,
  disabled = false,
  style,
  label,
  labelStyle,
  labels = { on: 'On', off: 'Off' },
  theme,
}: LiquidGlassToggleProps) {
  const { isDark: contextIsDark } = useTheme();
  const isDark = theme ? theme === 'dark' : contextIsDark;
  const dimensions = SIZE[size];
  const trackWidth = width ?? dimensions.width;
  const trackHeight = height ?? dimensions.height;
  const knobSize = Math.min(dimensions.knob, trackHeight - 8);
  const onPress = React.useCallback(() => {
    if (!disabled) onChange(!checked);
  }, [checked, disabled, onChange]);

  return (
    <View style={[styles.row, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TouchableOpacity
        accessibilityRole="switch"
        accessibilityState={{ checked, disabled }}
        activeOpacity={0.85}
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.track,
          {
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackHeight / 2,
            backgroundColor: isDark ? '#141824' : '#eef3f7',
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#d0d8e3',
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        <View
          style={[
            styles.knob,
            {
              width: knobSize,
              height: knobSize,
              borderRadius: knobSize / 2,
              left: checked ? trackWidth - knobSize - 4 : 4,
              backgroundColor: checked ? '#22c55e' : '#64748b',
            },
          ]}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.value,
            {
              color: isDark ? '#ffffff' : '#0f172a',
              fontSize: dimensions.fontSize,
              paddingLeft: checked ? 4 : knobSize + 6,
              paddingRight: checked ? knobSize + 6 : 4,
            },
          ]}
        >
          {checked ? labels.on : labels.off}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export const LiquidGlassToggle = LiquidGlassToggleComponent;
export { LiquidGlassToggle as NeumorphicRadioToggle };
export { LiquidGlassToggle as GooeyToggle };

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 10,
  },
  track: {
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },
  knob: {
    position: 'absolute',
  },
  value: {
    alignSelf: 'center',
    fontWeight: '700',
    textAlign: 'center',
  },
});
