import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard, GlassAvatar, GlassBadgeIcon } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Profile } from '../../types/database';

export function EkipHostCard({
  host,
  onOpenProfile,
}: {
  host: Profile;
  onOpenProfile: () => void;
}) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const ShieldIcon = getIcon('Shield');
  const ChevronRight = getIcon(isRTL ? 'ChevronLeft' : 'ChevronRight');

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onOpenProfile} style={{ marginBottom: 12 }}>
      <GlassCard variant="thin" style={styles.card}>
        <GlassAvatar
          src={host.avatar_url}
          name={`${host.first_name} ${host.last_name}`}
          size={46}
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
              {host.first_name} {host.last_name}
            </Text>
            {host.is_verified && <GlassBadgeIcon icon="Verified" label="" color="blue" />}
            {host.is_premium && <GlassBadgeIcon icon="Crown" label="" color="amber" />}
          </View>

          <Text style={[styles.handle, { color: colors.textTertiary }]} numberOfLines={1}>
            @{host.username} {host.job ? `· ${host.job}` : ''}
          </Text>

          <View style={styles.statsRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ShieldIcon size={12} color="#22c55e" style={{ marginRight: 3 }} />
              <Text style={styles.statText}>
                {isRTL ? `اعتبار ${host.honor_score}` : `Honor ${host.honor_score}`}
              </Text>
            </View>
            <Text style={[styles.statDot, { color: colors.textTertiary }]}>·</Text>
            <Text style={styles.statText}>
              {isRTL ? `سطح ${host.level}` : `Level ${host.level}`}
            </Text>
          </View>
        </View>

        <ChevronRight size={18} color={colors.textTertiary} />
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 22,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  handle: {
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  statText: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '600',
  },
  statDot: {
    fontSize: 10,
  },
});
