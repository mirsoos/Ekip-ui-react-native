// --- START OF FILE LiquidGlassToggle.tsx ---

import React, { useRef, useEffect, useId, useCallback, useMemo } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Path,
  Circle,
} from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

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
  testID?: string;
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
  testID,
}: LiquidGlassToggleProps) {
  const rawId = useId();
  const uniqueId = useMemo(
    () => rawId.replace(/[^a-zA-Z0-9_-]/g, '') || 'sw',
    [rawId]
  );

  // Exact em scale factor (matching CSS font-size)
  const em = size === 'lg' ? 15 : size === 'md' ? 12 : 10;
  const scale = widthProp ? widthProp / 5 : heightProp ? heightProp / 2.875 : em;

  // ==========================================================
  // WEB: 100% Untouched Original HTML/CSS Markup
  // ==========================================================
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.outerWrapper, style]} testID={testID}>
        {label && <Text style={[styles.labelText, labelStyle as any]}>{label}</Text>}

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
          <label
            className={`switch ${disabled ? 'switch--disabled' : ''}`}
            style={{ fontSize: `${scale}px` }}
          >
            <input
              className="switch__input"
              type="checkbox"
              role="switch"
              checked={checked}
              disabled={disabled}
              onChange={(e) => {
                if (!disabled) {
                  onChange(e.target.checked);
                }
              }}
            />
            <span className="switch__base-outer" />
            <span className="switch__base-inner" />
            <svg
              className="switch__base-neon"
              viewBox="0 0 40 24"
              width="40px"
              height="24px"
            >
              <defs>
                <filter id={`switch-glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur result="coloredBlur" stdDeviation="1" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient
                  id={`switch-gradient1-${uniqueId}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#6cf873" />
                  <stop offset="100%" stopColor="#6cf8cf" />
                </linearGradient>
                <linearGradient
                  id={`switch-gradient2-${uniqueId}`}
                  x1="0.7"
                  y1="0"
                  x2="0.3"
                  y2="1"
                >
                  <stop offset="25%" stopColor="#6cf873" stopOpacity={0} />
                  <stop offset="50%" stopColor="#6cf873" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6cf8cf" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <path
                fill="none"
                filter={`url(#switch-glow-${uniqueId})`}
                stroke={`url(#switch-gradient1-${uniqueId})`}
                strokeWidth="1"
                strokeDasharray="0 104.26 0"
                strokeDashoffset="0.01"
                strokeLinecap="round"
                d="m.5,12C.5,5.649,5.649.5,12,.5h16c6.351,0,11.5,5.149,11.5,11.5s-5.149,11.5-11.5,11.5H12C5.649,23.5.5,18.351.5,12Z"
              />
            </svg>
            <span className="switch__knob-shadow" />
            <span className="switch__knob-container">
              <span className="switch__knob">
                <svg
                  className="switch__knob-neon"
                  viewBox="0 0 48 48"
                  width="48px"
                  height="48px"
                >
                  <circle
                    fill="none"
                    stroke={`url(#switch-gradient2-${uniqueId})`}
                    strokeDasharray="0 90.32 0 54.19"
                    strokeLinecap="round"
                    strokeWidth="1"
                    r="23"
                    cx="24"
                    cy="24"
                    transform="rotate(-112.5,24,24)"
                  />
                </svg>
              </span>
            </span>
            <span className="switch__led" />
            <span className="switch__text">Power</span>
          </label>
        </div>
      </View>
    );
  }

  // ==========================================================
  // NATIVE (iOS & Android): 100% True Neumorphic + Symmetrical Neon Fill
  // ==========================================================
  const totalWidth = 5.0 * scale;
  const totalHeight = 2.875 * scale;

  // Outer base: top: 0.125em, left: 0.125em, width: 4.75em, height: 2.75em, radius: 1.25em
  const outerTop = 0.125 * scale;
  const outerLeft = 0.125 * scale;
  const outerWidth = 4.75 * scale;
  const outerHeight = 2.75 * scale;
  const outerRadius = 1.25 * scale;

  // Inner cavity: top: 0.375em, left: 0.375em, width: 4.25em, height: 2.25em, radius: 1.125em
  const innerTop = 0.375 * scale;
  const innerLeft = 0.375 * scale;
  const innerWidth = 4.25 * scale;
  const innerHeight = 2.25 * scale;
  const innerRadius = 1.125 * scale;

  // Knob container: top: 0.5em, left: 0.5em, width: 4.0em, height: 2.0em, radius: 1.0em
  const knobContainerTop = 0.5 * scale;
  const knobContainerLeft = 0.5 * scale;
  const knobContainerWidth = 4.0 * scale;
  const knobContainerHeight = 2.0 * scale;
  const knobRadius = 1.0 * scale;

  const knobSize = 2.0 * scale;
  const knobTravel = 2.0 * scale;

  // LED: top: 0, left: 0, width: 0.28em, height: 0.28em
  const ledTop = 0.05 * scale;
  const ledLeft = 0.05 * scale;
  const ledSize = 0.32 * scale;

  // Native hardware driver for transforms & opacity
  const nativeAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;
  // SVG driver for animated path stroke dashoffset
  const svgAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const currentTarget = useRef(checked ? 1 : 0);

  const startAnimation = useCallback((target: number) => {
    currentTarget.current = target;
    Animated.parallel([
      Animated.timing(nativeAnim, {
        toValue: target,
        duration: 450,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
        useNativeDriver: true,
      }),
      Animated.timing(svgAnim, {
        toValue: target,
        duration: 450,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
        useNativeDriver: false,
      }),
    ]).start();
  }, [nativeAnim, svgAnim]);

  useEffect(() => {
    const target = checked ? 1 : 0;
    if (currentTarget.current !== target) {
      startAnimation(target);
    }
  }, [checked, startAnimation]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    const nextChecked = !checked;
    startAnimation(nextChecked ? 1 : 0);
    onChange(nextChecked);
  }, [checked, disabled, onChange, startAnimation]);

  // Native Driver interpolations (GPU thread)
  const translateX = useMemo(
    () =>
      nativeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, knobTravel],
      }),
    [nativeAnim, knobTravel]
  );

  const offLedOpacity = useMemo(
    () =>
      nativeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    [nativeAnim]
  );

  const onLedOpacity = useMemo(
    () =>
      nativeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    [nativeAnim]
  );

  // SVG interpolations: Path length of each half is exactly 52.13.
  // When animating from 52.13 to 0, both streams shoot out from the left and meet on the right!
  const neonDashOffset = useMemo(
    () =>
      svgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [52.13, 0],
      }),
    [svgAnim]
  );

  const knobDashOffset = useMemo(
    () =>
      svgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [45.16, 0],
      }),
    [svgAnim]
  );

  const knobNeonOpacity = useMemo(
    () =>
      svgAnim.interpolate({
        inputRange: [0, 0.05, 1],
        outputRange: [0, 1, 1],
      }),
    [svgAnim]
  );

  // Symmetrical Top & Bottom Half paths (Starting at x=0.5, y=12 and meeting at x=39.5, y=12)
  const topHalfPathD = "M 0.5 12 A 11.5 11.5 0 0 1 12 0.5 H 28 A 11.5 11.5 0 0 1 39.5 12";
  const bottomHalfPathD = "M 0.5 12 A 11.5 11.5 0 0 0 12 23.5 H 28 A 11.5 11.5 0 0 0 39.5 12";

  return (
    <View style={[styles.outerWrapper, style]} testID={testID}>
      {label && <Text style={[styles.labelText, labelStyle as any]}>{label}</Text>}

      <Pressable
        disabled={disabled}
        onPress={handlePress}
        accessibilityRole="switch"
        accessibilityState={{ checked, disabled }}
        hitSlop={8}
        style={[
          styles.nativeSwitchContainer,
          {
            width: totalWidth,
            height: totalHeight,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {/* 1. Outer Base Bevel Frame (matches .switch__base-outer 4-shadow neumorphic frame) */}
        <View
          style={[
            styles.nativeBaseOuter,
            {
              top: outerTop,
              left: outerLeft,
              width: outerWidth,
              height: outerHeight,
              borderRadius: outerRadius,
            },
          ]}
        />

        {/* 2. Inner Sunken Cavity Track (matches .switch__base-inner reverse shadow well) */}
        <View
          style={[
            styles.nativeBaseInner,
            {
              top: innerTop,
              left: innerLeft,
              width: innerWidth,
              height: innerHeight,
              borderRadius: innerRadius,
            },
          ]}
        />

        {/* 3. Base Neon Glow Track: Two Symmetrical Streams Racing Around Both Sides */}
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              ...(Platform.OS === 'ios' && {
                shadowColor: '#6cf873',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.85,
                shadowRadius: 4,
              }),
            },
          ]}
        >
          <Svg width={totalWidth} height={totalHeight} viewBox="0 0 40 24">
            <Defs>
              <SvgLinearGradient id={`neonGrad1-${uniqueId}`} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#6cf873" />
                <Stop offset="100%" stopColor="#6cf8cf" />
              </SvgLinearGradient>
            </Defs>

            {/* Ambient Diffused Glow (Top & Bottom) */}
            <AnimatedPath
              fill="none"
              stroke="#6cf873"
              strokeWidth={2.8}
              strokeOpacity={0.35}
              strokeLinecap="round"
              strokeDasharray={[52.13, 52.13]}
              strokeDashoffset={neonDashOffset}
              d={topHalfPathD}
            />
            <AnimatedPath
              fill="none"
              stroke="#6cf873"
              strokeWidth={2.8}
              strokeOpacity={0.35}
              strokeLinecap="round"
              strokeDasharray={[52.13, 52.13]}
              strokeDashoffset={neonDashOffset}
              d={bottomHalfPathD}
            />

            {/* Crisp High-Intensity Core Tube (Top & Bottom) */}
            <AnimatedPath
              fill="none"
              stroke={`url(#neonGrad1-${uniqueId})`}
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeDasharray={[52.13, 52.13]}
              strokeDashoffset={neonDashOffset}
              d={topHalfPathD}
            />
            <AnimatedPath
              fill="none"
              stroke={`url(#neonGrad1-${uniqueId})`}
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeDasharray={[52.13, 52.13]}
              strokeDashoffset={neonDashOffset}
              d={bottomHalfPathD}
            />
          </Svg>
        </View>

        {/* 4. Sliding Knob Drop Shadow (Cast into cavity) */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.nativeKnobShadow,
            {
              top: knobContainerTop,
              left: knobContainerLeft,
              width: knobSize,
              height: knobSize,
              borderRadius: knobRadius,
              transform: [{ translateX }],
            },
          ]}
        />

        {/* 5. Sliding Knob Container */}
        <View
          pointerEvents="none"
          style={[
            styles.nativeKnobContainer,
            {
              top: knobContainerTop,
              left: knobContainerLeft,
              width: knobContainerWidth,
              height: knobContainerHeight,
              borderRadius: knobRadius,
            },
          ]}
        >
          {/* 6. Realistic 3D Metallic Dome Knob */}
          <Animated.View
            style={[
              styles.nativeKnob,
              {
                width: knobSize,
                height: knobSize,
                borderRadius: knobRadius,
                transform: [{ translateX }],
              },
            ]}
          >
            {/* Base Metallic Curvature Gradient */}
            <LinearGradient
              colors={['#2c2f35', '#222428', '#16171a']}
              start={{ x: 0.2, y: 0.2 }}
              end={{ x: 0.85, y: 0.85 }}
              style={[StyleSheet.absoluteFill, { borderRadius: knobRadius }]}
            />

            {/* Specular Shiny Dome Catchlight (Matches CSS radial-gradient 47% 47% hsl(85%)) */}
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.45)',
                'rgba(255, 255, 255, 0.1)',
                'rgba(0, 0, 0, 0.25)',
              ]}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.8, y: 0.85 }}
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: knobRadius,
                  borderWidth: 0.5,
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                },
              ]}
            />

            {/* Knob Neon Arc Layer: Animated Crescent Drawing Around Rim */}
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <Svg width={knobSize} height={knobSize} viewBox="0 0 48 48">
                <Defs>
                  <SvgLinearGradient id={`knobNeonArc-${uniqueId}`} x1="0.7" y1="0" x2="0.3" y2="1">
                    <Stop offset="25%" stopColor="#6cf873" stopOpacity={0} />
                    <Stop offset="50%" stopColor="#6cf873" stopOpacity={0.75} />
                    <Stop offset="100%" stopColor="#6cf8cf" stopOpacity={0.75} />
                  </SvgLinearGradient>
                </Defs>
                <AnimatedCircle
                  fill="none"
                  stroke={`url(#knobNeonArc-${uniqueId})`}
                  strokeDasharray={[45.16, 144.51]}
                  strokeDashoffset={knobDashOffset}
                  strokeLinecap="round"
                  strokeWidth={2}
                  r={23}
                  cx={24}
                  cy={24}
                  transform="rotate(-112.5,24,24)"
                  opacity={knobNeonOpacity}
                />
              </Svg>
            </View>
          </Animated.View>
        </View>

        {/* 7. Corner LED Status Indicator */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.nativeLed,
            {
              top: ledTop,
              left: ledLeft,
              width: ledSize,
              height: ledSize,
              borderRadius: ledSize / 2,
              opacity: offLedOpacity,
              backgroundColor: '#f8726c',
              ...(Platform.OS === 'ios'
                ? {
                    shadowColor: '#f8726c',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.95,
                    shadowRadius: 3,
                  }
                : { elevation: 3 }),
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.nativeLed,
            {
              top: ledTop,
              left: ledLeft,
              width: ledSize,
              height: ledSize,
              borderRadius: ledSize / 2,
              opacity: onLedOpacity,
              backgroundColor: '#6cf873',
              ...(Platform.OS === 'ios'
                ? {
                    shadowColor: '#6cf873',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.95,
                    shadowRadius: 3.5,
                  }
                : { elevation: 3 }),
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

export const LiquidGlassToggle = React.memo(
  LiquidGlassToggleComponent,
  (prev, next) =>
    prev.checked === next.checked &&
    prev.disabled === next.disabled &&
    prev.size === next.size &&
    prev.width === next.width &&
    prev.height === next.height &&
    prev.label === next.label &&
    prev.style === next.style
);

export { LiquidGlassToggle as NeumorphicRadioToggle };
export { LiquidGlassToggle as GooeyToggle };
export default LiquidGlassToggle;

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
  nativeSwitchContainer: {
    position: 'relative',
    direction: 'ltr',
  },
  nativeBaseOuter: {
    position: 'absolute',
    backgroundColor: '#1b1d22',
    borderTopColor: '#4c505b',
    borderLeftColor: '#4c505b',
    borderBottomColor: '#090a0d',
    borderRightColor: '#090a0d',
    borderWidth: 1.2,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.65,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  nativeBaseInner: {
    position: 'absolute',
    backgroundColor: '#111215',
    borderTopColor: '#07080a',
    borderLeftColor: '#07080a',
    borderBottomColor: '#383b44',
    borderRightColor: '#383b44',
    borderWidth: 1.2,
  },
  nativeKnobContainer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  nativeKnobShadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 3, height: 1.5 },
        shadowOpacity: 0.85,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  nativeKnob: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    borderTopColor: '#4e525d',
    borderLeftColor: '#4e525d',
    borderBottomColor: '#101114',
    borderRightColor: '#101114',
    borderWidth: 1,
  },
  nativeLed: {
    position: 'absolute',
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 0.5,
  },
});
