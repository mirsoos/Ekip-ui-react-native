import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassButton, GlassBackButton, GlassAvatar, GlassSegmented } from '../components/Glass';
import { GlassSheet, Toast } from '../components/Overlays';
import { getIcon } from '../lib/icons';

interface PrivacyScreenProps {
  onBack: () => void;
}

type Audience = 'everyone' | 'friends_of_friends' | 'friends';
type InviteAudience = 'everyone' | 'verified' | 'friends';

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  blockedDate: string;
}

const INITIAL_BLOCKED_USERS: BlockedUser[] = [
  {
    id: 'block-1',
    name: 'Darius Vance',
    username: 'darius_v',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    blockedDate: 'Jan 14, 2025',
  },
  {
    id: 'block-2',
    name: 'Sasha Miller',
    username: 'sasham',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    blockedDate: 'Dec 02, 2024',
  },
];

export function PrivacyScreen({ onBack }: PrivacyScreenProps) {
  const { addNotification } = useAppData();

  const [ghostMode, setGhostMode] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [discoverySearch, setDiscoverySearch] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showInAttendeeList, setShowInAttendeeList] = useState(true);
  const [preciseLocation, setPreciseLocation] = useState(false);
  const [showCityNeighborhood, setShowCityNeighborhood] = useState(true);
  const [hideHonorScore, setHideHonorScore] = useState(false);

  const [dmAudience, setDmAudience] = useState<Audience>('friends_of_friends');
  const [inviteAudience, setInviteAudience] = useState<InviteAudience>('verified');

  const [showBlockedSheet, setShowBlockedSheet] = useState(false);
  const [blockedList, setBlockedList] = useState<BlockedUser[]>(INITIAL_BLOCKED_USERS);

  const [toastMessage, setToastMessage] = useState('');

  const Lock = getIcon('Lock');
  const Eye = getIcon('Eye');
  const EyeOff = getIcon('EyeOff');
  const Users = getIcon('Users');
  const MapPin = getIcon('MapPin');
  const Ban = getIcon('Ban');
  const ShieldCheck = getIcon('ShieldCheck');
  const ChevronRight = getIcon('ChevronRight');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2800);
  };

  const handleUnblockUser = (id: string, name: string) => {
    setBlockedList((prev) => prev.filter((u) => u.id !== id));
    showToast(`Unblocked ${name}`);
    addNotification({
      type: 'system',
      title: 'User Unblocked',
      body: `You unblocked ${name}. They can now find and connect with you on Ekip.`,
      icon: 'UserCheck',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingTop: 84, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Ghost Mode Card */}
        <GlassCard variant="thick" style={styles.heroCard}>
          <View style={styles.ghostHeader}>
            <View style={[styles.iconBox, { backgroundColor: ghostMode ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.08)' }]}>
              {ghostMode ? <EyeOff size={22} color="#ec4899" /> : <Eye size={22} color="#fff" />}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.ghostTitle}>Tactical Ghost Mode</Text>
              <Text style={styles.ghostDesc}>
                Hide your presence from squad radar while remaining active
              </Text>
            </View>
            <Switch
              value={ghostMode}
              onValueChange={(val) => {
                setGhostMode(val);
                showToast(`Ghost mode ${val ? 'engaged' : 'disengaged'}`);
              }}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>

        {/* Visibility Matrix */}
        <Text style={styles.sectionHeading}>DISCOVERY & RADAR</Text>
        <GlassCard style={styles.cardSection}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Private Profile</Text>
              <Text style={styles.settingDesc}>Only approved squad members see your stats</Text>
            </View>
            <Switch
              value={privateProfile}
              onValueChange={setPrivateProfile}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Discoverable in Global Search</Text>
              <Text style={styles.settingDesc}>Allow operators to locate you by handle</Text>
            </View>
            <Switch
              value={discoverySearch}
              onValueChange={setDiscoverySearch}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Show Live Online Status</Text>
              <Text style={styles.settingDesc}>Display green telemetry dot when active</Text>
            </View>
            <Switch
              value={showOnlineStatus}
              onValueChange={setShowOnlineStatus}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Display in Squad Attendees</Text>
              <Text style={styles.settingDesc}>List your avatar in squads you have joined</Text>
            </View>
            <Switch
              value={showInAttendeeList}
              onValueChange={setShowInAttendeeList}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>

        {/* Location Visibility */}
        <Text style={styles.sectionHeading}>LOCATION PRECISION</Text>
        <GlassCard style={styles.cardSection}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>High-Precision GPS</Text>
              <Text style={styles.settingDesc}>Share exact coordinates (within 50m) with squads</Text>
            </View>
            <Switch
              value={preciseLocation}
              onValueChange={setPreciseLocation}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Show Neighborhood / Sector</Text>
              <Text style={styles.settingDesc}>Approximate zone visible on your profile card</Text>
            </View>
            <Switch
              value={showCityNeighborhood}
              onValueChange={setShowCityNeighborhood}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>

        {/* Direct Messages Audience */}
        <Text style={styles.sectionHeading}>COMMUNICATION PERMISSIONS</Text>
        <GlassCard style={styles.cardSection}>
          <Text style={styles.segmentedLabel}>WHO CAN DIRECT MESSAGE YOU</Text>
          <View style={{ marginTop: 8 }}>
            <GlassSegmented
              options={[
                { label: 'Everyone', value: 'everyone', icon: 'Globe' },
                { label: 'Mutuals', value: 'friends_of_friends', icon: 'Users' },
                { label: 'Friends', value: 'friends', icon: 'Heart' },
              ]}
              value={dmAudience}
              onChange={(v) => {
                setDmAudience(v as Audience);
                showToast(`DMs set to ${v === 'everyone' ? 'Everyone' : v === 'friends_of_friends' ? 'Mutuals' : 'Friends'}`);
              }}
            />
          </View>

          <Text style={[styles.segmentedLabel, { marginTop: 18 }]}>WHO CAN INVITE YOU TO MISSIONS</Text>
          <View style={{ marginTop: 8 }}>
            <GlassSegmented
              options={[
                { label: 'Everyone', value: 'everyone', icon: 'Globe' },
                { label: 'Verified', value: 'verified', icon: 'Award' },
                { label: 'Friends', value: 'friends', icon: 'UserCheck' },
              ]}
              value={inviteAudience}
              onChange={(v) => {
                setInviteAudience(v as InviteAudience);
                showToast(`Invites set to ${v === 'everyone' ? 'Everyone' : v === 'verified' ? 'Verified' : 'Friends'}`);
              }}
            />
          </View>
        </GlassCard>

        {/* Blocked Accounts */}
        <Text style={styles.sectionHeading}>SAFETY & RESTRICTIONS</Text>
        <GlassCard style={styles.cardSection}>
          <TouchableOpacity
            style={styles.blockedRow}
            onPress={() => setShowBlockedSheet(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
              <Ban size={18} color="#ef4444" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.settingTitle}>Blocked Operators</Text>
              <Text style={styles.settingDesc}>{blockedList.length} accounts restricted</Text>
            </View>
            <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </GlassCard>
      </ScrollView>

      {/* Blocked Users Sheet */}
      <GlassSheet
        open={showBlockedSheet}
        onClose={() => setShowBlockedSheet(false)}
        title="Blocked Operators"
      >
        <View style={{ paddingVertical: 10 }}>
          {blockedList.length === 0 ? (
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>No blocked accounts</Text>
            </View>
          ) : (
            blockedList.map((user) => (
              <View key={user.id} style={styles.blockedUserItem}>
                <GlassAvatar src={user.avatar} name={user.name} size={40} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>{user.name}</Text>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>@{user.username}</Text>
                </View>
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUnblockUser(user.id, user.name)}
                >
                  Unblock
                </GlassButton>
              </View>
            ))
          )}
        </View>
      </GlassSheet>

      <Toast message={toastMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(236,72,153,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(236,72,153,0.4)',
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ec4899',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroCard: {
    padding: 16,
    borderRadius: 20,
    borderColor: 'rgba(236,72,153,0.3)',
    borderWidth: 1,
  },
  ghostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  ghostDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginTop: 22,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardSection: {
    padding: 16,
    borderRadius: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  settingDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 10,
  },
  segmentedLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  audienceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  audienceBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  audienceBtnActive: {
    backgroundColor: 'rgba(236,72,153,0.2)',
    borderColor: '#ec4899',
  },
  audienceBtnText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  audienceBtnTextActive: {
    color: '#fff',
  },
  blockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockedUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
});
