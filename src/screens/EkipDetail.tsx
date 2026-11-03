// --- START OF FILE EkipDetail.tsx ---

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { GlassButton } from '../components/Glass';
import { GlassSheet } from '../components/Overlays';
import { getIcon, type IconName } from '../lib/icons';
import { FloatingGlassHeader } from '../components/common/FloatingGlassHeader';
import { FrostedGlass } from '../components/FrostedGlass';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';
import { EkipEventInfoCard } from '../components/ekip/EkipEventInfoCard';
import { EkipHostCard } from '../components/ekip/EkipHostCard';
import { EkipMembersSection } from '../components/ekip/EkipMembersSection';
import { EkipRequirementsCard } from '../components/ekip/EkipRequirementsCard';
import { EkipActionBar } from '../components/ekip/EkipActionBar';
import { EkipJoinModal } from '../components/ekip/EkipJoinModal';
import { EkipShareSheet } from '../components/ekip/EkipShareSheet';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { useToast } from '../lib/ToastContext';
import type { Group } from '../types/database';

const categoryIcons: Record<string, IconName> = {
  entertainment: 'PartyPopper',
  work: 'Briefcase',
};

export function EkipDetailComponent({
  group,
  onBack,
  onOpenProfile,
  onOpenChat,
}: {
  group: Group;
  onBack: () => void;
  onOpenProfile: (userId: string) => void;
  onOpenChat: (conversationId: string) => void;
}) {
  const { me, members, requests, addRequest, updateRequest, addNotification, conversations } = useAppData();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const { showToast } = useToast();

  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  // پشتیبانی از دکمه Back فیزیکی اندروید
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showJoinSheet) {
        setShowJoinSheet(false);
        return true;
      }
      if (showShare) {
        setShowShare(false);
        return true;
      }
      if (showCancel) {
        setShowCancel(false);
        return true;
      }
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack, showJoinSheet, showShare, showCancel]);

  const CatIcon = getIcon(categoryIcons[group.category] ?? 'PartyPopper');
  const ShareIcon = getIcon('Share');

  const groupMembers = useMemo(
    () => members.filter((m) => m.group_id === group.id && m.status === 'active'),
    [members, group.id]
  );

  const myRequest = useMemo(
    () => requests.find((r) => r.group_id === group.id && r.user_id === 'me'),
    [requests, group.id]
  );

  const isOwner = group.owner_id === 'me';
  const isMember = useMemo(
    () => groupMembers.some((m) => m.user_id === 'me'),
    [groupMembers]
  );

  // Eligibility check
  const levelOk = !group.required_level || me.level >= group.required_level;
  const honorOk = !group.required_honor || me.honor_score >= group.required_honor;
  const ageOk =
    (!group.age_min || (me.age ?? 0) >= group.age_min) &&
    (!group.age_max || (me.age ?? 0) <= group.age_max);
  const genderOk =
    !group.gender_preference ||
    group.gender_preference === 'any' ||
    me.gender === group.gender_preference;
  const premiumOk = !group.premium_only || me.is_premium;
  const eligible = levelOk && honorOk && ageOk && genderOk && premiumOk;
  const spotsLeft = group.max_members ? group.max_members - group.member_count : null;
  const full = spotsLeft !== null && spotsLeft <= 0;

  const handleJoin = useCallback(() => {
    if (group.auto_accept) {
      addRequest({
        id: `r-${Date.now()}`,
        group_id: group.id,
        user_id: 'me',
        status: 'accepted',
        message: joinMessage || null,
        created_at: new Date().toISOString(),
        group,
        profile: me,
      });
      addNotification({
        type: 'group_request',
        title: isRTL ? 'پیوستن به اکیپ' : 'Ekip Joined',
        body: isRTL
          ? `شما عضو اکیپ «${group.title}» شدید!`
          : `You joined ${group.title}!`,
        icon: 'Users',
      });
      showToast(isRTL ? 'عضویت در اکیپ با موفقیت انجام شد!' : 'Joined Ekip successfully!');
    } else {
      addRequest({
        id: `r-${Date.now()}`,
        group_id: group.id,
        user_id: 'me',
        status: 'pending',
        message: joinMessage || null,
        created_at: new Date().toISOString(),
        group,
        profile: me,
      });
      showToast(isRTL ? 'درخواست عضویت برای میزبان اکیپ ارسال شد' : 'Join request sent to the host');
    }
    setShowJoinSheet(false);
  }, [group, joinMessage, me, isRTL, addRequest, addNotification, showToast]);

  const handleCancelRequest = useCallback(() => {
    if (myRequest) {
      updateRequest(myRequest.id, 'rejected');
      showToast(isRTL ? 'درخواست عضویت لغو شد' : 'Join request cancelled');
      setShowCancel(false);
    }
  }, [myRequest, updateRequest, isRTL, showToast]);

  const handleStartChat = useCallback(() => {
    const existing = conversations.find((c) => c.group_id === group.id);
    if (existing) onOpenChat(existing.id);
    else onOpenChat('c2');
  }, [conversations, group.id, onOpenChat]);

  const handleOpenHostProfile = useCallback(() => {
    if (group.owner) {
      onOpenProfile(group.owner.id);
    }
  }, [group.owner, onOpenProfile]);

  return (
    <View style={styles.container}>
      <FloatingGlassHeader
        onBack={onBack}
        title={group.title}
        subtitle={
          isOwner
            ? t('ekip.manage')
            : group.category === 'work'
            ? t('discover.cat.work')
            : t('discover.cat.entertainment')
        }
        trailing={
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowShare(true)}
            style={[
              styles.headerActionBtn,
              { borderColor: colors.glassBorderStrong },
            ]}
          >
            <FrostedGlass
              borderRadius={19}
              marginWidth={8}
              scale={20}
              blurDeviation={1.6}
              overlayOpacity={isDark ? 0.1 : 0.22}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.headerIconWrap}>
              <ShareIcon size={18} color={colors.textPrimary} strokeWidth={2.2} />
            </View>
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: getSinglePillContentPaddingTop(insets.top),
          },
          Platform.OS !== 'web' && {
            paddingBottom: 110 + insets.bottom,
          },
        ]}
      >
        {group.cover_url ? (
          <View style={styles.ownerCoverShadow}>
            <View style={[styles.ownerCoverCard, { borderColor: colors.glassBorderStrong }]}>
              <Image
                source={{ uri: group.cover_url }}
                style={styles.ownerCoverImage}
                resizeMode="cover"
              />
            </View>
          </View>
        ) : null}

        <View style={styles.bodyWrap}>
          {/* Category Chip */}
          <View
            style={[
              styles.categoryBadge,
              {
                alignSelf: isRTL ? 'flex-end' : 'flex-start',
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <CatIcon
              size={12}
              color="#ffffff"
              strokeWidth={2.4}
              style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }}
            />
            <Text style={styles.categoryText}>
              {group.category === 'work' ? t('discover.cat.work') : t('discover.cat.entertainment')}
            </Text>
          </View>

          {/* Title and Description */}
          <Text style={[styles.title, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
            {group.title}
          </Text>
          <Text style={[styles.desc, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {group.description}
          </Text>

          {/* Tags */}
          {group.tags && group.tags.length > 0 && (
            <View style={[styles.tagsWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {group.tags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tagPill,
                    { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
                  ]}
                >
                  <Text style={[styles.tagText, { color: colors.textTertiary }]}>
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Event info card */}
          <View style={{ marginTop: 14 }}>
            <EkipEventInfoCard group={group} />
          </View>

          {/* Host card */}
          {group.owner && (
            <View style={{ marginTop: 2 }}>
              <EkipHostCard
                host={group.owner}
                onOpenProfile={handleOpenHostProfile}
              />
            </View>
          )}

          {/* Requirements card */}
          <View style={{ marginTop: 2 }}>
            <EkipRequirementsCard group={group} user={me} />
          </View>

          {/* Deployed Operatives Section */}
          <View style={{ marginTop: 2 }}>
            <EkipMembersSection
              members={groupMembers}
              memberCount={group.member_count}
              maxMembers={group.max_members}
              onOpenProfile={onOpenProfile}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <EkipActionBar
        group={group}
        onOpenProfile={onOpenProfile}
        onOpenChat={onOpenChat}
        onOpenJoinSheet={() => setShowJoinSheet(true)}
        onCancelRequest={() => setShowCancel(true)}
      />

      {/* Join Sheet */}
      <EkipJoinModal
        open={showJoinSheet}
        group={group}
        eligible={eligible}
        message={joinMessage}
        onChangeMessage={setJoinMessage}
        onSubmit={handleJoin}
        onClose={() => setShowJoinSheet(false)}
      />

      {/* Share Sheet */}
      <EkipShareSheet
        open={showShare}
        groupId={group.id}
        onClose={() => setShowShare(false)}
        onCopy={() => {
          showToast(isRTL ? 'لینک اکیپ در کلیپ‌بورد کپی شد' : 'Coordinates copied to clipboard');
          setShowShare(false);
        }}
      />

      {/* Cancel Confirmation Sheet */}
      <GlassSheet
        open={showCancel}
        onClose={() => setShowCancel(false)}
        title={isRTL ? 'لغو درخواست عضویت؟' : 'Revoke Clearance Request?'}
      >
        <View style={{ gap: 14, paddingVertical: 10 }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              lineHeight: 20,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {isRTL
              ? 'آیا مطمئن هستید که می‌خواهید درخواست عضویت خود در این اکیپ را لغو کنید؟'
              : 'Are you sure you want to cancel your deployment request for this operation?'}
          </Text>
          <GlassButton variant="danger" fullWidth onPress={handleCancelRequest}>
            {isRTL ? 'لغو درخواست' : 'Revoke Request'}
          </GlassButton>
          <GlassButton variant="secondary" fullWidth onPress={() => setShowCancel(false)}>
            {isRTL ? 'نگه داشتن درخواست' : 'Keep Active'}
          </GlassButton>
        </View>
      </GlassSheet>
    </View>
  );
}

export const EkipDetail = React.memo(EkipDetailComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  bodyWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f472b6',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ownerCoverShadow: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 24,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
        }
      : {}),
  },
  ownerCoverCard: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    ...(Platform.OS === 'android' ? { elevation: 6 } : {}),
  },
  ownerCoverImage: {
    width: '100%',
    height: '100%',
  },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: Platform.OS === 'android' ? 0 : 4,
    overflow: 'hidden',
    position: 'relative',
  },
  headerIconWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});