import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAppData } from '../lib/appData';
import { GlassButton } from '../components/Glass';
import { GlassSheet, Toast } from '../components/Overlays';
import { getIcon, type IconName } from '../lib/icons';
import { EkipDetailHeader } from '../components/ekip/EkipDetailHeader';
import { EkipEventInfoCard } from '../components/ekip/EkipEventInfoCard';
import { EkipHostCard } from '../components/ekip/EkipHostCard';
import { EkipMembersSection } from '../components/ekip/EkipMembersSection';
import { EkipRequirementsCard } from '../components/ekip/EkipRequirementsCard';
import { EkipActionBar } from '../components/ekip/EkipActionBar';
import { EkipJoinModal } from '../components/ekip/EkipJoinModal';
import { EkipShareSheet } from '../components/ekip/EkipShareSheet';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import type { Group } from '../types/database';

const categoryIcons: Record<string, IconName> = {
  entertainment: 'PartyPopper',
  work: 'Briefcase',
};

export function EkipDetail({
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
  const { colors } = useTheme();
  const { t, isRTL } = useI18n();

  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [toast, setToast] = useState('');

  const CatIcon = getIcon(categoryIcons[group.category] ?? 'PartyPopper');
  const groupMembers = members.filter((m) => m.group_id === group.id && m.status === 'active');
  const myRequest = requests.find((r) => r.group_id === group.id && r.user_id === 'me');
  const isOwner = group.owner_id === 'me';
  const isMember = groupMembers.some((m) => m.user_id === 'me');

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

  const handleJoin = () => {
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
        title: isRTL ? 'پیوستن به اکیپ' : 'Squad Joined',
        body: isRTL
          ? `شما اکنون یکی از اعضای مستقر در «${group.title}» هستید!`
          : `You are now a deployed operator in ${group.title}!`,
        icon: 'Users',
      });
      setToast(isRTL ? 'عضویت در اکیپ با موفقیت انجام شد!' : 'Joined squad successfully!');
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
      setToast(isRTL ? 'درخواست مجوز ورود برای سرگروه ارسال شد' : 'Clearance request transmitted to command');
    }
    setShowJoinSheet(false);
    setTimeout(() => setToast(''), 2500);
  };

  const handleCancelRequest = () => {
    if (myRequest) {
      updateRequest(myRequest.id, 'rejected');
      setToast(isRTL ? 'درخواست ورود لغو گردید' : 'Clearance request cancelled');
      setShowCancel(false);
      setTimeout(() => setToast(''), 2500);
    }
  };

  const handleStartChat = () => {
    const existing = conversations.find((c) => c.group_id === group.id);
    if (existing) onOpenChat(existing.id);
    else onOpenChat('c2');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <EkipDetailHeader
          coverUrl={group.cover_url ?? ''}
          onBack={onBack}
          onShare={() => setShowShare(true)}
        />

        <View style={styles.bodyWrap}>
          {/* Category Chip */}
          <View style={styles.categoryBadge}>
            <CatIcon size={12} color="#ffffff" strokeWidth={2.4} style={{ marginRight: 4 }} />
            <Text style={styles.categoryText}>
              {group.category === 'work' ? t('discover.cat.work') : t('discover.cat.entertainment')}
            </Text>
          </View>

          {/* Title and Description */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {group.title}
          </Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>
            {group.description}
          </Text>

          {/* Tags */}
          {group.tags && group.tags.length > 0 && (
            <View style={styles.tagsWrap}>
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
                onOpenProfile={() => onOpenProfile(group.owner!.id)}
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
          setToast('Coordinates copied to clipboard');
          setShowShare(false);
          setTimeout(() => setToast(''), 2500);
        }}
      />

      {/* Cancel Confirmation Sheet */}
      <GlassSheet
        open={showCancel}
        onClose={() => setShowCancel(false)}
        title="Revoke Clearance Request?"
      >
        <View style={{ gap: 14, paddingVertical: 10 }}>
          <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
            Are you sure you want to cancel your deployment request for this operation?
          </Text>
          <GlassButton variant="danger" fullWidth onPress={handleCancelRequest}>
            Revoke Request
          </GlassButton>
          <GlassButton variant="secondary" fullWidth onPress={() => setShowCancel(false)}>
            Keep Active
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
});
