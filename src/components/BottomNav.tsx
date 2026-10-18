import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Animated,
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

  // Layout measurements
  const [dockWidth, setDockWidth] = useState(0);
  const lensAnimX = useRef(new Animated.Value(0)).current;

  const handleDockLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) {
      setDockWidth(w);
    }
  };

  // Animate the Liquid Glass Lens follower whenever active tab changes
  useEffect(() => {
    if (dockWidth <= 0) return;
    const padding = 12; // 6px each side
    const innerWidth = dockWidth - padding;
    const slotW = innerWidth / 5;
    const targetX = 6 + activeIndex * slotW;

    Animated.spring(lensAnimX, {
      toValue: targetX,
      tension: 65,
      friction: 9,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [activeIndex, dockWidth]);

  const slotWidth = dockWidth > 0 ? (dockWidth - 12) / 5 : '20%';
  const isCreateActive = active === 'create';

  const handleTabPress = (key: TabKey) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // ignore
      }
    }
    onChange(key);
  };

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View
        onLayout={handleDockLayout}
        style={[
          styles.dockContainer,
          {
            backgroundColor: colors.glassThickBg,
            borderColor: colors.glassBorderStrong,
          },
        ]}
      >
        {/* iOS 26 Liquid Glass Sliding Lens Follower */}
        {Platform.OS === 'web' ? (
          <View
            // @ts-ignore
            className="glass-lens"
            style={{
              position: 'absolute',
              top: 6,
              bottom: 6,
              left: 6,
              width: 'calc((100% - 12px) / 5)' as any,
              transform: [{ translateX: `${activeIndex * 100}%` as any }],
              transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.3, 1), opacity 0.22s ease',
              opacity: isCreateActive ? 0 : 1,
              pointerEvents: 'none',
              borderRadius: 22,
              zIndex: 1,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.75)',
            } as any}
          >
            <LinearGradient
              colors={[
                isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.90)',
                isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.25)',
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.lensTopHighlight}
            />
          </View>
        ) : (
          <Animated.View
            style={[
              styles.liquidLens,
              {
                width: slotWidth,
                transform: [{ translateX: lensAnimX }],
                opacity: isCreateActive ? 0 : 1,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.75)',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.45)',
              },
            ]}
          >
            <LinearGradient
              colors={[
                isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.90)',
                isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.25)',
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.lensTopHighlight}
            />
          </Animated.View>
        )}

        {tabs.map((tab) => {
          const isActive = tab.key === active;
          const isCreate = tab.key === 'create';
          const IconComp = getIcon(tab.icon);
          const badgeCount = badges[tab.key] ?? 0;

          if (isCreate) {
            return (
              <View key={tab.key} style={styles.createSlot}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleTabPress('create')}
                  style={styles.createButtonWrapper}
                >
                  <LinearGradient
                    colors={['#f472b6', '#3b82f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.createOrb}
                  >
                    <IconComp
                      size={24}
                      color="#ffffff"
                      strokeWidth={2.8}
                      style={{
                        transform: [{ rotate: isActive ? '45deg' : '0deg' }],
                      }}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => handleTabPress(tab.key)}
              style={styles.tabItem}
            >
              <View style={styles.iconContainer}>
                {tab.key === 'profile' && me?.avatar_url ? (
                  <View
                    style={[
                      styles.avatarBorder,
                      {
                        borderColor: isActive ? colors.accentPink : 'transparent',
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: me.avatar_url }}
                      style={styles.avatarImg}
                    />
                  </View>
                ) : (
                  <IconComp
                    size={22}
                    color={isActive ? colors.accentPink : colors.textTertiary}
                    strokeWidth={isActive ? 2.5 : 1.9}
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
    shadowOpacity: 0.38,
    shadowRadius: 28,
    elevation: 14,
    overflow: 'visible',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(36px) saturate(150%)',
          WebkitBackdropFilter: 'blur(36px) saturate(150%)',
        }
      : {}),
  },
  liquidLens: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 1,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }
      : {}),
  },
  lensTopHighlight: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: '45%',
    borderRadius: 9999,
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
  createButtonWrapper: {
    marginTop: -24,
    shadowColor: '#f472b6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  createOrb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  avatarBorder: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
});
