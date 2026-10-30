import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassButton, GlassSegmented, GlassEmpty, GlassAvatar } from '../components/Glass';
import { GlassSheet, Toast } from '../components/Overlays';
import { StatBox } from '../components/common/StatBox';
import { ProfileHeaderCard } from '../components/profile/ProfileHeaderCard';
import { ProfileXpCard } from '../components/profile/ProfileXpCard';
import { EkipCard } from '../components/EkipCard';
import { ProfileScreenSkeleton } from '../components/skeleton';
import { darkColors, lightColors, useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { getIcon, type IconName } from '../lib/icons';
import type { Badge, Friendship, Group, Mission } from '../types/database';

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
        <Image source={{ uri: bannerUrl }} style={styles.bannerImg} />
      ) : (
        <View
          style={[
            styles.bannerImg,
            PROFILE_BANNER_FALLBACK_STYLE[isDark ? 'dark' : 'light'],
          ]}
        />
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.6)']}
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
  isLoading?: boolean;
}) {
  const { me, profiles, groups, members, badges, missions, friends, addFriend, updateFriend, addNotification } = useAppData();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const [tab, setTab] = useState('activity');
  const [showActions, setShowActions] = useState(false);
  const [toast, setToast] = useState('');
  const [internalScrollY] = useState(() => new Animated.Value(0));
  const scrollY = externalScrollY ?? internalScrollY;

  const profile = useMemo(() => profiles.find((p) => p.id === userId) ?? me, [profiles, userId, me]);
  const isMe = profile.id === 'me';

  const myGroups = useMemo(
    () => {
      if (!isMe) return groups.filter((group) => group.owner_id === profile.id);
      const joinedGroupIds = new Set(
        members
          .filter((member) => member.user_id === 'me' && member.status === 'active')
          .map((member) => member.group_id)
      );
      return groups.filter(
        (group) => group.owner_id === 'me' || joinedGroupIds.has(group.id)
      );
    },
    [groups, members, isMe, profile.id]
  );
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
    () => friends.find((f) => f.friend_id === profile.id || (f.user_id === profile.id && f.friend_id === 'me')),
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
  const renderItem = useCallback(({ item }: { item: ProfileListItem }) => {
    if (item.kind === 'group') {
      return <ProfileGroupCard group={item.value} onOpenGroup={onOpenGroup} />;
    }

    if (item.kind === 'badge') {
      const BadgeIcon = getIcon((item.value.icon as IconName) ?? 'Award');
      return (
        <GlassCard variant="thin" style={styles.badgeCard}>
          <View style={styles.badgeIcon}>
            <BadgeIcon size={18} color="#f472b6" strokeWidth={2.4} />
          </View>
          <View style={styles.itemText}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              {item.value.name}
            </Text>
            <Text style={[styles.itemDescription, { color: colors.textTertiary }]} numberOfLines={1}>
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
          <View style={[styles.missionTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
              {mission.title}
            </Text>
            <Text style={styles.missionReward}>+{mission.xp_reward} XP</Text>
          </View>
          <Text style={[styles.itemDescription, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {mission.description}
          </Text>
          <View style={[styles.missionProgressRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.itemDescription, { color: colors.textTertiary }]}>
              {isRTL ? 'میزان پیشرفت' : 'Progress'}
            </Text>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
              {mission.progress} / {mission.target}
            </Text>
          </View>
          <View style={[styles.missionProgressTrack, { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder }]}>
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
    const ChevronRight = getIcon(isRTL ? 'ChevronLeft' : 'ChevronRight');
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={() => noopOpenProfile(friendProfile.id)}>
        <GlassCard variant="thin" style={styles.friendCard}>
          <GlassAvatar
            src={friendProfile.avatar_url}
            name={`${friendProfile.first_name} ${friendProfile.last_name}`}
            size={42}
          />
          <View style={styles.itemText}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              {friendProfile.first_name} {friendProfile.last_name}
            </Text>
            <Text style={[styles.itemDescription, { color: colors.textTertiary }]} numberOfLines={1}>
              @{friendProfile.username} {friendProfile.job ? `· ${friendProfile.job}` : ''}
            </Text>
          </View>
          <ChevronRight size={18} color={colors.textTertiary} />
        </GlassCard>
      </TouchableOpacity>
    );
  }, [colors, isRTL, onOpenGroup]);
  const scrollContentStyle = useMemo(
    () => [
      styles.scrollContent,
      {
        paddingBottom: isOwnProfile
          ? Platform.OS === 'web' ? 110 : 90 + insets.bottom
          : Platform.OS === 'web' ? 24 : 24 + insets.bottom,
      },
    ],
    [insets.bottom, isOwnProfile]
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
    setToast(isRTL ? 'گزارش تخلف ثبت گردید' : 'Report transmitted to Command');
    setTimeout(() => setToast(''), 2500);
  }, [isRTL]);
  const handleAddFriend = useCallback(() => {
    if (existingFriend) {
      updateFriend(existingFriend.id, 'accepted');
      setToast(isRTL ? 'درخواست دوستی تایید شد' : 'Friend request accepted');
    } else {
      addFriend(profile.id);
      setToast(isRTL ? 'درخواست دوستی ارسال شد' : 'Friend request sent');
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
    setTimeout(() => setToast(''), 2500);
  }, [existingFriend, updateFriend, isRTL, addFriend, profile.id, profile.first_name, addNotification]);
  const handleOpenActions = useCallback(() => setShowActions(true), []);
  const listHeader = (
    <>
      <ProfileBanner bannerUrl={profile.banner_url} isDark={isDark} />
      <ProfileHeaderCard
        profile={profile}
        isOwnProfile={isOwnProfile}
        isFriend={Boolean(existingFriend && existingFriend.status === 'accepted')}
        onAddFriend={handleAddFriend}
        onOpenActions={handleOpenActions}
        onOpenVerification={onOpenVerification}
        hideAvatar
      />
      <View style={styles.statsRow}>
        <StatBox icon="Layers" value={myGroups.length} label={t('profile.operations')} />
        <StatBox icon="Award" value={myBadges.length} label={t('profile.medals')} />
        <StatBox icon="Users" value={myFriends.length} label={t('profile.contacts')} />
        <StatBox icon="Shield" value={profile.honor_score} label={t('profile.readiness')} highlight />
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
        <ProfileXpCard profile={profile} />
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <GlassSegmented options={profileTabs} value={tab} onChange={setTab} />
      </View>
      <View style={{ height: 14 }} />
    </>
  );
  const emptyList = tab === 'activity'
    ? <GlassEmpty icon="Layers" title={t('profile.noMissions')} subtitle={isRTL ? 'در اکیپ‌ها و دورهمی‌های مختلف شرکت کنید تا آمار فعالیت شما ثبت شود.' : 'Join Ekips and hangouts to build your activity stats.'} />
    : tab === 'badges'
    ? <GlassEmpty icon="Award" title={isRTL ? 'هنوز نشانی دریافت نکرده‌اید' : 'No badges earned'} subtitle={isRTL ? 'در دورهمی‌ها شرکت کنید و چالش‌ها را کامل کنید تا نشان‌ها فعال شوند.' : 'Join hangouts and complete challenges to unlock badges.'} />
    : tab === 'missions'
    ? <GlassEmpty icon="Target" title={isRTL ? 'هیچ چالش فعالی وجود ندارد' : 'No active challenges'} subtitle={isRTL ? 'چالش‌ها و ماموریت‌های جدید به زودی اضافه خواهند شد.' : 'New social challenges are added periodically.'} />
    : <GlassEmpty icon="Users" title={isRTL ? 'هیچ مخاطبی متصل نشده است' : 'No linked contacts'} subtitle={isRTL ? 'با سایر اعضای فعال در عملیات‌ها ارتباط برقرار کنید.' : 'Connect with active operatives across field operations.'} />;
  const itemSeparator = useCallback(() => <View style={{ height: 10 }} />, []);
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
        renderItem={renderListItem}
        keyExtractor={(item) => `${item.kind}-${item.value.id}`}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={<View style={styles.tabContentWrap}>{emptyList}</View>}
        ItemSeparatorComponent={itemSeparator}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
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
        <View style={{ gap: 10, paddingVertical: 8 }}>
          <GlassButton fullWidth variant="secondary" onPress={handleAddFriend}>
            {existingFriend ? (isRTL ? 'تایید پیوند ارتباطی' : 'Confirm Contact Link') : (isRTL ? 'ارسال درخواست ارتباط' : 'Send Link Request')}
          </GlassButton>
          <GlassButton
            fullWidth
            variant="danger"
            onPress={onReportIncident}
          >
            {isRTL ? 'ثبت گزارش تخلف تاکتیکی' : 'File Tactical Incident Report'}
          </GlassButton>
        </View>
      </GlassSheet>

      <Toast message={toast} visible={Boolean(toast)} />
    </View>
  );
}

export const ProfileScreen = React.memo(ProfileScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
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
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  tabContentWrap: {
    paddingHorizontal: 16,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
  },
  badgeIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 114, 182, 0.18)',
  },
  itemText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemDescription: {
    fontSize: 11,
    marginTop: 2,
  },
  missionCard: {
    padding: 12,
    borderRadius: 20,
  },
  missionTop: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  missionReward: {
    fontSize: 11,
    fontWeight: '800',
    color: '#f472b6',
  },
  missionProgressRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  missionProgressTrack: {
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  missionProgressBar: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#f472b6',
  },
  missionComplete: {
    fontSize: 10,
    fontWeight: '700',
    color: '#22c55e',
    marginTop: 8,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
  },
});
