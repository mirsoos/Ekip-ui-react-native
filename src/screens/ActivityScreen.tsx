import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassSegmented, GlassEmpty, GlassBadgeIcon, GlassButton } from '../components/Glass';
import { Toast } from '../components/Overlays';
import { StatBox } from '../components/common/StatBox';
import { RequestsModal } from '../components/activity/RequestsModal';
import { NotificationButton } from '../components/NotificationButton';
import { getIcon, type IconName } from '../lib/icons';
import { useTheme } from '../lib/theme';
import type { Group } from '../types/database';

export function ActivityScreen({
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
  const { groups, members, requests, updateRequest, addNotification, notifications } = useAppData();
  const { colors, isDark } = useTheme();

  const [internalTab, setInternalTab] = useState('created');
  const activeTab = onChangeTab ? tab : internalTab;
  const setActiveTab = onChangeTab || setInternalTab;

  const [showRequests, setShowRequests] = useState(false);
  const [requestsGroupId, setRequestsGroupId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const createdGroups = groups.filter((g) => g.owner_id === 'me');
  const myRequests = requests.filter((r) => r.user_id === 'me');
  const joinedGroups = groups.filter(
    (g) =>
      g.owner_id !== 'me' &&
      members.some((m) => m.group_id === g.id && m.user_id === 'me' && m.status === 'active')
  );

  const ChevronRight = getIcon('ChevronRight');

  const handleAccept = (reqId: string, profileName: string, groupTitle: string) => {
    updateRequest(reqId, 'accepted');
    addNotification({
      type: 'group_request',
      title: 'Request accepted',
      body: `You accepted ${profileName} into ${groupTitle}.`,
      icon: 'CheckCircle2',
    });
    setToast('Request accepted');
    setTimeout(() => setToast(''), 2500);
  };

  const handleReject = (reqId: string) => {
    updateRequest(reqId, 'rejected');
    setToast('Request rejected');
    setTimeout(() => setToast(''), 2500);
  };

  const openRequests = (groupId: string) => {
    setRequestsGroupId(groupId);
    setShowRequests(true);
  };

  const activeGroupRequests = requests.filter(
    (r) => r.group_id === requestsGroupId && r.status === 'pending'
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Created Tab */}
        {activeTab === 'created' && (
          <View key="created" className="animate-raise" style={{ gap: 16 }}>
            {createdGroups.length === 0 ? (
              <GlassEmpty
                icon="Crown"
                title="No created Ekips"
                subtitle="Create your first Ekip to start gathering people."
              />
            ) : (
              createdGroups.map((g) => {
                const pendingReqs = requests.filter(
                  (r) => r.group_id === g.id && r.status === 'pending'
                );
                const groupMembers = members.filter(
                  (m) => m.group_id === g.id && m.status === 'active'
                );

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
                            {new Date(g.event_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Text>
                        </View>
                        <GlassBadgeIcon icon="Crown" label="Owner" color="amber" />
                      </View>
                    </TouchableOpacity>

                    {/* Stats & Management Actions Body */}
                    <View style={styles.cardBody}>
                      {/* Metric Stat Boxes: Members, Requests, Views, Joined */}
                      <View style={styles.statsGrid}>
                        <StatBox
                          icon="Users"
                          value={groupMembers.length}
                          label="Members"
                          style={{ marginHorizontal: 2 }}
                        />
                        <StatBox
                          icon="UserPlus"
                          value={pendingReqs.length}
                          label="Requests"
                          highlight={pendingReqs.length > 0}
                          onPress={() => openRequests(g.id)}
                          style={{ marginHorizontal: 2 }}
                        />
                        <StatBox
                          icon="Eye"
                          value={g.views}
                          label="Views"
                          style={{ marginHorizontal: 2 }}
                        />
                        <StatBox
                          icon="TrendingUp"
                          value={g.member_count}
                          label="Joined"
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
                            Edit
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
                              Requests ({pendingReqs.length})
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
                title="No joined Ekips"
                subtitle="Discover and join Ekips to see them here."
              />
            ) : (
              joinedGroups.map((g) => (
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
                        {new Date(g.event_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        · {g.city}
                      </Text>
                      <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }}>
                        <GlassBadgeIcon icon="CheckCircle2" label="Member" color="green" />
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
                title="No requests sent"
                subtitle="Request to join an Ekip and track its status here."
              />
            ) : (
              myRequests.map((r) => {
                const g = groups.find((gr) => gr.id === r.group_id);
                if (!g) return null;

                const statusConfig: Record<
                  string,
                  { icon: IconName; color: 'blue' | 'green' | 'pink'; label: string }
                > = {
                  pending: { icon: 'Clock', color: 'blue', label: 'Pending' },
                  accepted: { icon: 'CheckCircle2', color: 'green', label: 'Accepted' },
                  rejected: { icon: 'XCircle', color: 'pink', label: 'Rejected' },
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
                          {new Date(g.event_date).toLocaleDateString('en-US', {
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
    paddingTop: 135,
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
    ...StyleSheet.absoluteFillObject,
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
