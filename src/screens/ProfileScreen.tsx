import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassButton, GlassSegmented, GlassEmpty, GlassBackButton } from '../components/Glass';
import { FrostedGlass } from '../components/FrostedGlass';
import { GlassSheet, Toast } from '../components/Overlays';
import { StatBox } from '../components/common/StatBox';
import { ProfileHeaderCard } from '../components/profile/ProfileHeaderCard';
import { ProfileXpCard } from '../components/profile/ProfileXpCard';
import { ProfileBadgesList } from '../components/profile/ProfileBadgesList';
import { ProfileMissionsList } from '../components/profile/ProfileMissionsList';
import { FriendsList } from '../components/profile/FriendsList';
import { EkipCard } from '../components/EkipCard';
import { ProfileScreenSkeleton } from '../components/skeleton';
import { getIcon } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { useDeferredMount } from '../lib/useDeferredMount';
import type { Group } from '../types/database';

const ProfileBanner = React.memo(function ProfileBanner({
  bannerUrl,
}: {
  bannerUrl?: string | null;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.bannerWrap}>
      {bannerUrl ? (
        <Image source={{ uri: bannerUrl }} style={styles.bannerImg} />
      ) : (
        <View style={[styles.bannerImg, { backgroundColor: colors.glassThinBg }]} />
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
  const { t, isRTL } = useI18n();
  const [tab, setTab] = useState('activity');
  const [showActions, setShowActions] = useState(false);
  const [toast, setToast] = useState('');
  const isDeferredReady = useDeferredMount(32);
  const internalScrollY = useRef(new Animated.Value(0)).current;
  const scrollY = externalScrollY ?? internalScrollY;

  const profile = useMemo(() => profiles.find((p) => p.id === userId) ?? me, [profiles, userId, me]);
  const isMe = profile.id === 'me';

  const myGroups = useMemo(
    () =>
      groups.filter((g) => {
        if (isMe) {
          return (
            g.owner_id === 'me' ||
            members.some((m) => m.group_id === g.id && m.user_id === 'me' && m.status === 'active')
          );
        }
        return g.owner_id === profile.id;
      }),
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

  const Sun = getIcon('Sun');
  const Moon = getIcon('Moon');
  const SettingsIcon = getIcon('Settings');

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
  }, [existingFriend, updateFriend, isRTL, addFriend, profile.id, addNotification]);
  const handleOpenActions = useCallback(() => setShowActions(true), []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ProfileScreenSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isOwnProfile
            ? { paddingBottom: Platform.OS === 'web' ? 110 : 90 + insets.bottom }
            : { paddingBottom: Platform.OS === 'web' ? 24 : 24 + insets.bottom },
        ]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
      >
        {/* Banner */}
        <ProfileBanner bannerUrl={profile.banner_url} />

        {/* Profile Card Info */}
        <ProfileHeaderCard
          profile={profile}
          isOwnProfile={isOwnProfile}
          isFriend={Boolean(existingFriend && existingFriend.status === 'accepted')}
          onAddFriend={handleAddFriend}
          onOpenActions={handleOpenActions}
          onOpenVerification={onOpenVerification}
          hideAvatar
        />

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBox icon="Layers" value={myGroups.length} label={t('profile.operations')} />
          <StatBox icon="Award" value={myBadges.length} label={t('profile.medals')} />
          <StatBox icon="Users" value={myFriends.length} label={t('profile.contacts')} />
          <StatBox icon="Shield" value={profile.honor_score} label={t('profile.readiness')} highlight />
        </View>

        {/* Level / XP Meter */}
        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <ProfileXpCard profile={profile} />
        </View>

        {/* Tab switcher */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <GlassSegmented
            options={[
              { label: t('profile.tabOps'), value: 'activity', icon: 'Layers' },
              { label: t('profile.tabMedals'), value: 'badges', icon: 'Award' },
              { label: t('profile.tabDirectives'), value: 'missions', icon: 'Target' },
              { label: t('profile.tabContacts'), value: 'friends', icon: 'Users' },
            ]}
            value={tab}
            onChange={setTab}
          />
        </View>

        {/* Tab content */}
        <View key={tab} className="animate-raise" style={styles.tabContentWrap}>
          {tab === 'activity' && (
            <View style={{ gap: 10 }}>
              {myGroups.length === 0 ? (
                <GlassEmpty
                  icon="Layers"
                  title={t('profile.noMissions')}
                  subtitle={isRTL ? 'در اکیپ‌ها و دورهمی‌های مختلف شرکت کنید تا آمار فعالیت شما ثبت شود.' : 'Join Ekips and hangouts to build your activity stats.'}
                />
              ) : (
                (isDeferredReady ? myGroups : myGroups.slice(0, 2)).map((g) => (
                  <EkipCard
                    key={g.id}
                    group={g}
                    onPress={() => onOpenGroup(g)}
                  />
                ))
              )}
            </View>
          )}

          {tab === 'badges' && <ProfileBadgesList badges={myBadges} />}

          {tab === 'missions' && <ProfileMissionsList missions={myMissions} />}

          {tab === 'friends' && (
            <FriendsList
              friends={myFriends}
              onOpenProfile={(id) => {}}
            />
          )}
        </View>
      </Animated.ScrollView>

      {/* Action sheet for other users */}
      <GlassSheet
        open={showActions}
        onClose={() => setShowActions(false)}
        title={isRTL ? 'گزینه‌های کاربر' : 'Operative Options'}
      >
        <View style={{ gap: 10, paddingVertical: 8 }}>
          <GlassButton fullWidth variant="secondary" onPress={handleAddFriend}>
            {existingFriend ? (isRTL ? 'تایید پیوند ارتباطی' : 'Confirm Contact Link') : (isRTL ? 'ارسال درخواست ارتباط' : 'Send Link Request')}
          </GlassButton>
          <GlassButton
            fullWidth
            variant="danger"
            onPress={() => {
              setShowActions(false);
              setToast(isRTL ? 'گزارش تخلف ثبت گردید' : 'Report transmitted to Command');
              setTimeout(() => setToast(''), 2500);
            }}
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
    marginTop: 14,
  },
});
