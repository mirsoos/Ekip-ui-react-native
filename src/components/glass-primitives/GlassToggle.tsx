import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../lib/theme';
import { LiquidGlassToggle } from '../common/LiquidGlassToggle';
import { GLASS_THEME_STYLES, TOGGLE_ROW_STYLE, TOGGLE_LABEL_STYLE } from './theme';

export function GlassToggleComponent({
  checked,
  onChange,
  label,
  size = 'sm',
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}) {
  const { isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];

  return (
    <View style={TOGGLE_ROW_STYLE}>
      {label && (
        <Text style={[TOGGLE_LABEL_STYLE, themeStyles.toggleLabel]}>
          {label}
        </Text>
      )}
      <LiquidGlassToggle checked={checked} onChange={onChange} size={size} disabled={disabled} />
    </View>
  );
}

export const GlassToggle = React.memo(GlassToggleComponent);
