import { StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { darkColors, lightColors } from '../../lib/theme';

export const DARK_CARD_GRADIENT_COLORS = [
  'rgba(255, 255, 255, 0.08)',
  'rgba(255, 255, 255, 0.02)',
  'transparent',
] as const;

export const LIGHT_CARD_GRADIENT_COLORS = [
  'rgba(255, 255, 255, 0.60)',
  'rgba(255, 255, 255, 0.15)',
  'transparent',
] as const;

export const CARD_GRADIENT_START = { x: 0, y: 0 };
export const CARD_GRADIENT_END = { x: 1, y: 1 };
export const GRADIENT_START = { x: 0, y: 0 };
export const GRADIENT_END = { x: 1, y: 1 };
export const PROGRESS_LTR_START = { x: 0, y: 0 };
export const PROGRESS_LTR_END = { x: 1, y: 0 };
export const PROGRESS_RTL_START = { x: 1, y: 0 };
export const PROGRESS_RTL_END = { x: 0, y: 0 };

export const PRIMARY_BUTTON_GRADIENT = ['#f472b6', '#3b82f6'] as const;
export const DANGER_BUTTON_GRADIENT = ['#ef4444', '#dc2626'] as const;
export const CHIP_GRADIENT = ['#f472b6', '#3b82f6'] as const;

export const BUTTON_ICON_LEFT_STYLE = { marginRight: 6 };
export const BUTTON_ICON_RIGHT_STYLE = { marginLeft: 6 };
export const SMALL_CHIP_ICON_STYLE = { marginRight: 5 };

export const GLASS_THEME_STYLES = {
  light: StyleSheet.create({
    buttonSecondary: {
      backgroundColor: lightColors.glassThinBg,
      borderColor: lightColors.glassBorder,
      borderWidth: 1,
    },
    buttonTextPrimary: { color: lightColors.textPrimary },
    buttonTextSecondary: { color: lightColors.textSecondary },
    chip: {
      backgroundColor: lightColors.glassThinBg,
      borderColor: lightColors.glassBorder,
      borderWidth: 1,
    },
    chipText: { color: lightColors.textSecondary },
    input: {
      backgroundColor: lightColors.glassThinBg,
      borderColor: lightColors.glassBorder,
    },
    backButton: { borderColor: lightColors.glassBorderStrong },
    closeButton: { borderColor: lightColors.glassBorderStrong },
    progress: {
      backgroundColor: lightColors.glassThinBg,
      borderColor: lightColors.glassBorder,
    },
    toggleLabel: { color: lightColors.textPrimary },
    listTitle: { color: lightColors.textPrimary },
    listSubtitle: { color: lightColors.textSecondary },
    sectionTitle: { color: lightColors.textPrimary },
    emptyIcon: {
      backgroundColor: lightColors.glassThinBg,
      borderColor: lightColors.glassBorder,
    },
    emptyTitle: { color: lightColors.textPrimary },
    emptySubtitle: { color: lightColors.textSecondary },
  }),
  dark: StyleSheet.create({
    buttonSecondary: {
      backgroundColor: darkColors.glassThinBg,
      borderColor: darkColors.glassBorder,
      borderWidth: 1,
    },
    buttonTextPrimary: { color: darkColors.textPrimary },
    buttonTextSecondary: { color: darkColors.textSecondary },
    chip: {
      backgroundColor: darkColors.glassThinBg,
      borderColor: darkColors.glassBorder,
      borderWidth: 1,
    },
    chipText: { color: darkColors.textSecondary },
    input: {
      backgroundColor: darkColors.glassThinBg,
      borderColor: darkColors.glassBorder,
    },
    backButton: { borderColor: darkColors.glassBorderStrong },
    closeButton: { borderColor: darkColors.glassBorderStrong },
    progress: {
      backgroundColor: darkColors.glassThinBg,
      borderColor: darkColors.glassBorder,
    },
    toggleLabel: { color: darkColors.textPrimary },
    listTitle: { color: darkColors.textPrimary },
    listSubtitle: { color: darkColors.textSecondary },
    sectionTitle: { color: darkColors.textPrimary },
    emptyIcon: {
      backgroundColor: darkColors.glassThinBg,
      borderColor: darkColors.glassBorder,
    },
    emptyTitle: { color: darkColors.textPrimary },
    emptySubtitle: { color: darkColors.textSecondary },
  }),
};

export const LIST_ROW_STYLES: Record<'ltr' | 'rtl', ViewStyle> = {
  ltr: { flexDirection: 'row' },
  rtl: { flexDirection: 'row-reverse' },
};

export const LIST_CHEVRON_STYLES: Record<'ltr' | 'rtl', ViewStyle> = {
  ltr: { marginLeft: 6, marginRight: 0 },
  rtl: { marginLeft: 0, marginRight: 6 },
};

export const LIST_LEADING_STYLES: Record<'ltr' | 'rtl', ViewStyle> = {
  ltr: { flex: 1, marginLeft: 12, marginRight: 0 },
  rtl: { flex: 1, marginLeft: 0, marginRight: 12 },
};

export const LIST_NO_LEADING_STYLE: ViewStyle = { flex: 1 };

export const TOGGLE_ROW_STYLE: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
};

export const TOGGLE_LABEL_STYLE: TextStyle = {
  fontSize: 15,
  fontWeight: '500',
  flex: 1,
};

export const PROGRESS_GRADIENTS = {
  accent: ['#f472b6', '#3b82f6'],
  success: ['#22c55e', '#10b981'],
  warning: ['#eab308', '#f59e0b'],
} as const;

export const BUTTON_TEXT_SIZE_STYLES: Record<'sm' | 'md' | 'lg', TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 14 },
  lg: { fontSize: 16 },
};

export const PROGRESS_DIRECTION_STYLES: Record<'ltr' | 'rtl', ViewStyle> = {
  ltr: { flexDirection: 'row' },
  rtl: { flexDirection: 'row-reverse' },
};

export const TEXT_DIRECTION_STYLES: Record<'ltr' | 'rtl', TextStyle> = {
  ltr: { textAlign: 'left' },
  rtl: { textAlign: 'right' },
};
