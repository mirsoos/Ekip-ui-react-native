// --- START OF FILE PrivacyScreen.tsx ---

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassButton, GlassAvatar, GlassSegmented } from '../components/Glass';
import { GlassSheet, Toast } from '../components/Overlays';
import { LiquidGlassToggle } from '../components/common/LiquidGlassToggle';
import { getIcon } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';

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
  const insets = useSafeAreaInsets();
  const { addNotification } = useAppData();
  const { colors } = useTheme();
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
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const Eye = getIcon('Eye');
  const EyeOff = getIcon('EyeOff');
  const Ban = getIcon('Ban');
  const ChevronRight = getIcon(isRTL ? 'ChevronLeft' : 'ChevronRight');

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showBlockedSheet) {
        setShowBlockedSheet(false);
        return true;
      }
      onBack();
      return true;
    });
    return () => {
      sub.remove();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [onBack, showBlockedSheet]);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => setToastMessage(''), 2500);
  }, []);

  const handleUnblockUser = (id: string, name: string) => {
    setBlockedList((prev) => prev.filter((u) => u.id !== id));
    showToast(isRTL ? `مسدودی کاربر «${name}» برداشته شد` : `Unblocked ${name}`);
    addNotification({
      type: 'system',
      title: isRTL ? 'رفع مسدودی کاربر' : 'Operator Unblocked',
      body: isRTL
        ? `محدودیت دسترسی ${name} برداشته شد.`
        : `${name} was removed from your restriction blacklist.`,
      icon: 'UserCheck',
    });
  };

  const dmOptions = useMemo(
    () =>
      isRTL
        ? [
            { label: 'دوستان', value: 'friends', icon: 'Heart' as const },
            { label: 'دوستانِ دوستان', value: 'friends_of_friends', icon: 'Users' as const },
            { label: 'همه', value: 'everyone', icon: 'Globe' as const },
          ]
        : [
            { label: 'Everyone', value: 'everyone', icon: 'Globe' as const },
            { label: 'Mutuals', value: 'friends_of_friends', icon: 'Users' as const },
            { label: 'Friends', value: 'friends', icon: 'Heart' as const },
          ],
    [isRTL]
  );

  const inviteOptions = useMemo(
    () =>
      isRTL
        ? [
            { label: 'دوستان', value: 'friends', icon: 'UserCheck' as const },
            { label: 'تاییدشده‌ها', value: 'verified', icon: 'Award' as const },
            { label: 'همه', value: 'everyone', icon: 'Globe' as const },
          ]
        : [
            { label: 'Everyone', value: 'everyone', icon: 'Globe' as const },
            { label: 'Verified', value: 'verified', icon: 'Award' as const },
            { label: 'Friends', value: 'friends', icon: 'UserCheck' as const },
          ],
    [isRTL]
  );

  const rowDir = isRTL ? ('row-reverse' as const) : ('row' as const);
  const textAlign = isRTL ? ('right' as const) : ('left' as const);
  const textSpacing = {
    marginLeft: isRTL ? 0 : 12,
    marginRight: isRTL ? 12 : 0,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          paddingTop: getSinglePillContentPaddingTop(insets.top),
          paddingBottom: 60 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tactical Ghost Mode Hero */}
        <GlassCard variant="thick" style={styles.ghostCard}>
          <View style={[styles.ghostHeader, { flexDirection: rowDir }]}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: ghostMode ? 'rgba(236,72,153,0.2)' : colors.glassThinBg,
                },
              ]}
            >
              {ghostMode ? (
                <EyeOff size={22} color="#ec4899" />
              ) : (
                <Eye size={22} color={colors.textPrimary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.ghostTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'حالت مخفی (Ghost Mode)' : 'Incognito Mode'}
              </Text>
              <Text style={[styles.ghostDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'مشاهده اکیپ‌ها بدون نمایش وضعیت آنلاین به سایر کاربران'
                  : 'Browse Ekips without showing your online presence'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={ghostMode}
              onChange={(val) => {
                setGhostMode(val);
                showToast(
                  val
                    ? isRTL
                      ? 'حالت مخفی فعال شد'
                      : 'Incognito activated'
                    : isRTL
                    ? 'حالت مخفی غیرفعال شد'
                    : 'Incognito deactivated'
                );
              }}
              size="sm"
            />
          </View>
        </GlassCard>

        {/* Visibility */}
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'قابلیت مشاهده و حریم خصوصی' : 'VISIBILITY & PRIVACY'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <View style={[styles.settingRow, { flexDirection: rowDir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'پروفایل خصوصی' : 'Private Profile'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'فقط دوستان و اعضای اکیپ مشترک اطلاعات شما را ببینند'
                  : 'Only friends and shared Ekip members see full info'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={privateProfile}
              onChange={setPrivateProfile}
              size="sm"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={[styles.settingRow, { flexDirection: rowDir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'قابل جستجو در رادار عمومی' : 'Discoverable in Global Search'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'به سایر کاربران اجازه یافتن شما با نام کاربری را می‌دهد'
                  : 'Allow operators to locate you by handle'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={discoverySearch}
              onChange={setDiscoverySearch}
              size="sm"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={[styles.settingRow, { flexDirection: rowDir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'نمایش وضعیت آنلاین بودن' : 'Show Live Online Status'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'نمایش تیک سبز رنگ در هنگام حضور در برنامه'
                  : 'Display green telemetry dot when active'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={showOnlineStatus}
              onChange={setShowOnlineStatus}
              size="sm"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={[styles.settingRow, { flexDirection: rowDir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'نمایش در اعضای اکیپ' : 'Display in Squad Attendees'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'نمایش آواتار شما در اکیپ‌هایی که پیوسته‌اید'
                  : 'List your avatar in squads you have joined'}
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
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'دقت موقعیت مکانی' : 'LOCATION PRECISION'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <View style={[styles.settingRow, { flexDirection: rowDir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'موقعیت زنده با دقت بالا' : 'High-Precision GPS'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'اشتراک مختصات دقیق (خطای زیر ۵۰ متر) با اکیپ'
                  : 'Share exact coordinates (within 50m) with squads'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={preciseLocation}
              onChange={setPreciseLocation}
              size="sm"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={[styles.settingRow, { flexDirection: rowDir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'نمایش محله / بخش شهری' : 'Show Neighborhood / Sector'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'محدوده تقریبی در پروفایل شما نشان داده شود'
                  : 'Approximate zone visible on your profile card'}
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
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'مجوزهای ارتباطی' : 'COMMUNICATION PERMISSIONS'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <Text style={[styles.segmentedLabel, { color: colors.textSecondary, textAlign }]}>
            {isRTL ? 'چه کسانی می‌توانند پیام خصوصی بفرستند' : 'WHO CAN DIRECT MESSAGE YOU'}
          </Text>
          <View style={{ marginTop: 8 }}>
            <GlassSegmented
              options={dmOptions}
              value={dmAudience}
              onChange={(v) => {
                setDmAudience(v as Audience);
                showToast(
                  isRTL ? 'تنظیمات پیام خصوصی به‌روزرسانی شد' : `DMs set to ${v}`
                );
              }}
            />
          </View>

          <Text
            style={[
              styles.segmentedLabel,
              { marginTop: 18, color: colors.textSecondary, textAlign },
            ]}
          >
            {isRTL
              ? 'چه کسانی می‌توانند شما را به اکیپ دعوت کنند'
              : 'WHO CAN INVITE YOU TO MISSIONS'}
          </Text>
          <View style={{ marginTop: 8 }}>
            <GlassSegmented
              options={inviteOptions}
              value={inviteAudience}
              onChange={(v) => {
                setInviteAudience(v as InviteAudience);
                showToast(
                  isRTL ? 'تنظیمات دعوت به اکیپ به‌روزرسانی شد' : `Invites set to ${v}`
                );
              }}
            />
          </View>
        </GlassCard>

        {/* Blocked Accounts */}
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'امنیت و محدودیت‌ها' : 'SAFETY & RESTRICTIONS'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <TouchableOpacity
            style={[styles.blockedRow, { flexDirection: rowDir }]}
            onPress={() => setShowBlockedSheet(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
              <Ban size={18} color="#ef4444" />
            </View>
            <View style={[{ flex: 1 }, textSpacing]}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'کاربران مسدود شده' : 'Blocked Operators'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? `${blockedList.length} کاربر در لیست مسدود`
                  : `${blockedList.length} accounts restricted`}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
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
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                {isRTL ? 'هیچ کاربری در لیست مسدودی نیست' : 'No blocked accounts'}
              </Text>
            </View>
          ) : (
            blockedList.map((user) => (
              <View
                key={user.id}
                style={[
                  styles.blockedUserItem,
                  { flexDirection: rowDir, borderBottomColor: colors.divider },
                ]}
              >
                <GlassAvatar src={user.avatar} name={user.name} size={40} />
                <View style={[{ flex: 1 }, textSpacing]}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: colors.textPrimary,
                      textAlign,
                    }}
                  >
                    {user.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textTertiary, textAlign }}>
                    @{user.username}
                  </Text>
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
    gap: 12,
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
  },
  ghostDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 22,
    marginBottom: 8,
    marginHorizontal: 4,
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
    gap: 14,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  segmentedLabel: {
    fontSize: 11,
    fontWeight: '700',
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
  },
});