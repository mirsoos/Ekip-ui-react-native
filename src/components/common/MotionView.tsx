// --- START OF FILE MotionView.tsx ---

import React, { useEffect, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BOTTOM_NAV_CLEARANCE } from '../../constants/layout';

export interface MotionViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Bottom clearance for fixed BottomNav. Defaults to true (100px clearance). */
  includeBottomClearance?: boolean;
  /** Custom bottom clearance height in px */
  bottomClearance?: number;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Optional custom duration (ms), defaults to 380ms per project standard */
  duration?: number;
  /** Optional key that retriggers animation when changed */
  animationKey?: string | number;
}

const ENTRANCE_DURATION = 380;
const INITIAL_TRANSLATE_Y = 20;

/**
 * Universal Screen Content Motion Primitive (STRICT PROJECT STANDARD):
 * Enforces the 3-Tier Screen Architecture Law:
 * Content rises from below (translateY: 20 -> 0, opacity: 0 -> 1) over 380ms
 * with pure GPU native driver execution and 100px BottomNav clearance.
 */
export const MotionView = React.memo(function MotionView({
  children,
  style,
  includeBottomClearance = true,
  bottomClearance = BOTTOM_NAV_CLEARANCE,
  delay = 0,
  duration = ENTRANCE_DURATION,
  animationKey,
}: MotionViewProps) {
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    anim.setValue(0);
    const timing = Animated.timing(anim, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.bezier(0.16, 1, 0.3, 1), // Apple-style smooth cubic deceleration
      useNativeDriver: Platform.OS !== 'web',
    });
    timing.start();

    return () => {
      timing.stop();
    };
  }, [anim, duration, delay, animationKey]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [INITIAL_TRANSLATE_Y, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        includeBottomClearance && { paddingBottom: bottomClearance },
        style,
        {
          opacity: anim,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
