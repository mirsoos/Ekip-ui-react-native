import React, { useRef, useEffect } from 'react';
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
} from 'react-native';
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

export function LiquidGlassToggle({
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

  // Determine active theme (prop takes precedence, then context, fallback to dark)
  let isDark = true;
  try {
    const themeContext = useTheme();
    isDark = themeProp ? themeProp === 'dark' : themeContext.isDark;
  } catch {
    isDark = themeProp ? themeProp === 'dark' : true;
  }

  // Refined compact sizes tailored for list rows and mobile touch
  const fontSize = size === 'lg' ? 24 : size === 'md' ? 14 : 10.5;
  const horizontalPadding = size === 'lg' ? 20 : size === 'md' ? 13 : 9;
  const verticalPadding = size === 'lg' ? 12 : size === 'md' ? 7 : 4.5;
  const borderRadius = size === 'lg' ? 40 : size === 'md' ? 22 : 16;

  // Colors & shadows per theme
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

  // React Native Animated progress for mobile native
  const animProgress = useRef(new Animated.Value(checked ? 0 : 1)).current;
  useEffect(() => {
    Animated.timing(animProgress, {
      toValue: checked ? 0 : 1,
      duration: 380,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [checked]);

  // Web Implementation: Clean Neumorphic On/Off (No burst icons)
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
          {/* Inject Comfortaa Font & Neumorphic Styles */}
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
                min-width: ${size === 'lg' ? 140 : size === 'md' ? 84 : 64}px;
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
              {/* Sliding Sunken Neumorphic Highlight Pill */}
              <div className="radio-checked_highlight" />

              {/* Labels Container (On / Off) */}
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

  // Native iOS / Android Fallback
  const highlightTranslate = animProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, horizontalPadding * 2 + fontSize * 1.4],
  });

  return (
    <View style={[styles.outerWrapper, style]}>
      {label && <Text style={[styles.labelText, labelStyle]}>{label}</Text>}

      <TouchableOpacity
        activeOpacity={0.88}
        disabled={disabled}
        onPress={() => !disabled && onChange(!checked)}
        style={[
          styles.nativeContainer,
          {
            backgroundColor: bg,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            borderWidth: isDark ? 1 : 0,
            borderRadius,
            paddingVertical: verticalPadding,
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.nativeHighlight,
            {
              backgroundColor: highlightBg,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#ffffff',
              borderRadius,
              transform: [{ translateX: highlightTranslate }],
            },
          ]}
        />
        <View style={styles.nativeLabelRow}>
          <Text
            style={[
              styles.nativeLabel,
              { fontSize },
              checked ? styles.nativeOnText : { color: inactiveTextColor },
            ]}
          >
            {labels.on}
          </Text>
          <Text
            style={[
              styles.nativeLabel,
              { fontSize },
              !checked ? styles.nativeOffText : { color: inactiveTextColor },
            ]}
          >
            {labels.off}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Aliases
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
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  nativeHighlight: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 2,
    width: '48%',
    borderWidth: 1,
  },
  nativeLabelRow: {
    flexDirection: 'row',
    direction: 'ltr',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nativeLabel: {
    fontWeight: '700',
    paddingHorizontal: 6,
  },
  nativeOnText: {
    color: '#47cf73',
  },
  nativeOffText: {
    color: '#ff3c41',
  },
});
