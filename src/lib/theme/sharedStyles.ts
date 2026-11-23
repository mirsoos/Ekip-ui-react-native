import { StyleSheet, ViewStyle } from 'react-native';
import { radii, spacing } from './spacing';
import { darkThemeColors } from './colors';

/**
 * Standard Liquid Glass Shared Styles
 * Eliminates 99% repeated layout & container boilerplate across screens.
 */
export const sharedStyles = StyleSheet.create({
  /** Fullscreen base container - transparent to allow AuroraBackground to shine through */
  screenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  /** Standard screen content container with horizontal padding and BottomNav clearance */
  screenContent: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.bottomNavClearance,
  },
  /** Standard scroll container padding */
  screenScrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.bottomNavClearance,
  },
  /** Standard Liquid Glass card with layered RGBA, subtle border and rounded corners */
  glassCard: {
    backgroundColor: darkThemeColors.glassCardBg,
    borderColor: darkThemeColors.glassBorder,
    borderWidth: 1,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  /** Interactive glass card with strong border */
  glassCardInteractive: {
    backgroundColor: darkThemeColors.glassCardBg,
    borderColor: darkThemeColors.glassBorderStrong,
    borderWidth: 1,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  /** Standard Liquid Glass pill */
  glassPill: {
    backgroundColor: darkThemeColors.glassPillBg,
    borderColor: darkThemeColors.glassBorder,
    borderWidth: 1,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Standard glass modal or bottom sheet surface */
  glassModalCard: {
    backgroundColor: darkThemeColors.glassModalBg,
    borderColor: darkThemeColors.glassBorderStrong,
    borderWidth: 1,
    borderRadius: radii.xxl,
    overflow: 'hidden',
  },
  /** Full horizontal divider */
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: darkThemeColors.divider,
  },
  /** Vertical separator */
  dividerVertical: {
    width: 1,
    height: '100%',
    backgroundColor: darkThemeColors.divider,
  },
  /** Row flex layout with vertical centering */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  /** Row flex with space-between */
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  /** Centered row */
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Perfectly centered flex item */
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Standard flex: 1 */
  flex1: {
    flex: 1,
  },
});

/** Standard native platform elevation shadows */
export const shadows: Record<'sm' | 'md' | 'lg', ViewStyle> = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};
