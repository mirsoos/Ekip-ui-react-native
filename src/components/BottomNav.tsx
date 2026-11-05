// --- START OF FILE BottomNav.tsx ---

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Animated,
  PanResponder,
  Easing,
  type LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons, type IconName } from '../lib/icons';
import { useAppData } from '../lib/appData';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';

import { FrostedGlass } from './FrostedGlass';
import { EkipLogoButton } from './ekip/EkipLogoButton';

export type TabKey = 'discover' | 'activity' | 'create' | 'chat' | 'profile';

interface BottomNavProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string; icon: IconName }[] = [
  { key: 'discover', label: 'Discover', icon: 'Compass' },
  { key: 'activity', label: 'My Ekip', icon: 'Layers' },
  { key: 'create', label: 'Create', icon: 'Plus' },
  { key: 'chat', label: 'Chats', icon: 'MessageCircle' },
  { key: 'profile', label: 'Profile', icon: 'User' },
];

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

const NAV_SPRING_CONFIG = {
  stiffness: 220,
  damping: 24,
  mass: 0.85,
  useNativeDriver: USE_NATIVE_DRIVER,
};

const NAV_SCALE_SPRING_CONFIG = {
  stiffness: 260,
  damping: 26,
  mass: 0.9,
  useNativeDriver: USE_NATIVE_DRIVER,
};

interface BottomNavTabItemProps {
  tabKey: TabKey;
  icon: IconName;
  label: string;
  active: boolean;
  badgeCount: number;
  avatarUrl?: string | null;
  accentColor: string;
  activeTextColor: string;
  inactiveColor: string;
  onPress: () => void;
}

const BottomNavTabItem = React.memo(function BottomNavTabItem({
  tabKey,
  icon,
  label,
  active,
  badgeCount,
  avatarUrl,
  accentColor,
  activeTextColor,
  inactiveColor,
  onPress,
}: BottomNavTabItemProps) {
  if (tabKey === 'create') {
    return (
      <View style={styles.createSlot}>
        <EkipLogoButton active={active} onPress={onPress} size={44} />
      </View>
    );
  }

  const IconComp = (Icons as Record<string, typeof Icons.Compass>)[icon] ?? Icons.Compass;
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.tabItem}>
      <View style={[styles.iconContainer, { transform: [{ translateY: active ? -2 : 0 }] }]}>
        {tabKey === 'profile' && avatarUrl ? (
          <View
            style={[
              styles.avatarBorder,
              { borderColor: active ? accentColor : 'transparent' },
            ]}
          >
            <Image source={{ uri: avatarUrl }} style={styles.avatarImg as any} />
          </View>
        ) : (
          <IconComp
            size={22}
            color={active ? accentColor : inactiveColor}
            strokeWidth={active ? 2.4 : 1.9}
          />
        )}

        {badgeCount > 0 && (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>
              {badgeCount > 9 ? '9+' : badgeCount}
            </Text>
          </View>
        )}
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.tabLabel,
          {
            color: active ? activeTextColor : inactiveColor,
            fontWeight: active ? '700' : '500',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
});

export function BottomNavComponent({ active, onChange }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const { me, conversations, notifications } = useAppData();
  const { colors, isDark } = useTheme();
  const { t } = useI18n();

  // پالت رنگ‌های نشانگر فعال منطبق دقیق با TactileSegmented
  const thumbGradient = isDark
    ? (['rgba(255, 255, 255, 0.14)', 'rgba(255, 255, 255, 0.05)'] as const)
    : (['#ffffff', '#f1f5f9'] as const);

  const thumbBorder = isDark ? 'rgba(255, 255, 255, 0.18)' : '#ffffff';
  const rimHighlight = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 0.90)';

  const tabLabels: Record<TabKey, string> = useMemo(
    () => ({
      discover: t('nav.discover'),
      activity: t('nav.activity'),
      create: t('nav.create'),
      chat: t('nav.chat'),
      profile: t('nav.profile'),
    }),
    [t]
  );

  const unreadChats = useMemo(
    () => conversations.reduce((s, c) => s + c.unread_count, 0),
    [conversations]
  );
  const unreadNotifs = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const badges: Partial<Record<TabKey, number>> = useMemo(
    () => ({
      chat: unreadChats,
      activity: unreadNotifs,
    }),
    [unreadChats, unreadNotifs]
  );

  const activeIndex = Math.max(0, tabs.findIndex((item) => item.key === active));

  // Dock measurements & animation values
  const [dockWidth, setDockWidth] = useState(0);
  const dockWidthRef = useRef(0);
  const activeRef = useRef<TabKey>(active);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    dockWidthRef.current = dockWidth;
  }, [dockWidth]);

  useEffect(() => {
    activeRef.current = active;
    activeIndexRef.current = activeIndex;
  }, [active, activeIndex]);

  const [lensX] = useState(() => new Animated.Value(0));
  const [lensScale] = useState(() => new Animated.Value(active === 'create' ? 0 : 1));
  const [createRotate] = useState(() => new Animated.Value(active === 'create' ? 1 : 0));

  const isDragging = useRef(false);
  const currentLensX = useRef(0);
  const lastLensXRef = useRef(0);

  // Entrance animation
  const [enterAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    enterAnim.setValue(0);
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [enterAnim]);

  const enterTranslateY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [95, 0],
  });

  // Handle dock width layout
  const handleDockLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      if (w > 0) {
        if (dockWidthRef.current === 0) {
          const slotW = (w - 14) / 5;
          const initialX = 6 + activeIndexRef.current * slotW;
          lensX.setValue(initialX);
          currentLensX.current = initialX;
          lensScale.setValue(activeRef.current === 'create' ? 0 : 1);
        }
        dockWidthRef.current = w;
        setDockWidth((prev) => (Math.abs(prev - w) > 0.5 ? w : prev));
      }
    },
    [lensScale, lensX]
  );

  // 1. Unified Tab Transition Animation (همگام‌سازی جابجایی تب با فیزیک فنری لوکس)
  useEffect(() => {
    if (dockWidth <= 0 || isDragging.current) return;

    const innerWidth = dockWidth - 14;
    const slotW = innerWidth / 5;
    const targetX = 6 + activeIndex * slotW;

    if (Math.abs(currentLensX.current - targetX) > 0.5) {
      currentLensX.current = targetX;

      Animated.spring(createRotate, {
        toValue: active === 'create' ? 1 : 0,
        ...NAV_SPRING_CONFIG,
      }).start();

      if (active === 'create') {
        Animated.parallel([
          Animated.spring(lensX, {
            toValue: targetX,
            ...NAV_SPRING_CONFIG,
          }),
          Animated.spring(lensScale, {
            toValue: 0,
            ...NAV_SCALE_SPRING_CONFIG,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.spring(lensScale, {
            toValue: 1,
            ...NAV_SCALE_SPRING_CONFIG,
          }),
          Animated.spring(lensX, {
            toValue: targetX,
            ...NAV_SPRING_CONFIG,
          }),
        ]).start();
      }
    }
  }, [active, activeIndex, dockWidth, createRotate, lensScale, lensX]);

  const handleSelectTab = useCallback(
    (key: TabKey) => {
      if (key === activeRef.current) return;
      if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        try {
          navigator.vibrate(6);
        } catch {
          // ignore
        }
      }

      // ۱. استارت آنی انیمیشن کپسول روی ترد نیتیو
      const targetIndex = tabs.findIndex((item) => item.key === key);
      const w = dockWidthRef.current;
      if (w > 0 && targetIndex !== -1) {
        const slotW = (w - 14) / 5;
        const targetX = 6 + targetIndex * slotW;
        currentLensX.current = targetX;

        Animated.spring(createRotate, {
          toValue: key === 'create' ? 1 : 0,
          ...NAV_SPRING_CONFIG,
        }).start();

        if (key === 'create') {
          Animated.parallel([
            Animated.spring(lensX, {
              toValue: targetX,
              ...NAV_SPRING_CONFIG,
            }),
            Animated.spring(lensScale, {
              toValue: 0,
              ...NAV_SCALE_SPRING_CONFIG,
            }),
          ]).start();
        } else {
          Animated.parallel([
            Animated.spring(lensScale, {
              toValue: 1,
              ...NAV_SCALE_SPRING_CONFIG,
            }),
            Animated.spring(lensX, {
              toValue: targetX,
              ...NAV_SPRING_CONFIG,
            }),
          ]).start();
        }
      }

      // ۲. اجرای تغییر سنگین صفحه در فریم بعدی جهت تضمین روانی ۱۲۰ فریم
      requestAnimationFrame(() => {
        onChange(key);
      });
    },
    [onChange, createRotate, lensScale, lensX]
  );

  const handleSelectTabRef = useRef(handleSelectTab);
  useEffect(() => {
    handleSelectTabRef.current = handleSelectTab;
  }, [handleSelectTab]);

  const tabPressHandlers = useMemo(
    () => new Map(tabs.map((tab) => [tab.key, () => handleSelectTab(tab.key)])),
    [handleSelectTab]
  );

  // 2. Unified PanResponder for Drag & Drop (Touch on Mobile — Fixed Stale Closure!)
  const dragStartRef = useRef(0);

  const [panResponder, setPanResponder] = useState<ReturnType<typeof PanResponder.create> | null>(null);

  useEffect(() => {
    setPanResponder(
      PanResponder.create({
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponderCapture: (_, gs) => Math.abs(gs.dx) > 6 && Math.abs(gs.dx) > Math.abs(gs.dy),
        onPanResponderGrant: () => {
          const w = dockWidthRef.current;
          if (w <= 0) return;
          isDragging.current = true;
          const slotW = (w - 14) / 5;
          if (activeRef.current === 'create') {
            dragStartRef.current = 6 + 2 * slotW;
            lensX.setValue(dragStartRef.current);
            Animated.spring(lensScale, {
              toValue: 1,
              ...NAV_SCALE_SPRING_CONFIG,
            }).start();
          } else {
            dragStartRef.current = currentLensX.current;
          }
        },
        onPanResponderMove: (_, gs) => {
          const w = dockWidthRef.current;
          if (w <= 0) return;
          const slotW = (w - 14) / 5;
          const minX = 6;
          const maxX = 6 + 4 * slotW;
          const nextX = Math.max(minX, Math.min(maxX, dragStartRef.current + gs.dx));
          if (Math.abs(nextX - lastLensXRef.current) >= 1) {
            lastLensXRef.current = nextX;
            lensX.setValue(nextX);
          }
        },
        onPanResponderRelease: (_, gs) => {
          isDragging.current = false;
          const w = dockWidthRef.current;
          if (w <= 0) return;
          const slotW = (w - 14) / 5;
          const minX = 6;
          const maxX = 6 + 4 * slotW;
          const finalX = Math.max(minX, Math.min(maxX, dragStartRef.current + gs.dx));

          let droppedIndex = Math.round((finalX - 6) / slotW);
          droppedIndex = Math.max(0, Math.min(4, droppedIndex));

          const chosenTab = tabs[droppedIndex].key;
          const targetX = 6 + droppedIndex * slotW;
          currentLensX.current = targetX;
          handleSelectTabRef.current(chosenTab);

          if (chosenTab === 'create') {
            Animated.parallel([
              Animated.spring(lensX, {
                toValue: 6 + 2 * slotW,
                ...NAV_SPRING_CONFIG,
              }),
              Animated.spring(lensScale, {
                toValue: 0,
                ...NAV_SCALE_SPRING_CONFIG,
              }),
            ]).start();
          } else {
            Animated.parallel([
              Animated.spring(lensScale, {
                toValue: 1,
                ...NAV_SCALE_SPRING_CONFIG,
              }),
              Animated.spring(lensX, {
                toValue: targetX,
                ...NAV_SPRING_CONFIG,
              }),
            ]).start();
          }
        },
        onPanResponderTerminate: () => {
          isDragging.current = false;
          const w = dockWidthRef.current;
          if (w > 0) {
            const slotW = (w - 14) / 5;
            const targetX = 6 + activeIndexRef.current * slotW;
            Animated.spring(lensX, {
              toValue: targetX,
              ...NAV_SPRING_CONFIG,
            }).start();
          }
        },
      })
    );
  }, [lensScale, lensX]);

  // 3. Unified Mouse Drag & Drop on Web
  const handleWebMouseDown = (e: React.MouseEvent) => {
    if (Platform.OS !== 'web' || dockWidth <= 0 || e.button !== 0) return;

    const startMouseX = e.clientX;
    const slotW = (dockWidth - 14) / 5;
    const initialDragX = active === 'create' ? 6 + 2 * slotW : currentLensX.current;
    let hasMoved = false;

    const minX = 6;
    const maxX = 6 + 4 * slotW;

    const onMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startMouseX;
      if (!hasMoved && Math.abs(dx) > 4) {
        hasMoved = true;
        isDragging.current = true;
        if (active === 'create') {
          lensX.setValue(6 + 2 * slotW);
          Animated.spring(lensScale, {
            toValue: 1,
            ...NAV_SCALE_SPRING_CONFIG,
          }).start();
        }
      }
      if (hasMoved) {
        const nextX = Math.max(minX, Math.min(maxX, initialDragX + dx));
        if (Math.abs(nextX - lastLensXRef.current) >= 1) {
          lastLensXRef.current = nextX;
          lensX.setValue(nextX);
        }
      }
    };

    const onMouseUp = (ev: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (hasMoved) {
        isDragging.current = false;
        const dx = ev.clientX - startMouseX;
        const finalX = Math.max(minX, Math.min(maxX, initialDragX + dx));

        let droppedIndex = Math.round((finalX - 6) / slotW);
        droppedIndex = Math.max(0, Math.min(4, droppedIndex));

        const chosenTab = tabs[droppedIndex].key;
        handleSelectTab(chosenTab);

        if (chosenTab === 'create') {
          Animated.parallel([
            Animated.spring(lensX, {
              toValue: 6 + 2 * slotW,
              ...NAV_SPRING_CONFIG,
            }),
            Animated.spring(lensScale, {
              toValue: 0,
              ...NAV_SCALE_SPRING_CONFIG,
            }),
          ]).start();
        } else {
          Animated.parallel([
            Animated.spring(lensScale, {
              toValue: 1,
              ...NAV_SCALE_SPRING_CONFIG,
            }),
            Animated.spring(lensX, {
              toValue: 6 + droppedIndex * slotW,
              ...NAV_SPRING_CONFIG,
            }),
          ]).start();
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const slotWidth = dockWidth > 0 ? (dockWidth - 14) / 5 : '20%';

  return (
    <View
      style={[
        styles.outerContainer,
        {
          paddingBottom: Platform.OS === 'web' ? 12 : Math.max(12, insets.bottom + 6),
        },
      ]}
      pointerEvents="box-none"
    >
      <Animated.View
        onLayout={handleDockLayout}
        {...(panResponder ? panResponder.panHandlers : {})}
        {...(Platform.OS === 'web' ? { onMouseDown: handleWebMouseDown } : {})}
        style={[
          styles.dockContainer,
          {
            borderColor: colors.glassBorderStrong,
            transform: [{ translateY: enterTranslateY }],
          },
        ]}
      >
        {/* 360° Frosted Glass for the entire navbar dock */}
        <FrostedGlass
          borderRadius={36}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        {/* Active Tab Sliding Pill Indicator (3D Tactile Pill منطبق با TactileSegmented) */}
        {dockWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            renderToHardwareTextureAndroid={true}
            style={[
              styles.activeIndicator,
              {
                width: slotWidth,
                opacity: lensScale,
                borderRadius: 22,
                transform: [
                  { translateX: lensX },
                  { scale: lensScale },
                ],
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
                styles.indicatorInner,
                {
                  borderRadius: 22,
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
                    borderRadius: 22,
                  },
                ]}
              />
            </View>
          </Animated.View>
        )}

        {/* Tab Buttons */}
        {tabs.map((tab) => (
          <BottomNavTabItem
            key={tab.key}
            tabKey={tab.key}
            icon={tab.icon}
            label={tabLabels[tab.key] || tab.label}
            active={tab.key === active}
            badgeCount={badges[tab.key] ?? 0}
            avatarUrl={tab.key === 'profile' ? me?.avatar_url : undefined}
            accentColor={colors.accentPink}
            activeTextColor={colors.textPrimary}
            inactiveColor={colors.textSecondary}
            onPress={tabPressHandlers.get(tab.key)!}
          />
        ))}
      </Animated.View>
    </View>
  );
}

export const BottomNav = React.memo(BottomNavComponent);

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    zIndex: 900,
  },
  dockContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 36,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
    direction: 'ltr',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
        }),
    overflow: 'visible',
    ...(Platform.OS === 'web'
      ? ({
          touchAction: 'none',
          userSelect: 'none',
          cursor: 'pointer',
        } as any)
      : {}),
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    zIndex: 1,
  },
  indicatorInner: {
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
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    zIndex: 10,
  },
  iconContainer: {
    position: 'relative',
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
  },
  tabBadge: {
    position: 'absolute',
    top: -2,
    right: -10,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#ef4444',
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  tabBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  createSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  createLogoButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    // @ts-ignore
    outlineStyle: 'none',
  },
  createLogoImage: {
    width: 48,
    height: 48,
  },
  avatarBorder: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%' as any,
    height: '100%' as any,
  },
});