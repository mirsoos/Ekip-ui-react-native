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

function getLiquidLensNormalMap(w: number, h: number, r: number, margin: number): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;
  const bx = w / 2;
  const by = h / 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const px = x - bx + 0.5;
      const py = y - by + 0.5;

      const qx = Math.abs(px) - (bx - r);
      const qy = Math.abs(py) - (by - r);
      const d = Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r;

      let rVal = 128;
      let gVal = 128;

      if (d > -margin && d <= 0) {
        const t = (-d) / margin;

        // Ultra-soft feather fade into center (smoothstep rise + cos^2 silky fadeout)
        let strength: number;
        if (t < 0.28) {
          const u = t / 0.28;
          strength = u * u * (3 - 2 * u);
        } else {
          const u = (t - 0.28) / 0.72;
          strength = Math.cos(u * Math.PI * 0.5) ** 2;
        }

        const eps = 0.5;
        const qx1 = Math.abs(px + eps) - (bx - r);
        const qy1 = Math.abs(py) - (by - r);
        const d1 = Math.min(Math.max(qx1, qy1), 0) + Math.hypot(Math.max(qx1, 0), Math.max(qy1, 0)) - r;

        const qx2 = Math.abs(px) - (bx - r);
        const qy2 = Math.abs(py + eps) - (by - r);
        const d2 = Math.min(Math.max(qx2, qy2), 0) + Math.hypot(Math.max(qx2, 0), Math.max(qy2, 0)) - r;

        const gx = (d1 - d) / eps;
        const gy = (d2 - d) / eps;
        const len = Math.hypot(gx, gy) || 1;

        const nx = -(gx / len);
        const ny = -(gy / len);

        rVal = Math.round(128 + nx * 120 * strength);
        gVal = Math.round(128 + ny * 120 * strength);
      }

      data[idx] = rVal;
      data[idx + 1] = gVal;
      data[idx + 2] = 128;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { me, conversations, notifications } = useAppData();
  const { colors, isDark } = useTheme();

  const unreadChats = conversations.reduce((s, c) => s + c.unread_count, 0);
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  const badges: Partial<Record<TabKey, number>> = {
    chat: unreadChats,
    activity: unreadNotifs,
  };

  const activeIndex = Math.max(0, tabs.findIndex((t) => t.key === active));

  // Dock measurements & animation values
  const [dockWidth, setDockWidth] = useState(0);

  // Generate deterministic 360-degree liquid lens normal map (SDF of rounded capsule)
  const normalMapUri = useMemo(() => {
    if (Platform.OS !== 'web') return '';
    const slotW = dockWidth > 0 ? Math.round((dockWidth - 12) / 5) : 74;
    return getLiquidLensNormalMap(slotW, 48, 22, 14);
  }, [dockWidth]);
  const lensX = useRef(new Animated.Value(0)).current;
  const lensScale = useRef(new Animated.Value(active === 'create' ? 0 : 1)).current;
  const createRotate = useRef(new Animated.Value(active === 'create' ? 1 : 0)).current;

  const isDragging = useRef(false);
  const currentLensX = useRef(0);
  const prevActiveTab = useRef(active);

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
      <View
        onLayout={handleDockLayout}
        {...panResponder.panHandlers}
        {...(Platform.OS === 'web' ? { onMouseDown: handleWebMouseDown } : {})}
        style={[
          styles.dockContainer,
          {
            borderColor: colors.glassBorderStrong,
          },
        ]}
      >
        {/* Active Indicator (Liquid Glass Lens - Rendered underneath tabs) */}
        {dockWidth > 0 && (
          <Animated.View
            style={[
              styles.liquidLens,
              {
                width: slotWidth,
                opacity: lensScale,
                transform: [
                  { translateX: lensX },
                  { scale: lensScale },
                ],
              },
            ]}
          >
            {Platform.OS === 'web' && (
              <svg style={{ display: 'none' }} aria-hidden="true">
                <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
                  {/* 1. Center matte frost blur (فقط کمی ماته) */}
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="matteBackdrop" />

                  {/* 2. Deterministic 360-degree rounded capsule lens normal map */}
                  {normalMapUri ? (
                    <feImage
                      href={normalMapUri}
                      preserveAspectRatio="none"
                      result="refractionMap"
                    />
                  ) : null}

                  {/* 3. Displace matte backdrop smoothly along all inner margins */}
                  <feDisplacementMap
                    in="matteBackdrop"
                    in2="refractionMap"
                    scale="36"
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="refracted"
                  />
                </filter>
              </svg>
            )}
            <View style={styles.glassFilter} />
            <View style={styles.glassOverlay} />
            <View style={styles.glassSpecular} />
          </Animated.View>
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
                    color={isActive ? colors.accentPink : colors.textTertiary}
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
                    color: isActive ? colors.textPrimary : colors.textTertiary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  liquidLens: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    backgroundColor: 'transparent',
    borderRadius: 22,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 1,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)',
        } as any)
      : {}),
  },
  glassFilter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.001)',
    pointerEvents: 'none',
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
          filter: 'url(#lg-dist)',
          isolation: 'isolate',
        } as any)
      : {}),
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  glassSpecular: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    borderRadius: 22,
    overflow: 'hidden',
    pointerEvents: 'none',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow:
            'inset 0 1px 1px rgba(255, 255, 255, 0.55), inset 0 -1px 1px rgba(255, 255, 255, 0.1)',
        } as any)
      : {
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.75)',
        }),
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
