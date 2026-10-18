import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard, GlassAvatar, GlassButton, GlassEmpty, GlassBadgeIcon } from '../Glass';
import { GlassSheet } from '../Overlays';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import type { GroupRequest } from '../../types/database';

export function RequestsModal({
  open,
  onClose,
  requests,
  onAccept,
  onReject,
  onOpenProfile,
}: {
  open: boolean;
  onClose: () => void;
  requests: GroupRequest[];
  onAccept: (reqId: string, name: string, groupTitle: string) => void;
  onReject: (reqId: string) => void;
  onOpenProfile?: (userId: string) => void;
}) {
  const { colors } = useTheme();
  const ChevronRight = getIcon('ChevronRight');

  const handleProfilePress = (userId: string) => {
    if (onOpenProfile) {
      onClose();
      onOpenProfile(userId);
    }
  };

  return (
    <GlassSheet open={open} onClose={onClose} title="Pending Join Requests">
      <View style={{ gap: 12 }}>
        {requests.length === 0 ? (
          <GlassEmpty
            icon="UserCheck"
            title="All caught up"
            subtitle="No pending requests for this Ekip."
          />
        ) : (
          requests.map((r) => {
            const profile = r.profile;
            const group = r.group;
            if (!profile || !group) return null;

            return (
              <GlassCard key={r.id} variant="thin" style={styles.card}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => handleProfilePress(profile.id)}
                  style={styles.profileRow}
                >
                  <GlassAvatar
                    src={profile.avatar_url}
                    name={`${profile.first_name} ${profile.last_name}`}
                    size={42}
                  />

                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                        {profile.first_name} {profile.last_name}
                      </Text>
                      {profile.is_verified && <GlassBadgeIcon icon="Verified" label="" color="blue" />}
                      {profile.is_premium && <GlassBadgeIcon icon="Crown" label="" color="amber" />}
                    </View>

                    <Text style={[styles.meta, { color: colors.textTertiary }]} numberOfLines={1}>
                      Level {profile.level} · Honor {profile.honor_score} {profile.city ? `· ${profile.city}` : ''}
                    </Text>
                  </View>

                  <ChevronRight size={18} color={colors.textTertiary} />
                </TouchableOpacity>

                {r.message && (
                  <View style={[styles.msgBox, { backgroundColor: colors.glassThinBg }]}>
                    <Text style={[styles.msgText, { color: colors.textSecondary }]}>
                      "{r.message}"
                    </Text>
                  </View>
                )}

                <View style={styles.actionsRow}>
                  <View style={{ flex: 1 }}>
                    <GlassButton
                      size="sm"
                      fullWidth
                      onPress={() =>
                        onAccept(r.id, `${profile.first_name} ${profile.last_name}`, group.title)
                      }
                    >
                      Accept
                    </GlassButton>
                  </View>
                  <View style={{ flex: 1 }}>
                    <GlassButton
                      size="sm"
                      fullWidth
                      variant="danger"
                      onPress={() => onReject(r.id)}
                    >
                      Reject
                    </GlassButton>
                  </View>
                </View>
              </GlassCard>
            );
          })
        )}
      </View>
    </GlassSheet>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  meta: {
    fontSize: 11,
    marginTop: 2,
  },
  msgBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 14,
  },
  msgText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
});
