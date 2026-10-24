import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Group } from '../../types/database';

export function EkipEventInfoCard({ group }: { group: Group }) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();

  const eventDate = new Date(group.event_date);
  const dateStr = eventDate.toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = eventDate.toLocaleTimeString(isRTL ? 'fa-IR' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const MapPin = getIcon('MapPin');
  const Clock = getIcon('Clock');

  return (
    <GlassCard style={styles.card}>
      <View style={styles.topRow}>
        <LinearGradient
          colors={['rgba(244, 114, 182, 0.25)', 'rgba(59, 130, 246, 0.25)']}
          style={styles.dateBox}
        >
          <Text style={styles.monthText}>
            {eventDate.toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', { month: 'short' })}
          </Text>
          <Text style={[styles.dayText, { color: colors.textPrimary }]}>
            {eventDate.getDate()}
          </Text>
        </LinearGradient>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.dateTitle, { color: colors.textPrimary }]}>
            {dateStr}
          </Text>
          <View style={styles.timeRow}>
            <Clock size={13} color={colors.textTertiary} strokeWidth={2.2} style={{ marginRight: 4 }} />
            <Text style={[styles.timeText, { color: colors.textTertiary }]}>
              {timeStr}
            </Text>
            {group.is_repeating && (
              <Text style={styles.repeatingTag}>
                {isRTL ? ' · مأموریت دوره‌ای' : ' · Recurring Op'}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={[styles.bottomRow, { borderTopColor: colors.divider }]}>
        <View style={styles.locRow}>
          <MapPin size={14} color={colors.textTertiary} strokeWidth={2.2} style={{ marginRight: 5 }} />
          <Text style={[styles.locText, { color: colors.textSecondary }]} numberOfLines={1}>
            {group.location_name ? `${group.location_name}، ` : ''}{group.city}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 22,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f472b6',
    textTransform: 'uppercase',
  },
  dayText: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
  },
  dateTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    fontSize: 12,
  },
  repeatingTag: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '600',
  },
  bottomRow: {
    paddingTop: 10,
    borderTopWidth: 1,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locText: {
    fontSize: 12,
    flex: 1,
  },
});
