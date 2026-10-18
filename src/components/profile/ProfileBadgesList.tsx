import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassEmpty } from '../Glass';
import { getIcon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import type { Badge } from '../../types/database';

export function ProfileBadgesList({ badges }: { badges: Badge[] }) {
  const { colors } = useTheme();

  if (badges.length === 0) {
    return (
      <GlassEmpty
        icon="Award"
        title="No badges earned"
        subtitle="Complete tactical missions to unlock command medals."
      />
    );
  }

  return (
    <View style={styles.grid}>
      {badges.map((b) => {
        const IconComp = getIcon((b.icon as IconName) ?? 'Award');
        return (
          <GlassCard key={b.id} variant="thin" style={styles.badgeCard}>
            <LinearGradient
              colors={['rgba(244, 114, 182, 0.3)', 'rgba(59, 130, 246, 0.3)']}
              style={styles.iconBox}
            >
              <IconComp size={18} color="#f472b6" strokeWidth={2.4} />
            </LinearGradient>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
                {b.name}
              </Text>
              <Text style={[styles.desc, { color: colors.textTertiary }]} numberOfLines={1}>
                {b.description}
              </Text>
            </View>
          </GlassCard>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 8,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  desc: {
    fontSize: 11,
    marginTop: 1,
  },
});
