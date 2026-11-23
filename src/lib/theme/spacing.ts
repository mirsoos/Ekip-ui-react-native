export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  // Standard layout measurements
  screenPadding: 16,
  headerBarHeight: 56,
  multiRowHeaderHeight: 128,
  contentTopGap: 20,
  bottomNavClearance: 100,
} as const;

export const radii = {
  none: 0,
  xxs: 4,
  xs: 6,
  badge: 6,
  tag: 8,
  sm: 10,
  input: 12,
  button: 12,
  md: 14,
  card: 16,
  lg: 20,
  modal: 20,
  xl: 24,
  xxl: 32,
  pill: 9999,
  full: 9999,
} as const;

export const layout = {
  screenPaddingHorizontal: 16,
  headerBarHeight: 56,
  multiRowHeaderHeight: 126,
  contentTopGap: 16,
  bottomNavClearance: 100,
} as const;

export const zIndex = {
  base: 0,
  card: 1,
  badge: 2,
  dropdown: 10,
  stickyHeader: 50,
  bottomNav: 80,
  modal: 100,
  toast: 150,
} as const;
