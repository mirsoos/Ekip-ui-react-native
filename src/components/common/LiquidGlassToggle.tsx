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

  const bg = isDark ? '#141824' : '#eef3f7';
  const border = isDark ? '1px solid rgba(255, 255, 255, 0.08)' : 'none';
  const boxShadow = isDark
    ? '-1.5px -1.5px 4px rgba(255, 255, 255, 0.05), 2px 2px 5px rgba(0, 0, 0, 0.6)'
    : size === 'lg'
    ? '-4px -3px 9px 2px #ffffff, 5px 5px 8px 1px #d0d8e3'
    : '-2px -2px 5px 1px #ffffff, 2.5px 2.5px 5px 1px #d0d8e3';

  const highlightBg = isDark ? '#1d2333' : '#eef3f7';
  const highlightBorder = isDark ? '1px solid rgba(255, 255, 255, 0.09)' : 'none';
  const highlightBoxShadow = isDark
    ? 'inset -1.5px -1.5px 3px rgba(255, 255, 255, 0.07), inset 1.5px 1.5px 3px rgba(0, 0, 0, 0.5)'
    : size === 'lg'
    ? 'inset -4px -4px 8px 3px #ffffff, inset -2px 4px 6px 4px #d0d8e3'
    : 'inset -2px -2px 4px 1px #ffffff, inset -1px 2px 4px 1.5px #d0d8e3';

  const inactiveTextColor = isDark ? '#64748b' : '#acb2c0';

  // Exact measured width on Native so the 50% pill slides pixel-perfectly!
  const [trackWidth, setTrackWidth] = useState(minWidth);
  const animProgress = useRef(new Animated.Value(checked ? 0 : 1)).current;

  useEffect(() => {
    if (Platform.OS === 'web') return;
    Animated.timing(animProgress, {
      toValue: checked ? 0 : 1,
      duration: 240,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [checked]);

  const handlePress = React.useCallback(() => {
    if (disabled) return;
    onChange(!checked);
  }, [checked, disabled, onChange]);

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
  const halfWidth = trackWidth / 2;
  const highlightTranslate = animProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, halfWidth],
  });

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - trackWidth) > 0.5) {
      setTrackWidth(w);
    }
  };

  return (
    <View style={[styles.outerWrapper, style]}>
      {label && <Text style={[styles.labelText, labelStyle]}>{label}</Text>}

      <TouchableOpacity
        activeOpacity={0.9}
        disabled={disabled}
        delayPressIn={0}
        onPress={handlePress}
        onLayout={handleTrackLayout}
        style={[
          styles.nativeContainer,
          {
            minWidth,
            backgroundColor: bg,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.09)' : '#d0d8e3',
            borderWidth: 1,
            borderRadius,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {/* Sliding 50% Sunken Neumorphic Highlight Pill */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.nativeHighlight,
            {
              width: halfWidth,
              borderRadius,
              backgroundColor: highlightBg,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : '#ffffff',
              transform: [{ translateX: highlightTranslate }],
            },
          ]}
        >
          {/* Inner Neumorphic Sunken Depth Gradient (Simulates inset box-shadow on Android!) */}
          <LinearGradient
            pointerEvents="none"
            colors={
              isDark
                ? ['rgba(0, 0, 0, 0.45)', 'transparent', 'rgba(255, 255, 255, 0.06)']
                : ['rgba(208, 216, 227, 0.65)', 'rgba(238, 243, 247, 0.2)', 'rgba(255, 255, 255, 0.9)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius }]}
          />
        </Animated.View>

        {/* Equal 50% / 50% Label Columns */}
        <View style={styles.nativeLabelRow}>
          <View
            style={[
              styles.nativeCell,
              {
                paddingVertical: verticalPadding + 1,
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.nativeLabel,
                { fontSize },
                checked
                  ? [
                      styles.nativeOnText,
                      {
                        textShadowColor: isDark
                          ? 'rgba(71, 207, 115, 0.85)'
                          : 'rgba(71, 207, 115, 0.55)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 8,
                      },
                    ]
                  : { color: inactiveTextColor },
              ]}
            >
              {labels.on}
            </Text>
          </View>

          <View
            style={[
              styles.nativeCell,
              {
                paddingVertical: verticalPadding + 1,
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.nativeLabel,
                { fontSize },
                !checked
                  ? [
                      styles.nativeOffText,
                      {
                        textShadowColor: isDark
                          ? 'rgba(255, 60, 65, 0.85)'
                          : 'rgba(255, 60, 65, 0.55)',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 8,
                      },
                    ]
                  : { color: inactiveTextColor },
              ]}
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
    direction: 'ltr',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nativeHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderWidth: 1,
    overflow: 'hidden',
  },
  nativeLabelRow: {
    flexDirection: 'row',
    direction: 'ltr',
    alignItems: 'center',
    width: '100%',
    zIndex: 2,
  },
  nativeCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeLabel: {
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  nativeOnText: {
    color: '#47cf73',
  },
  nativeOffText: {
    color: '#ff3c41',
  },
});