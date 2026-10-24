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

  const typeLabels: Record<string, string> = {
    solo: t('ekip.typeSolo'),
    couple: t('ekip.typeCouple'),
    group: t('ekip.typeGroup'),
  };

  const categoryLabels: Record<string, string> = {
    work: t('discover.cat.work'),
    entertainment: t('discover.cat.entertainment'),
  };

  const eventDate = new Date(group.event_date);
  const dateStr = eventDate.toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', { month: 'short', day: 'numeric' });
  const timeStr = eventDate.toLocaleTimeString(isRTL ? 'fa-IR' : 'en-US', { hour: 'numeric', minute: '2-digit' });

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
                {typeLabels[group.group_type] ?? group.group_type}
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
              <Text style={styles.tagChipText}>{categoryLabels[group.category] ?? group.category}</Text>
            </View>
            <View style={styles.tagChip}>
              <Text style={styles.tagChipText}>{typeLabels[group.group_type] ?? group.group_type}</Text>
            </View>
            {group.premium_only && (
              <LinearGradient
                colors={['#eab308', '#f59e0b']}
                style={[styles.tagChip, { borderColor: 'transparent' }]}
              >
                <CrownIcon size={11} color="#ffffff" strokeWidth={2.4} style={{ marginRight: 3 }} />
                <Text style={styles.tagChipText}>{t('ekip.premium')}</Text>
              </LinearGradient>
            )}
          </View>

          {/* Status badge */}
          {(isOwner || myRequest) && (
            <View>
              {isOwner ? (
                <GlassBadgeIcon icon="Crown" label={t('activity.owner')} color="amber" />
              ) : myRequest ? (
                <GlassBadgeIcon
                  icon={myRequest.status === 'accepted' ? 'CheckCircle2' : 'Clock'}
                  label={myRequest.status === 'accepted' ? t('activity.joinedBadge') : t('activity.pendingBadge')}
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
                {group.owner ? `${group.owner.first_name} ${group.owner.last_name}` : ''}
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
    borderRadius: 24,
    overflow: 'hidden',
  },
  coverWrapper: {
    position: 'relative',
    height: 160,
    width: '100%',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBadgesRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
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
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  datePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tagItem: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagItemText: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
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
    fontSize: 11,
    fontWeight: '500',
  },
  compactCard: {
    padding: 10,
    borderRadius: 18,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactImage: {
    width: 54,
    height: 54,
    borderRadius: 14,
  },
  compactType: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactSub: {
    fontSize: 11,
  },
});
