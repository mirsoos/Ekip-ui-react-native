import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassButton, GlassSegmented, GlassEmpty, GlassBackButton } from '../components/Glass';
import { LiquidLens } from '../components/LiquidLens';
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
import type { Group } from '../types/database';

export function ProfileScreen({
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
  const { theme, toggle, colors, isDark } = useTheme();
  const [tab, setTab] = useState('activity');
  const [showActions, setShowActions] = useState(false);
  const [toast, setToast] = useState('');
  const internalScrollY = useRef(new Animated.Value(0)).current;
  const scrollY = externalScrollY ?? internalScrollY;

  const profile = profiles.find((p) => p.id === userId) ?? me;
  const isMe = profile.id === 'me';

  const myGroups = groups.filter((g) => {
    if (isMe) {
      return (
        g.owner_id === 'me' ||
        members.some((m) => m.group_id === g.id && m.user_id === 'me' && m.status === 'active')
      );
    }
    return g.owner_id === profile.id;
  });

  const myBadges = badges.filter((b) => b.user_id === profile.id || (isMe && b.user_id === 'me'));
  const myMissions = missions.filter((m) => m.user_id === profile.id || isMe);
  const myFriends = friends.filter(
    (f) => (f.user_id === profile.id || f.friend_id === profile.id) && f.status === 'accepted'
  );
  const existingFriend = friends.find(
    (f) => f.friend_id === profile.id || (f.user_id === profile.id && f.friend_id === 'me')
  );

  const Sun = getIcon('Sun');
  const Moon = getIcon('Moon');
  const SettingsIcon = getIcon('Settings');

  const handleAddFriend = () => {
    if (existingFriend) {
      updateFriend(existingFriend.id, 'accepted');
      setToast('Contact link confirmed');
    } else {
      addFriend(profile.id);
      setToast('Link request dispatched');
    }
    addNotification({
      type: 'friend_request',
      title: 'Contact Link',
      body: `You established comms link with ${profile.first_name}.`,
      icon: 'UserCheck',
    });
    setShowActions(false);
    setTimeout(() => setToast(''), 2500);
  };

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
        contentContainerStyle={[styles.scrollContent, isOwnProfile && { paddingBottom: 110 }]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Banner */}
        <View style={styles.bannerWrap}>
          {profile.banner_url ? (
            <Image source={{ uri: profile.banner_url }} style={styles.bannerImg} />
          ) : (
            <View style={[styles.bannerImg, { backgroundColor: colors.glassThinBg }]} />
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.6)']}
            style={styles.bannerGradient}
          />
        </View>

        {/* Profile Card Info */}
        <ProfileHeaderCard
          profile={profile}
          isOwnProfile={isOwnProfile}
          isFriend={Boolean(existingFriend && existingFriend.status === 'accepted')}
          onAddFriend={handleAddFriend}
          onOpenActions={() => setShowActions(true)}
          onOpenVerification={onOpenVerification}
          hideAvatar
        />

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBox icon="Layers" value={myGroups.length} label="Operations" />
          <StatBox icon="Award" value={myBadges.length} label="Medals" />
          <StatBox icon="Users" value={myFriends.length} label="Contacts" />
          <StatBox icon="Shield" value={profile.honor_score} label="Readiness" highlight />
        </View>

        {/* Level / XP Meter */}
        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <ProfileXpCard profile={profile} />
        </View>

        {/* Tab switcher */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <GlassSegmented
            options={[
              { label: 'Ops', value: 'activity', icon: 'Layers' },
              { label: 'Medals', value: 'badges', icon: 'Award' },
              { label: 'Directives', value: 'missions', icon: 'Target' },
              { label: 'Contacts', value: 'friends', icon: 'Users' },
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
                  title="No assigned missions"
                  subtitle="Deploy in an operation to build your field dossier."
                />
              ) : (
                myGroups.map((g) => (
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
        title="Operative Options"
      >
        <View style={{ gap: 10, paddingVertical: 8 }}>
          <GlassButton fullWidth variant="secondary" onPress={handleAddFriend}>
            {existingFriend ? 'Confirm Contact Link' : 'Send Link Request'}
          </GlassButton>
          <GlassButton
            fullWidth
            variant="danger"
            onPress={() => {
              setShowActions(false);
              setToast('Report transmitted to Command');
              setTimeout(() => setToast(''), 2500);
            }}
          >
            File Tactical Incident Report
          </GlassButton>
        </View>
      </GlassSheet>

      <Toast message={toast} visible={Boolean(toast)} />
    </View>
  );
}

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
