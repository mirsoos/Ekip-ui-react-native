import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HEADER_BAR_HEIGHT = 54;
export const MULTI_ROW_HEADER_HEIGHT = 126;
export const CONTENT_TOP_GAP = 16;
export const BOTTOM_NAV_CLEARANCE = 100;

export const LAYOUT_CONSTANTS = {
  headerBarHeight: HEADER_BAR_HEIGHT,
  multiRowHeaderHeight: MULTI_ROW_HEADER_HEIGHT,
  contentTopGap: CONTENT_TOP_GAP,
  bottomNavClearance: BOTTOM_NAV_CLEARANCE,
  screenPaddingHorizontal: 16,
} as const;

/**
 * Standardized top inset calculation across Web, iOS, and Android.
 */
export function getHeaderTopInset(insetsTop: number): number {
  return Platform.OS === 'web' ? 12 : Math.max(12, insetsTop + 6);
}

/**
 * Calculates standardized content paddingTop below a header so content
 * never overlaps or clips behind headers on mobile or web.
 */
export function getContentTopInset(
  insetsTop: number,
  variant: 'single' | 'multi' = 'single',
  customHeaderHeight?: number
): number {
  if (customHeaderHeight !== undefined) {
    const topInset = getHeaderTopInset(insetsTop);
    return topInset + customHeaderHeight + CONTENT_TOP_GAP;
  }

  if (variant === 'multi') {
    // Multi-row header card (Discover, Activity, ChatList):
    // Header card is ~126px on web, ~134px on mobile (Persian fonts & line-heights).
    // On web: 156px ensures clean 20px clearance below 136px header bottom.
    // On mobile: insetsTop + 156px guarantees header card (insetsTop + 138px) never covers content.
    return Platform.OS === 'web' ? 156 : insetsTop + 156;
  }

  // Single-row pill header (Settings, PersonalInfo, Notifications, Plans, AI, etc.):
  // Pill is 54px tall.
  // On web: 86px ensures clean 20px clearance below 66px pill bottom.
  // On mobile: insetsTop + 86px ensures clean 26px clearance below insetsTop + 60px pill bottom.
  return Platform.OS === 'web' ? 86 : insetsTop + 86;
}

/**
 * React hook returning the standardized content paddingTop below headers.
 * - 'single': for 54px pill headers (Settings, Create, Chat Conversation, AI, Notifications, etc.)
 * - 'multi': for multi-row cards (Discover, Activity, Chat List)
 */
export function useContentTopInset(
  variant: 'single' | 'multi' = 'single',
  customHeaderHeight?: number
): number {
  const insets = useSafeAreaInsets();
  return getContentTopInset(insets.top, variant, customHeaderHeight);
}
