import {
  HEADER_BAR_HEIGHT,
  MULTI_ROW_HEADER_HEIGHT,
  CONTENT_TOP_GAP,
  BOTTOM_NAV_CLEARANCE,
  LAYOUT_CONSTANTS,
  getHeaderTopInset,
  getContentTopInset,
  useContentTopInset,
} from '../constants/layout';

export {
  HEADER_BAR_HEIGHT,
  MULTI_ROW_HEADER_HEIGHT,
  CONTENT_TOP_GAP,
  BOTTOM_NAV_CLEARANCE,
  LAYOUT_CONSTANTS,
  getHeaderTopInset,
  getContentTopInset,
  useContentTopInset,
};

export const HEADER_METRICS = {
  // Margin from screen edges to floating header container
  marginHorizontal: 12,
  // Horizontal padding inside the pill / card
  paddingHorizontal: 8,
  // Vertical padding inside standard pill
  paddingVertical: 6,
  // Standard single-row floating pill height: 56px (clean 6px clearance for 42px action buttons)
  pillHeight: HEADER_BAR_HEIGHT,
  // Standard multi-row card height (Discover, Activity, ChatList)
  multiRowCardHeight: MULTI_ROW_HEADER_HEIGHT,
  // Standard action button diameter (standardized 42px)
  actionButtonSize: 42,
  // Exact horizontal coordinate from screen edge to button edge:
  // 12 (margin) + 1 (border) + 8 (padding) = 21px
  buttonOffset: 21,
  // Exact vertical offset from topInset to top edge of 42px button:
  // 1 (border) + 6 (paddingTop) = 7px
  buttonTopOffset: 7,
  // Gap between bottom of header and first scrollable content item
  contentTopGap: CONTENT_TOP_GAP,
  // Bottom navigation dock clearance
  bottomNavClearance: BOTTOM_NAV_CLEARANCE,
} as const;

/**
 * Standardized paddingTop for screen scrollable content under a single-row pill header
 * (e.g. Settings, PersonalInfo, Create, AI, Notifications, etc.)
 */
export function getSinglePillContentPaddingTop(insetsTop: number): number {
  return getContentTopInset(insetsTop, 'single');
}

/**
 * Standardized paddingTop for screen scrollable content under multi-row headers
 * (e.g. Discover, Activity, ChatList)
 */
export function getMultiRowContentPaddingTop(
  insetsTop: number,
  headerCardHeight: number = MULTI_ROW_HEADER_HEIGHT
): number {
  return getContentTopInset(insetsTop, 'multi', headerCardHeight);
}
