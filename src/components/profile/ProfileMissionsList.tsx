import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassEmpty } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Mission } from '../../types/database';

function MissionProgressBar({
  progress,
  target,
  isComplete,
  colors,
  index,
}: {
  progress: number;
  target: number;
  isComplete: boolean;
  colors: any;
  index: number;
}) {
  const { isRTL } = useI18n();
  const pct = Math.min(100, Math.max(0, (progress / (target || 1)) * 100));

  const gradColors: [string, string] = isComplete
    ? ['#22c55e', '#10b981']
    : ['#f472b6', '#3b82f6'];

  return (
    <View
      style={[
        styles.progressTrack,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          backgroundColor: colors.glassThinBg,
          borderColor: colors.glassBorder,
        },
      ]}
    >
      <View style={[styles.progressBar, { width: `${pct}%` }]}>
        <LinearGradient
          colors={gradColors}
          start={{ x: isRTL ? 1 : 0, y: 0 }}
          end={{ x: isRTL ? 0 : 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
}

export function ProfileMissionsList({ missions }: { missions: Mission[] }) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const CheckCircle2 = getIcon('CheckCircle2');

  if (missions.length === 0) {
    return (
      <GlassEmpty
        icon="Target"
        title={isRTL ? 'هیچ چالش فعالی وجود ندارد' : 'No active challenges'}
        subtitle={isRTL ? 'چالش‌ها و ماموریت‌های جدید به زودی اضافه خواهند شد.' : 'New social challenges are added periodically.'}
      />
    );
  }

  return (
    <View style={{ gap: 10 }}>
      {missions.map((m, idx) => (
        <GlassCard key={m.id} variant="thin" style={styles.card}>
          <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.title, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
              {m.title}
            </Text>
            <Text style={styles.reward}>+{m.xp_reward} XP</Text>
          </View>

          <Text style={[styles.desc, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {m.description}
          </Text>

          <View style={{ marginTop: 8 }}>
            <View style={[styles.progressRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.progressLabel, { color: colors.textTertiary }]}>
                {isRTL ? 'میزان پیشرفت' : 'Progress'}
              </Text>
              <Text style={[styles.progressCount, { color: colors.textPrimary }]}>
                {m.progress} / {m.target}
              </Text>
            </View>

            <MissionProgressBar
              progress={m.progress}
              target={m.target}
              isComplete={m.is_complete}
              colors={colors}
              index={idx}
            />
          </View>

          {m.is_complete && (
            <View style={[styles.completeTag, { alignSelf: isRTL ? 'flex-end' : 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <CheckCircle2 size={13} color="#22c55e" strokeWidth={2.4} style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }} />
              <Text style={styles.completeText}>
                {isRTL ? 'تکمیل شد' : 'Completed'}
              </Text>
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
  },
  reward: {
    fontSize: 11,
    fontWeight: '800',
    color: '#f472b6',
  },
  desc: {
    fontSize: 12,
    lineHeight: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressCount: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  completeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  completeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#22c55e',
  },
});
