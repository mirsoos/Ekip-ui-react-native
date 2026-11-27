// --- START OF FILE EkipDetail.tsx ---

import React, { useState, useMemo, useCallback, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  BackHandler,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '@/src/lib/appData';
import { GlassButton } from '@/src/components/glass';
import { GlassSheet } from '@/src/components/common';
import { Icons, type IconName } from '@/src/lib/icons';
import { getSinglePillContentPaddingTop } from '@/src/lib/headerLayout';
import { EkipEventInfoCard } from '../components/EkipEventInfoCard';
import { EkipHostCard } from '../components/EkipHostCard';
import { EkipMembersSection } from '../components/EkipMembersSection';
import { EkipRequirementsCard } from '../components/EkipRequirementsCard';
import { EkipActionBar } from '../components/EkipActionBar';
import { EkipJoinModal } from '../components/EkipJoinModal';
import { EkipShareSheet } from '../components/EkipShareSheet';
import { useTheme, colors as themeColors, spacing, radii, sharedStyles } from '@/src/lib/theme';
import { useI18n } from '@/src/lib/i18n';
import { useToast } from '@/src/lib/ToastContext';
import type { Group } from '@/src/types/database';

const categoryIcons: Record<string, IconName> = {
  entertainment: 'PartyPopper',
  work: 'Briefcase',
};

export interface EkipDetailHandle {
  openShare: () => void;
}

export interface EkipDetailProps {
  group: Group;
  onBack: () => void;
  onOpenProfile: (userId: string) => void;
  onOpenChat: (conversationId: string) => void;
  initialScrollOffset?: number;
  onScrollOffsetChange?: (offset: number) => void;
}

export const EkipDetail = React.memo(
  forwardRef<EkipDetailHandle, EkipDetailProps>(function EkipDetail(
    {
      group,
      onBack,
      onOpenProfile,
      onOpenChat,
      initialScrollOffset = 0,
      onScrollOffsetChange,
    },
    ref
  ) {
  const { me, members, requests, addRequest, updateRequest, addNotification } = useAppData();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t, isRTL } = useI18n();
  const { showToast } = useToast();

  const scrollRef = useRef<any>(null);
  const initialOffset = useMemo(
    () => (initialScrollOffset > 0 ? { x: 0, y: initialScrollOffset } : undefined),
    [initialScrollOffset]
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScrollOffsetChange?.(e.nativeEvent.contentOffset.y);
    },
    [onScrollOffsetChange]
  );

  useEffect(() => {
    if (initialScrollOffset > 0) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({ y: initialScrollOffset, animated: false });
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [initialScrollOffset]);

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

  const CatIcon = (Icons as Record<string, typeof Icons.Sparkles>)[categoryIcons[group.category] ?? 'PartyPopper'] ?? Icons.PartyPopper;

  const groupMembers = useMemo(
    () => members.filter((m) => m.group_id === group.id && m.status === 'active'),
    [members, group.id]
  );

  const myRequest = useMemo(
    () => requests.find((r) => r.group_id === group.id && r.user_id === 'me'),
    [requests, group.id]
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

  const handleOpenHostProfile = useCallback(() => {
    if (group.owner) {
      onOpenProfile(group.owner.id);
    }
  }, [group.owner, onOpenProfile]);

  useImperativeHandle(
    ref,
    () => ({
      openShare: () => setShowShare(true),
    }),
    []
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentOffset={initialOffset}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: getSinglePillContentPaddingTop(insets.top),
          },
          Platform.OS !== 'web' && {
            paddingBottom: spacing.bottomNavClearance + spacing.sm + insets.bottom,
          },
        ]}
      >
        {group.cover_url ? (
          <View style={styles.ownerCoverShadow}>
            <View style={[styles.ownerCoverCard, { borderColor: colors.glassBorderStrong }]}>
              <Image
                source={{ uri: group.cover_url }}
                style={styles.ownerCoverImage}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
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
                backgroundColor: colors.brandPink,
                alignSelf: isRTL ? 'flex-end' : 'flex-start',
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <CatIcon
              size={12}
              color={colors.white}
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
          <View style={{ marginTop: spacing.md }}>
            <EkipEventInfoCard group={group} />
          </View>

          {/* Host card */}
          {group.owner && (
            <View style={{ marginTop: spacing.xxs }}>
              <EkipHostCard
                host={group.owner}
                onOpenProfile={handleOpenHostProfile}
              />
            </View>
          )}

          {/* Requirements card */}
          <View style={{ marginTop: spacing.xxs }}>
            <EkipRequirementsCard group={group} user={me} />
          </View>

          {/* Deployed Operatives Section */}
          <View style={{ marginTop: spacing.xxs }}>
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
        <View style={{ gap: spacing.md, paddingVertical: spacing.sm }}>
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
}));

const styles = StyleSheet.create({
  container: {
    ...sharedStyles.screenContainer,
  },
  scrollContent: {
    paddingBottom: spacing.bottomNavClearance,
  },
  bodyWrap: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.screenPadding,
  },
  categoryBadge: {
    ...sharedStyles.row,
    backgroundColor: themeColors.brand.brandPink,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    marginBottom: spacing.sm,
  },
  categoryText: {
    color: themeColors.palette.white,
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
    marginTop: spacing.sm,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  tagPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ownerCoverShadow: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
    borderRadius: radii.xl,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: themeColors.palette.black,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
        }
      : {}),
  },
  ownerCoverCard: {
    height: 180,
    borderRadius: radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    ...(Platform.OS === 'android' ? { elevation: 6 } : {}),
  },
  ownerCoverImage: {
    width: '100%',
    height: '100%',
  },
});
