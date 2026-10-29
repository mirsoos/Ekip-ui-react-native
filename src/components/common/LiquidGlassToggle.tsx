// --- START OF FILE LiquidGlassToggle.tsx ---

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  Text,
  LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../lib/theme';

const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 1, y: 1 };
const NATIVE_TOGGLE_DIMS = {
  sm: { width: 62, height: 28, radius: 14, font: 10.5 },
  md: { width: 78, height: 32, radius: 16, font: 11.5 },
  lg: { width: 106, height: 40, radius: 20, font: 13.5 },
} as const;
const NATIVE_TOGGLE_THEME_STYLES = {
  dark: {
    background: '#141824',
    border: 'rgba(255, 255, 255, 0.09)',
    highlightBackground: '#1d2333',
    highlightBorder: 'rgba(255, 255, 255, 0.10)',
    inactiveText: '#64748b',
    gradient: [
      'rgba(0, 0, 0, 0.45)',
      'transparent',
      'rgba(255, 255, 255, 0.06)',
    ] as const,
  },
  light: {
    background: '#eef3f7',
    border: '#d0d8e3',
    highlightBackground: '#eef3f7',
    highlightBorder: '#ffffff',
    inactiveText: '#acb2c0',
    gradient: [
      'rgba(208, 216, 227, 0.65)',
      'rgba(238, 243, 247, 0.2)',
      'rgba(255, 255, 255, 0.9)',
    ] as const,
  },
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

export function LiquidGlassToggleComponent({
  checked,
  onChange,
  size = 'sm',
  width: widthProp,
  height: heightProp,
  disabled = false,
  style,
  label,
  labelStyle,
  labels = { on: 'On', off: 'Off' },
  theme: themeProp,
}: LiquidGlassToggleProps) {
  const instanceId = useRef(`rc-${Math.random().toString(36).substring(2, 9)}`).current;

  let isDark = true;
  try {
    const themeContext = useTheme();
    isDark = themeProp ? themeProp === 'dark' : themeContext.isDark;
  } catch {
    isDark = themeProp ? themeProp === 'dark' : true;
  }

  const fontSize = size === 'lg' ? 24 : size === 'md' ? 14 : 10.5;
  const horizontalPadding = size === 'lg' ? 20 : size === 'md' ? 13 : 9;
  const verticalPadding = size === 'lg' ? 12 : size === 'md' ? 7 : 4.5;
  const borderRadius = size === 'lg' ? 40 : size === 'md' ? 22 : 16;
  const minWidth = size === 'lg' ? 140 : size === 'md' ? 84 : 64;

  const nativeThemeStyles = NATIVE_TOGGLE_THEME_STYLES[isDark ? 'dark' : 'light'];
  const bg = nativeThemeStyles.background;
  const border = isDark ? '1px solid rgba(255, 255, 255, 0.08)' : 'none';
  const boxShadow = isDark
    ? '-1.5px -1.5px 4px rgba(255, 255, 255, 0.05), 2px 2px 5px rgba(0, 0, 0, 0.6)'
    : size === 'lg'
    ? '-4px -3px 9px 2px #ffffff, 5px 5px 8px 1px #d0d8e3'
    : '-2px -2px 5px 1px #ffffff, 2.5px 2.5px 5px 1px #d0d8e3';

  const highlightBg = nativeThemeStyles.highlightBackground;
  const highlightBorder = isDark ? '1px solid rgba(255, 255, 255, 0.09)' : 'none';
  const highlightBoxShadow = isDark
    ? 'inset -1.5px -1.5px 3px rgba(255, 255, 255, 0.07), inset 1.5px 1.5px 3px rgba(0, 0, 0, 0.5)'
    : size === 'lg'
    ? 'inset -4px -4px 8px 3px #ffffff, inset -2px 4px 6px 4px #d0d8e3'
    : 'inset -2px -2px 4px 1px #ffffff, inset -1px 2px 4px 1.5px #d0d8e3';

  const inactiveTextColor = nativeThemeStyles.inactiveText;

  const animProgress = useRef(new Animated.Value(checked ? 0 : 1)).current;

  useEffect(() => {
    if (Platform.OS === 'web') return;
    Animated.timing(animProgress, {
      toValue: checked ? 0 : 1,
      duration: 220,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      useNativeDriver: true,
    }).start();
  }, [checked, animProgress]);

  const handlePress = React.useCallback(() => {
    if (disabled) return;
    const nextChecked = !checked;
    if (Platform.OS !== 'web') {
      Animated.timing(animProgress, {
        toValue: nextChecked ? 0 : 1,
        duration: 220,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
        useNativeDriver: true,
      }).start();
    }
    onChange(nextChecked);
  }, [checked, disabled, onChange, animProgress]);

  // ==========================================================
  // WEB: 100% Untouched Original Implementation
  // ==========================================================
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.outerWrapper, style]}>
        {label && <Text style={[styles.labelText, labelStyle]}>{label}</Text>}

        <div
          dir="ltr"
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            flexShrink: 0,
            direction: 'ltr',
          }}
        >
          <style>
            {`
              @import url("https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap");

              #${instanceId}-wrap {
                direction: ltr !important;
              }

              #${instanceId}-wrap .radio-checked {
                direction: ltr !important;
                position: relative;
                font-family: "Comfortaa", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: ${fontSize}px;
                letter-spacing: 0.5px;
                background-color: ${bg};
                border: ${border};
                border-radius: ${borderRadius}px;
                box-shadow: ${boxShadow};
                display: inline-flex;
                overflow: hidden;
                cursor: ${disabled ? 'not-allowed' : 'pointer'};
                opacity: ${disabled ? 0.6 : 1};
                box-sizing: border-box;
                min-width: ${minWidth}px;
              }

              #${instanceId}-wrap .radio-checked_container {
                direction: ltr !important;
                position: relative;
                display: flex;
                flex-direction: row !important;
                align-items: center;
                z-index: 2;
                width: 100%;
              }

              #${instanceId}-wrap .radio-checked_highlight {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 50%;
                border-radius: ${borderRadius}px;
                background: ${highlightBg};
                border: ${highlightBorder};
                box-shadow: ${highlightBoxShadow};
                transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
                transform: ${checked ? 'translateX(0%)' : 'translateX(100%)'};
                z-index: 1;
                pointer-events: none;
                box-sizing: border-box;
              }

              #${instanceId}-wrap .radio-checked_label {
                position: relative;
                flex: 1;
                text-align: center;
                cursor: pointer;
                padding: ${verticalPadding}px ${horizontalPadding}px;
                line-height: 1.2;
                border-radius: ${borderRadius}px;
                font-weight: 700;
                color: ${inactiveTextColor};
                transition: color 180ms ease, text-shadow 180ms ease;
                white-space: nowrap;
                user-select: none;
              }

              #${instanceId}-wrap .radio-checked_label--on.active {
                color: #47cf73;
                text-shadow: 0 0 ${isDark ? '9px' : '7px'} rgba(71, 207, 115, ${isDark ? '0.75' : '0.6'});
              }

              #${instanceId}-wrap .radio-checked_label--off.active {
                color: #ff3c41;
                text-shadow: 0 0 ${isDark ? '9px' : '7px'} rgba(255, 60, 65, ${isDark ? '0.75' : '0.6'});
              }
            `}
          </style>

          <div id={`${instanceId}-wrap`}>
            <div
              className="radio-checked"
              onClick={() => !disabled && onChange(!checked)}
            >
              <div className="radio-checked_highlight" />
              <div className="radio-checked_container">
                <div
                  className={`radio-checked_label radio-checked_label--on ${
                    checked ? 'active' : ''
                  }`}
                >
                  {labels.on}
                </div>
                <div
                  className={`radio-checked_label radio-checked_label--off ${
                    !checked ? 'active' : ''
                  }`}
                >
                  {labels.off}
                </div>
              </div>
            </div>
          </div>
        </div>
      </View>
    );
  }

  // ==========================================================
  // ANDROID & iOS: Pixel-Perfect Neumorphic Pill Match
  // ==========================================================
  const nativeDims = NATIVE_TOGGLE_DIMS[size] ?? NATIVE_TOGGLE_DIMS.md;

  const finalWidth = widthProp ?? nativeDims.width;
  const finalHeight = heightProp ?? nativeDims.height;
  const finalRadius = nativeDims.radius;
  const finalFont = nativeDims.font;

  const pillWidth = Math.round((finalWidth - 4) / 2);
  const pillHeight = finalHeight - 4;

  const highlightTranslate = React.useMemo(
    () => animProgress.interpolate({ inputRange: [0, 1], outputRange: [0, pillWidth] }),
    [animProgress, pillWidth]
  );
  const nativeContainerStyle = React.useMemo(
    () => [
      styles.nativeContainer,
      {
        width: finalWidth,
        height: finalHeight,
        backgroundColor: bg,
        borderColor: nativeThemeStyles.border,
        borderWidth: 1,
        borderRadius: finalRadius,
        opacity: disabled ? 0.6 : 1,
      },
    ],
    [bg, disabled, finalHeight, finalRadius, finalWidth, nativeThemeStyles.border]
  );
  const nativeHighlightStyle = React.useMemo(
    () => [
      styles.nativeHighlight,
      {
        width: pillWidth,
        height: pillHeight,
        borderRadius: finalRadius - 2,
        backgroundColor: highlightBg,
        borderColor: nativeThemeStyles.highlightBorder,
        transform: [{ translateX: highlightTranslate }],
      },
    ],
    [
      finalRadius,
      highlightBg,
      highlightTranslate,
      nativeThemeStyles.highlightBorder,
      pillHeight,
      pillWidth,
    ]
  );
  const nativeLabelRowStyle = React.useMemo(
    () => [styles.nativeLabelRow, { width: finalWidth - 4, height: pillHeight }],
    [finalWidth, pillHeight]
  );
  const nativeCellStyles = React.useMemo(
    () => [
      [styles.nativeCell, { width: pillWidth }],
      [styles.nativeCell, { width: pillWidth }],
    ],
    [pillWidth]
  );
  const activeLabelStyle = React.useMemo(
    () => [styles.nativeLabel, { fontSize: finalFont, color: '#47cf73' }],
    [finalFont]
  );
  const inactiveLabelStyle = React.useMemo(
    () => [styles.nativeLabel, { fontSize: finalFont, color: inactiveTextColor }],
    [finalFont, inactiveTextColor]
  );
  const offLabelStyle = React.useMemo(
    () => [styles.nativeLabel, { fontSize: finalFont, color: '#ff3c41' }],
    [finalFont]
  );
  const gradientOverlayStyle = React.useMemo(
    () => [StyleSheet.absoluteFill, { borderRadius: finalRadius - 2 }],
    [finalRadius]
  );

  return (
    <View style={[styles.outerWrapper, style]}>
      {label && <Text style={[styles.labelText, labelStyle]}>{label}</Text>}

      <TouchableOpacity
        activeOpacity={0.88}
        disabled={disabled}
        delayPressIn={0}
        onPress={handlePress}
        style={nativeContainerStyle}
      >
        {/* Sliding 50% Sunken Neumorphic Highlight Pill */}
        <Animated.View
          renderToHardwareTextureAndroid={true}
          pointerEvents="none"
          style={nativeHighlightStyle}
        >
          {/* Inner Neumorphic Sunken Depth Gradient (Simulates inset box-shadow on Android!) */}
          <LinearGradient
            pointerEvents="none"
            colors={nativeThemeStyles.gradient}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={gradientOverlayStyle}
          />
        </Animated.View>

        {/* Equal 50% / 50% Label Columns */}
        <View style={nativeLabelRowStyle}>
          <View style={nativeCellStyles[0]}>
            <Text
              numberOfLines={1}
              style={checked ? activeLabelStyle : inactiveLabelStyle}
            >
              {labels.on}
            </Text>
          </View>

          <View style={nativeCellStyles[1]}>
            <Text
              numberOfLines={1}
              style={!checked ? offLabelStyle : inactiveLabelStyle}
            >
              {labels.off}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export const LiquidGlassToggle = React.memo(LiquidGlassToggleComponent);

export { LiquidGlassToggle as NeumorphicRadioToggle };
export { LiquidGlassToggle as GooeyToggle };

const styles = StyleSheet.create({
  outerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 10,
  },
  nativeContainer: {
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
  },
  nativeHighlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  nativeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  nativeCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeLabel: {
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});