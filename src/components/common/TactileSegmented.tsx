// --- START OF FILE TactileSegmented.tsx ---

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
  PanResponder,
  type StyleProp,
  type ViewStyle,
  type LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getIcon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export interface TactileSegmentedOption {
  label: string;
  value: string;
  icon?: IconName;
  badgeCount?: number;
}

export interface TactileSegmentedProps {
  options: TactileSegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md' | 'lg';
}

const SPRING_CONFIG = {
  tension: 130,
  friction: 12,
  useNativeDriver: Platform.OS !== 'web',
};

const iconCache = new Map<string, any>();
function getCachedIcon(name: string) {
  let icon = iconCache.get(name);
  if (!icon) {
    icon = getIcon(name);
    iconCache.set(name, icon);
  }
  return icon;
}

interface TactileTabButtonProps {
  option: TactileSegmentedOption;
  isActive: boolean;
  onPress: (val: string) => void;
  size: 'sm' | 'md' | 'lg';
  isDark: boolean;
  activeTextColor: string;
  inactiveTextColor: string;
  activeIconColor: string;
  inactiveIconColor: string;
  accentPink: string;
}

const TactileTabButton = React.memo(function TactileTabButton({
  option,
  isActive,
  onPress,
  size,
  isDark,
  activeTextColor,
  inactiveTextColor,
  activeIconColor,
  inactiveIconColor,
  accentPink,
}: TactileTabButtonProps) {
  const IconComp = option.icon ? getCachedIcon(option.icon) : null;
  const handlePress = useCallback(() => {
    onPress(option.value);
  }, [onPress, option.value]);

  return (
    <Pressable
      onPress={handlePress}
      style={styles.tabButton}
    >
      {IconComp && (
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: isActive
                ? isDark
                  ? 'rgba(244, 114, 182, 0.16)'
                  : 'rgba(219, 39, 119, 0.10)'
                : 'transparent',
            },
          ]}
        >
          <IconComp
            size={size === 'sm' ? 13 : 15}
            color={isActive ? activeIconColor : inactiveIconColor}
            strokeWidth={isActive ? 2.5 : 1.9}
          />
        </View>
      )}

      <Text
        numberOfLines={1}
        style={[
          styles.tabText,
          {
            color: isActive ? activeTextColor : inactiveTextColor,
            fontWeight: isActive ? '800' : '600',
            fontSize: size === 'sm' ? 12 : 13.5,
          },
        ]}
      >
        {option.label}
      </Text>

      {option.badgeCount !== undefined && option.badgeCount > 0 && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isActive
                ? accentPink
                : isDark
                ? '#273146'
                : '#cbd5e1',
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: isActive ? '#ffffff' : isDark ? '#f1f5f9' : '#1e293b',
              },
            ]}
          >
            {option.badgeCount > 99 ? '99+' : option.badgeCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
});

export const TactileSegmented = React.memo(function TactileSegmented({
  options,
  value,
  onChange,
  style,
  size = 'md',
}: TactileSegmentedProps) {
  const { isDark, colors } = useTheme();
  const { isRTL } = useI18n();

  const count = Math.max(1, options.length);
  const activeIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value)
  );

  const [containerWidth, setContainerWidth] = useState(0);
  const containerWidthRef = useRef(0);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const countRef = useRef(count);
  countRef.current = count;

  const isRTLRef = useRef(isRTL);
  isRTLRef.current = isRTL;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  // انیمیشن‌های حرکتی و ابعاد
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pressScaleAnim = useRef(new Animated.Value(1)).current;
  const isDragging = useRef(false);
  const dragStartRef = useRef(0);
  const currentPosRef = useRef(0);

  // محاسبه موقعیت افقی تب فعال با احتساب جهت LTR/RTL
  const getSlotX = useCallback(
    (idx: number, totalW: number) => {
      if (totalW <= 0) return 0;
      const innerW = totalW - 8;
      const itemW = innerW / countRef.current;
      const effectiveIndex = isRTLRef.current ? countRef.current - 1 - idx : idx;
      return 4 + effectiveIndex * itemW;
    },
    []
  );

  const getSlotWidth = useCallback((totalW: number) => {
    if (totalW <= 0) return 0;
    const innerW = totalW - 8;
    return innerW / countRef.current;
  }, []);

  const triggerHaptic = useCallback(() => {
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      'navigator' in window &&
      typeof navigator.vibrate === 'function'
    ) {
      try {
        navigator.vibrate(6);
      } catch {
        // ignore
      }
    }
  }, []);

  const selectTab = useCallback(
    (newVal: string) => {
      if (newVal === value) return;
      triggerHaptic();

      // ۱. استارت آنی انیمیشن روی لایه بومی/GPU قبل از درگیر شدن JS
      const targetIdx = optionsRef.current.findIndex((opt) => opt.value === newVal);
      const w = containerWidthRef.current;
      if (targetIdx !== -1 && w > 0) {
        const targetX = getSlotX(targetIdx, w);
        currentPosRef.current = targetX;
        Animated.spring(slideAnim, {
          toValue: targetX,
          ...SPRING_CONFIG,
        }).start();
      }

      // ۲. موکول کردن آپدیت سنگین والد به فریم بعدی جهت حفظ ۱۲۰/۶۰ فریم پیوسته
      requestAnimationFrame(() => {
        onChange(newVal);
      });
    },
    [value, triggerHaptic, getSlotX, slideAnim, onChange]
  );

  const selectTabRef = useRef(selectTab);
  selectTabRef.current = selectTab;

  // ری‌ست و پرش به مکان صحیح تب فعلی
  const snapToActive = useCallback(() => {
    const w = containerWidthRef.current;
    if (w <= 0) return;
    const targetX = getSlotX(activeIndexRef.current, w);
    currentPosRef.current = targetX;
    Animated.spring(slideAnim, {
      toValue: targetX,
      ...SPRING_CONFIG,
    }).start();
  }, [getSlotX, slideAnim]);

  // همگام‌سازی جابجایی تب هنگام تغییر props
  useEffect(() => {
    if (containerWidth <= 0 || isDragging.current) return;
    const targetX = getSlotX(activeIndex, containerWidth);
    if (Math.abs(currentPosRef.current - targetX) > 0.5) {
      currentPosRef.current = targetX;
      Animated.spring(slideAnim, {
        toValue: targetX,
        ...SPRING_CONFIG,
      }).start();
    }
  }, [activeIndex, containerWidth, getSlotX, slideAnim]);

  // رویدادهای درگ و دراپ اختصاصی (Gesture Lock جهت جلوگیری از تداخل با اسکرول عمودی)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,

      // قفل کردن انحصاری حرکت افقی و تسلیم کردن تاچ در صورت اسکرول عمودی
      onMoveShouldSetPanResponder: (_, gs) => {
        const { dx, dy } = gs;
        // فقط اگر قصد کاربر حرکت افقی باشد تصاحب کن
        return Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy) * 2;
      },
      onMoveShouldSetPanResponderCapture: (_, gs) => {
        const { dx, dy } = gs;
        return Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 2.5;
      },

      // جلوگیری از اسکرول خوردن صفحه زیرین به محض تصاحب درگ تب
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: () => {
        const w = containerWidthRef.current;
        if (w <= 0) return;
        isDragging.current = true;
        dragStartRef.current = currentPosRef.current;

        Animated.spring(pressScaleAnim, {
          toValue: 1.03,
          tension: 140,
          friction: 8,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      },

      onPanResponderMove: (_, gs) => {
        const w = containerWidthRef.current;
        if (w <= 0) return;
        const slotW = getSlotWidth(w);
        const minX = 4;
        const maxX = 4 + (countRef.current - 1) * slotW;

        const nextX = Math.max(minX, Math.min(maxX, dragStartRef.current + gs.dx));
        slideAnim.setValue(nextX);
      },

      onPanResponderRelease: (_, gs) => {
        isDragging.current = false;
        Animated.spring(pressScaleAnim, {
          toValue: 1,
          tension: 140,
          friction: 8,
          useNativeDriver: Platform.OS !== 'web',
        }).start();

        const w = containerWidthRef.current;
        if (w <= 0) return;
        const slotW = getSlotWidth(w);
        const minX = 4;
        const maxX = 4 + (countRef.current - 1) * slotW;
        const finalX = Math.max(minX, Math.min(maxX, dragStartRef.current + gs.dx));

        let visualIndex = Math.round((finalX - 4) / slotW);
        visualIndex = Math.max(0, Math.min(countRef.current - 1, visualIndex));

        const chosenIndex = isRTLRef.current ? countRef.current - 1 - visualIndex : visualIndex;
        const chosenOption = optionsRef.current[chosenIndex];

        if (chosenOption) {
          selectTabRef.current(chosenOption.value);
        }

        const snappedX = getSlotX(chosenIndex, w);
        currentPosRef.current = snappedX;
        Animated.spring(slideAnim, {
          toValue: snappedX,
          ...SPRING_CONFIG,
        }).start();
      },

      // در صورت لغو یا مداخله ناگهانی (مثلاً خروج لمس یا اسکرول)، کپسول دقیقاً به تب فعال بازمی‌گردد و گیر نمی‌کند!
      onPanResponderTerminate: () => {
        isDragging.current = false;
        Animated.spring(pressScaleAnim, {
          toValue: 1,
          ...SPRING_CONFIG,
        }).start();
        snapToActive();
      },
    })
  ).current;

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      if (w > 0 && Math.abs(w - containerWidthRef.current) > 0.5) {
        containerWidthRef.current = w;
        setContainerWidth(w);
        const initialX = getSlotX(activeIndexRef.current, w);
        currentPosRef.current = initialX;
        slideAnim.setValue(initialX);
      }
    },
    [getSlotX, slideAnim]
  );

  // ابعاد کنترلر
  const heightMap = { sm: 44, md: 50, lg: 56 };
  const baseHeight = heightMap[size];
  const thumbHeight = baseHeight - 10;
  const slotW = containerWidth > 0 ? getSlotWidth(containerWidth) : 0;

  // پالت رنگ‌های تاکتایل ۳ بعدی و باظرافت (Crafted Tactile Industrial)
  const trackBg = isDark ? '#0b0f19' : '#e2e8f0';
  const trackBorder = isDark ? '#161d2e' : '#cbd5e1';

  // گرادیان ملایم بدنه کپسول برای حجم‌دهی متالیک/ارگونومیک
  const thumbGradient = isDark
    ? (['#28344d', '#1b2334'] as const)
    : (['#ffffff', '#f1f5f9'] as const);

  const thumbBorder = isDark ? 'rgba(255, 255, 255, 0.16)' : '#ffffff';
  const rimHighlight = isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.85)';

  const activeTextColor = isDark ? '#ffffff' : '#0f172a';
  const inactiveTextColor = isDark ? '#7f90ab' : '#64748b';

  const activeIconColor = isDark ? '#f472b6' : '#db2777';
  const inactiveIconColor = isDark ? '#60708b' : '#6b7a94';

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.track,
        {
          height: baseHeight,
          backgroundColor: trackBg,
          borderColor: trackBorder,
        },
        style,
      ]}
      {...panResponder.panHandlers}
    >
      {/* نشانگر زنده ۳ بعدی متحرک با تفکیک لایه سایه (iOS Unclipped Shadow Layer) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.thumb,
          {
            height: thumbHeight,
            width: slotW,
            opacity: slotW > 0 ? 1 : 0,
            borderRadius: thumbHeight / 2,
            transform: [{ translateX: slideAnim }, { scale: pressScaleAnim }],
            ...(Platform.OS === 'web'
              ? ({
                  willChange: 'transform',
                  boxShadow: isDark
                    ? '0 6px 16px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                    : '0 4px 12px rgba(15, 23, 42, 0.15), 0 1px 3px rgba(15, 23, 42, 0.08), inset 0 1px 0 #ffffff',
                } as any)
              : isDark
              ? {
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.55,
                  shadowRadius: 6,
                  elevation: 7,
                }
              : {
                  shadowColor: '#0f172a',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.14,
                  shadowRadius: 5,
                  elevation: 4,
                }),
          },
        ]}
      >
        <View
          style={[
            styles.thumbInner,
            {
              borderRadius: thumbHeight / 2,
              borderColor: thumbBorder,
            },
          ]}
        >
          <LinearGradient
            colors={thumbGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* لبه هایلایت ظریف فوقانی (Light Catch Reflection) */}
          <View
            style={[
              styles.specularRim,
              {
                backgroundColor: rimHighlight,
                borderRadius: thumbHeight / 2,
              },
            ]}
          />
        </View>
      </Animated.View>

      {/* خطوط جداکننده مینیمال بین تب‌های غیرفعال (Divider lines) */}
      <View
        pointerEvents="none"
        style={[
          styles.dividersRow,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
      >
        {options.map((_, i) => {
          if (i === 0) return null;
          const isNearActive = i === activeIndex || i === activeIndex + 1;
          return (
            <View
              key={`div-${i}`}
              style={[
                styles.dividerSegment,
                {
                  opacity: isNearActive ? 0 : 1,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                },
              ]}
            />
          );
        })}
      </View>

      {/* لیست تب‌های تعاملی و قابل کلیک (کامپوننت‌های کاملاً مِموشده جهت پرفورمنس ۱۲۰ فریم) */}
      <View
        style={[
          styles.tabsRow,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
      >
        {options.map((opt) => (
          <TactileTabButton
            key={opt.value}
            option={opt}
            isActive={opt.value === value}
            onPress={selectTab}
            size={size}
            isDark={isDark}
            activeTextColor={activeTextColor}
            inactiveTextColor={inactiveTextColor}
            activeIconColor={activeIconColor}
            inactiveIconColor={inactiveIconColor}
            accentPink={colors.accentPink}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  track: {
    borderRadius: 26,
    borderWidth: 1.5,
    padding: 4,
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          userSelect: 'none',
          WebkitUserSelect: 'none',
          cursor: 'pointer',
        } as any)
      : {}),
  },
  thumb: {
    position: 'absolute',
    top: 4,
    left: 0,
    zIndex: 2,
  },
  thumbInner: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    overflow: 'hidden',
  },
  specularRim: {
    position: 'absolute',
    top: 0,
    left: 4,
    right: 4,
    height: 1.5,
    opacity: 0.9,
  },
  dividersRow: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    zIndex: 1,
  },
  dividerSegment: {
    width: 1.5,
    height: 18,
    borderRadius: 1,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    gap: 6,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          userSelect: 'none',
          WebkitUserSelect: 'none',
        } as any)
      : {}),
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tabText: {
    letterSpacing: -0.2,
    flexShrink: 1,
    ...(Platform.OS === 'web'
      ? ({
          userSelect: 'none',
          WebkitUserSelect: 'none',
        } as any)
      : {}),
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
