import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  type StyleProp,
  type ViewStyle,
  ScrollView,
} from 'react-native';
import { GlassCard } from '../Glass';
import { useTheme } from '../../lib/theme';

/**
 * Shared breathing animation hook
 * Creates an organic, deep, sinusoidal pulse (0.35 -> 0.85) without layout shifts or harsh flashes.
 */
export function useBreathingValue(duration = 1400, enabled = true) {
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    if (!enabled) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.85,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
          isInteraction: false,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
          isInteraction: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [pulse, duration, enabled]);

  return pulse;
}

export interface GlassSkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  pulseValue?: Animated.Value;
}

/**
 * Base Glass Skeleton Block
 */
export function GlassSkeleton({
  width = '100%',
  height = 16,
  borderRadius = 10,
  style,
  pulseValue,
}: GlassSkeletonProps) {
  const { isDark, colors } = useTheme();
  const internalPulse = useBreathingValue(1400, pulseValue === undefined);
  const opacity = pulseValue ?? internalPulse;

  const bg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          backgroundColor: bg,
          borderColor: border,
          borderWidth: 1,
          opacity,
        },
        style,
      ]}
    />
  );
}

/**
 * Skeleton for EkipCard (Featured, Default, or Compact)
 * Exactly mirrors the real EkipCard dimensions for Zero Layout Shift.
 */
export function EkipCardSkeleton({
  variant = 'default',
}: {
  variant?: 'default' | 'compact' | 'featured';
}) {
  const { colors, isDark } = useTheme();
  const pulse = useBreathingValue();

  if (variant === 'compact') {
    return (
      <GlassCard variant="thin" style={styles.compactCard}>
        <View style={styles.compactRow}>
          <GlassSkeleton width={60} height={60} borderRadius={16} pulseValue={pulse} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <GlassSkeleton width={70} height={10} borderRadius={6} pulseValue={pulse} style={{ marginBottom: 6 }} />
            <GlassSkeleton width="80%" height={14} borderRadius={8} pulseValue={pulse} style={{ marginBottom: 6 }} />
            <GlassSkeleton width="50%" height={10} borderRadius={6} pulseValue={pulse} />
          </View>
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard glow={variant === 'featured'} style={styles.card}>
      {/* Cover Banner Skeleton */}
      <View style={styles.coverWrapper}>
        <GlassSkeleton
          width="100%"
          height={150}
          borderRadius={0}
          pulseValue={pulse}
          style={StyleSheet.absoluteFill}
        />

        {/* Top badges placeholder */}
        <View style={styles.topBadgesRow}>
          <View style={styles.chipsGroup}>
            <GlassSkeleton width={80} height={22} borderRadius={999} pulseValue={pulse} />
            <GlassSkeleton width={60} height={22} borderRadius={999} pulseValue={pulse} />
          </View>
        </View>

        {/* Date pill placeholder */}
        <View style={styles.datePill}>
          <GlassSkeleton width={110} height={22} borderRadius={14} pulseValue={pulse} />
        </View>
      </View>

      {/* Body Skeleton */}
      <View style={styles.cardBody}>
        <GlassSkeleton width="75%" height={18} borderRadius={9} pulseValue={pulse} style={{ marginBottom: 8 }} />
        <GlassSkeleton width="96%" height={13} borderRadius={6} pulseValue={pulse} style={{ marginBottom: 5 }} />
        <GlassSkeleton width="60%" height={13} borderRadius={6} pulseValue={pulse} style={{ marginBottom: 12 }} />

        {/* Tags placeholders */}
        <View style={styles.tagsContainer}>
          <GlassSkeleton width={56} height={20} borderRadius={999} pulseValue={pulse} />
          <GlassSkeleton width={70} height={20} borderRadius={999} pulseValue={pulse} />
          <GlassSkeleton width={64} height={20} borderRadius={999} pulseValue={pulse} />
        </View>

        {/* Footer Skeleton */}
        <View style={[styles.cardFooter, { borderTopColor: colors.divider }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <GlassSkeleton width={28} height={28} borderRadius={14} pulseValue={pulse} />
            <View style={{ marginLeft: 8 }}>
              <GlassSkeleton width={85} height={12} borderRadius={6} pulseValue={pulse} style={{ marginBottom: 3 }} />
              <GlassSkeleton width={55} height={9} borderRadius={4} pulseValue={pulse} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <GlassSkeleton width={40} height={12} borderRadius={6} pulseValue={pulse} />
            <GlassSkeleton width={45} height={12} borderRadius={6} pulseValue={pulse} />
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

/**
 * Skeleton for CommunityMembersRow (Active Operatives / Members in Sector)
 */
export function CommunityMembersRowSkeleton() {
  const pulse = useBreathingValue();

  return (
    <View style={styles.membersContainer}>
      <View style={styles.membersHeader}>
        <GlassSkeleton width={18} height={18} borderRadius={9} pulseValue={pulse} style={{ marginRight: 8 }} />
        <GlassSkeleton width={140} height={16} borderRadius={8} pulseValue={pulse} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <GlassCard key={i} variant="thin" style={styles.memberCard}>
            <GlassSkeleton width={36} height={36} borderRadius={18} pulseValue={pulse} />
            <GlassSkeleton width={42} height={10} borderRadius={5} pulseValue={pulse} style={{ marginTop: 8 }} />
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

/**
 * Skeleton for ChatListItem
 */
export function ChatListItemSkeleton() {
  const pulse = useBreathingValue();

  return (
    <View style={{ marginBottom: 8 }}>
      <GlassCard variant="thin" style={styles.chatCard}>
        <GlassSkeleton width={48} height={48} borderRadius={24} pulseValue={pulse} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.chatTopRow}>
            <GlassSkeleton width={120} height={15} borderRadius={7} pulseValue={pulse} />
            <GlassSkeleton width={35} height={11} borderRadius={5} pulseValue={pulse} />
          </View>
          <GlassSkeleton width="80%" height={12} borderRadius={6} pulseValue={pulse} style={{ marginTop: 6 }} />
        </View>
      </GlassCard>
    </View>
  );
}

/**
 * Skeleton for Profile Screen
 */
export function ProfileScreenSkeleton() {
  const { colors } = useTheme();
  const pulse = useBreathingValue();

  return (
    <View style={styles.profileContainer}>
      {/* Cover Skeleton */}
      <GlassSkeleton width="100%" height={190} borderRadius={0} pulseValue={pulse} />

      {/* Profile Card Header */}
      <View style={{ paddingHorizontal: 16, marginTop: -48, alignItems: 'center' }}>
        <GlassSkeleton width={96} height={96} borderRadius={48} pulseValue={pulse} style={{ borderWidth: 3, borderColor: colors.bgCanvas }} />
        <GlassSkeleton width={160} height={20} borderRadius={10} pulseValue={pulse} style={{ marginTop: 12 }} />
        <GlassSkeleton width={100} height={13} borderRadius={6} pulseValue={pulse} style={{ marginTop: 6 }} />

        {/* Stats Row */}
        <View style={styles.profileStatsRow}>
          <GlassSkeleton width={75} height={50} borderRadius={16} pulseValue={pulse} />
          <GlassSkeleton width={75} height={50} borderRadius={16} pulseValue={pulse} />
          <GlassSkeleton width={75} height={50} borderRadius={16} pulseValue={pulse} />
        </View>
      </View>
    </View>
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
  coverWrapper: {
    position: 'relative',
    height: 150,
    width: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
  },
  chipsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  datePill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  cardBody: {
    padding: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  membersContainer: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  membersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberCard: {
    width: 70,
    height: 82,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 22,
  },
  chatTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    flex: 1,
  },
  profileStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
});
