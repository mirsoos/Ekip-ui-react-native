import { Platform } from 'react-native';

export const HEADER_METRICS = {
  // Margin from screen edges to floating header container
  marginHorizontal: 12,
  // Horizontal padding inside the pill / card
  paddingHorizontal: 8,
  // Vertical padding inside standard pill
  paddingVertical: 7,
  // Standard single-row floating pill height: 7 (top) + 38 (button) + 7 (bottom) + 2 (borders) = 54px
  pillHeight: 54,
  // Standard action button diameter
  actionButtonSize: 38,
  // Exact horizontal coordinate from screen edge to button edge:
  // 12 (margin) + 1 (border) + 8 (padding) = 21px
  buttonOffset: 21,
  // Exact vertical offset from topInset to top edge of 38px button:
  // 1 (border) + 7 (paddingTop) = 8px
  buttonTopOffset: 8,
} as const;

/**
 * Standardized top inset calculation across Web, iOS, and Android.
 * Always anchors to safe-area inset top consistently with a stable fallback.
 */
export function getHeaderTopInset(insetsTop: number): number {
  return Platform.OS === 'web' ? 12 : Math.max(12, insetsTop + 6);
}

/**
 * Standardized paddingTop for screen scrollable content under a single-row pill header
 * (e.g. Settings, PersonalInfo, Create, AI, Notifications, etc.)
 */
export function getSinglePillContentPaddingTop(insetsTop: number): number {
  const topInset = getHeaderTopInset(insetsTop);
  return topInset + HEADER_METRICS.pillHeight + 14;
}

/**
 * Standardized paddingTop for screen scrollable content under multi-row headers
 * (e.g. Discover, Activity, ChatList)
 */
export function getMultiRowContentPaddingTop(insetsTop: number, headerCardHeight: number): number {
  const topInset = getHeaderTopInset(insetsTop);
  return topInset + headerCardHeight + 14;
}
