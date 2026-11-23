/**
 * Liquid Glass Centralized Color Tokens
 * STRICT STANDARD: Zero blur allowed anywhere in the app.
 * Rely strictly on layered RGBA tokens, borders, and native platform shadows.
 */

export const brandColors = {
  brandPink: '#f472b6',
  brandBlue: '#3b82f6',
  brandGreen: '#10b981',
  brandPurple: '#a855f7',
  brandAmber: '#f59e0b',
  brandCyan: '#06b6d4',
  brandRose: '#fb7185',
  brandIndigo: '#6366f1',
} as const;

export const palette = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
} as const;

export const darkThemeColors = {
  isDark: true,
  // Canvases
  bgCanvas: '#04060c',
  bgCanvasGrad: ['#04060c', '#080a14', '#080e1a', '#060a12'] as [string, string, ...string[]],
  // Surfaces & Glass (Layered RGBA, NO BLUR)
  glassBg: 'rgba(13, 16, 26, 0.94)',
  glassHeaderBg: 'rgba(13, 16, 26, 0.94)',
  glassCardBg: 'rgba(255, 255, 255, 0.06)',
  glassCardHoverBg: 'rgba(255, 255, 255, 0.09)',
  glassThickBg: 'rgba(11, 14, 23, 0.96)',
  glassThinBg: 'rgba(255, 255, 255, 0.06)',
  glassModalBg: 'rgba(13, 16, 26, 0.97)',
  glassInputBg: 'rgba(255, 255, 255, 0.05)',
  glassPillBg: 'rgba(255, 255, 255, 0.08)',
  // Borders
  glassBorderSubtle: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.20)',
  glassBorderActive: 'rgba(244, 114, 182, 0.40)',
  // Typography
  textPrimary: '#ffffff',
  textSecondary: '#a0aec0',
  textTertiary: '#737d8e',
  textMuted: '#64748b',
  textInverse: '#0f172a',
  // Brand tokens
  brandPink: brandColors.brandPink,
  brandBlue: brandColors.brandBlue,
  brandGreen: brandColors.brandGreen,
  brandPurple: brandColors.brandPurple,
  brandAmber: brandColors.brandAmber,
  brandCyan: brandColors.brandCyan,
  brandRose: brandColors.brandRose,
  brandIndigo: brandColors.brandIndigo,
  white: palette.white,
  black: palette.black,
  transparent: palette.transparent,
  // Accents & Semantic
  accent: brandColors.brandPink,
  accentPink: brandColors.brandPink,
  accentBlue: '#60a5fa',
  accentGreen: '#34d399',
  accentAmber: '#fbbf24',
  accentPurple: '#c084fc',
  danger: '#f87171',
  warning: '#fbbf24',
  success: '#34d399',
  info: '#60a5fa',
  // UI Utilities
  divider: 'rgba(255, 255, 255, 0.10)',
  cardShadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.70)',
} as const;

export const lightThemeColors = {
  isDark: false,
  // Canvases
  bgCanvas: '#ebf0fa',
  bgCanvasGrad: ['#ebf0fa', '#dbeafe', '#e0e7ff', '#dbeafe'] as [string, string, ...string[]],
  // Surfaces & Glass
  glassBg: 'rgba(255, 255, 255, 0.92)',
  glassHeaderBg: 'rgba(255, 255, 255, 0.92)',
  glassCardBg: 'rgba(255, 255, 255, 0.92)',
  glassCardHoverBg: 'rgba(255, 255, 255, 0.98)',
  glassThickBg: 'rgba(255, 255, 255, 0.96)',
  glassThinBg: 'rgba(255, 255, 255, 0.50)',
  glassModalBg: 'rgba(255, 255, 255, 0.98)',
  glassInputBg: 'rgba(255, 255, 255, 0.80)',
  glassPillBg: 'rgba(255, 255, 255, 0.75)',
  // Borders
  glassBorderSubtle: 'rgba(15, 23, 42, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.60)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.90)',
  glassBorderActive: 'rgba(244, 114, 182, 0.50)',
  // Typography
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textTertiary: '#64748b',
  textMuted: '#94a3b8',
  textInverse: '#ffffff',
  // Brand tokens
  brandPink: brandColors.brandPink,
  brandBlue: brandColors.brandBlue,
  brandGreen: brandColors.brandGreen,
  brandPurple: brandColors.brandPurple,
  brandAmber: brandColors.brandAmber,
  brandCyan: brandColors.brandCyan,
  brandRose: brandColors.brandRose,
  brandIndigo: brandColors.brandIndigo,
  white: palette.white,
  black: palette.black,
  transparent: palette.transparent,
  // Accents & Semantic
  accent: brandColors.brandPink,
  accentPink: brandColors.brandPink,
  accentBlue: brandColors.brandBlue,
  accentGreen: brandColors.brandGreen,
  accentAmber: brandColors.brandAmber,
  accentPurple: brandColors.brandPurple,
  danger: '#ef4444',
  warning: '#eab308',
  success: '#10b981',
  info: '#3b82f6',
  // UI Utilities
  divider: 'rgba(15, 23, 42, 0.08)',
  cardShadow: 'rgba(15, 23, 42, 0.12)',
  overlay: 'rgba(15, 23, 42, 0.45)',
} as const;

export interface ThemeColorsType {
  readonly isDark: boolean;
  readonly bgCanvas: string;
  readonly bgCanvasGrad: readonly [string, string, ...string[]];
  readonly glassBg: string;
  readonly glassHeaderBg: string;
  readonly glassCardBg: string;
  readonly glassCardHoverBg: string;
  readonly glassThickBg: string;
  readonly glassThinBg: string;
  readonly glassModalBg: string;
  readonly glassInputBg: string;
  readonly glassPillBg: string;
  readonly glassBorderSubtle: string;
  readonly glassBorder: string;
  readonly glassBorderStrong: string;
  readonly glassBorderActive: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textTertiary: string;
  readonly textMuted: string;
  readonly textInverse: string;
  readonly brandPink: string;
  readonly brandBlue: string;
  readonly brandGreen: string;
  readonly brandPurple: string;
  readonly brandAmber: string;
  readonly brandCyan: string;
  readonly brandRose: string;
  readonly brandIndigo: string;
  readonly white: string;
  readonly black: string;
  readonly transparent: string;
  readonly accent: string;
  readonly accentPink: string;
  readonly accentBlue: string;
  readonly accentGreen: string;
  readonly accentAmber: string;
  readonly accentPurple: string;
  readonly danger: string;
  readonly warning: string;
  readonly success: string;
  readonly info: string;
  readonly divider: string;
  readonly cardShadow: string;
  readonly overlay: string;
}

export const colors = {
  brand: brandColors,
  palette,
  dark: darkThemeColors,
  light: lightThemeColors,
} as const;
