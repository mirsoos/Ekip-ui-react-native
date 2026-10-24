import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassProgress } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Profile } from '../../types/database';

export function ProfileXpCard({ profile }: { profile: Profile }) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const Shield = getIcon('Shield');

  return (
    <GlassCard style={styles.card}>
      <View style={styles.topRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LinearGradient
            colors={['#f472b6', '#3b82f6']}
            style={styles.levelBadge}
          >
            <Text style={styles.levelNum}>{profile.level}</Text>
          </LinearGradient>
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.levelTitle, { color: colors.textPrimary }]}>
              {isRTL ? `سطح ${profile.level}` : `Level ${profile.level}`}
            </Text>
            <Text style={[styles.xpText, { color: colors.textTertiary }]}>
              {profile.xp} / {profile.xp_to_next} XP
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.honorScore, { color: colors.textPrimary }]}>
            {profile.honor_score}
          </Text>
          <Text style={[styles.reputation, { color: colors.textTertiary }]}>
            {profile.reputation_level}
          </Text>
        </View>
      </View>

      <GlassProgress value={profile.xp} max={profile.xp_to_next} />

      <View style={styles.bottomRow}>
        <Shield size={14} color="#22c55e" strokeWidth={2.4} style={{ marginRight: 4 }} />
        <Text style={[styles.honorLabel, { color: colors.textTertiary }]}>
          {isRTL ? 'نمره آمادگی تاکتیکی' : 'Tactical Readiness Score'}
        </Text>
        <Text style={[styles.honorVal, { color: colors.textPrimary }]}>
          {profile.honor_score}/100
        </Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 22,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  levelBadge: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNum: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  xpText: {
    fontSize: 11,
    marginTop: 1,
  },
  honorScore: {
    fontSize: 18,
    fontWeight: '800',
  },
  reputation: {
    fontSize: 11,
    marginTop: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  honorLabel: {
    fontSize: 11,
    flex: 1,
  },
  honorVal: {
    fontSize: 12,
    fontWeight: '700',
  },
});
