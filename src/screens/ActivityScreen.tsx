// --- START OF FILE ActivityScreen.tsx ---

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassEmpty, GlassBadgeIcon, GlassButton } from '../components/Glass';
import { StatBox } from '../components/common/StatBox';
import { RequestsModal } from '../components/activity/RequestsModal';
import { MembersSheet } from '../components/activity/MembersSheet';
import { getIcon, Icons, type IconName } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { useToast } from '../lib/ToastContext';
import { getMultiRowContentPaddingTop } from '../lib/headerLayout';
import type { Group, GroupMember, GroupRequest } from '../types/database';

const categoryIcons: Record<string, IconName> = {
  entertainment: 'PartyPopper',
  work: 'Briefcase',
};

const EMPTY_GROUP_REQUESTS: GroupRequest[] = [];
const EMPTY_GROUP_MEMBERS: GroupMember[] = [];
const keyExtractor = (item: Group | GroupRequest) => item.id;

function ActivityItemSeparator() {
  return <View style={styles.itemSeparator} />;
}

export function ActivityScreenComponent({
  tab = 'created',
  onChangeTab,
  onOpenGroup,
  onOpenProfile,
  onOpenNotifications,
}: {
  tab?: string;
  onChangeTab?: (tab: string) => void;
  onOpenGroup: (group: Group) => void;
  onOpenProfile: (userId: string) => void;
  onOpenNotifications: () => void;
}) {
  const { groups, members, requests, updateRequest, addNotification } = useAppData();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t, isRTL } = useI18n();
  const { showToast } = useToast();

  const [internalTab] = useState('created');
  const activeTab = onChangeTab ? tab : internalTab;

  const [showRequests, setShowRequests] = useState(false);
  const [requestsGroupId, setRequestsGroupId] = useState<string | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [membersGroupId, setMembersGroupId] = useState<string | null>(null);

  const {
    groupsById,
    createdGroups,
    joinedGroups,
    myRequests,
    activeMembersByGroup,
    pendingRequestsByGroup,
  } = useMemo(() => {
    const groupsByIdMap = new Map(groups.map((group) => [group.id, group]));
    const activeMembersMap = new Map<string, GroupMember[]>();
    const joinedGroupIds = new Set<string>();

    for (const member of members) {
      if (member.status !== 'active') continue;
      const groupMembers = activeMembersMap.get(member.group_id);
      if (groupMembers) groupMembers.push(member);
      else activeMembersMap.set(member.group_id, [member]);
      if (member.user_id === 'me') joinedGroupIds.add(member.group_id);
    }

    const pendingRequestsMap = new Map<string, GroupRequest[]>();
    const userRequests: GroupRequest[] = [];
    for (const request of requests) {
      if (request.user_id === 'me') userRequests.push(request);
      if (request.status !== 'pending') continue;
      const groupRequests = pendingRequestsMap.get(request.group_id);
      if (groupRequests) groupRequests.push(request);
      else pendingRequestsMap.set(request.group_id, [request]);
    }

    return {
      groupsById: groupsByIdMap,
      createdGroups: groups.filter((group) => group.owner_id === 'me'),
      joinedGroups: groups.filter(
        (group) => group.owner_id !== 'me' && joinedGroupIds.has(group.id)
      ),
      myRequests: userRequests,
      activeMembersByGroup: activeMembersMap,
      pendingRequestsByGroup: pendingRequestsMap,
    };
  }, [groups, members, requests]);

  const ChevronRight = getIcon(isRTL ? 'ChevronLeft' : 'ChevronRight');

  const handleAccept = useCallback(
    (reqId: string, profileName: string, groupTitle: string) => {
      updateRequest(reqId, 'accepted');
      addNotification({
        type: 'group_request',
        title: isRTL ? 'درخواست تایید شد' : 'Request accepted',
        body: isRTL
          ? `شما ${profileName} را به ${groupTitle} پذیرفتید.`
          : `You accepted ${profileName} into ${groupTitle}.`,
        icon: 'CheckCircle2',
      });
      showToast(isRTL ? 'درخواست پذیرفته شد' : 'Request accepted');
    },
    [addNotification, isRTL, updateRequest, showToast]
  );

  const handleReject = useCallback(
    (reqId: string) => {
      updateRequest(reqId, 'rejected');
      showToast(isRTL ? 'درخواست رد شد' : 'Request rejected');
    },
    [isRTL, updateRequest, showToast]
  );

  const openRequests = useCallback((groupId: string) => {
    setRequestsGroupId(groupId);
    setShowRequests(true);
  }, []);

  const closeRequests = useCallback(() => {
    setShowRequests(false);
  }, []);

  const openMembers = useCallback((groupId: string) => {
    setMembersGroupId(groupId);
    setShowMembers(true);
  }, []);

  const closeMembers = useCallback(() => {
    setShowMembers(false);
  }, []);

  const activeGroupRequests = requestsGroupId
    ? pendingRequestsByGroup.get(requestsGroupId) ?? EMPTY_GROUP_REQUESTS
    : EMPTY_GROUP_REQUESTS;
  const activeGroupMembers = membersGroupId
    ? activeMembersByGroup.get(membersGroupId) ?? EMPTY_GROUP_MEMBERS
    : EMPTY_GROUP_MEMBERS;

  const listData = useMemo(
    () =>
      activeTab === 'created'
        ? createdGroups
        : activeTab === 'joined'
        ? joinedGroups
        : myRequests.filter((request) => groupsById.has(request.group_id)),
    [activeTab, createdGroups, groupsById, joinedGroups, myRequests]
  );

  const typeLabels = useMemo<Record<string, string>>(
    () => ({
      solo: t('ekip.typeSolo'),
      couple: t('ekip.typeCouple'),
      group: t('ekip.typeGroup'),
    }),
    [t]
  );

  const categoryLabels = useMemo<Record<string, string>>(
    () => ({
      work: t('discover.cat.work'),
      entertainment: t('discover.cat.entertainment'),
    }),
    [t]
  );

  const renderItem = useCallback(
    ({ item }: { item: Group | GroupRequest }) => {
      if (activeTab === 'created' && !('group_id' in item)) {
        const group = item;
        const pendingReqs = pendingRequestsByGroup.get(group.id) ?? EMPTY_GROUP_REQUESTS;
        const groupMembers = activeMembersByGroup.get(group.id) ?? EMPTY_GROUP_MEMBERS;

        const eventDate = new Date(group.event_date);
        const dateStr = eventDate.toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
          month: 'short',
          day: 'numeric',
        });
        const timeStr = eventDate.toLocaleTimeString(isRTL ? 'fa-IR' : 'en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });

        const CatIcon = Icons[categoryIcons[group.category] ?? 'PartyPopper'];
        const CalendarIcon = Icons.Calendar;
        const CrownIcon = Icons.Crown;

        return (
          <GlassCard style={styles.cardContainer}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => onOpenGroup(group)}
              style={styles.bannerWrapper}
            >
              {group.cover_url ? (
                <Image
                  source={{ uri: group.cover_url }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.bannerImage, { backgroundColor: colors.glassThinBg }]} />
              )}
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.72)']}
                style={styles.bannerGradient}
              />

              {/* Top badges */}
              <View style={[styles.topBadgesRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={[styles.chipsGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.tagChip, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <CatIcon
                      size={11}
                      color="#ffffff"
                      strokeWidth={2.4}
                      style={{ marginRight: isRTL ? 0 : 3, marginLeft: isRTL ? 3 : 0 }}
                    />
                    <Text style={styles.tagChipText}>
                      {categoryLabels[group.category] ?? group.category}
                    </Text>
                  </View>
                  <View style={styles.tagChip}>
                    <Text style={styles.tagChipText}>
                      {typeLabels[group.group_type] ?? group.group_type}
                    </Text>
                  </View>
                  {group.premium_only && (
                    <LinearGradient
                      colors={['#eab308', '#f59e0b']}
                      style={[
                        styles.tagChip,
                        { borderColor: 'transparent', flexDirection: isRTL ? 'row-reverse' : 'row' },
                      ]}
                    >
                      <CrownIcon
                        size={11}
                        color="#ffffff"
                        strokeWidth={2.4}
                        style={{ marginRight: isRTL ? 0 : 3, marginLeft: isRTL ? 3 : 0 }}
                      />
                      <Text style={styles.tagChipText}>{t('ekip.premium')}</Text>
                    </LinearGradient>
                  )}
                </View>
              </View>

              {/* Date pill at bottom */}
              <View style={[styles.datePill, isRTL ? styles.datePillRTL : styles.datePillLTR]}>
                <CalendarIcon
                  size={11}
                  color="#ffffff"
                  strokeWidth={2.2}
                  style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }}
                />
                <Text style={styles.datePillText}>
                  {dateStr} · {timeStr}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.cardBody}>
              <Text
                style={[
                  styles.groupCardTitle,
                  { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' },
                ]}
                numberOfLines={1}
              >
                {group.title}
              </Text>
              <View style={[styles.statsGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <StatBox
                  icon="Users"
                  value={groupMembers.length}
                  label={t('common.members')}
                  onPress={() => openMembers(group.id)}
                />
                <StatBox
                  icon="TrendingUp"
                  value={`${group.member_count}/${group.max_members ?? '∞'}`}
                  label={t('activity.capacity')}
                />
                <StatBox icon="Eye" value={group.views} label={t('activity.views')} />
              </View>
              <View style={[styles.actionsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={{ flex: 1 }}>
                  <GlassButton
                    size="sm"
                    variant="secondary"
                    icon="Edit"
                    onPress={() => onOpenGroup(group)}
                    fullWidth
                  >
                    {t('common.edit')}
                  </GlassButton>
                </View>
                {pendingReqs.length > 0 && (
                  <View style={{ flex: 1 }}>
                    <GlassButton
                      size="sm"
                      icon="UserPlus"
                      onPress={() => openRequests(group.id)}
                      fullWidth
                    >
                      {t('activity.requestsPending', { count: pendingReqs.length })}
                    </GlassButton>
                  </View>
                )}
              </View>
            </View>
          </GlassCard>
        );
      }

      if (activeTab === 'joined' && !('group_id' in item)) {
        const group = item;
        return (
          <TouchableOpacity activeOpacity={0.82} onPress={() => onOpenGroup(group)}>
            <GlassCard
              variant="thin"
              style={[styles.joinedCard, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              {group.cover_url ? (
                <Image
                  source={{ uri: group.cover_url }}
                  style={styles.thumbImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.thumbImage, { backgroundColor: colors.glassThinBg }]} />
              )}
              <View style={[styles.joinedInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text
                  style={[
                    styles.groupTitle,
                    { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' },
                  ]}
                  numberOfLines={1}
                >
                  {group.title}
                </Text>
                <Text
                  style={[
                    styles.groupMeta,
                    { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' },
                  ]}
                >
                  {group.city} ·{' '}
                  {new Date(group.event_date).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <GlassBadgeIcon
                  icon="CheckCircle2"
                  label={t('activity.joinedBadge')}
                  color="green"
                  solid
                />
              </View>
              <ChevronRight size={18} color={colors.textTertiary} />
            </GlassCard>
          </TouchableOpacity>
        );
      }

      if (activeTab === 'requested' && 'group_id' in item) {
        const group = groupsById.get(item.group_id);
        if (!group) return null;
        const statusConfig: Record<
          string,
          { icon: IconName; color: 'blue' | 'green' | 'pink'; label: string }
        > = {
          pending: { icon: 'Clock', color: 'blue', label: t('activity.pendingBadge') },
          accepted: { icon: 'CheckCircle2', color: 'green', label: t('activity.acceptedBadge') },
          rejected: { icon: 'XCircle', color: 'pink', label: t('activity.rejectedBadge') },
        };
        const status = statusConfig[item.status] ?? statusConfig.pending;
        return (
          <TouchableOpacity activeOpacity={0.82} onPress={() => onOpenGroup(group)}>
            <GlassCard
              variant="thin"
              style={[styles.joinedCard, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              {group.cover_url ? (
                <Image
                  source={{ uri: group.cover_url }}
                  style={styles.thumbImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.thumbImage, { backgroundColor: colors.glassThinBg }]} />
              )}
              <View style={[styles.joinedInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text
                  style={[
                    styles.groupTitle,
                    { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' },
                  ]}
                  numberOfLines={1}
                >
                  {group.title}
                </Text>
                <Text
                  style={[
                    styles.groupMeta,
                    { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' },
                  ]}
                >
                  {new Date(group.event_date).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <GlassBadgeIcon icon={status.icon} label={status.label} color={status.color} solid />
              </View>
              <ChevronRight size={18} color={colors.textTertiary} />
            </GlassCard>
          </TouchableOpacity>
        );
      }
      return null;
    },
    [
      activeMembersByGroup,
      activeTab,
      categoryLabels,
      colors,
      ChevronRight,
      groupsById,
      isRTL,
      onOpenGroup,
      openMembers,
      openRequests,
      pendingRequestsByGroup,
      t,
      typeLabels,
    ]
  );

  const emptyList = useMemo(
    () =>
      activeTab === 'created' ? (
        <GlassEmpty
          icon="Crown"
          title={t('activity.noCreated')}
          subtitle={t('activity.noCreatedSub')}
        />
      ) : activeTab === 'joined' ? (
        <GlassEmpty
          icon="Users"
          title={t('activity.noJoined')}
          subtitle={t('activity.noJoinedSub')}
        />
      ) : (
        <GlassEmpty
          icon="Clock"
          title={t('activity.noRequests')}
          subtitle={t('activity.noRequestsSub')}
        />
      ),
    [activeTab, t]
  );

  const contentContainerStyle = useMemo(
    () => [
      styles.scrollContent,
      {
        paddingTop: getMultiRowContentPaddingTop(insets.top),
        paddingBottom: 100 + insets.bottom,
      },
    ],
    [insets.top, insets.bottom]
  );

  return (
    <View style={styles.container}>
      <FlatList<Group | GroupRequest>
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        ItemSeparatorComponent={ActivityItemSeparator}
        ListEmptyComponent={emptyList}
      />

      {/* Requests Modal Sheet */}
      <RequestsModal
        open={showRequests}
        onClose={closeRequests}
        requests={activeGroupRequests}
        onAccept={handleAccept}
        onReject={handleReject}
        onOpenProfile={onOpenProfile}
      />

      {/* Members Sheet */}
      <MembersSheet
        open={showMembers}
        onClose={closeMembers}
        members={activeGroupMembers}
        onOpenProfile={onOpenProfile}
      />
    </View>
  );
}

export const ActivityScreen = React.memo(ActivityScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    zIndex: 50,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  itemSeparator: {
    height: 12,
  },
  cardContainer: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  bannerWrapper: {
    position: 'relative',
    height: 140,
    width: '100%',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBadgesRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  chipsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tagChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  datePill: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  datePillLTR: {
    left: 10,
  },
  datePillRTL: {
    right: 10,
    flexDirection: 'row-reverse',
  },
  datePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardBody: {
    padding: 14,
  },
  groupCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  joinedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 24,
    gap: 12,
  },
  thumbImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  joinedInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 5,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  groupMeta: {
    fontSize: 12,
  },
});