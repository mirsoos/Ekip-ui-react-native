import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { GlassInput, GlassAvatar } from '../Glass';
import { NotificationButton } from '../NotificationButton';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
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
  const SlidersIcon = getIcon('SlidersHorizontal');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.glassThickBg,
          borderBottomColor: colors.glassBorder,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cityText, { color: colors.textTertiary }]}>
            {user.city}
          </Text>
          <Text style={[styles.titleText, { color: colors.textPrimary }]}>
            Discover
          </Text>
        </View>

        <View style={styles.topActions}>
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

      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <GlassInput
            icon="Search"
            placeholder="Search Ekips, tags, sectors..."
            value={search}
            onChangeText={onChangeSearch}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    zIndex: 50,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
