import { Easing, Platform } from 'react-native';

export const animationDurations = {
  sceneEntrance: 380,
  headerEntrance: 380,
  bottomNavEntrance: 280,
  pillSpring: 300,
  cardHover: 200,
  toastFade: 240,
} as const;

export const animationEasings = {
  /** Apple-grade cubic deceleration curve */
  smoothDecelerate: Easing.bezier(0.16, 1, 0.3, 1),
  /** Standard luxury entrance */
  standardEntrance: Easing.bezier(0.25, 0.1, 0.25, 1),
  /** Sharp acceleration for dismissals */
  sharpDismiss: Easing.bezier(0.4, 0, 1, 1),
} as const;

export const USE_NATIVE_DRIVER = Platform.OS !== 'web';
