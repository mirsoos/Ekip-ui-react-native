import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassEmpty, GlassBadgeIcon, GlassButton } from '../components/Glass';
import { Toast } from '../components/Overlays';
import { StatBox } from '../components/common/StatBox';
import { RequestsModal } from '../components/activity/RequestsModal';
import { getIcon, type IconName } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { getMultiRowContentPaddingTop } from '../lib/headerLayout';
import type { Group, GroupMember, GroupRequest } from '../types/database';

const EMPTY_GROUP_REQUESTS: GroupRequest[] = [];
const EMPTY_GROUP_MEMBERS: GroupMember[] = [];

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

  const [internalTab, setInternalTab] = useState('created');
  const activeTab = onChangeTab ? tab : internalTab;

  const [showRequests, setShowRequests] = useState(false);
  const [requestsGroupId, setRequestsGroupId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const {
    groupsById,
    createdGroups,
    joinedGroups,
    myRequests,
    activeMembersByGroup,
    pendingRequestsByGroup,
  } = useMemo(() => {
    const groupsById = new Map(groups.map((group) => [group.id, group]));
    const activeMembersByGroup = new Map<string, GroupMember[]>();
    const joinedGroupIds = new Set<string>();

    for (const member of members) {
      if (member.status !== 'active') continue;
      const groupMembers = activeMembersByGroup.get(member.group_id);
      if (groupMembers) groupMembers.push(member);
      else activeMembersByGroup.set(member.group_id, [member]);
      if (member.user_id === 'me') joinedGroupIds.add(member.group_id);
    }

    const pendingRequestsByGroup = new Map<string, GroupRequest[]>();
    const myRequests: GroupRequest[] = [];
    for (const request of requests) {
      if (request.user_id === 'me') myRequests.push(request);
      if (request.status !== 'pending') continue;
      const groupRequests = pendingRequestsByGroup.get(request.group_id);
      if (groupRequests) groupRequests.push(request);
      else pendingRequestsByGroup.set(request.group_id, [request]);
    }

    return {
      groupsById,
      createdGroups: groups.filter((group) => group.owner_id === 'me'),
      joinedGroups: groups.filter(
        (group) => group.owner_id !== 'me' && joinedGroupIds.has(group.id)
      ),
      myRequests,
      activeMembersByGroup,
      pendingRequestsByGroup,
    };
  }, [groups, members, requests]);

  const ChevronRight = getIcon(isRTL ? 'ChevronLeft' : 'ChevronRight');

  const handleAccept = useCallback((reqId: string, profileName: string, groupTitle: string) => {
    updateRequest(reqId, 'accepted');
    addNotification({
      type: 'group_request',
      title: isRTL ? 'درخواست تایید شد' : 'Request accepted',
      body: isRTL
        ? `شما ${profileName} را به ${groupTitle} پذیرفتید.`
        : `You accepted ${profileName} into ${groupTitle}.`,
      icon: 'CheckCircle2',
    });
    setToast(isRTL ? 'درخواست پذیرفته شد' : 'Request accepted');
    setTimeout(() => setToast(''), 2500);
  }, [addNotification, isRTL, updateRequest]);

  const handleReject = useCallback((reqId: string) => {
    updateRequest(reqId, 'rejected');
    setToast(isRTL ? 'درخواست رد شد' : 'Request rejected');
    setTimeout(() => setToast(''), 2500);
  }, [isRTL, updateRequest]);

  const openRequests = useCallback((groupId: string) => {
    setRequestsGroupId(groupId);
    setShowRequests(true);
  }, []);

  const activeGroupRequests = requestsGroupId
    ? pendingRequestsByGroup.get(requestsGroupId) ?? EMPTY_GROUP_REQUESTS
    : EMPTY_GROUP_REQUESTS;
  const listData = useMemo(
    () => activeTab === 'created'
      ? createdGroups
      : activeTab === 'joined'
      ? joinedGroups
      : myRequests.filter((request) => groupsById.has(request.group_id)),
    [activeTab, createdGroups, groupsById, joinedGroups, myRequests]
  );
  const renderItem = useCallback(({ item }: { item: Group | GroupRequest }) => {
    if (activeTab === 'created' && !('group_id' in item)) {
      const group = item;
      const pendingReqs = pendingRequestsByGroup.get(group.id) ?? EMPTY_GROUP_REQUESTS;
      const groupMembers = activeMembersByGroup.get(group.id) ?? EMPTY_GROUP_MEMBERS;

      return (
        <GlassCard style={styles.cardContainer}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => onOpenGroup(group)}
            style={styles.bannerWrapper}
          >
            {group.cover_url ? (
              <Image source={{ uri: group.cover_url }} style={styles.bannerImage} resizeMode="cover" />
            ) : (
              <View style={[styles.bannerImage, { backgroundColor: colors.glassThinBg }]} />
            )}
            <View style={styles.bannerContent}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.bannerTitle} numberOfLines={1}>{group.title}</Text>
                <Text style={styles.bannerDate}>
                  {new Date(group.event_date).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              <GlassBadgeIcon icon="Crown" label={t('activity.owner')} color="amber" />
            </View>
          </TouchableOpacity>
          <View style={styles.cardBody}>
            <View style={styles.statsGrid}>
              <StatBox icon="Users" value={groupMembers.length} label={t('common.members')} />
              <StatBox
                icon="UserPlus"
                value={pendingReqs.length}
                label={t('activity.requests')}
                highlight={pendingReqs.length > 0}
                onPress={() => openRequests(group.id)}
              />
              <StatBox icon="Eye" value={group.views} label={t('activity.views')} />
              <StatBox icon="TrendingUp" value={group.member_count} label={t('activity.joined')} />
            </View>
            <View style={styles.actionsRow}>
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
          <GlassCard variant="thin" style={styles.joinedCard}>
            {group.cover_url ? (
              <Image source={{ uri: group.cover_url }} style={styles.thumbImage} resizeMode="cover" />
            ) : (
              <View style={[styles.thumbImage, { backgroundColor: colors.glassThinBg }]} />
            )}
            <View style={styles.joinedInfo}>
              <Text style={[styles.groupTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {group.title}
              </Text>
              <Text style={[styles.groupMeta, { color: colors.textTertiary }]}>
                {group.city} · {new Date(group.event_date).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
              <GlassBadgeIcon icon="CheckCircle2" label={t('activity.joinedBadge')} color="green" />
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </GlassCard>
        </TouchableOpacity>
      );
    }

    if (activeTab === 'requested' && 'group_id' in item) {
      const group = groupsById.get(item.group_id);
      if (!group) return null;
      const statusConfig: Record<string, { icon: IconName; color: 'blue' | 'green' | 'pink'; label: string }> = {
        pending: { icon: 'Clock', color: 'blue', label: t('activity.pendingBadge') },
        accepted: { icon: 'CheckCircle2', color: 'green', label: t('activity.acceptedBadge') },
        rejected: { icon: 'XCircle', color: 'pink', label: t('activity.rejectedBadge') },
      };
      const status = statusConfig[item.status] ?? statusConfig.pending;
      return (
        <TouchableOpacity activeOpacity={0.82} onPress={() => onOpenGroup(group)}>
          <GlassCard variant="thin" style={styles.joinedCard}>
            {group.cover_url ? (
              <Image source={{ uri: group.cover_url }} style={styles.thumbImage} resizeMode="cover" />
            ) : (
              <View style={[styles.thumbImage, { backgroundColor: colors.glassThinBg }]} />
            )}
            <View style={styles.joinedInfo}>
              <Text style={[styles.groupTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {group.title}
              </Text>
              <Text style={[styles.groupMeta, { color: colors.textTertiary }]}>
                {new Date(group.event_date).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
              <GlassBadgeIcon icon={status.icon} label={status.label} color={status.color} />
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </GlassCard>
        </TouchableOpacity>
      );
    }
    return null;
  }, [
    activeMembersByGroup,
    activeTab,
    colors,
    ChevronRight,
    groupsById,
    isRTL,
    onOpenGroup,
    openRequests,
    pendingRequestsByGroup,
    t,
  ]);
  const emptyList = activeTab === 'created'
    ? <GlassEmpty icon="Crown" title={t('activity.noCreated')} subtitle={t('activity.noCreatedSub')} />
    : activeTab === 'joined'
    ? <GlassEmpty icon="Users" title={t('activity.noJoined')} subtitle={t('activity.noJoinedSub')} />
    : <GlassEmpty icon="Clock" title={t('activity.noRequests')} subtitle={t('activity.noRequestsSub')} />;

  return (
    <View style={styles.container}>
      <FlatList<Group | GroupRequest>
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: getMultiRowContentPaddingTop(insets.top),
            paddingBottom: 100 + insets.bottom,
          },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={emptyList}
      />

      {/* Requests Modal Sheet */}
      <RequestsModal
        open={showRequests}
        onClose={() => setShowRequests(false)}
        requests={activeGroupRequests}
        onAccept={handleAccept}
        onReject={handleReject}
        onOpenProfile={onOpenProfile}
      />

      {/* Toast Notification */}
      <Toast message={toast} visible={Boolean(toast)} />
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
  cardContainer: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  bannerWrapper: {
    position: 'relative',
    height: 120,
    width: '100%',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  bannerDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.82)',
    marginTop: 2,
  },
  cardBody: {
    padding: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  groupMeta: {
    fontSize: 12,
    marginTop: 3,
  },
});
