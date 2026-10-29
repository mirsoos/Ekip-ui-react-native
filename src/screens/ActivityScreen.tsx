import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassEmpty, GlassBadgeIcon, GlassButton } from '../components/Glass';
import { Toast } from '../components/Overlays';
import { StatBox } from '../components/common/StatBox';
import { RequestsModal } from '../components/activity/RequestsModal';
import { getIcon, type IconName } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { useDeferredMount } from '../lib/useDeferredMount';
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
  const isDeferredReady = useDeferredMount(32);

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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'web' && {
            paddingTop: 148 + insets.top,
            paddingBottom: 90 + insets.bottom,
          },
        ]}
      >
        {/* Created Tab */}
        {activeTab === 'created' && (
          <View key="created" className="animate-raise" style={{ gap: 16 }}>
            {createdGroups.length === 0 ? (
              <GlassEmpty
                icon="Crown"
                title={t('activity.noCreated')}
                subtitle={t('activity.noCreatedSub')}
              />
            ) : (
              (isDeferredReady ? createdGroups : createdGroups.slice(0, 2)).map((g) => {
                const pendingReqs = pendingRequestsByGroup.get(g.id) ?? EMPTY_GROUP_REQUESTS;
                const groupMembers = activeMembersByGroup.get(g.id) ?? EMPTY_GROUP_MEMBERS;

                return (
                  <GlassCard key={g.id} style={styles.cardContainer}>
                    {/* Cover image banner with gradient & title overlay */}
                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={() => onOpenGroup(g)}
                      style={styles.bannerWrapper}
                    >
                      {g.cover_url ? (
                        <Image
                          source={{ uri: g.cover_url }}
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
                      <View style={styles.bannerContent}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                          <Text style={styles.bannerTitle} numberOfLines={1}>
                            {g.title}
                          </Text>
                          <Text style={styles.bannerDate}>
                            {new Date(g.event_date).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Text>
                        </View>
                        <GlassBadgeIcon icon="Crown" label={t('activity.owner')} color="amber" />
                      </View>
                    </TouchableOpacity>

                    {/* Stats & Management Actions Body */}
                    <View style={styles.cardBody}>
                      {/* Metric Stat Boxes: Members, Requests, Views, Joined */}
                      <View style={styles.statsGrid}>
                        <StatBox
                          icon="Users"
                          value={groupMembers.length}
                          label={t('common.members')}
                          style={{ marginHorizontal: 2 }}
                        />
                        <StatBox
                          icon="UserPlus"
                          value={pendingReqs.length}
                          label={t('activity.requests')}
                          highlight={pendingReqs.length > 0}
                          onPress={() => openRequests(g.id)}
                          style={{ marginHorizontal: 2 }}
                        />
                        <StatBox
                          icon="Eye"
                          value={g.views}
                          label={t('activity.views')}
                          style={{ marginHorizontal: 2 }}
                        />
                        <StatBox
                          icon="TrendingUp"
                          value={g.member_count}
                          label={t('activity.joined')}
                          style={{ marginHorizontal: 2 }}
                        />
                      </View>

                      {/* Action buttons */}
                      <View style={styles.actionsRow}>
                        <View style={{ flex: 1 }}>
                          <GlassButton
                            size="sm"
                            variant="secondary"
                            icon="Edit"
                            onPress={() => onOpenGroup(g)}
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
                              onPress={() => openRequests(g.id)}
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
              })
            )}
          </View>
        )}

        {/* Joined Tab */}
        {activeTab === 'joined' && (
          <View key="joined" className="animate-raise" style={{ gap: 12 }}>
            {joinedGroups.length === 0 ? (
              <GlassEmpty
                icon="Users"
                title={t('activity.noJoined')}
                subtitle={t('activity.noJoinedSub')}
              />
            ) : (
              (isDeferredReady ? joinedGroups : joinedGroups.slice(0, 3)).map((g) => (
                <TouchableOpacity
                  key={g.id}
                  activeOpacity={0.82}
                  onPress={() => onOpenGroup(g)}
                >
                  <GlassCard variant="thin" style={styles.joinedCard}>
                    {g.cover_url ? (
                      <Image
                        source={{ uri: g.cover_url }}
                        style={styles.thumbImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.thumbImage, { backgroundColor: colors.glassThinBg }]} />
                    )}
                    <View style={styles.joinedInfo}>
                      <Text
                        style={[styles.groupTitle, { color: colors.textPrimary }]}
                        numberOfLines={1}
                      >
                        {g.title}
                      </Text>
                      <Text style={[styles.groupMeta, { color: colors.textTertiary }]}>
                        {new Date(g.event_date).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        · {g.city}
                      </Text>
                      <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }}>
                        <GlassBadgeIcon icon="CheckCircle2" label={t('activity.joinedBadge')} color="green" />
                      </View>
                    </View>
                    <ChevronRight size={18} color={colors.textTertiary} style={{ alignSelf: 'center' }} />
                  </GlassCard>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Requested Tab */}
        {activeTab === 'requested' && (
          <View key="requested" className="animate-raise" style={{ gap: 12 }}>
            {myRequests.length === 0 ? (
              <GlassEmpty
                icon="Clock"
                title={t('activity.noRequests')}
                subtitle={t('activity.noRequestsSub')}
              />
            ) : (
              myRequests.map((r) => {
                const g = groupsById.get(r.group_id);
                if (!g) return null;

                const statusConfig: Record<
                  string,
                  { icon: IconName; color: 'blue' | 'green' | 'pink'; label: string }
                > = {
                  pending: { icon: 'Clock', color: 'blue', label: t('activity.pendingBadge') },
                  accepted: { icon: 'CheckCircle2', color: 'green', label: t('activity.acceptedBadge') },
                  rejected: { icon: 'XCircle', color: 'pink', label: t('activity.rejectedBadge') },
                };
                const sc = statusConfig[r.status] ?? statusConfig.pending;

                return (
                  <TouchableOpacity
                    key={r.id}
                    activeOpacity={0.82}
                    onPress={() => onOpenGroup(g)}
                  >
                    <GlassCard variant="thin" style={styles.joinedCard}>
                      {g.cover_url ? (
                        <Image
                          source={{ uri: g.cover_url }}
                          style={styles.thumbImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.thumbImage, { backgroundColor: colors.glassThinBg }]} />
                      )}
                      <View style={styles.joinedInfo}>
                        <Text
                          style={[styles.groupTitle, { color: colors.textPrimary }]}
                          numberOfLines={1}
                        >
                          {g.title}
                        </Text>
                        <Text style={[styles.groupMeta, { color: colors.textTertiary }]}>
                          {new Date(g.event_date).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                        <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }}>
                          <GlassBadgeIcon icon={sc.icon} label={sc.label} color={sc.color} />
                        </View>
                      </View>
                      <ChevronRight size={18} color={colors.textTertiary} style={{ alignSelf: 'center' }} />
                    </GlassCard>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      </ScrollView>

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
    paddingHorizontal: 20,
    paddingTop: 148,
    paddingBottom: 110,
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
  bannerGradient: {
    ...(StyleSheet.absoluteFill as object),
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
