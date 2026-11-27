// --- START OF FILE ProfileScreen.tsx ---

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppData } from '@/src/lib/appData';
import { GlassCard, GlassButton, GlassEmpty, GlassAvatar } from '@/src/components/glass';
import { TactileSegmented } from '@/src/components/common/TactileSegmented';
import { GlassSheet, ProfileScreenSkeleton } from '@/src/components/common';
import { StatBox } from '@/src/components/common/StatBox';
import { ProfileHeaderCard } from '../components/ProfileHeaderCard';
import { ProfileXpCard } from '../components/ProfileXpCard';
import { EkipCard } from '@/src/features/ekip/components/EkipCard';
import {
  darkColors,
  lightColors,
  useTheme,
  colors as themeColors,
  brandColors,
  spacing,
  radii,
  sharedStyles,
} from '@/src/lib/theme';
import { useI18n } from '@/src/lib/i18n';
import { useToast } from '@/src/lib/ToastContext';
import { Icons, Icon } from '@/src/lib/icons';
import type { Badge, Friendship, Group, Mission } from '@/src/types/database';

type ProfileListItem =
  | { kind: 'group'; value: Group }
  | { kind: 'badge'; value: Badge }
  | { kind: 'mission'; value: Mission }
  | { kind: 'friend'; value: Friendship };

const PROFILE_BANNER_FALLBACK_STYLE = {
  light: { backgroundColor: lightColors.glassThinBg },
  dark: { backgroundColor: darkColors.glassThinBg },
};
const noopOpenProfile = (_id: string) => {};
const keyExtractor = (item: ProfileListItem) => `${item.kind}-${item.value.id}`;

function ProfileItemSeparator() {
  return <View style={styles.itemSeparator} />;
}

const ProfileGroupCard = React.memo(function ProfileGroupCard({
  group,
  onOpenGroup,
}: {
  group: Group;
  onOpenGroup: (group: Group) => void;
}) {
  const onPress = useCallback(() => onOpenGroup(group), [group, onOpenGroup]);
  return <EkipCard group={group} onPress={onPress} />;
});

const BadgeItemIcon = React.memo(function BadgeItemIcon({ name }: { name: string }) {
  return <Icon name={name} size={18} color={brandColors.brandPink} strokeWidth={2.4} />;
});

const ProfileBanner = React.memo(function ProfileBanner({
  bannerUrl,
  isDark,
}: {
  bannerUrl?: string | null;
  isDark: boolean;
}) {
  return (
    <View style={styles.bannerWrap}>
      {bannerUrl ? (
        <Image
          source={{ uri: bannerUrl }}
          style={styles.bannerImg}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
      ) : (
        <View
          style={[
            styles.bannerImg,
            PROFILE_BANNER_FALLBACK_STYLE[isDark ? 'dark' : 'light'],
          ]}
        />
      )}
      <LinearGradient
        colors={[themeColors.dark.overlay, themeColors.palette.transparent, themeColors.dark.overlay]}
        style={styles.bannerGradient}
      />
    </View>
  );
});

export function ProfileScreenComponent({
  userId,
  isOwnProfile,
  onBack,
  onOpenGroup,
  onOpenSettings,
  onOpenPersonalInfo,
  onOpenVerification,
  scrollY: externalScrollY,
  contentOffset = 0,
  isLoading = false,
}: {
  userId?: string;
  isOwnProfile: boolean;
  onBack?: () => void;
  onOpenGroup: (group: Group) => void;
  onOpenSettings: () => void;
  onOpenPersonalInfo?: () => void;
  onOpenVerification?: () => void;
  scrollY?: Animated.Value;
  contentOffset?: number;
  isLoading?: boolean;
}) {
  const { me, profiles, groups, members, badges, missions, friends, addFriend, updateFriend, addNotification } = useAppData();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const { showToast } = useToast();
  const [tab, setTab] = useState('activity');
  const [showActions, setShowActions] = useState(false);
  const [internalScrollY] = useState(() => new Animated.Value(0));
  const scrollY = externalScrollY ?? internalScrollY;

  const profile = useMemo(
    () => profiles.find((p) => p.id === userId) ?? me,
    [profiles, userId, me]
  );
  const isMe = profile.id === 'me';

  const myGroups = useMemo(() => {
    if (!isMe) return groups.filter((group) => group.owner_id === profile.id);
    const joinedGroupIds = new Set(
      members
        .filter((member) => member.user_id === 'me' && member.status === 'active')
        .map((member) => member.group_id)
    );
    return groups.filter(
      (group) => group.owner_id === 'me' || joinedGroupIds.has(group.id)
    );
  }, [groups, members, isMe, profile.id]);

  const myBadges = useMemo(
    () => badges.filter((b) => b.user_id === profile.id || (isMe && b.user_id === 'me')),
    [badges, profile.id, isMe]
  );

  const myMissions = useMemo(
    () => missions.filter((m) => m.user_id === profile.id || isMe),
    [missions, profile.id, isMe]
  );

  const myFriends = useMemo(
    () =>
      friends.filter(
        (f) => (f.user_id === profile.id || f.friend_id === profile.id) && f.status === 'accepted'
      ),
    [friends, profile.id]
  );

  const existingFriend = useMemo(
    () =>
      friends.find(
        (f) => f.friend_id === profile.id || (f.user_id === profile.id && f.friend_id === 'me')
      ),
    [friends, profile.id]
  );

  const profileTabs = useMemo(
    () => [
      { label: t('profile.tabOps'), value: 'activity', icon: 'Layers' as const },
      { label: t('profile.tabMedals'), value: 'badges', icon: 'Award' as const },
      { label: t('profile.tabDirectives'), value: 'missions', icon: 'Target' as const },
      { label: t('profile.tabContacts'), value: 'friends', icon: 'Users' as const },
    ],
    [t]
  );

  const listData = useMemo<ProfileListItem[]>(() => {
    if (tab === 'activity') return myGroups.map((value) => ({ kind: 'group', value }));
    if (tab === 'badges') return myBadges.map((value) => ({ kind: 'badge', value }));
    if (tab === 'missions') return myMissions.map((value) => ({ kind: 'mission', value }));
    return myFriends
      .filter((friend) => Boolean(friend.profile))
      .map((value) => ({ kind: 'friend', value }));
  }, [myBadges, myFriends, myGroups, myMissions, tab]);

  const rowDirStyle = useMemo(
    () => ({ flexDirection: (isRTL ? 'row-reverse' : 'row') as 'row' | 'row-reverse' }),
    [isRTL]
  );

  const textDirStyle = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'left' | 'right' }),
    [isRTL]
  );

  const itemTextSpacing = useMemo(
    () => ({
      marginLeft: isRTL ? 0 : 10,
      marginRight: isRTL ? 10 : 0,
    }),
    [isRTL]
  );

  const renderItem = useCallback(
    ({ item }: { item: ProfileListItem }) => {
      if (item.kind === 'group') {
        return <ProfileGroupCard group={item.value} onOpenGroup={onOpenGroup} />;
      }

      if (item.kind === 'badge') {
        return (
          <GlassCard variant="thin" style={[styles.badgeCard, rowDirStyle]}>
            <View style={styles.badgeIcon}>
              <BadgeItemIcon name={item.value.icon || 'Award'} />
            </View>
            <View style={[styles.itemText, itemTextSpacing]}>
              <Text
                style={[styles.itemTitle, { color: colors.textPrimary }, textDirStyle]}
                numberOfLines={1}
              >
                {item.value.name}
              </Text>
              <Text
                style={[styles.itemDescription, { color: colors.textTertiary }, textDirStyle]}
                numberOfLines={1}
              >
                {item.value.description}
              </Text>
            </View>
          </GlassCard>
        );
      }

      if (item.kind === 'mission') {
        const mission = item.value;
        const progress = Math.min(100, Math.max(0, (mission.progress / (mission.target || 1)) * 100));
        return (
          <GlassCard variant="thin" style={styles.missionCard}>
            <View style={[styles.missionTop, rowDirStyle]}>
              <Text style={[styles.itemTitle, { color: colors.textPrimary }, textDirStyle]}>
                {mission.title}
              </Text>
              <Text style={styles.missionReward}>+{mission.xp_reward} XP</Text>
            </View>
            <Text style={[styles.itemDescription, { color: colors.textSecondary }, textDirStyle]}>
              {mission.description}
            </Text>
            <View style={[styles.missionProgressRow, rowDirStyle]}>
              <Text style={[styles.itemDescription, { color: colors.textTertiary }]}>
                {isRTL ? 'میزان پیشرفت' : 'Progress'}
              </Text>
              <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                {mission.progress} / {mission.target}
              </Text>
            </View>
            <View
              style={[
                styles.missionProgressTrack,
                rowDirStyle,
                { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
              ]}
            >
              <View style={[styles.missionProgressBar, { width: `${progress}%` }]} />
            </View>
            {mission.is_complete && (
              <Text style={[styles.missionComplete, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
                {isRTL ? 'تکمیل شد' : 'Completed'}
              </Text>
            )}
          </GlassCard>
        );
      }

      const friend = item.value;
      const friendProfile = friend.profile;
      if (!friendProfile) return null;
      const ChevronIcon = isRTL ? Icons.ChevronLeft : Icons.ChevronRight;
      return (
        <TouchableOpacity activeOpacity={0.75} onPress={() => noopOpenProfile(friendProfile.id)}>
          <GlassCard variant="thin" style={[styles.friendCard, rowDirStyle]}>
            <GlassAvatar
              user={friendProfile}
              src={friendProfile.avatar_url}
              name={`${friendProfile.first_name} ${friendProfile.last_name}`}
              size={42}
            />
            <View style={[styles.itemText, itemTextSpacing]}>
              <Text
                style={[styles.itemTitle, { color: colors.textPrimary }, textDirStyle]}
                numberOfLines={1}
              >
                {friendProfile.first_name} {friendProfile.last_name}
              </Text>
              <Text
                style={[styles.itemDescription, { color: colors.textTertiary }, textDirStyle]}
                numberOfLines={1}
              >
                @{friendProfile.username} {friendProfile.job ? `· ${friendProfile.job}` : ''}
              </Text>
            </View>
            <ChevronIcon size={18} color={colors.textTertiary} />
          </GlassCard>
        </TouchableOpacity>
      );
    },
    [colors, isRTL, itemTextSpacing, onOpenGroup, rowDirStyle, textDirStyle]
  );

  const scrollContentStyle = useMemo(
    () => [
      styles.scrollContent,
      {
        paddingBottom: isOwnProfile ? spacing.bottomNavClearance + insets.bottom : spacing.xxl + insets.bottom,
      },
    ],
    [insets.bottom, isOwnProfile]
  );

  const initialOffset = useMemo(
    () => (contentOffset > 0 ? { x: 0, y: contentOffset } : undefined),
    [contentOffset]
  );

  const onScroll = useMemo(
    () =>
      Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: Platform.OS !== 'web' }
      ),
    [scrollY]
  );

  const closeActions = useCallback(() => setShowActions(false), []);

  const onReportIncident = useCallback(() => {
    setShowActions(false);
    showToast(isRTL ? 'گزارش تخلف ثبت گردید' : 'Report transmitted to Command');
  }, [isRTL, showToast]);

  const handleAddFriend = useCallback(() => {
    if (existingFriend) {
      updateFriend(existingFriend.id, 'accepted');
      showToast(isRTL ? 'درخواست دوستی تایید شد' : 'Friend request accepted');
    } else {
      addFriend(profile.id);
      showToast(isRTL ? 'درخواست دوستی ارسال شد' : 'Friend request sent');
    }
    addNotification({
      type: 'friend_request',
      title: isRTL ? 'دوستی جدید' : 'New Friend',
      body: isRTL
        ? `شما با ${profile.first_name} دوست شدید.`
        : `You are now connected with ${profile.first_name}.`,
      icon: 'UserCheck',
    });
    setShowActions(false);
  }, [
    existingFriend,
    updateFriend,
    isRTL,
    addFriend,
    profile.id,
    profile.first_name,
    addNotification,
    showToast,
  ]);

  const handleOpenActions = useCallback(() => setShowActions(true), []);

  const isFriendAccepted = Boolean(existingFriend && existingFriend.status === 'accepted');

  // Memoize کردن هدر سنگین پروفایل تا با باز/بسته شدن شیت یا Toast دوباره ساخته نشود
  const listHeader = useMemo(
    () => (
      <View>
        <ProfileBanner bannerUrl={profile.banner_url} isDark={isDark} />
        <ProfileHeaderCard
          profile={profile}
          isOwnProfile={isOwnProfile}
          isFriend={isFriendAccepted}
          onAddFriend={handleAddFriend}
          onOpenActions={handleOpenActions}
          onOpenVerification={onOpenVerification}
          hideAvatar
        />
        <View style={[styles.statsRow, rowDirStyle]}>
          <StatBox icon="Layers" value={myGroups.length} label={t('profile.operations')} />
          <StatBox icon="Award" value={myBadges.length} label={t('profile.medals')} />
          <StatBox icon="Users" value={myFriends.length} label={t('profile.contacts')} />
          <StatBox icon="Shield" value={profile.honor_score} label={t('profile.readiness')} highlight />
        </View>
        <View style={styles.xpWrap}>
          <ProfileXpCard profile={profile} />
        </View>
        <View style={styles.tabsWrap}>
          <TactileSegmented options={profileTabs} value={tab} onChange={setTab} />
        </View>
        <View style={styles.headerBottomSpacer} />
      </View>
    ),
    [
      profile,
      isDark,
      isOwnProfile,
      isFriendAccepted,
      handleAddFriend,
      handleOpenActions,
      onOpenVerification,
      rowDirStyle,
      myGroups.length,
      t,
      myBadges.length,
      myFriends.length,
      profileTabs,
      tab,
    ]
  );

  const emptyComponent = useMemo(() => {
    const emptyNode =
      tab === 'activity' ? (
        <GlassEmpty
          icon="Layers"
          title={t('profile.noMissions')}
          subtitle={
            isRTL
              ? 'در اکیپ‌ها و دورهمی‌های مختلف شرکت کنید تا آمار فعالیت شما ثبت شود.'
              : 'Join Ekips and hangouts to build your activity stats.'
          }
        />
      ) : tab === 'badges' ? (
        <GlassEmpty
          icon="Award"
          title={isRTL ? 'هنوز نشانی دریافت نکرده‌اید' : 'No badges earned'}
          subtitle={
            isRTL
              ? 'در دورهمی‌ها شرکت کنید و چالش‌ها را کامل کنید تا نشان‌ها فعال شوند.'
              : 'Join hangouts and complete challenges to unlock badges.'
          }
        />
      ) : tab === 'missions' ? (
        <GlassEmpty
          icon="Target"
          title={isRTL ? 'هیچ چالش فعالی وجود ندارد' : 'No active challenges'}
          subtitle={
            isRTL
              ? 'چالش‌ها و ماموریت‌های جدید به زودی اضافه خواهند شد.'
              : 'New social challenges are added periodically.'
          }
        />
      ) : (
        <GlassEmpty
          icon="Users"
          title={isRTL ? 'هیچ مخاطبی متصل نشده است' : 'No linked contacts'}
          subtitle={
            isRTL
              ? 'با سایر اعضای فعال در عملیات‌ها ارتباط برقرار کنید.'
              : 'Connect with active operatives across field operations.'
          }
        />
      );

    return <View style={styles.tabContentWrap}>{emptyNode}</View>;
  }, [isRTL, t, tab]);

  const renderListItem = useCallback(
    ({ item }: { item: ProfileListItem }) => (
      <View style={styles.tabContentWrap}>{renderItem({ item })}</View>
    ),
    [renderItem]
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ProfileScreenSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList<ProfileListItem>
        data={listData}
        contentOffset={initialOffset}
        renderItem={renderListItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={emptyComponent}
        ItemSeparatorComponent={ProfileItemSeparator}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={scrollContentStyle}
        scrollEventThrottle={16}
        onScroll={onScroll}
      />

      {/* Action sheet for other users */}
      <GlassSheet
        open={showActions}
        onClose={closeActions}
        title={isRTL ? 'گزینه‌های کاربر' : 'Operative Options'}
      >
        <View style={{ gap: spacing.md, paddingVertical: spacing.sm }}>
          <GlassButton fullWidth variant="secondary" onPress={handleAddFriend}>
            {existingFriend
              ? isRTL
                ? 'تایید پیوند ارتباطی'
                : 'Confirm Contact Link'
              : isRTL
              ? 'ارسال درخواست ارتباط'
              : 'Send Link Request'}
          </GlassButton>
          <GlassButton fullWidth variant="danger" onPress={onReportIncident}>
            {isRTL ? 'ثبت گزارش تخلف تاکتیکی' : 'File Tactical Incident Report'}
          </GlassButton>
        </View>
      </GlassSheet>
    </View>
  );
}

export const ProfileScreen = React.memo(ProfileScreenComponent);

const styles = StyleSheet.create({
  container: {
    ...sharedStyles.screenContainer,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  bannerWrap: {
    position: 'relative',
    height: 180,
    width: '100%',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  statsRow: {
    ...sharedStyles.row,
    gap: spacing.sm,
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
  },
  xpWrap: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
  },
  tabsWrap: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.sm,
  },
  headerBottomSpacer: {
    height: spacing.md,
  },
  itemSeparator: {
    height: spacing.sm,
  },
  tabContentWrap: {
    paddingHorizontal: spacing.screenPadding,
  },
  badgeCard: {
    ...sharedStyles.row,
    padding: spacing.sm,
    borderRadius: radii.lg,
  },
  badgeIcon: {
    width: 38,
    height: 38,
    borderRadius: radii.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkColors.glassPillBg,
  },
  itemText: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemDescription: {
    fontSize: 11,
    marginTop: spacing.xxs,
  },
  missionCard: {
    padding: spacing.md,
    borderRadius: radii.card,
  },
  missionTop: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  missionReward: {
    fontSize: 11,
    fontWeight: '800',
    color: darkColors.brandPink,
  },
  missionProgressRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  missionProgressTrack: {
    height: 8,
    borderRadius: radii.xxs,
    borderWidth: 1,
    overflow: 'hidden',
  },
  missionProgressBar: {
    height: '100%',
    borderRadius: radii.xxs,
    backgroundColor: darkColors.brandPink,
  },
  missionComplete: {
    fontSize: 10,
    fontWeight: '700',
    color: darkColors.success,
    marginTop: spacing.sm,
  },
  friendCard: {
    ...sharedStyles.row,
    padding: spacing.sm,
    borderRadius: radii.card,
  },
});
