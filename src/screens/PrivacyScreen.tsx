import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassButton, GlassBackButton, GlassAvatar, GlassSegmented } from '../components/Glass';
import { GlassSheet, Toast } from '../components/Overlays';
import { LiquidGlassToggle } from '../components/common/LiquidGlassToggle';
import { getIcon } from '../lib/icons';
import { useI18n } from '../lib/i18n';

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
    name: 'داریوش ونس',
    username: 'darius_v',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    blockedDate: '۱۴ دی ۱۴۰۳',
  },
  {
    id: 'block-2',
    name: 'ساشا میلر',
    username: 'sasham',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    blockedDate: '۲ آذر ۱۴۰۳',
  },
];

export function PrivacyScreen({ onBack }: PrivacyScreenProps) {
  const { addNotification } = useAppData();
  const { isRTL } = useI18n();

  const [ghostMode, setGhostMode] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [discoverySearch, setDiscoverySearch] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showInAttendeeList, setShowInAttendeeList] = useState(true);
  const [preciseLocation, setPreciseLocation] = useState(false);
  const [showCityNeighborhood, setShowCityNeighborhood] = useState(true);

  const [dmAudience, setDmAudience] = useState<Audience>('friends_of_friends');
  const [inviteAudience, setInviteAudience] = useState<InviteAudience>('verified');

  const [showBlockedSheet, setShowBlockedSheet] = useState(false);
  const [blockedList, setBlockedList] = useState<BlockedUser[]>(INITIAL_BLOCKED_USERS);

  const [toastMessage, setToastMessage] = useState('');

  const Eye = getIcon('Eye');
  const EyeOff = getIcon('EyeOff');
  const Ban = getIcon('Ban');
  const ChevronRight = getIcon(isRTL ? 'ChevronLeft' : 'ChevronRight');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleUnblockUser = (id: string, name: string) => {
    setBlockedList((prev) => prev.filter((u) => u.id !== id));
    showToast(isRTL ? `مسدودی کاربر «${name}» برداشته شد` : `Unblocked ${name}`);
    addNotification({
      type: 'system',
      title: isRTL ? 'رفع مسدودی کاربر' : 'Operator Unblocked',
      body: isRTL ? `محدودیت دسترسی ${name} برداشته شد.` : `${name} was removed from your restriction blacklist.`,
      icon: 'UserCheck',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingTop: 84, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tactical Ghost Mode Hero */}
        <GlassCard variant="thick" style={styles.ghostCard}>
          <View style={styles.ghostHeader}>
            <View style={[styles.iconBox, { backgroundColor: ghostMode ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.08)' }]}>
              {ghostMode ? <EyeOff size={22} color="#ec4899" /> : <Eye size={22} color="#fff" />}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.ghostTitle}>
                {isRTL ? 'حالت مخفی (Ghost Mode)' : 'Incognito Mode'}
              </Text>
              <Text style={styles.ghostDesc}>
                {isRTL
                  ? 'مشاهده اکیپ‌ها بدون نمایش وضعیت آنلاین به سایر کاربران'
                  : 'Browse Ekips without showing your online presence'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={ghostMode}
              onChange={(val) => {
                setGhostMode(val);
                showToast(val ? (isRTL ? 'حالت مخفی فعال شد' : 'Incognito activated') : (isRTL ? 'حالت مخفی غیرفعال شد' : 'Incognito deactivated'));
              }}
              size="sm"
            />
          </View>
        </GlassCard>

        {/* Visibility */}
        <Text style={styles.sectionHeading}>
          {isRTL ? 'قابلیت مشاهده و حریم خصوصی' : 'VISIBILITY & PRIVACY'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}>
              <Text style={styles.settingTitle}>
                {isRTL ? 'پروفایل خصوصی' : 'Private Profile'}
              </Text>
              <Text style={styles.settingDesc}>
                {isRTL ? 'فقط دوستان و اعضای اکیپ مشترک اطلاعات شما را ببینند' : 'Only friends and shared Ekip members see full info'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={privateProfile}
              onChange={setPrivateProfile}
              size="sm"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}>
              <Text style={styles.settingTitle}>
                {isRTL ? 'قابل جستجو در رادار عمومی' : 'Discoverable in Global Search'}
              </Text>
              <Text style={styles.settingDesc}>
                {isRTL ? 'به سایر کاربران اجازه یافتن شما با نام کاربری را می‌دهد' : 'Allow operators to locate you by handle'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={discoverySearch}
              onChange={setDiscoverySearch}
              size="sm"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}>
              <Text style={styles.settingTitle}>
                {isRTL ? 'نمایش وضعیت آنلاین بودن' : 'Show Live Online Status'}
              </Text>
              <Text style={styles.settingDesc}>
                {isRTL ? 'نمایش تیک سبز رنگ در هنگام حضور در برنامه' : 'Display green telemetry dot when active'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={showOnlineStatus}
              onChange={setShowOnlineStatus}
              size="sm"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}>
              <Text style={styles.settingTitle}>
                {isRTL ? 'نمایش در اعضای اکیپ' : 'Display in Squad Attendees'}
              </Text>
              <Text style={styles.settingDesc}>
                {isRTL ? 'نمایش آواتار شما در اکیپ‌هایی که پیوسته‌اید' : 'List your avatar in squads you have joined'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={showInAttendeeList}
              onChange={setShowInAttendeeList}
              size="sm"
            />
          </View>
        </GlassCard>

        {/* Location Visibility */}
        <Text style={styles.sectionHeading}>
          {isRTL ? 'دقت موقعیت مکانی' : 'LOCATION PRECISION'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}>
              <Text style={styles.settingTitle}>
                {isRTL ? 'موقعیت زنده با دقت بالا' : 'High-Precision GPS'}
              </Text>
              <Text style={styles.settingDesc}>
                {isRTL ? 'اشتراک مختصات دقیق (خطای زیر ۵۰ متر) با اکیپ' : 'Share exact coordinates (within 50m) with squads'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={preciseLocation}
              onChange={setPreciseLocation}
              size="sm"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}>
              <Text style={styles.settingTitle}>
                {isRTL ? 'نمایش محله / بخش شهری' : 'Show Neighborhood / Sector'}
              </Text>
              <Text style={styles.settingDesc}>
                {isRTL ? 'محدوده تقریبی در پروفایل شما نشان داده شود' : 'Approximate zone visible on your profile card'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={showCityNeighborhood}
              onChange={setShowCityNeighborhood}
              size="sm"
            />
          </View>
        </GlassCard>

        {/* Direct Messages Audience */}
        <Text style={styles.sectionHeading}>
          {isRTL ? 'مجوزهای ارتباطی' : 'COMMUNICATION PERMISSIONS'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <Text style={styles.segmentedLabel}>
            {isRTL ? 'چه کسانی می‌توانند پیام خصوصی بفرستند' : 'WHO CAN DIRECT MESSAGE YOU'}
          </Text>
          <View style={{ marginTop: 8 }}>
            <GlassSegmented
              options={[
                { label: isRTL ? 'همه' : 'Everyone', value: 'everyone', icon: 'Globe' },
                { label: isRTL ? 'دوستانِ دوستان' : 'Mutuals', value: 'friends_of_friends', icon: 'Users' },
                { label: isRTL ? 'دوستان' : 'Friends', value: 'friends', icon: 'Heart' },
              ]}
              value={dmAudience}
              onChange={(v) => {
                setDmAudience(v as Audience);
                showToast(isRTL ? 'تنظیمات پیام خصوصی به‌روزرسانی شد' : `DMs set to ${v}`);
              }}
            />
          </View>

          <Text style={[styles.segmentedLabel, { marginTop: 18 }]}>
            {isRTL ? 'چه کسانی می‌توانند شما را به اکیپ دعوت کنند' : 'WHO CAN INVITE YOU TO MISSIONS'}
          </Text>
          <View style={{ marginTop: 8 }}>
            <GlassSegmented
              options={[
                { label: isRTL ? 'همه' : 'Everyone', value: 'everyone', icon: 'Globe' },
                { label: isRTL ? 'تاییدشده‌ها' : 'Verified', value: 'verified', icon: 'Award' },
                { label: isRTL ? 'دوستان' : 'Friends', value: 'friends', icon: 'UserCheck' },
              ]}
              value={inviteAudience}
              onChange={(v) => {
                setInviteAudience(v as InviteAudience);
                showToast(isRTL ? 'تنظیمات دعوت به اکیپ به‌روزرسانی شد' : `Invites set to ${v}`);
              }}
            />
          </View>
        </GlassCard>

        {/* Blocked Accounts */}
        <Text style={styles.sectionHeading}>
          {isRTL ? 'امنیت و محدودیت‌ها' : 'SAFETY & RESTRICTIONS'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <TouchableOpacity
            style={styles.blockedRow}
            onPress={() => setShowBlockedSheet(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
              <Ban size={18} color="#ef4444" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.settingTitle}>
                {isRTL ? 'کاربران مسدود شده' : 'Blocked Operators'}
              </Text>
              <Text style={styles.settingDesc}>
                {isRTL ? `${blockedList.length} کاربر در لیست مسدود` : `${blockedList.length} accounts restricted`}
              </Text>
            </View>
            <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </GlassCard>
      </ScrollView>

      {/* Blocked Users Sheet */}
      <GlassSheet
        open={showBlockedSheet}
        onClose={() => setShowBlockedSheet(false)}
        title={isRTL ? 'کاربران مسدود شده' : 'Blocked Operators'}
      >
        <View style={{ paddingVertical: 10 }}>
          {blockedList.length === 0 ? (
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                {isRTL ? 'هیچ کاربری در لیست مسدودی نیست' : 'No blocked accounts'}
              </Text>
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
                  onPress={() => handleUnblockUser(user.id, user.name)}
                >
                  {isRTL ? 'رفع مسدودی' : 'Unblock'}
                </GlassButton>
              </View>
            ))
          )}
        </View>
      </GlassSheet>

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  ghostCard: {
    padding: 16,
    borderRadius: 22,
    borderColor: 'rgba(236,72,153,0.3)',
    borderWidth: 1,
  },
  ghostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  ghostDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    lineHeight: 16,
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
    padding: 14,
    borderRadius: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    gap: 18,
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 12,
  },
  segmentedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.6,
  },
  blockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockedUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
});
