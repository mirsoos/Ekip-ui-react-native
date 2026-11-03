// --- START OF FILE SelectMembersSheet.tsx ---

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { GlassCard, GlassAvatar, GlassButton, GlassEmpty, GlassSegmented, GlassInput } from '../Glass';
import { GlassSheet } from '../Overlays';
import { useAppData } from '../../lib/appData';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Profile } from '../../types/database';

export interface SelectMembersSheetProps {
  open: boolean;
  onClose: () => void;
  selectedMembers: Profile[];
  onToggleMember: (profile: Profile) => void;
  maxSelection?: number;
}

interface MemberAddRemoveButtonProps {
  isAdded: boolean;
  disabled?: boolean;
  onPress: () => void;
  size?: number;
}

const MemberAddRemoveButton = React.memo(function MemberAddRemoveButton({
  isAdded,
  disabled,
  onPress,
  size = 38,
}: MemberAddRemoveButtonProps) {
  const anim = useRef(new Animated.Value(isAdded ? 1 : 0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isAdded ? 1 : 0,
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    }).start();
  }, [isAdded, anim]);

  const activeHeight = Math.max(14, Math.round(size * 0.38));
  const activeRadius = Math.round(activeHeight / 2);

  const buttonHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [size, activeHeight],
  });

  const buttonRadius = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [size / 2, activeRadius],
  });

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#22c55e', '#ef4444'],
  });

  const vLineOpacity = anim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [1, 0.2, 0],
  });

  const vLineScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const handlePressIn = useCallback(() => {
    Animated.spring(pressScale, {
      toValue: 0.88,
      useNativeDriver: Platform.OS !== 'web',
      speed: 40,
      bounciness: 4,
    }).start();
  }, [pressScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
      speed: 30,
      bounciness: 6,
    }).start();
  }, [pressScale]);

  const lineWidth = Math.round(size * 0.44);
  const lineHeight = Math.max(2.5, Math.round(size * 0.07));
  const radius = Math.round(size / 2);

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        opacity: disabled ? 0.45 : 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale: pressScale }],
        }}
      >
        <Animated.View
          style={[
            styles.toggleButton,
            {
              width: size,
              height: buttonHeight,
              borderRadius: buttonRadius,
              backgroundColor,
            },
          ]}
        >
          {/* Horizontal Line (-) */}
          <View
            style={{
              position: 'absolute',
              width: lineWidth,
              height: lineHeight,
              borderRadius: lineHeight / 2,
              backgroundColor: '#ffffff',
            }}
          />

          {/* Vertical Line (|) */}
          <Animated.View
            style={{
              position: 'absolute',
              width: lineHeight,
              height: lineWidth,
              borderRadius: lineHeight / 2,
              backgroundColor: '#ffffff',
              opacity: vLineOpacity,
              transform: [{ scaleY: vLineScale }],
            }}
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
});

export function SelectMembersSheetComponent({
  open,
  onClose,
  selectedMembers,
  onToggleMember,
  maxSelection,
}: SelectMembersSheetProps) {
  const { profiles, friends, me } = useAppData();
  const { colors } = useTheme();
  const { isRTL } = useI18n();

  const [activeTab, setActiveTab] = useState<'friends' | 'search'>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedIds = useMemo(
    () => new Set(selectedMembers.map((m) => m.id)),
    [selectedMembers]
  );

  // 1. Friends list (excluding current user)
  const friendsList = useMemo(() => {
    const friendProfiles: Profile[] = [];
    const profilesById = new Map(profiles.map((p) => [p.id, p]));

    for (const f of friends) {
      if (f.status === 'accepted') {
        const otherId = f.user_id === me.id ? f.friend_id : f.user_id;
        const p = f.profile ?? profilesById.get(otherId);
        if (p && p.id !== me.id) {
          friendProfiles.push(p);
        }
      }
    }

    const baseList =
      friendProfiles.length === 0
        ? profiles.filter((p) => p.id !== me.id).slice(0, 5)
        : friendProfiles;

    const q = searchQuery.trim().toLowerCase();
    if (!q) return baseList;

    return baseList.filter((p) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      const username = (p.username ?? '').toLowerCase();
      const city = (p.city ?? '').toLowerCase();
      const job = (p.job ?? '').toLowerCase();
      const interests = (p.interests ?? []).join(' ').toLowerCase();

      return (
        fullName.includes(q) ||
        username.includes(q) ||
        city.includes(q) ||
        job.includes(q) ||
        interests.includes(q)
      );
    });
  }, [friends, me.id, profiles, searchQuery]);

  // 2. Search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const candidates = profiles.filter((p) => p.id !== me.id);
    if (!q) return candidates;

    return candidates.filter((p) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      const username = (p.username ?? '').toLowerCase();
      const city = (p.city ?? '').toLowerCase();
      const job = (p.job ?? '').toLowerCase();
      const interests = (p.interests ?? []).join(' ').toLowerCase();

      return (
        fullName.includes(q) ||
        username.includes(q) ||
        city.includes(q) ||
        job.includes(q) ||
        interests.includes(q)
      );
    });
  }, [me.id, profiles, searchQuery]);

  const tabOptions = useMemo(
    () =>
      isRTL
        ? [
            { label: 'جستجو', value: 'search', icon: 'Search' as const },
            { label: 'دوستان', value: 'friends', icon: 'Users' as const },
          ]
        : [
            { label: 'Friends', value: 'friends', icon: 'Users' as const },
            { label: 'Search', value: 'search', icon: 'Search' as const },
          ],
    [isRTL]
  );

  const currentList = activeTab === 'friends' ? friendsList : searchResults;

  return (
    <GlassSheet
      open={open}
      onClose={onClose}
      fullHeight={true} // 👈 قفل کردن ارتفاع شیت تا هنگام سرچ یا تعویض تب دوستان/جستجو نپرد!
      title={
        typeof maxSelection === 'number'
          ? isRTL
            ? `معرفی اعضا (حداکثر ${maxSelection} نفر)`
            : `Introduce Members (Max ${maxSelection})`
          : isRTL
          ? 'معرفی اعضای اولیه'
          : 'Introduce Initial Members'
      }
      headerContent={
        <View style={{ gap: 10 }}>
          <GlassSegmented
            options={tabOptions}
            value={activeTab}
            onChange={(v) => setActiveTab(v as 'friends' | 'search')}
          />

          <GlassInput
            icon="Search"
            placeholder={
              activeTab === 'friends'
                ? isRTL
                  ? 'جستجو در بین دوستان...'
                  : 'Search in friends...'
                : isRTL
                ? 'جستجو بر اساس نام، شهر، مهارت یا شغل...'
                : 'Search by name, city, skill...'
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      }
      footerContent={
        <GlassButton variant="primary" fullWidth onPress={onClose}>
          {isRTL
            ? `تایید (${selectedMembers.length} نفر انتخاب شده)`
            : `Confirm (${selectedMembers.length} selected)`}
        </GlassButton>
      }
    >
      <View style={{ gap: 10, paddingBottom: 10 }}>
        {currentList.length === 0 ? (
          <GlassEmpty
            icon={activeTab === 'friends' ? 'Users' : 'Search'}
            title={
              activeTab === 'friends'
                ? isRTL
                  ? 'دوستی یافت نشد'
                  : 'No friends found'
                : isRTL
                ? 'کاربری یافت نشد'
                : 'No users found'
            }
            subtitle={
              activeTab === 'friends'
                ? isRTL
                  ? 'هیچ موردی مطابق جستجو یافت نشد.'
                  : 'No matching friends found.'
                : isRTL
                ? 'عبارت دیگری را جستجو کنید.'
                : 'Try a different search term.'
            }
          />
        ) : (
          currentList.map((profile) => {
            const isAdded = selectedIds.has(profile.id);
            const isLimitReached =
              !isAdded && typeof maxSelection === 'number' && selectedMembers.length >= maxSelection;

            return (
              <GlassCard key={profile.id} variant="thin" style={styles.card}>
                <View style={[styles.profileRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <GlassAvatar
                    user={profile}
                    src={profile.avatar_url}
                    name={`${profile.first_name} ${profile.last_name}`}
                    size={42}
                  />

                  <View
                    style={{
                      flex: 1,
                      marginLeft: isRTL ? 0 : 10,
                      marginRight: isRTL ? 10 : 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Text
                        style={[
                          styles.name,
                          { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' },
                        ]}
                        numberOfLines={1}
                      >
                        {profile.first_name} {profile.last_name}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.meta,
                        { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' },
                      ]}
                      numberOfLines={1}
                    >
                      {profile.job ? `${profile.job} · ` : ''}
                      {profile.city ?? ''}
                    </Text>
                  </View>

                  <MemberAddRemoveButton
                    isAdded={isAdded}
                    disabled={isLimitReached}
                    onPress={() => onToggleMember(profile)}
                  />
                </View>
              </GlassCard>
            );
          })
        )}
      </View>
    </GlassSheet>
  );
}

export const SelectMembersSheet = React.memo(SelectMembersSheetComponent);

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  meta: {
    fontSize: 11,
    marginTop: 2,
  },
  toggleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }
      : Platform.OS === 'android'
      ? { elevation: 3 }
      : ({
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
        } as any)),
  },
});