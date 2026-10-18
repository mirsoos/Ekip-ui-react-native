import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard, GlassEmpty, GlassProgress } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import type { Mission } from '../../types/database';

export function ProfileMissionsList({ missions }: { missions: Mission[] }) {
  const { colors } = useTheme();
  const CheckCircle2 = getIcon('CheckCircle2');

  if (missions.length === 0) {
    return (
      <GlassEmpty
        icon="Target"
        title="No active missions"
        subtitle="New directives are issued weekly by Command."
      />
    );
  }

  return (
    <View style={{ gap: 10 }}>
      {missions.map((m) => (
        <GlassCard key={m.id} variant="thin" style={styles.card}>
          <View style={styles.topRow}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {m.title}
            </Text>
            <Text style={styles.reward}>+{m.xp_reward} XP</Text>
          </View>

          <Text style={[styles.desc, { color: colors.textSecondary }]}>
            {m.description}
          </Text>

          <View style={{ marginTop: 8 }}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: colors.textTertiary }]}>
                Progress
              </Text>
              <Text style={[styles.progressCount, { color: colors.textPrimary }]}>
                {m.progress} / {m.target}
              </Text>
            </View>

            <GlassProgress
              value={m.progress}
              max={m.target}
              color={m.is_complete ? 'success' : 'accent'}
            />
          </View>

          {m.is_complete && (
            <View style={styles.completeTag}>
              <CheckCircle2 size={13} color="#22c55e" strokeWidth={2.4} style={{ marginRight: 4 }} />
              <Text style={styles.completeText}>Objective Complete</Text>
            </View>
          )}
        </GlassCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  reward: {
    color: '#f472b6',
    fontSize: 12,
    fontWeight: '800',
  },
  desc: {
    fontSize: 12,
    lineHeight: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
  },
  progressCount: {
    fontSize: 11,
    fontWeight: '700',
  },
  completeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  completeText: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '700',
  },
});
