import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Animated,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getIcon, type IconName } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { LiquidLens } from './LiquidLens';
export { LiquidGlassToggle, type LiquidGlassToggleProps } from './common/LiquidGlassToggle';

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

export function GlassCard({
  children,
  style,
  variant = 'default',
  glow = false,
  onPress,
  onClick,
}: GlassCardProps) {
  const { isDark, colors } = useTheme();
  const handlePress = onPress ?? onClick;

  const tint = isDark ? 'dark' : 'light';
  const intensity = variant === 'thick' ? 45 : variant === 'thin' ? 20 : 30;

  const bg =
    variant === 'thick'
      ? colors.glassThickBg
      : variant === 'thin'
      ? colors.glassThinBg
      : colors.glassBg;

  const cardStyle: ViewStyle = {
    backgroundColor: bg,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: glow ? 0.35 : 0.18,
    shadowRadius: glow ? 16 : 8,
    elevation: glow ? 8 : 4,
    position: 'relative',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: `blur(${variant === 'thick' ? 24 : variant === 'thin' ? 12 : 16}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${variant === 'thick' ? 24 : variant === 'thin' ? 12 : 16}px) saturate(180%)`,
          transform: 'translateZ(0)',
        }
      : {}),
  };

  const content = (
    <>
      {/* Specular subtle gradient highlight */}
      <LinearGradient
        colors={[
          isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.60)',
          isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.15)',
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}
      />
      {children}
    </>
  );

  if (handlePress) {
    return (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={handlePress}
        style={[cardStyle, style]}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{content}</View>;
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

export function GlassButton({
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
  const { colors } = useTheme();
  const handlePress = onPress ?? onClick;

  const padVertical = size === 'sm' ? 8 : size === 'lg' ? 15 : 12;
  const padHorizontal = size === 'sm' ? 14 : size === 'lg' ? 24 : 18;
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 16 : 14;
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  const IconComp = icon ? getIcon(icon) : null;
  const IconRightComp = iconRight ? getIcon(iconRight) : null;

  const baseStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    paddingVertical: padVertical,
    paddingHorizontal: padHorizontal,
    opacity: disabled ? 0.45 : 1,
    width: fullWidth ? '100%' : undefined,
  };

  if (variant === 'primary' || variant === 'danger') {
    const gradColors: [string, string] =
      variant === 'danger'
        ? ['#ef4444', '#dc2626']
        : ['#f472b6', '#3b82f6'];

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        disabled={disabled}
        style={[{ width: fullWidth ? '100%' : undefined }, style]}
      >
        <LinearGradient
          colors={gradColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            baseStyle,
            {
              shadowColor: gradColors[0],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 10,
              elevation: 4,
            },
          ]}
        >
          {IconComp && (
            <IconComp
              size={iconSize}
              color="#ffffff"
              style={{ marginRight: 6 }}
            />
          )}
          {typeof children === 'string' ? (
            <Text
              style={[
                {
                  color: '#ffffff',
                  fontSize,
                  fontWeight: '700',
                  textAlign: 'center',
                },
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
              color="#ffffff"
              style={{ marginLeft: 6 }}
            />
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const isSecondary = variant === 'secondary';
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      disabled={disabled}
      style={[
        baseStyle,
        {
          backgroundColor: isSecondary ? colors.glassThinBg : 'transparent',
          borderColor: isSecondary ? colors.glassBorder : 'transparent',
          borderWidth: isSecondary ? 1 : 0,
        },
        style,
      ]}
    >
      {IconComp && (
        <IconComp
          size={iconSize}
          color={isSecondary ? colors.textPrimary : colors.textSecondary}
          style={{ marginRight: 6 }}
        />
      )}
      {typeof children === 'string' ? (
        <Text
          style={[
            {
              color: isSecondary ? colors.textPrimary : colors.textSecondary,
              fontSize,
              fontWeight: '600',
            },
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
          color={isSecondary ? colors.textPrimary : colors.textSecondary}
          style={{ marginLeft: 6 }}
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

export function GlassChip({
  children,
  active,
  onPress,
  icon,
  style,
}: GlassChipProps) {
  const { colors } = useTheme();
  const IconComp = icon ? getIcon(icon) : null;

  if (active) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={style}>
        <LinearGradient
          colors={['#f472b6', '#3b82f6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.chip}
        >
          {IconComp && (
            <IconComp size={14} color="#ffffff" style={{ marginRight: 5 }} />
          )}
          {typeof children === 'string' ? (
            <Text style={[styles.chipText, { color: '#ffffff', fontWeight: '700' }]}>
              {children}
            </Text>
          ) : (
            children
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: colors.glassThinBg,
          borderColor: colors.glassBorder,
          borderWidth: 1,
        },
        style,
      ]}
    >
      {IconComp && (
        <IconComp
          size={14}
          color={colors.textSecondary}
          style={{ marginRight: 5 }}
        />
      )}
      {typeof children === 'string' ? (
        <Text style={[styles.chipText, { color: colors.textSecondary }]}>
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

export function GlassInput({
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
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const IconComp = icon ? getIcon(icon) : null;

  return (
    <View
      style={[
        styles.inputWrapper,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          backgroundColor: colors.glassThinBg,
          borderColor: colors.glassBorder,
          minHeight: multiline ? numberOfLines * 24 + 20 : 48,
        },
        style,
      ]}
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
        style={[
          styles.inputText,
          {
            color: colors.textPrimary,
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr',
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
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

export function GlassAvatar({
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
          <LinearGradient
            colors={['#f472b6', '#3b82f6']}
            style={[
              styles.avatarFallback,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          >
            <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: size * 0.38 }}>
              {initials}
            </Text>
          </LinearGradient>
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
export function GlassBackButton({
  onPress,
  onClick,
  style,
}: {
  onPress?: () => void;
  onClick?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();
  const IconComp = getIcon(isRTL ? 'ArrowRight' : 'ArrowLeft');
  const handlePress = onPress ?? onClick;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={[
        styles.backButton,
        {
          borderColor: colors.glassBorderStrong,
        },
        style,
      ]}
    >
      <LiquidLens
        borderRadius={19}
        marginWidth={8}
        scale={20}
        blurDeviation={1.6}
        overlayOpacity={isDark ? 0.10 : 0.22}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.backButtonIconWrap}>
        <IconComp size={18} color={colors.textPrimary} strokeWidth={2.4} />
      </View>
    </TouchableOpacity>
  );
}

// ============================================
// GLASS CLOSE BUTTON
// ============================================
export function GlassCloseButton({
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
          borderColor: colors.glassBorderStrong,
        },
        style,
      ]}
    >
      <LiquidLens
        borderRadius={radius}
        marginWidth={Math.max(6, Math.round(size * 0.22))}
        scale={Math.max(14, Math.round(size * 0.55))}
        blurDeviation={1.5}
        overlayOpacity={isDark ? 0.10 : 0.22}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.backButtonIconWrap}>
        <CloseIcon size={Math.round(size * 0.5)} color={colors.textPrimary} strokeWidth={2.4} />
      </View>
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

export function GlassSegmented({
  options,
  value,
  onChange,
  style,
}: GlassSegmentedProps) {
  const { colors, isDark } = useTheme();
  const activeIndex = Math.max(0, options.findIndex((opt) => opt.value === value));
  const count = Math.max(1, options.length);

  const [containerWidth, setContainerWidth] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const padding = 8; // 4px on each side
    const innerW = containerWidth > 0 ? containerWidth - padding : 320;
    const itemW = innerW / count;
    const targetX = activeIndex * itemW;

    Animated.spring(slideAnim, {
      toValue: targetX,
      tension: 70,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, containerWidth, count]);

  const handleSelect = (v: string) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(6);
      } catch {
        // ignore
      }
    }
    onChange(v);
  };

  return (
    <View
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
      }}
      style={[
        styles.segmentedContainer,
        {
          backgroundColor: colors.glassThinBg,
          borderColor: colors.glassBorder,
          position: 'relative',
        },
        style,
      ]}
    >
      {/* Sliding Liquid Glass Lens */}
      {Platform.OS === 'web' ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: `calc(4px + ${activeIndex} * (100% - 8px) / ${count})` as any,
            width: `calc((100% - 8px) / ${count})` as any,
            transition: 'all 0.3s cubic-bezier(0.25, 1, 0.3, 1)',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.65)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.85)',
            borderWidth: 1,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.35 : 0.12,
            shadowRadius: 8,
            elevation: 4,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 1,
            backdropFilter: 'blur(16px) saturate(190%)',
            WebkitBackdropFilter: 'blur(16px) saturate(190%)',
          } as any}
        >
          {/* Top specular highlight sheen */}
          <LinearGradient
            colors={[
              isDark ? 'rgba(255, 255, 255, 0.32)' : 'rgba(255, 255, 255, 0.90)',
              isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.22)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: '6%',
              right: '6%',
              height: '45%',
              borderRadius: 9999,
            }}
          />
        </View>
      ) : (
        <Animated.View
          style={[
            styles.segmentedLens,
            {
              width: containerWidth > 0 ? (containerWidth - 8) / count : `${100 / count}%`,
              transform: [{ translateX: slideAnim }],
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.65)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.85)',
              borderWidth: 1,
              overflow: 'hidden',
            },
          ]}
        >
          <LinearGradient
            colors={[
              isDark ? 'rgba(255, 255, 255, 0.32)' : 'rgba(255, 255, 255, 0.90)',
              isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.22)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: '6%',
              right: '6%',
              height: '45%',
              borderRadius: 9999,
            }}
          />
        </Animated.View>
      )}

      {options.map((opt) => {
        const active = opt.value === value;
        const IconComp = opt.icon ? getIcon(opt.icon) : null;

        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.8}
            onPress={() => handleSelect(opt.value)}
            style={styles.segmentedItem}
          >
            {IconComp && (
              <IconComp
                size={count >= 4 ? 13 : 15}
                color={active ? colors.textPrimary : colors.textTertiary}
                style={{ marginRight: 5 }}
                strokeWidth={active ? 2.4 : 1.9}
              />
            )}
            <Text
              numberOfLines={1}
              style={[
                styles.segmentedText,
                {
                  color: active ? colors.textPrimary : colors.textTertiary,
                  fontWeight: active ? '700' : '600',
                },
              ]}
            >
              {opt.label}
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

export function GlassProgress({
  value,
  max,
  color = 'accent',
  style,
}: GlassProgressProps) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const pct = Math.min(100, Math.max(0, (value / (max || 1)) * 100));

  const gradColors: [string, string] =
    color === 'success'
      ? ['#22c55e', '#10b981']
      : color === 'warning'
      ? ['#eab308', '#f59e0b']
      : ['#f472b6', '#3b82f6'];

  return (
    <View
      style={[
        styles.progressTrack,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          backgroundColor: colors.glassThinBg,
          borderColor: colors.glassBorder,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradColors}
        start={{ x: isRTL ? 1 : 0, y: 0 }}
        end={{ x: isRTL ? 0 : 1, y: 0 }}
        style={[styles.progressBar, { width: `${pct}%` }]}
      />
    </View>
  );
}

// ============================================
// GLASS BADGE ICON
// ============================================
export function GlassBadgeIcon({
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
export function GlassToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {label && (
        <Text style={{ fontSize: 15, color: colors.textPrimary, fontWeight: '500' }}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChange(!checked)}
        style={{
          width: 50,
          height: 28,
          borderRadius: 14,
          backgroundColor: checked ? '#10b981' : colors.glassThinBg,
          borderColor: colors.glassBorder,
          borderWidth: 1,
          justifyContent: 'center',
          paddingHorizontal: 3,
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: '#ffffff',
            alignSelf: checked ? 'flex-end' : 'flex-start',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 2,
          }}
        />
      </TouchableOpacity>
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

export function GlassListItem({
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
  const { colors } = useTheme();
  const IconComp = icon ? getIcon(icon) : null;
  const ChevronRight = getIcon('ChevronRight');

  const content = (
    <View style={styles.listItemRow}>
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

      <View style={{ flex: 1, marginLeft: avatar || IconComp ? 12 : 0 }}>
        <Text style={[styles.listTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.listSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {right}
      {showChevron && (
        <ChevronRight
          size={18}
          color={colors.textTertiary}
          style={{ marginLeft: 6 }}
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
export function GlassSectionHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      {action}
    </View>
  );
}

// ============================================
// GLASS EMPTY STATE
// ============================================
export function GlassEmpty({
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
  const { colors } = useTheme();
  const IconComp = getIcon(icon);

  return (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconCircle,
          { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
        ]}
      >
        <IconComp size={30} color={colors.textTertiary} strokeWidth={1.8} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      {action && <View style={{ marginTop: 14 }}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  backButtonIconWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
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
  },
  segmentedLens: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
    pointerEvents: 'none',
    zIndex: 1,
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

export { LiquidLens, type LiquidLensProps } from './LiquidLens';
