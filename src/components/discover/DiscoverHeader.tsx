import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { GlassInput, GlassAvatar } from '../Glass';
import { NotificationButton } from '../NotificationButton';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Profile } from '../../types/database';

export interface DiscoverHeaderProps {
  user: Profile;
  unreadCount: number;
  search: string;
  onChangeSearch: (val: string) => void;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  onOpenNotifications: () => void;
  onOpenOwnProfile: () => void;
}

export function DiscoverHeader({
  user,
  unreadCount,
  search,
  onChangeSearch,
  hasActiveFilters,
  onOpenFilters,
  onOpenNotifications,
  onOpenOwnProfile,
}: DiscoverHeaderProps) {
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const SlidersIcon = getIcon('SlidersHorizontal');

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
    outputRange: [-85, 0],
  });

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.container,
          {
            borderColor: colors.glassBorderStrong,
            transform: [{ translateY: enterTranslateY }],
          },
        ]}
      >
        {/* 360° Liquid Glass Lens */}
        <LiquidLens
          borderRadius={28}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.topRow}>
          <View style={{ flex: 1, zIndex: 10 }}>
            <Text style={[styles.cityText, { color: colors.textTertiary }]}>
              {user.city}
            </Text>
            <Text style={[styles.titleText, { color: colors.textPrimary }]}>
              {t('discover.title')}
            </Text>
          </View>

          <View style={[styles.topActions, { zIndex: 10 }]}>
            <NotificationButton
              unreadCount={unreadCount}
              onPress={onOpenNotifications}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onOpenOwnProfile}
              style={{ marginLeft: 8 }}
            >
              <GlassAvatar
                src={user.avatar_url}
                name={`${user.first_name} ${user.last_name}`}
                size={38}
                online
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.searchRow, { zIndex: 10 }]}>
          <View style={{ flex: 1 }}>
            <GlassInput
              icon="Search"
              placeholder={t('discover.searchPlaceholder')}
              value={search}
              onChangeText={onChangeSearch}
              style={{
                backgroundColor: isDark ? '#101625' : '#f0f4fa',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
              }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onOpenFilters}
            style={[
              styles.filterBtn,
              {
                borderColor: hasActiveFilters
                  ? colors.accentPink
                  : colors.glassBorderStrong,
              },
            ]}
          >
            <LiquidLens
              borderRadius={20}
              marginWidth={9}
              scale={22}
              blurDeviation={1.6}
              overlayOpacity={
                hasActiveFilters
                  ? 0.25
                  : isDark
                  ? 0.10
                  : 0.22
              }
              style={StyleSheet.absoluteFill}
            />
            {hasActiveFilters && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: 'rgba(244, 114, 182, 0.20)',
                    borderRadius: 20,
                    zIndex: 1,
                    pointerEvents: 'none',
                  },
                ]}
              />
            )}
            <View style={styles.filterIconWrap}>
              <SlidersIcon
                size={18}
                color={hasActiveFilters ? colors.accentPink : colors.textPrimary}
                strokeWidth={2.2}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    zIndex: 900,
  },
  container: {
    position: 'relative',
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
    overflow: 'visible',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    zIndex: 10,
  },
  cityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  filterIconWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
