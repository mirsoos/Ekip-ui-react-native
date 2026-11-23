import { useEffect, useState, useCallback } from 'react';
import { Animated, Easing, Platform } from 'react-native';

export const USE_NATIVE_DRIVER = Platform.OS !== 'web';

export const animationDurations = {
  sceneEntrance: 540,
  headerEntrance: 520,
  bottomNavEntrance: 320,
  pillSpring: 300,
  cardHover: 200,
  toastFade: 240,
  modalEntrance: 340,
  pressFeedback: 120,
} as const;

export const animationEasings = {
  /** Apple-grade cubic deceleration curve */
  smoothDecelerate: Easing.bezier(0.16, 1, 0.3, 1),
  /** Standard luxury entrance */
  standardEntrance: Easing.bezier(0.25, 0.1, 0.25, 1),
  /** Sharp acceleration for dismissals */
  sharpDismiss: Easing.bezier(0.4, 0, 1, 1),
  /** Smooth ease out */
  easeOut: Easing.out(Easing.ease),
} as const;

export const springConfigs = {
  bouncy: {
    tension: 180,
    friction: 12,
    useNativeDriver: USE_NATIVE_DRIVER,
  },
  gentle: {
    tension: 120,
    friction: 14,
    useNativeDriver: USE_NATIVE_DRIVER,
  },
  stiff: {
    tension: 240,
    friction: 20,
    useNativeDriver: USE_NATIVE_DRIVER,
  },
} as const;

export interface UseEntranceAnimationOptions {
  delay?: number;
  duration?: number;
  initialY?: number;
}

/**
 * Standard GPU-accelerated entrance animation hook.
 * Follows React 19 safety standard (no ref access during render).
 */
export function useEntranceAnimation({
  delay = 0,
  duration = animationDurations.sceneEntrance,
  initialY = 48,
}: UseEntranceAnimationOptions = {}) {
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    anim.setValue(0);
    const timing = Animated.timing(anim, {
      toValue: 1,
      duration,
      delay,
      easing: animationEasings.smoothDecelerate,
      useNativeDriver: USE_NATIVE_DRIVER,
    });
    timing.start();
    return () => timing.stop();
  }, [anim, duration, delay]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [initialY, 0],
  });

  return {
    anim,
    opacity: anim,
    translateY,
    animatedStyle: {
      opacity: anim,
      transform: [{ translateY }],
    },
  };
}

/**
 * Standard GPU-accelerated header entrance animation hook (3-Tier Entrance Law).
 * Drops down from above (translateY: -50 -> 0, opacity: 0 -> 1).
 */
export function useHeaderEntranceAnimation({
  delay = 0,
  duration = animationDurations.headerEntrance,
  initialY = -50,
}: UseEntranceAnimationOptions = {}) {
  return useEntranceAnimation({ delay, duration, initialY });
}

/**
 * Standard tactile press feedback animation hook.
 */
export function usePressAnimation(pressedScale = 0.96) {
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const onPressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: pressedScale,
      ...springConfigs.stiff,
    }).start();
  }, [scaleAnim, pressedScale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      ...springConfigs.bouncy,
    }).start();
  }, [scaleAnim]);

  return {
    scaleAnim,
    onPressIn,
    onPressOut,
    animatedStyle: {
      transform: [{ scale: scaleAnim }],
    },
  };
}
