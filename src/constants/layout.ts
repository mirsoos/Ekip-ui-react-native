import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HEADER_BAR_HEIGHT = 56;
export const MULTI_ROW_HEADER_HEIGHT = 128;
export const ACTIVITY_HEADER_HEIGHT = 128;
export const CONTENT_TOP_GAP = 20;
export const BOTTOM_NAV_CLEARANCE = 100;

export const LAYOUT_CONSTANTS = {
  headerBarHeight: HEADER_BAR_HEIGHT,
  multiRowHeaderHeight: MULTI_ROW_HEADER_HEIGHT,
  activityHeaderHeight: ACTIVITY_HEADER_HEIGHT,
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
 * maintains an EXACT, uniform 20px gap below ANY floating header card across all screens.
 */
export function getContentTopInset(
  insetsTop: number,
  variant: 'single' | 'multi' | 'activity' = 'single',
  customHeaderHeight?: number
): number {
  const topInset = getHeaderTopInset(insetsTop);

  if (customHeaderHeight !== undefined) {
    return topInset + customHeaderHeight + CONTENT_TOP_GAP;
  }

  if (variant === 'activity' || variant === 'multi') {
    // Standard multi-row header card (Discover, Activity, ChatList): exactly 128px
    return topInset + MULTI_ROW_HEADER_HEIGHT + CONTENT_TOP_GAP;
  }

  // Single-row pill header (Settings, PersonalInfo, Notifications, Plans, AI, etc.): 56px
  return topInset + HEADER_BAR_HEIGHT + CONTENT_TOP_GAP;
}

/**
 * React hook returning the standardized content paddingTop below headers.
 * - 'single': for 56px pill headers (Settings, Create, Chat Conversation, AI, Notifications, etc.)
 * - 'multi': for multi-row cards (Discover, Activity, Chat List)
 */
export function useContentTopInset(
  variant: 'single' | 'multi' = 'single',
  customHeaderHeight?: number
): number {
  const insets = useSafeAreaInsets();
  return getContentTopInset(insets.top, variant, customHeaderHeight);
}
