import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard, GlassAvatar } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { GroupMember } from '../../types/database';

export function EkipMembersSection({
  members,
  memberCount,
  maxMembers,
  onOpenProfile,
}: {
  members: GroupMember[];
  memberCount: number;
  maxMembers: number | null;
  onOpenProfile: (userId: string) => void;
}) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const Users = getIcon('Users');
  const activeMembers = members.filter((m) => m.status === 'active');

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Users size={16} color="#f472b6" strokeWidth={2.4} style={{ marginRight: 6 }} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {isRTL ? 'اعضای اکیپ' : 'Ekip Members'}
          </Text>
        </View>
        <Text style={[styles.spots, { color: colors.textTertiary }]}>
          {isRTL
            ? `${memberCount} از ${maxMembers ?? '∞'} نفر`
            : `${memberCount} ${maxMembers ? `/ ${maxMembers}` : ''} spots`}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
      >
        {activeMembers.map((m) => {
          const profile = m.profile;
          if (!profile) return null;
          return (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.75}
              onPress={() => onOpenProfile(profile.id)}
              style={styles.memberItem}
            >
              <GlassAvatar
                src={profile.avatar_url}
                name={`${profile.first_name} ${profile.last_name}`}
                size={40}
                ring={m.role === 'owner'}
              />
              <Text
                style={[styles.memberName, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {profile.first_name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 22,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  spots: {
    fontSize: 12,
    fontWeight: '500',
  },
  memberItem: {
    alignItems: 'center',
    width: 52,
  },
  memberName: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
});
