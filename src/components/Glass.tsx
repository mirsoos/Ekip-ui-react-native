import React, { type ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  Platform,
} from 'react-native';
import { getIcon, type IconName } from '../lib/icons';
import { darkColors, lightColors, useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { LiquidGlassToggle, type LiquidGlassToggleProps } from './common/LiquidGlassToggle';
export { LiquidGlassToggle, type LiquidGlassToggleProps };

const BUTTON_ICON_LEFT_STYLE = { marginRight: 6 };
const BUTTON_ICON_RIGHT_STYLE = { marginLeft: 6 };
const SMALL_CHIP_ICON_STYLE = { marginRight: 5 };
const SEGMENTED_ICON_STYLE = { marginRight: 5 };
const GLASS_THEME_STYLES = {
  light: {
    buttonSecondary: {
      backgroundColor: lightColors.glassThinBg,
      borderColor: lightColors.glassBorder,
      borderWidth: 1,
    },
    buttonPrimary: { backgroundColor: '#d946a0' },
    buttonDanger: { backgroundColor: '#dc2626' },
    buttonTextPrimary: { color: lightColors.textPrimary },
    buttonTextSecondary: { color: lightColors.textSecondary },
    chip: {
      backgroundColor: lightColors.glassThinBg,
      borderColor: lightColors.glassBorder,
      borderWidth: 1,
    },
    activeChip: {
      backgroundColor: '#d946a0',
      borderColor: '#d946a0',
    },
    chipText: { color: lightColors.textSecondary },
    input: {
      backgroundColor: lightColors.glassThinBg,
      borderColor: lightColors.glassBorder,
    },
    backButton: {
      backgroundColor: lightColors.glassThinBg,
      borderColor: lightColors.glassBorderStrong,
    },
    closeButton: {
      backgroundColor: lightColors.glassThinBg,
      borderColor: lightColors.glassBorderStrong,
    },
    segmented: {
      backgroundColor: lightColors.glassThinBg,
      borderColor: lightColors.glassBorder,
    },
    segmentedSelected: { backgroundColor: 'rgba(255, 255, 255, 0.65)' },
    segmentedTextActive: { color: lightColors.textPrimary, fontWeight: '700' as const },
    segmentedTextInactive: { color: lightColors.textTertiary, fontWeight: '600' as const },
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
  },
  dark: {
    buttonSecondary: {
      backgroundColor: darkColors.glassThinBg,
      borderColor: darkColors.glassBorder,
      borderWidth: 1,
    },
    buttonPrimary: { backgroundColor: '#db2777' },
    buttonDanger: { backgroundColor: '#b91c1c' },
    buttonTextPrimary: { color: darkColors.textPrimary },
    buttonTextSecondary: { color: darkColors.textSecondary },
    chip: {
      backgroundColor: darkColors.glassThinBg,
      borderColor: darkColors.glassBorder,
      borderWidth: 1,
    },
    activeChip: {
      backgroundColor: '#db2777',
      borderColor: '#db2777',
    },
    chipText: { color: darkColors.textSecondary },
    input: {
      backgroundColor: darkColors.glassThinBg,
      borderColor: darkColors.glassBorder,
    },
    backButton: {
      backgroundColor: darkColors.glassThinBg,
      borderColor: darkColors.glassBorderStrong,
    },
    closeButton: {
      backgroundColor: darkColors.glassThinBg,
      borderColor: darkColors.glassBorderStrong,
    },
    segmented: {
      backgroundColor: darkColors.glassThinBg,
      borderColor: darkColors.glassBorder,
    },
    segmentedSelected: { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
    segmentedTextActive: { color: darkColors.textPrimary, fontWeight: '700' as const },
    segmentedTextInactive: { color: darkColors.textTertiary, fontWeight: '600' as const },
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
  },
} as const;
const LIST_ROW_STYLES: Record<'ltr' | 'rtl', ViewStyle> = {
  ltr: { flexDirection: 'row' },
  rtl: { flexDirection: 'row-reverse' },
};
const LIST_CHEVRON_STYLES: Record<'ltr' | 'rtl', ViewStyle> = {
  ltr: { marginLeft: 6, marginRight: 0 },
  rtl: { marginLeft: 0, marginRight: 6 },
};
const LIST_LEADING_STYLES: Record<'ltr' | 'rtl', ViewStyle> = {
  ltr: { flex: 1, marginLeft: 12, marginRight: 0 },
  rtl: { flex: 1, marginLeft: 0, marginRight: 12 },
};
const LIST_NO_LEADING_STYLE: ViewStyle = { flex: 1 };
const TOGGLE_ROW_STYLE: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
};
const TOGGLE_LABEL_STYLE: TextStyle = {
  fontSize: 15,
  fontWeight: '500',
  flex: 1,
};
const PROGRESS_COLORS = {
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
} as const;
const BUTTON_TEXT_SIZE_STYLES: Record<'sm' | 'md' | 'lg', TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 14 },
  lg: { fontSize: 16 },
};
const PROGRESS_DIRECTION_STYLES: Record<'ltr' | 'rtl', ViewStyle> = {
  ltr: { flexDirection: 'row' },
  rtl: { flexDirection: 'row-reverse' },
};
const TEXT_DIRECTION_STYLES: Record<'ltr' | 'rtl', TextStyle> = {
  ltr: { textAlign: 'left' },
  rtl: { textAlign: 'right' },
};

// ============================================
// GLASS CARD
// ============================================
export interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'thick' | 'thin';
  glow?: boolean;
  onPress?: () => void;
  onClick?: () => void;
}

export function GlassCardComponent({
  children,
  style,
  variant = 'default',
  glow = false,
  onPress,
  onClick,
}: GlassCardProps) {
  const { colors } = useTheme();
  const handlePress = onPress ?? onClick;

  const bg =
    variant === 'thick'
      ? colors.glassThickBg
      : variant === 'thin'
      ? colors.glassThinBg
      : colors.glassBg;

  const cardStyle = React.useMemo<ViewStyle>(
    () => ({
      backgroundColor: bg,
      borderColor: colors.glassBorder,
      borderWidth: 1,
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative',
      ...(Platform.OS === 'ios'
        ? {
            shadowColor: colors.cardShadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: glow ? 0.35 : 0.18,
            shadowRadius: glow ? 16 : 8,
          }
        : Platform.OS === 'android'
        ? {
            elevation: 0,
          }
        : {
            shadowColor: colors.cardShadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: glow ? 0.35 : 0.18,
            shadowRadius: glow ? 16 : 8,
            elevation: glow ? 8 : 4,
            transform: 'translateZ(0)',
          }),
    }),
    [bg, colors.cardShadow, colors.glassBorder, glow]
  );
  const containerStyle = React.useMemo(() => [cardStyle, style], [cardStyle, style]);
  if (handlePress) {
    return (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={handlePress}
        style={containerStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

// ============================================
// GLASS BUTTON
// ============================================
export interface GlassButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function GlassButtonComponent({
  children,
  onPress,
  onClick,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  icon,
  iconRight,
  disabled,
  fullWidth,
}: GlassButtonProps) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const handlePress = onPress ?? onClick;

  const padVertical = size === 'sm' ? 8 : size === 'lg' ? 15 : 12;
  const padHorizontal = size === 'sm' ? 14 : size === 'lg' ? 24 : 18;
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  const IconComp = icon ? getIcon(icon) : null;
  const IconRightComp = iconRight ? getIcon(iconRight) : null;

  const baseStyle = React.useMemo<ViewStyle>(
    () => ({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9999,
      paddingVertical: padVertical,
      paddingHorizontal: padHorizontal,
      opacity: disabled ? 0.45 : 1,
      width: fullWidth ? '100%' : undefined,
    }),
    [disabled, fullWidth, padHorizontal, padVertical]
  );
  const primaryThemeStyle =
    variant === 'danger' ? themeStyles.buttonDanger : themeStyles.buttonPrimary;
  const fullWidthStyle = fullWidth ? styles.fullWidth : undefined;
  const secondaryStyle = React.useMemo(
    () => [baseStyle, variant === 'secondary' ? themeStyles.buttonSecondary : styles.buttonGhost, style],
    [baseStyle, style, themeStyles.buttonSecondary, variant]
  );

  const isSecondary = variant === 'secondary';
  const isPrimary = variant === 'primary' || variant === 'danger';
  return (
    <TouchableOpacity
      activeOpacity={isPrimary ? 0.85 : 0.75}
      onPress={handlePress}
      disabled={disabled}
      style={[
        isPrimary ? baseStyle : secondaryStyle,
        isPrimary && primaryThemeStyle,
        fullWidthStyle,
        style,
      ]}
    >
      {IconComp && (
        <IconComp
          size={iconSize}
          color={isPrimary ? '#ffffff' : isSecondary ? colors.textPrimary : colors.textSecondary}
          style={BUTTON_ICON_LEFT_STYLE}
        />
      )}
      {typeof children === 'string' ? (
        <Text
          style={[
            isPrimary
              ? styles.primaryButtonText
              : isSecondary ? themeStyles.buttonTextPrimary : themeStyles.buttonTextSecondary,
            BUTTON_TEXT_SIZE_STYLES[size],
            styles.secondaryButtonText,
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {IconRightComp && (
        <IconRightComp
          size={iconSize}
          color={isPrimary ? '#ffffff' : isSecondary ? colors.textPrimary : colors.textSecondary}
          style={BUTTON_ICON_RIGHT_STYLE}
        />
      )}
    </TouchableOpacity>
  );
}

// ============================================
// GLASS CHIP
// ============================================
export interface GlassChipProps {
  children: ReactNode;
  active?: boolean;
  onPress?: () => void;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}

export function GlassChipComponent({
  children,
  active,
  onPress,
  icon,
  style,
}: GlassChipProps) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const IconComp = icon ? getIcon(icon) : null;

  return (
    <TouchableOpacity
      activeOpacity={active ? 0.85 : 0.8}
      onPress={onPress}
      style={[
        styles.chip,
        themeStyles.chip,
        active && themeStyles.activeChip,
        style,
      ]}
    >
      {IconComp && (
        <IconComp
          size={14}
          color={active ? '#ffffff' : colors.textSecondary}
          style={SMALL_CHIP_ICON_STYLE}
        />
      )}
      {typeof children === 'string' ? (
        <Text style={[
          styles.chipText,
          active ? styles.activeChipText : themeStyles.chipText,
        ]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

// ============================================
// GLASS INPUT
// ============================================
export interface GlassInputProps {
  value?: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  icon?: IconName;
  secure?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  style?: StyleProp<ViewStyle>;
}

export function GlassInputComponent({
  value,
  onChangeText,
  placeholder,
  icon,
  secure,
  multiline,
  numberOfLines = 3,
  keyboardType = 'default',
  style,
}: GlassInputProps) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const { isRTL } = useI18n();
  const IconComp = icon ? getIcon(icon) : null;
  const inputStyle = React.useMemo(
    () => [
      styles.inputWrapper,
      themeStyles.input,
      {
        flexDirection: isRTL ? 'row-reverse' as const : 'row' as const,
        minHeight: multiline ? numberOfLines * 24 + 20 : 48,
      },
      style,
    ],
    [isRTL, multiline, numberOfLines, style, themeStyles.input]
  );
  const inputTextStyle = React.useMemo(
    () => [
      styles.inputText,
      {
        color: colors.textPrimary,
        textAlign: isRTL ? 'right' as const : 'left' as const,
        writingDirection: isRTL ? 'rtl' as const : 'ltr' as const,
        textAlignVertical: multiline ? 'top' as const : 'center' as const,
      },
    ],
    [colors.textPrimary, isRTL, multiline]
  );

  return (
    <View
      style={inputStyle}
    >
      {IconComp && (
        <IconComp
          size={18}
          color={colors.textTertiary}
          style={{
            marginRight: isRTL ? 0 : 10,
            marginLeft: isRTL ? 10 : 0,
            alignSelf: multiline ? 'flex-start' : 'center',
            marginTop: multiline ? 8 : 0,
          }}
        />
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        secureTextEntry={secure}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        style={inputTextStyle}
      />
    </View>
  );
}

// ============================================
// GLASS AVATAR
// ============================================
export interface GlassAvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  ring?: boolean;
  online?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function GlassAvatarComponent({
  src,
  name,
  size = 44,
  ring = true,
  online,
  style,
}: GlassAvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[{ width: size, height: size }, style]}>
      <View
        style={[
          styles.avatarContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: ring ? 1.5 : 0,
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
        ]}
      >
        {src ? (
          <Image
            source={{ uri: src }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
          />
        ) : (
          <View
            style={[
              styles.avatarFallback,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: '#3b82f6',
              },
            ]}
          >
            <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: size * 0.38 }}>
              {initials}
            </Text>
          </View>
        )}
      </View>
      {online && (
        <View
          style={[
            styles.onlineBadge,
            {
              width: Math.max(10, size * 0.26),
              height: Math.max(10, size * 0.26),
              borderRadius: size * 0.13,
            },
          ]}
        />
      )}
    </View>
  );
}

// ============================================
// GLASS BACK BUTTON
// ============================================
export function GlassBackButtonComponent({
  onPress,
  onClick,
  style,
}: {
  onPress?: () => void;
  onClick?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const { isRTL } = useI18n();
  const IconComp = getIcon(isRTL ? 'ArrowRight' : 'ArrowLeft');
  const handlePress = onPress ?? onClick;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={[
        styles.backButton,
        themeStyles.backButton,
        style,
      ]}
    >
      <IconComp size={18} color={colors.textPrimary} strokeWidth={2.4} />
    </TouchableOpacity>
  );
}

// ============================================
// GLASS CLOSE BUTTON
// ============================================
export function GlassCloseButtonComponent({
  onPress,
  onClick,
  size = 32,
  style,
}: {
  onPress?: () => void;
  onClick?: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const CloseIcon = getIcon('X');
  const handlePress = onPress ?? onClick;
  const radius = size / 2;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={[
        styles.closeButton,
        {
          width: size,
          height: size,
          borderRadius: radius,
          ...themeStyles.closeButton,
        },
        style,
      ]}
    >
      <CloseIcon size={Math.round(size * 0.5)} color={colors.textPrimary} strokeWidth={2.4} />
    </TouchableOpacity>
  );
}

// ============================================
// GLASS SEGMENTED CONTROL
// ============================================
export interface GlassSegmentedProps {
  options: { label: string; value: string; icon?: IconName }[];
  value: string;
  onChange: (v: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function GlassSegmentedComponent({
  options,
  value,
  onChange,
  style,
}: GlassSegmentedProps) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];

  return (
    <View style={[styles.segmentedContainer, themeStyles.segmented, style]}>
      {options.map((option) => {
        const active = option.value === value;
        const IconComp = option.icon ? getIcon(option.icon) : null;
        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.8}
            onPress={() => onChange(option.value)}
            style={[styles.segmentedItem, active && themeStyles.segmentedSelected]}
          >
            {IconComp && (
              <IconComp
                size={options.length >= 4 ? 13 : 15}
                color={active ? colors.textPrimary : colors.textTertiary}
                style={SEGMENTED_ICON_STYLE}
                strokeWidth={active ? 2.4 : 1.9}
              />
            )}
            <Text
              numberOfLines={1}
              style={[
                styles.segmentedText,
                active ? themeStyles.segmentedTextActive : themeStyles.segmentedTextInactive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ============================================
// GLASS PROGRESS
// ============================================
export interface GlassProgressProps {
  value: number;
  max: number;
  color?: 'accent' | 'success' | 'warning';
  style?: StyleProp<ViewStyle>;
}

export function GlassProgressComponent({
  value,
  max,
  color = 'accent',
  style,
}: GlassProgressProps) {
  const { isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const { isRTL } = useI18n();
  const pct = Math.min(100, Math.max(0, (value / (max || 1)) * 100));

  return (
    <View
      style={[
        styles.progressTrack,
        PROGRESS_DIRECTION_STYLES[isRTL ? 'rtl' : 'ltr'],
        themeStyles.progress,
        style,
      ]}
    >
      <View
        style={[
          styles.progressBar,
          PROGRESS_DIRECTION_STYLES[isRTL ? 'rtl' : 'ltr'],
          { width: `${pct}%`, backgroundColor: PROGRESS_COLORS[color] },
        ]}
      />
    </View>
  );
}

// ============================================
// GLASS BADGE ICON
// ============================================
export function GlassBadgeIconComponent({
  icon,
  label,
  color = 'pink',
  style,
}: {
  icon: IconName;
  label: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const IconComp = getIcon(icon);
  const colorMap: Record<string, string> = {
    pink: '#f472b6',
    blue: '#3b82f6',
    green: '#22c55e',
    amber: '#f59e0b',
    purple: '#a855f7',
    slate: '#94a3b8',
    indigo: '#6366f1',
  };
  const c = colorMap[color] ?? color;

  return (
    <View
      style={[
        styles.badgeContainer,
        {
          backgroundColor: `${c}20`,
          borderColor: `${c}40`,
        },
        style,
      ]}
    >
      <IconComp size={11} color={c} strokeWidth={2.5} style={{ marginRight: 4 }} />
      <Text style={[styles.badgeText, { color: c }]}>{label}</Text>
    </View>
  );
}

// ============================================
// GLASS TOGGLE (SWITCH)
// ============================================
export function GlassToggleComponent({
  checked,
  onChange,
  label,
  size = 'sm',
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}) {
  const { isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];

  return (
    <View style={TOGGLE_ROW_STYLE}>
      {label && (
        <Text style={[TOGGLE_LABEL_STYLE, themeStyles.toggleLabel]}>
          {label}
        </Text>
      )}
      <LiquidGlassToggle checked={checked} onChange={onChange} size={size} disabled={disabled} />
    </View>
  );
}

// ============================================
// GLASS LIST ITEM
// ============================================
export interface GlassListItemProps {
  icon?: IconName;
  iconBg?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  avatar?: string | null;
  avatarName?: string;
}

export function GlassListItemComponent({
  icon,
  iconBg,
  title,
  subtitle,
  right,
  onPress,
  showChevron,
  avatar,
  avatarName,
}: GlassListItemProps) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const { isRTL } = useI18n();
  const IconComp = icon ? getIcon(icon) : null;
  const ChevronIcon = getIcon(isRTL ? 'ChevronLeft' : 'ChevronRight');
  const hasLeading = Boolean(avatar || IconComp);
  const direction = isRTL ? 'rtl' : 'ltr';

  const content = (
    <View style={[styles.listItemRow, LIST_ROW_STYLES[direction]]}>
      {avatar ? (
        <GlassAvatar src={avatar} name={avatarName ?? title} size={40} />
      ) : IconComp ? (
        <View
          style={[
            styles.listIconBox,
            { backgroundColor: iconBg ?? 'rgba(244, 114, 182, 0.2)' },
          ]}
        >
          <IconComp size={18} color="#ffffff" strokeWidth={2.2} />
        </View>
      ) : null}

      <View
        style={hasLeading ? LIST_LEADING_STYLES[direction] : LIST_NO_LEADING_STYLE}
      >
        <Text
          style={[
            styles.listTitle,
            themeStyles.listTitle,
            TEXT_DIRECTION_STYLES[direction],
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.listSubtitle,
              themeStyles.listSubtitle,
              TEXT_DIRECTION_STYLES[direction],
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {right}
      {showChevron && (
        <ChevronIcon
          size={18}
          color={colors.textTertiary}
          style={LIST_CHEVRON_STYLES[direction]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

// ============================================
// GLASS SECTION HEADER
// ============================================
export function GlassSectionHeaderComponent({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  const { isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const { isRTL } = useI18n();

  return (
    <View style={[styles.sectionHeader, LIST_ROW_STYLES[isRTL ? 'rtl' : 'ltr']]}>
      <Text
        style={[
          styles.sectionTitle,
          themeStyles.sectionTitle,
          TEXT_DIRECTION_STYLES[isRTL ? 'rtl' : 'ltr'],
        ]}
      >
        {title}
      </Text>
      {action}
    </View>
  );
}

// ============================================
// GLASS EMPTY STATE
// ============================================
export function GlassEmptyComponent({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const IconComp = getIcon(icon);

  return (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconCircle,
          themeStyles.emptyIcon,
        ]}
      >
        <IconComp size={30} color={colors.textTertiary} strokeWidth={1.8} />
      </View>
      <Text style={[styles.emptyTitle, themeStyles.emptyTitle]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.emptySubtitle, themeStyles.emptySubtitle]}>
          {subtitle}
        </Text>
      )}
      {action && <View style={{ marginTop: 14 }}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
  },
  avatarContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#22c55e',
    borderColor: '#ffffff',
    borderWidth: 1.5,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 4,
        }),
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 4,
        }),
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  segmentedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 4,
    overflow: 'hidden',
    direction: 'ltr',
  },
  segmentedItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    zIndex: 2,
  },
  segmentedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressTrack: {
    height: 9,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  listIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  listSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
});

export const GlassCard = React.memo(GlassCardComponent);
export const GlassButton = React.memo(GlassButtonComponent);
export const GlassChip = React.memo(GlassChipComponent);
export const GlassInput = React.memo(GlassInputComponent);
export const GlassAvatar = React.memo(GlassAvatarComponent);
export const GlassBackButton = React.memo(GlassBackButtonComponent);
export const GlassCloseButton = React.memo(GlassCloseButtonComponent);
export const GlassSegmented = React.memo(GlassSegmentedComponent);
export const GlassProgress = React.memo(GlassProgressComponent);
export const GlassBadgeIcon = React.memo(GlassBadgeIconComponent);
export const GlassToggle = React.memo(GlassToggleComponent);
export const GlassListItem = React.memo(GlassListItemComponent);
export const GlassSectionHeader = React.memo(GlassSectionHeaderComponent);
export const GlassEmpty = React.memo(GlassEmptyComponent);

export { FrostedGlass, type FrostedGlassProps } from './FrostedGlass';
export { FrostedGlass as LiquidLens, type FrostedGlassProps as LiquidLensProps } from './FrostedGlass';
