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
  const animVal = useRef(new Animated.Value(0)).current;
  const pct = Math.min(100, Math.max(0, (progress / (target || 1)) * 100));

  useEffect(() => {
    animVal.setValue(0);
    const anim = Animated.timing(animVal, {
      toValue: pct,
      duration: 850,
      delay: index * 80 + 100,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [pct, index]);

  const gradColors: [string, string] = isComplete
    ? ['#22c55e', '#10b981']
    : ['#f472b6', '#3b82f6'];

  const width = animVal.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        styles.progressTrack,
        {
          backgroundColor: colors.glassThinBg,
          borderColor: colors.glassBorder,
        },
      ]}
    >
      <Animated.View style={[styles.progressBar, { width }]}>
        <LinearGradient
          colors={gradColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
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
        title={isRTL ? 'هیچ مأموریت فعالی وجود ندارد' : 'No active missions'}
        subtitle={isRTL ? 'دستورالعمل‌های جدید به صورت دوره‌ای توسط ستاد اعلام می‌شوند.' : 'New directives are issued weekly by Command.'}
      />
    );
  }

  return (
    <View style={{ gap: 10 }}>
      {missions.map((m, idx) => (
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
                {isRTL ? 'پیشرفت مأموریت' : 'Progress'}
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
            <View style={styles.completeTag}>
              <CheckCircle2 size={13} color="#22c55e" strokeWidth={2.4} style={{ marginRight: 4 }} />
              <Text style={styles.completeText}>
                {isRTL ? 'هدف با موفقیت تکمیل شد' : 'Objective Complete'}
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
