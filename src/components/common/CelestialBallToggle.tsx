// --- START OF FILE CelestialBallToggle.tsx ---

import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Circle,
  Mask,
  G,
} from 'react-native-svg';

export interface CelestialBallToggleProps {
  isDark: boolean;
  onToggle: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Authentic Celestial Ball Theme Toggle
 * - Dark Mode (Moon): Crescent ball with subtle moon shadow / glow.
 * - Light Mode (Sun): Rotated 180deg glowing Golden Sun (#fdb813) with radiant corona aura.
 */
export function CelestialBallToggleComponent({
  isDark,
  onToggle,
  size = 38,
  style,
}: CelestialBallToggleProps) {
  // 0 = Dark (Moon), 1 = Light (Sun)
  const anim = useRef(new Animated.Value(isDark ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isDark ? 0 : 1,
      duration: 650,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isDark, anim]);

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const sunOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const moonOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const radius = size / 2;

  // Web Implementation (Untouched)
  if (Platform.OS === 'web') {
    const isSun = !isDark;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onToggle}
        style={[
          styles.touchWrap,
          {
            width: size,
            height: size,
          },
          style,
        ]}
      >
        <div
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            cursor: 'pointer',
            transition: 'all 0.65s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
            transform: isSun ? 'rotate(180deg)' : 'rotate(0deg)',
            backgroundColor: isSun ? '#fdb813' : 'transparent',
            boxShadow: isSun
              ? 'inset -12px -12px 14px rgba(255, 170, 0, 0.9), 0 0 16px #fdb813, 0 0 28px rgba(253, 184, 19, 0.65)'
              : 'inset -6px -4px 6px rgba(255, 255, 255, 0.85), 0 0 8px rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        />
      </TouchableOpacity>
    );
  }

  // فضای اضافی دور بوم SVG برای اینکه هاله نور (Glow/Box-Shadow) مثل وب بیرون از دایره پخش شود و بریده نشود
  const glowPad = Math.round(size * 0.55);
  const canvasSize = size + glowPad * 2;
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onToggle}
      style={[
        styles.touchWrap,
        {
          width: size,
          height: size,
        },
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        renderToHardwareTextureAndroid={true}
        shouldRasterizeIOS={true}
        style={{
          width: canvasSize,
          height: canvasSize,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate }],
        }}
      >
        {/* ============================================================
            ۱. لایه ماه (Dark Mode): شبیه‌سازی دقیق
            inset -6px -4px 6px rgba(255,255,255,0.85), 0 0 8px rgba(255,255,255,0.2)
           ============================================================ */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: moonOpacity },
          ]}
        >
          <Svg width={canvasSize} height={canvasSize} viewBox={`0 0 ${canvasSize} ${canvasSize}`}>
            <Defs>
              {/* هاله سفید ملایم دور ماه: 0 0 8px rgba(255,255,255,0.2) */}
              <RadialGradient id="moonOuterGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="52%" stopColor="#ffffff" stopOpacity={0.22} />
                <Stop offset="75%" stopColor="#ffffff" stopOpacity={0.07} />
                <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
              </RadialGradient>

              {/* گرادینت لبه‌ی نورانی هلال ماه */}
              <LinearGradient id="crescentRim" x1="20%" y1="20%" x2="95%" y2="85%">
                <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.08} />
                <Stop offset="55%" stopColor="#ffffff" stopOpacity={0.55} />
                <Stop offset="100%" stopColor="#ffffff" stopOpacity={0.95} />
              </LinearGradient>

              {/* ماسک برش هلال ماه دقیقاً مشابه inset -6px -4px 6px */}
              <Mask id="moonCrescentMask">
                <Circle cx={cx} cy={cy} r={radius} fill="#ffffff" />
                <Circle
                  cx={cx - size * 0.16}
                  cy={cy - size * 0.11}
                  r={radius * 0.92}
                  fill="#000000"
                />
              </Mask>
            </Defs>

            {/* هاله نور بیرونی ماه */}
            <Circle cx={cx} cy={cy} r={radius + 9} fill="url(#moonOuterGlow)" />

            {/* لایه نرم زیرین هلال برای شبیه‌سازی Blur=6px در inset shadow */}
            <G mask="url(#moonCrescentMask)">
              <Circle cx={cx} cy={cy} r={radius} fill="url(#crescentRim)" />
              <Circle
                cx={cx + size * 0.06}
                cy={cy + size * 0.04}
                r={radius}
                fill="none"
                stroke="#ffffff"
                strokeWidth={4.5}
                strokeOpacity={0.35}
              />
            </G>

            {/* حاشیه ظریف کره ماه */}
            <Circle
              cx={cx}
              cy={cy}
              r={radius - 0.5}
              fill="none"
              stroke="#ffffff"
              strokeWidth={0.8}
              strokeOpacity={0.18}
            />
          </Svg>
        </Animated.View>

        {/* ============================================================
            ۲. لایه خورشید (Light Mode): شبیه‌سازی دقیق
            #fdb813 + inset -12px -12px 14px rgba(255,170,0,0.9), 0 0 16px #fdb813, 0 0 28px
           ============================================================ */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: sunOpacity },
          ]}
        >
          <Svg width={canvasSize} height={canvasSize} viewBox={`0 0 ${canvasSize} ${canvasSize}`}>
            <Defs>
              {/* هاله طلایی بزرگ دور خورشید (Corona Aura: 0 0 16px & 0 0 28px) */}
              <RadialGradient id="sunCoronaGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="35%" stopColor="#fdb813" stopOpacity={0.95} />
                <Stop offset="52%" stopColor="#fdb813" stopOpacity={0.55} />
                <Stop offset="74%" stopColor="#fdb813" stopOpacity={0.22} />
                <Stop offset="100%" stopColor="#fdb813" stopOpacity={0} />
              </RadialGradient>

              {/* حجم سه بعدی کره خورشید (inset -12px -12px 14px rgba(255, 170, 0, 0.9)) */}
              <RadialGradient
                id="sunSphere3D"
                cx="35%"
                cy="35%"
                rx="65%"
                ry="65%"
                fx="30%"
                fy="30%"
              >
                <Stop offset="0%" stopColor="#ffd24c" stopOpacity={1} />
                <Stop offset="55%" stopColor="#fdb813" stopOpacity={1} />
                <Stop offset="100%" stopColor="#ff9900" stopOpacity={1} />
              </RadialGradient>
            </Defs>

            {/* هاله درخشان بیرونی خورشید */}
            <Circle cx={cx} cy={cy} r={radius + glowPad - 2} fill="url(#sunCoronaGlow)" />

            {/* گوی اصلی خورشید */}
            <Circle cx={cx} cy={cy} r={radius} fill="url(#sunSphere3D)" />
          </Svg>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export const CelestialBallToggle = React.memo(CelestialBallToggleComponent);

const styles = StyleSheet.create({
  touchWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});