import { TextStyle, Platform } from 'react-native';

export const FONT_FAMILIES = {
  regular: Platform.select({
    web: 'IRANSans, IranianSans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    default: 'IranianSans',
  }),
  bold: Platform.select({
    web: 'IRANSans, IranianSans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    default: 'IranianSans',
  }),
};

export const typography = {
  h1: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
  } as TextStyle,
  h2: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
  } as TextStyle,
  h3: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
  } as TextStyle,
  h4: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,
  subtitle: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,
  body: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  } as TextStyle,
  bodyBold: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  } as TextStyle,
  bodySmall: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,
  caption: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  } as TextStyle,
  captionBold: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  } as TextStyle,
  badge: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  } as TextStyle,
  button: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  } as TextStyle,
  label: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  } as TextStyle,
} as const;
