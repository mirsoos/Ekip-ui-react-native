import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { type Group } from '../types/database';
import { GlassCard, GlassAvatar, GlassBadgeIcon } from './Glass';
import { getIcon, type IconName } from '../lib/icons';
import { useAppData } from '../lib/appData';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';

const categoryIcons: Record<string, IconName> = {
  entertainment: 'PartyPopper',
  work: 'Briefcase',
};

const typeLabels: Record<string, string> = {
  solo: 'Solo',
  couple: 'Couple',
  group: 'Group',
};

export function EkipCard({
  group,
  onPress,
  variant = 'default',
}: {
  group: Group;
  onPress?: () => void;
  variant?: 'default' | 'compact' | 'featured';
}) {
  const { requests } = useAppData();
  const { colors } = useTheme();
  const { isRTL, t } = useI18n();

  const myRequest = requests.find((r) => r.group_id === group.id && r.user_id === 'me');
  const isOwner = group.owner_id === 'me';

  const eventDate = new Date(group.event_date);
  const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const CatIcon = getIcon(categoryIcons[group.category] ?? 'PartyPopper');
  const CalendarIcon = getIcon('Calendar');
  const EyeIcon = getIcon('Eye');
  const UsersIcon = getIcon('Users');
  const CrownIcon = getIcon('Crown');

  if (variant === 'compact') {
    return (
      <GlassCard variant="thin" onPress={onPress} style={styles.compactCard}>
        <View style={styles.compactRow}>
          {group.cover_url ? (
            <Image source={{ uri: group.cover_url }} style={styles.compactImage} />
          ) : (
            <View style={[styles.compactImage, { backgroundColor: colors.glassThinBg }]} />
          )}

          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <CatIcon size={12} color="#f472b6" strokeWidth={2.4} style={{ marginRight: 4 }} />
              <Text style={[styles.compactType, { color: colors.textTertiary }]}>
                {typeLabels[group.group_type]}
              </Text>
            </View>

            <Text style={[styles.compactTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              {group.title}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={[styles.compactSub, { color: colors.textTertiary }]}>{dateStr}</Text>
              <Text style={[styles.compactSub, { color: colors.textTertiary, marginHorizontal: 4 }]}>·</Text>
              <Text style={[styles.compactSub, { color: colors.textTertiary }]}>
                {group.member_count}/{group.max_members ?? '∞'}
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard glow={variant === 'featured'} onPress={onPress} style={styles.card}>
      {/* Cover image banner */}
      <View style={styles.coverWrapper}>
        {group.cover_url && (
          <Image source={{ uri: group.cover_url }} style={styles.coverImage} />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
          style={styles.coverGradient}
        />

        {/* Top badges */}
        <View style={styles.topBadgesRow}>
          <View style={styles.chipsGroup}>
            <View style={styles.tagChip}>
              <CatIcon size={11} color="#ffffff" strokeWidth={2.4} style={{ marginRight: 3 }} />
              <Text style={styles.tagChipText}>{group.category}</Text>
            </View>
            <View style={styles.tagChip}>
              <Text style={styles.tagChipText}>{typeLabels[group.group_type]}</Text>
            </View>
            {group.premium_only && (
              <LinearGradient
                colors={['#eab308', '#f59e0b']}
                style={[styles.tagChip, { borderColor: 'transparent' }]}
              >
                <CrownIcon size={11} color="#ffffff" strokeWidth={2.4} style={{ marginRight: 3 }} />
                <Text style={styles.tagChipText}>Premium</Text>
              </LinearGradient>
            )}
          </View>

          {/* Status badge */}
          {(isOwner || myRequest) && (
            <View>
              {isOwner ? (
                <GlassBadgeIcon icon="Crown" label="Owner" color="amber" />
              ) : myRequest ? (
                <GlassBadgeIcon
                  icon={myRequest.status === 'accepted' ? 'CheckCircle2' : 'Clock'}
                  label={myRequest.status === 'accepted' ? 'Joined' : 'Pending'}
                  color={myRequest.status === 'accepted' ? 'green' : 'blue'}
                />
              ) : null}
            </View>
          )}
        </View>

        {/* Date pill */}
        <View style={styles.datePill}>
          <CalendarIcon size={12} color="#ffffff" strokeWidth={2.2} style={{ marginRight: 4 }} />
          <Text style={styles.datePillText}>
            {dateStr} · {timeStr}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text
          style={[
            styles.cardTitle,
            { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' },
          ]}
        >
          {group.title}
        </Text>
        <Text
          numberOfLines={2}
          style={[
            styles.cardDesc,
            { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' },
          ]}
        >
          {group.description}
        </Text>

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {group.tags.slice(0, 4).map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tagItem,
                  { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
                ]}
              >
                <Text style={[styles.tagItemText, { color: colors.textTertiary }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={[styles.cardFooter, { borderTopColor: colors.divider }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <GlassAvatar
              src={group.owner?.avatar_url}
              name={`${group.owner?.first_name} ${group.owner?.last_name}`}
              size={28}
              ring={false}
            />
            <View style={{ marginLeft: 8 }}>
              <Text style={[styles.ownerName, { color: colors.textPrimary }]}>
                @{group.owner?.username}
              </Text>
              <Text style={[styles.ownerJob, { color: colors.textTertiary }]}>
                {group.owner?.job}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <EyeIcon size={13} color={colors.textTertiary} strokeWidth={2} style={{ marginRight: 3 }} />
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                {group.views}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <UsersIcon size={13} color={colors.textTertiary} strokeWidth={2} style={{ marginRight: 3 }} />
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                {group.member_count}
                {group.max_members ? `/${group.max_members}` : ''}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  compactCard: {
    marginBottom: 10,
    padding: 10,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  compactType: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  compactSub: {
    fontSize: 12,
  },
  coverWrapper: {
    position: 'relative',
    height: 150,
    width: '100%',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topBadgesRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagChipText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  datePill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  datePillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  cardDesc: {
    fontSize: 13,
    marginTop: 5,
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagItem: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagItemText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  ownerName: {
    fontSize: 12,
    fontWeight: '600',
  },
  ownerJob: {
    fontSize: 10,
    marginTop: 1,
  },
  metaText: {
    fontSize: 12,
  },
});
