import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Animated,
  PanResponder,
  type LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getIcon, type IconName } from '../lib/icons';
import { useAppData } from '../lib/appData';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';

import { LiquidLens } from './LiquidLens';

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

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { me, conversations, notifications } = useAppData();
  const { colors, isDark } = useTheme();
  const { t } = useI18n();

  const tabLabels: Record<TabKey, string> = {
    discover: t('nav.discover'),
    activity: t('nav.activity'),
    create: t('nav.create'),
    chat: t('nav.chat'),
    profile: t('nav.profile'),
  };

  const unreadChats = conversations.reduce((s, c) => s + c.unread_count, 0);
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  const badges: Partial<Record<TabKey, number>> = {
    chat: unreadChats,
    activity: unreadNotifs,
  };

  const activeIndex = Math.max(0, tabs.findIndex((t) => t.key === active));

  // Dock measurements & animation values
  const [dockWidth, setDockWidth] = useState(0);
  const lensX = useRef(new Animated.Value(0)).current;
  const lensScale = useRef(new Animated.Value(active === 'create' ? 0 : 1)).current;
  const createRotate = useRef(new Animated.Value(active === 'create' ? 1 : 0)).current;

  const isDragging = useRef(false);
  const currentLensX = useRef(0);
  const prevActiveTab = useRef(active);

  // Entrance animation (spring physics from bottom up)
  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enterAnim.setValue(0);
    Animated.spring(enterAnim, {
      toValue: 1,
      bounciness: 4,
      speed: 14,
      useNativeDriver: false,
    }).start();
  }, []);

  const enterTranslateY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [95, 0],
  });

  // Keep currentLensX tracked
  useEffect(() => {
    const id = lensX.addListener(({ value }) => {
      currentLensX.current = value;
    });
    return () => {
      lensX.removeListener(id);
    };
  }, [lensX]);

  // Handle dock width layout
  const handleDockLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) {
      if (dockWidth === 0) {
        const slotW = (w - 12) / 5;
        const initialX = 6 + activeIndex * slotW;
        lensX.setValue(initialX);
        currentLensX.current = initialX;
        lensScale.setValue(active === 'create' ? 0 : 1);
      }
      setDockWidth(w);
    }
  };

  // 1. Unified Tab Transition Animation
  useEffect(() => {
    if (dockWidth <= 0 || isDragging.current) return;

    const innerWidth = dockWidth - 12;
    const slotW = innerWidth / 5;
    const prev = prevActiveTab.current;
    prevActiveTab.current = active;

    const targetX = 6 + activeIndex * slotW;

    // Rotate Create plus icon smoothly: 0deg when normal, 45deg when create
    Animated.spring(createRotate, {
      toValue: active === 'create' ? 1 : 0,
      tension: 70,
      friction: 8,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    if (active === 'create') {
      // Transitioning INTO Create: slide to slot 2 and shrink to 0 inside Create button
      Animated.parallel([
        Animated.spring(lensX, {
          toValue: targetX,
          tension: 80,
          friction: 8.5,
          useNativeDriver: false,
        }),
        Animated.spring(lensScale, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (prev === 'create') {
      // Transitioning OUT OF Create: start at slot 2, pop from 0 to 1, and slide to targetX
      lensX.setValue(6 + 2 * slotW);
      Animated.parallel([
        Animated.spring(lensScale, {
          toValue: 1,
          tension: 110,
          friction: 7,
          useNativeDriver: false,
        }),
        Animated.spring(lensX, {
          toValue: targetX,
          tension: 80,
          friction: 8.5,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Standard tab transition (e.g. Discover -> Activity)
      lensScale.setValue(1);
      Animated.spring(lensX, {
        toValue: targetX,
        tension: 80,
        friction: 8.5,
        useNativeDriver: false,
      }).start();
    }
  }, [active, activeIndex, dockWidth]);

  // Create Plus icon rotation interpolation
  const plusRotation = createRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const handleSelectTab = (key: TabKey) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // ignore
      }
    }
    onChange(key);
  };

  // 2. Unified PanResponder for Drag & Drop (Touch on Mobile)
  const dragStartRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: (_, gs) => Math.abs(gs.dx) > 6,
      onPanResponderGrant: () => {
        isDragging.current = true;
        if (dockWidth <= 0) return;
        const slotW = (dockWidth - 12) / 5;
        if (active === 'create') {
          dragStartRef.current = 6 + 2 * slotW;
          lensX.setValue(dragStartRef.current);
          Animated.spring(lensScale, { toValue: 1, tension: 120, friction: 7, useNativeDriver: false }).start();
        } else {
          dragStartRef.current = currentLensX.current;
        }
      },
      onPanResponderMove: (_, gs) => {
        if (dockWidth <= 0) return;
        const slotW = (dockWidth - 12) / 5;
        const minX = 6;
        const maxX = 6 + 4 * slotW;
        const nextX = Math.max(minX, Math.min(maxX, dragStartRef.current + gs.dx));
        lensX.setValue(nextX);
      },
      onPanResponderRelease: (_, gs) => {
        isDragging.current = false;
        if (dockWidth <= 0) return;
        const slotW = (dockWidth - 12) / 5;
        const minX = 6;
        const maxX = 6 + 4 * slotW;
        const finalX = Math.max(minX, Math.min(maxX, dragStartRef.current + gs.dx));

        let droppedIndex = Math.round((finalX - 6) / slotW);
        droppedIndex = Math.max(0, Math.min(4, droppedIndex));

        const chosenTab = tabs[droppedIndex].key;
        handleSelectTab(chosenTab);

        if (chosenTab === 'create') {
          Animated.parallel([
            Animated.spring(lensX, { toValue: 6 + 2 * slotW, tension: 80, friction: 8.5, useNativeDriver: false }),
            Animated.spring(lensScale, { toValue: 0, tension: 100, friction: 8, useNativeDriver: false }),
          ]).start();
        } else {
          Animated.spring(lensX, {
            toValue: 6 + droppedIndex * slotW,
            tension: 80,
            friction: 8.5,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        isDragging.current = false;
        if (dockWidth > 0) {
          const slotW = (dockWidth - 12) / 5;
          const targetX = 6 + activeIndex * slotW;
          Animated.spring(lensX, { toValue: targetX, tension: 80, friction: 8.5, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  // 3. Unified Mouse Drag & Drop on Web
  const handleWebMouseDown = (e: React.MouseEvent) => {
    if (Platform.OS !== 'web' || dockWidth <= 0 || e.button !== 0) return;

    const startMouseX = e.clientX;
    const slotW = (dockWidth - 12) / 5;
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
          Animated.spring(lensScale, { toValue: 1, tension: 120, friction: 7, useNativeDriver: false }).start();
        }
      }
      if (hasMoved) {
        const nextX = Math.max(minX, Math.min(maxX, initialDragX + dx));
        lensX.setValue(nextX);
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
            Animated.spring(lensX, { toValue: 6 + 2 * slotW, tension: 80, friction: 8.5, useNativeDriver: false }),
            Animated.spring(lensScale, { toValue: 0, tension: 100, friction: 8, useNativeDriver: false }),
          ]).start();
        } else {
          Animated.spring(lensX, {
            toValue: 6 + droppedIndex * slotW,
            tension: 80,
            friction: 8.5,
            useNativeDriver: false,
          }).start();
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const slotWidth = dockWidth > 0 ? (dockWidth - 12) / 5 : '20%';

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <Animated.View
        onLayout={handleDockLayout}
        {...panResponder.panHandlers}
        {...(Platform.OS === 'web' ? { onMouseDown: handleWebMouseDown } : {})}
        style={[
          styles.dockContainer,
          {
            borderColor: colors.glassBorderStrong,
            transform: [{ translateY: enterTranslateY }],
          },
        ]}
      >
        {/* 360° Liquid Glass Lens for the entire navbar dock */}
        <LiquidLens
          borderRadius={36}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        {/* Active Tab Sliding Pill Indicator */}
        {dockWidth > 0 && (
          <Animated.View
            style={[
              styles.activeIndicator,
              {
                width: slotWidth,
                opacity: lensScale,
                transform: [
                  { translateX: lensX },
                  { scale: lensScale },
                ],
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.52)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.72)',
              },
            ]}
          />
        )}

        {/* Tab Buttons */}
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          const isCreate = tab.key === 'create';
          const badgeCount = badges[tab.key] ?? 0;
          const IconComp = getIcon(tab.icon);

          if (isCreate) {
            return (
              <View key={tab.key} style={styles.createSlot}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleSelectTab('create')}
                  style={styles.createOrbButton}
                >
                  <LinearGradient
                    colors={isActive ? ['#ec4899', '#6366f1'] : ['#f472b6', '#3b82f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.createOrbGradient}
                  >
                    <Animated.View style={{ transform: [{ rotate: plusRotation }] }}>
                      {React.createElement(getIcon('Plus'), {
                        size: 24,
                        color: '#ffffff',
                        strokeWidth: 2.8,
                      })}
                    </Animated.View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => handleSelectTab(tab.key)}
              style={styles.tabItem}
            >
              <View style={[styles.iconContainer, { transform: [{ translateY: isActive ? -2 : 0 }] }]}>
                {tab.key === 'profile' && me?.avatar_url ? (
                  <View
                    style={[
                      styles.avatarBorder,
                      { borderColor: isActive ? colors.accentPink : 'transparent' },
                    ]}
                  >
                    <Image source={{ uri: me.avatar_url }} style={styles.avatarImg as any} />
                  </View>
                ) : (
                  <IconComp
                    size={22}
                    color={isActive ? colors.accentPink : '#ffffff'}
                    strokeWidth={isActive ? 2.4 : 1.9}
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
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? colors.textPrimary : '#ffffff',
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tabLabels[tab.key] || tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 22 : 12,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
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
    borderRadius: 22,
    borderWidth: 1,
    zIndex: 1,
    pointerEvents: 'none',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
        } as any)
      : {}),
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
  createOrbButton: {
    marginTop: -20,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
    // @ts-ignore
    outlineStyle: 'none',
  },
  createOrbGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
