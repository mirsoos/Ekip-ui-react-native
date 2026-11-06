// --- START OF FILE HorizonThemeToggle.tsx ---

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path, Line, G } from 'react-native-svg';

export interface HorizonThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const SUN_YELLOW = '#fbbf24'; // زرد خورشیدی
const MOON_WHITE = '#ffffff'; // سفید مهتابی

/**
 * دکمه تعویض تم خورشید و ماه (Horizon Theme Toggle)
 * - حالت خورشید (Light): زرد خورشیدی، خورشید کامل و پرتوهای تابان
 * - حالت ماه/افق (Dark): سفید، بازتاب موج‌های آب و خط افق گسترده
 */
export const HorizonThemeToggle = React.memo(function HorizonThemeToggle({
  isDark,
  onToggle,
  size = 36,
  style,
}: HorizonThemeToggleProps) {
  // پیاده‌سازی ۱۰۰٪ نیتیو HTML/CSS با انیمیشن‌های دقیق کاربر برای Web
  if (Platform.OS === 'web') {
    const currentColor = isDark ? MOON_WHITE : SUN_YELLOW;
    const inputId = 'horizon-theme-toggle';

    return (
      <div
        className="theme-toggle-btn"
        style={
          {
            '--toggleSize': `${size}px`,
            width: size,
            height: size,
            display: 'inline-grid',
            placeContent: 'center',
            position: 'relative',
            cursor: 'pointer',
            userSelect: 'none',
          } as React.CSSProperties
        }
      >
        <input
          type="checkbox"
          id={inputId}
          checked={isDark}
          onChange={onToggle}
          aria-label="Theme Toggle"
          style={
            {
              width: size,
              height: size,
              opacity: 0.00000001,
              position: 'absolute',
              cursor: 'pointer',
              zIndex: 2,
              margin: 0,
            } as React.CSSProperties
          }
        />
        <label
          htmlFor={inputId}
          style={{
            cursor: 'pointer',
            display: 'grid',
            placeContent: 'center',
            width: size,
            height: size,
          }}
        >
          <span
            style={{
              position: 'absolute',
              fontSize: '0.0000001px',
              opacity: 0.00000001,
            }}
          >
            Theme Toggle
          </span>
          <svg
            className="sun"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 118.4 118.4"
            width={size}
            height={size}
            style={{ overflow: 'visible' }}
          >
            <style type="text/css">{`
              .sun {
                --color: ${currentColor};
                --strokeWidth: 5;
                --strokeCap: round;
                --strokeMiter: 10;
                transition: filter 0.3s ease;
              }
              .theme-toggle-btn:hover .sun,
              .theme-toggle-btn:focus-within .sun {
                filter: drop-shadow(0 0 6px ${currentColor}80);
              }
              .sun line {
                fill: none;
                stroke-width: var(--strokeWidth);
                stroke-linecap: var(--strokeCap);
                stroke-miterlimit: var(--strokeMiter);
                stroke: var(--color);
                transition: stroke 0.5s ease, opacity 0.5s ease, transform 0.5s ease;
              }
              .sun-top {
                fill: var(--color);
                transition: fill 0.5s ease;
              }
              .sun-bottom {
                fill: var(--color);
                transition: fill 0.5s ease, opacity 0.5s ease;
                transition-delay: 0.3s;
              }
              .reflection {
                opacity: 0;
                transform: translateY(-5px);
                transition: stroke 0.5s ease, opacity 0.5s ease, transform 0.5s ease;
                transition-delay: 0.4s;
              }
              #${inputId}:checked + label .sun-bottom {
                opacity: 0;
              }
              #${inputId}:checked + label .reflection {
                opacity: 1;
                transform: translateY(0);
              }
              #${inputId}:checked + label .extend {
                transform: scaleX(5) translateX(1.5px);
              }
              #${inputId}:checked + label .ray:not(.extend) {
                opacity: 0;
              }
              .ray:nth-child(1) { transition-delay: 0.05s; }
              .ray:nth-child(2) { transition-delay: 0.1s; }
              .ray:nth-child(3) { transition-delay: 0.15s; }
              .ray:nth-child(4) { transition-delay: 0.2s; }
              .ray:nth-child(5) { transition-delay: 0.25s; }
              .ray:nth-child(6) { transition-delay: 0.3s; }
            `}</style>
            <g>
              <line className="ray" x1="59.2" y1="2" x2="59.2" y2="19.4" />
              <line className="ray" x1="99.6" y1="18.8" x2="87.3" y2="31.1" />
              <line className="ray" x1="116.4" y1="59.2" x2="99" y2="59.2" />
              <line className="ray" x1="99.6" y1="99.6" x2="87.3" y2="87.3" />
              <line className="ray" x1="59.2" y1="99" x2="59.2" y2="116.4" />
              <line className="ray" x1="31.1" y1="87.3" x2="18.8" y2="99.6" />
              <line className="ray" x1="31.1" y1="31.1" x2="18.8" y2="18.8" />
              <path
                className="sun-top"
                d="M59.2,26.7c-18,0-32.5,14.6-32.5,32.5h65.1C91.7,41.2,77.2,26.7,59.2,26.7z"
              />
              <path
                className="sun-bottom"
                d="M59.2,91.7c18,0,32.5-14.6,32.5-32.5v0H26.7v0C26.7,77.2,41.2,91.7,59.2,91.7z"
              />
              <line className="ray extend" x1="19.2" y1="59.2" x2="2" y2="59.2" />
              <line className="reflection" x1="87.7" y1="67.5" x2="30.7" y2="67.5" />
              <line className="reflection" x1="34.5" y1="75.7" x2="83.6" y2="75.7" />
              <line className="reflection" x1="76" y1="83.7" x2="43.1" y2="83.7" />
            </g>
          </svg>
        </label>
      </div>
    );
  }

  // پیاده‌سازی روان ۶۰ فریم Native با Animated برای iOS و Android
  return (
    <NativeHorizonThemeToggle
      isDark={isDark}
      onToggle={onToggle}
      size={size}
      style={style}
    />
  );
});

function NativeHorizonThemeToggle({
  isDark,
  onToggle,
  size,
  style,
}: {
  isDark: boolean;
  onToggle: () => void;
  size: number;
  style?: StyleProp<ViewStyle>;
}) {
  // 0 = Sun (Light Mode), 1 = Moon (Dark Mode)
  const [anim] = useState(() => new Animated.Value(isDark ? 1 : 0));
  const lastPressRef = useRef(0);

  const handlePress = useCallback(() => {
    const now = Date.now();
    if (now - lastPressRef.current < 450) {
      return;
    }
    lastPressRef.current = now;
    onToggle();
  }, [onToggle]);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isDark ? 1 : 0,
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [isDark, anim]);

  // لایه خورشید (Light Mode) - پرتوها و دیسک طلایی
  const sunOpacity = anim.interpolate({
    inputRange: [0, 0.65, 1],
    outputRange: [1, 0.15, 0],
  });
  const sunScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  // لایه ماه و افق (Dark Mode) - هلال ماه، خط افق و امواج آب سفید
  const moonOpacity = anim.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 0.15, 1],
  });
  const moonTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-4, 0],
  });
  const moonScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[{ width: size, height: size, position: 'relative' }, style]}
    >
      {/* لایه خورشید (حالت روز - زرد طلایی) */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: sunOpacity,
            transform: [{ scale: sunScale }],
          },
        ]}
      >
        <Svg viewBox="0 0 118.4 118.4" width={size} height={size}>
          <G>
            {/* ۷ پرتو تابان خورشید */}
            <Line x1="59.2" y1="2" x2="59.2" y2="19.4" stroke={SUN_YELLOW} strokeWidth={5} strokeLinecap="round" />
            <Line x1="99.6" y1="18.8" x2="87.3" y2="31.1" stroke={SUN_YELLOW} strokeWidth={5} strokeLinecap="round" />
            <Line x1="116.4" y1="59.2" x2="99" y2="59.2" stroke={SUN_YELLOW} strokeWidth={5} strokeLinecap="round" />
            <Line x1="99.6" y1="99.6" x2="87.3" y2="87.3" stroke={SUN_YELLOW} strokeWidth={5} strokeLinecap="round" />
            <Line x1="59.2" y1="99" x2="59.2" y2="116.4" stroke={SUN_YELLOW} strokeWidth={5} strokeLinecap="round" />
            <Line x1="31.1" y1="87.3" x2="18.8" y2="99.6" stroke={SUN_YELLOW} strokeWidth={5} strokeLinecap="round" />
            <Line x1="31.1" y1="31.1" x2="18.8" y2="18.8" stroke={SUN_YELLOW} strokeWidth={5} strokeLinecap="round" />

            {/* پرتو افقی سمت چپ */}
            <Line x1="19.2" y1="59.2" x2="2" y2="59.2" stroke={SUN_YELLOW} strokeWidth={5} strokeLinecap="round" />

            {/* نیمه فوقانی خورشید */}
            <Path
              d="M59.2,26.7c-18,0-32.5,14.6-32.5,32.5h65.1C91.7,41.2,77.2,26.7,59.2,26.7z"
              fill={SUN_YELLOW}
            />

            {/* نیمه تحتانی خورشید */}
            <Path
              d="M59.2,91.7c18,0,32.5-14.6,32.5-32.5v0H26.7v0C26.7,77.2,41.2,91.7,59.2,91.7z"
              fill={SUN_YELLOW}
            />
          </G>
        </Svg>
      </Animated.View>

      {/* لایه ماه و افق (حالت شب - سفید مهتابی) */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: moonOpacity,
            transform: [{ translateY: moonTranslateY }, { scale: moonScale }],
          },
        ]}
      >
        <Svg viewBox="0 0 118.4 118.4" width={size} height={size}>
          <G>
            {/* گنبد ماه شب */}
            <Path
              d="M59.2,26.7c-18,0-32.5,14.6-32.5,32.5h65.1C91.7,41.2,77.2,26.7,59.2,26.7z"
              fill={MOON_WHITE}
            />

            {/* خط ممتد و گسترده افق */}
            <Line
              x1="2"
              y1="59.2"
              x2="116.4"
              y2="59.2"
              stroke={MOON_WHITE}
              strokeWidth={5}
              strokeLinecap="round"
            />

            {/* ۳ خط موج و بازتاب روی آب */}
            <Line
              x1="87.7"
              y1="67.5"
              x2="30.7"
              y2="67.5"
              stroke={MOON_WHITE}
              strokeWidth={5}
              strokeLinecap="round"
            />
            <Line
              x1="34.5"
              y1="75.7"
              x2="83.6"
              y2="75.7"
              stroke={MOON_WHITE}
              strokeWidth={5}
              strokeLinecap="round"
            />
            <Line
              x1="76"
              y1="83.7"
              x2="43.1"
              y2="83.7"
              stroke={MOON_WHITE}
              strokeWidth={5}
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  );
}
