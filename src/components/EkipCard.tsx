import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import Svg, {
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { type Group } from '../types/database';
import { GlassCard, GlassAvatar, GlassBadgeIcon } from './Glass';
import { Icons, type IconName } from '../lib/icons';
import { useAppData } from '../lib/appData';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';

const categoryIcons: Record<string, IconName> = {
  entertainment: 'PartyPopper',
  work: 'Briefcase',
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedSvgLinearGradient = Animated.createAnimatedComponent(SvgLinearGradient);
const gradientRotationInput = Array.from({ length: 9 }, (_, index) => index / 8);
const gradientAngles = gradientRotationInput.map((progress) => progress * Math.PI * 2);

function PremiumGoldBorder({ radius }: { radius: number }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rotation] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));
  const inset = 1;
  const borderRadius = Math.max(0, radius - inset);
  const width = Math.max(0, size.width - 2 * inset);
  const height = Math.max(0, size.height - 2 * inset);
  const glowOpacity = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.02, 0.62, 0.02],
  });
  const coreOpacity = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.35, 0.98, 0.35],
  });
  const glowWidth = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [3, 10, 3],
  });
  const coreWidth = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.2, 2.5, 1.2],
  });
  const getGradientCoordinate = (offset: number, direction: 'x' | 'y') =>
    rotation.interpolate({
      inputRange: gradientRotationInput,
      outputRange: gradientAngles.map((angle) =>
        direction === 'x'
          ? 0.5 + Math.cos(angle + offset) * 0.5
          : 0.5 + Math.sin(angle + offset) * 0.5
      ),
    });
  const x1 = getGradientCoordinate(Math.PI, 'x');
  const y1 = getGradientCoordinate(Math.PI, 'y');
  const x2 = getGradientCoordinate(0, 'x');
  const y2 = getGradientCoordinate(0, 'y');

  useEffect(() => {
    if (width <= 0 || height <= 0) return;

    rotation.setValue(0);
    pulse.setValue(0);
    const movement = Animated.loop(Animated.timing(rotation, {
        toValue: 1,
        duration: 30000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    movement.start();
    breathing.start();

    return () => {
      movement.stop();
      breathing.stop();
    };
  }, [height, pulse, rotation, width]);

  return (
    <View
      pointerEvents="none"
      onLayout={({ nativeEvent }) => {
        const { width: layoutWidth, height: layoutHeight } = nativeEvent.layout;
        setSize((current) =>
          current.width === layoutWidth && current.height === layoutHeight
            ? current
            : { width: layoutWidth, height: layoutHeight }
        );
      }}
      style={StyleSheet.absoluteFill}
    >
      {width > 0 && height > 0 && (
        <Svg width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`}>
          <AnimatedSvgLinearGradient
            id="premiumGoldSweep"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            gradientUnits="objectBoundingBox"
          >
            <Stop offset="0%" stopColor="#d4af37" stopOpacity={0.28} />
            <Stop offset="34%" stopColor="#e6bd52" stopOpacity={0.5} />
            <Stop offset="46%" stopColor="#ffd966" stopOpacity={0.78} />
            <Stop offset="50%" stopColor="#fff7c2" stopOpacity={1} />
            <Stop offset="54%" stopColor="#ffd966" stopOpacity={0.78} />
            <Stop offset="66%" stopColor="#e6bd52" stopOpacity={0.5} />
            <Stop offset="100%" stopColor="#d4af37" stopOpacity={0.28} />
          </AnimatedSvgLinearGradient>
          <Rect
            x={inset}
            y={inset}
            width={width}
            height={height}
            rx={borderRadius}
            fill="none"
            stroke="#d4af37"
            strokeWidth={1}
          />
          <AnimatedRect
            x={inset}
            y={inset}
            width={width}
            height={height}
            rx={borderRadius}
            fill="none"
            stroke="url(#premiumGoldSweep)"
            strokeWidth={glowWidth}
            strokeOpacity={glowOpacity}
          />
          <AnimatedRect
            x={inset}
            y={inset}
            width={width}
            height={height}
            rx={borderRadius}
            fill="none"
            stroke="url(#premiumGoldSweep)"
            strokeWidth={coreWidth}
            strokeOpacity={coreOpacity}
          />
        </Svg>
      )}
    </View>
  );
}

function FeaturedRgbBorder() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rotation] = useState(() => new Animated.Value(0));

  useEffect(() => {
    rotation.setValue(0);
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [rotation]);

  const getGradientCoordinate = (offset: number, direction: 'x' | 'y') =>
    rotation.interpolate({
      inputRange: gradientRotationInput,
      outputRange: gradientAngles.map((angle) =>
        direction === 'x'
          ? 0.5 + Math.cos(angle + offset) * 0.5
          : 0.5 + Math.sin(angle + offset) * 0.5
      ),
    });

  const x1 = getGradientCoordinate(Math.PI, 'x');
  const y1 = getGradientCoordinate(Math.PI, 'y');
  const x2 = getGradientCoordinate(0, 'x');
  const y2 = getGradientCoordinate(0, 'y');

  return (
    <View
      pointerEvents="none"
      onLayout={({ nativeEvent }) => {
        const { width, height } = nativeEvent.layout;
        setSize((current) =>
          current.width === width && current.height === height
            ? current
            : { width, height }
        );
      }}
      style={StyleSheet.absoluteFill}
    >
      {size.width > 0 && size.height > 0 && (
        <Svg width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`}>
          <AnimatedSvgLinearGradient
            id="featuredRgbBorder"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            gradientUnits="objectBoundingBox"
          >
            <Stop offset="0%" stopColor="#ff3b30" />
            <Stop offset="20%" stopColor="#ffcc00" />
            <Stop offset="40%" stopColor="#34c759" />
            <Stop offset="60%" stopColor="#00c7be" />
            <Stop offset="80%" stopColor="#007aff" />
            <Stop offset="100%" stopColor="#af52de" />
          </AnimatedSvgLinearGradient>
          <AnimatedRect
            x={0.75}
            y={0.75}
            width={size.width - 1.5}
            height={size.height - 1.5}
            rx={24}
            fill="none"
            stroke="url(#featuredRgbBorder)"
            strokeWidth={1.5}
          />
        </Svg>
      )}
    </View>
  );
}

const EkipCardBody = React.memo(function EkipCardBody({
  group,
  isRTL,
}: {
  group: Group;
  isRTL: boolean;
}) {
  const { colors } = useTheme();
  const EyeIcon = Icons.Eye;
  const UsersIcon = Icons.Users;

  return (
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

      {group.tags && group.tags.length > 0 && (
        <View style={[styles.tagsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
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

      <View style={[styles.cardFooter, { borderTopColor: colors.divider, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
          <GlassAvatar
            src={group.owner?.avatar_url}
            name={`${group.owner?.first_name} ${group.owner?.last_name}`}
            size={28}
            ring={false}
          />
          <View style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>
            <Text style={[styles.ownerName, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
              {group.owner ? `${group.owner.first_name} ${group.owner.last_name}` : ''}
            </Text>
            <Text style={[styles.ownerJob, { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' }]}>
              {group.owner?.job}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
            <EyeIcon size={13} color={colors.textTertiary} strokeWidth={2} style={{ marginRight: isRTL ? 0 : 3, marginLeft: isRTL ? 3 : 0 }} />
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
              {group.views}
            </Text>
          </View>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
            <UsersIcon size={13} color={colors.textTertiary} strokeWidth={2} style={{ marginRight: isRTL ? 0 : 3, marginLeft: isRTL ? 3 : 0 }} />
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
              {group.member_count}
              {group.max_members ? `/${group.max_members}` : ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const EkipCardCompact = React.memo(function EkipCardCompact({
  group,
  onPress,
  categoryIcon: CategoryIcon,
  typeLabel,
  dateStr,
  isRTL,
  premium,
}: {
  group: Group;
  onPress?: () => void;
  categoryIcon: LucideIcon;
  typeLabel: string;
  dateStr: string;
  isRTL: boolean;
  premium: boolean;
}) {
  const { colors } = useTheme();

  return (
    <GlassCard
      variant="thin"
      onPress={onPress}
      style={[styles.compactCard, premium && styles.premiumCompactCard]}
    >
      <View style={[styles.compactRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {group.cover_url ? (
          <Image source={{ uri: group.cover_url }} style={styles.compactImage} />
        ) : (
          <View style={[styles.compactImage, { backgroundColor: colors.glassThinBg }]} />
        )}

        <View style={{ flex: 1, marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 2 }}>
            <CategoryIcon size={12} color="#f472b6" strokeWidth={2.4} style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }} />
            <Text style={[styles.compactType, { color: colors.textTertiary }]}>
              {typeLabel}
            </Text>
          </View>

          <Text style={[styles.compactTitle, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
            {group.title}
          </Text>

          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={[styles.compactSub, { color: colors.textTertiary }]}>{dateStr}</Text>
            <Text style={[styles.compactSub, { color: colors.textTertiary, marginHorizontal: 4 }]}>·</Text>
            <Text style={[styles.compactSub, { color: colors.textTertiary }]}>
              {group.member_count}/{group.max_members ?? '∞'}
            </Text>
          </View>
        </View>
      </View>
      {premium && <PremiumGoldBorder radius={18} />}
    </GlassCard>
  );
});

export function EkipCardComponent({
  group,
  onPress,
  variant = 'default',
}: {
  group: Group;
  onPress?: () => void;
  variant?: 'default' | 'compact' | 'featured';
}) {
  const { requests } = useAppData();
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

  const CatIcon = Icons[categoryIcons[group.category] ?? 'PartyPopper'];
  const CalendarIcon = Icons.Calendar;
  const CrownIcon = Icons.Crown;

  if (variant === 'compact') {
    return (
      <EkipCardCompact
        group={group}
        onPress={onPress}
        categoryIcon={CatIcon}
        typeLabel={typeLabels[group.group_type] ?? group.group_type}
        dateStr={dateStr}
        isRTL={isRTL}
        premium={group.premium_only}
      />
    );
  }

  return (
    <GlassCard
      glow={variant === 'featured'}
      onPress={onPress}
      style={[styles.card, group.premium_only && styles.premiumCard]}
    >
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
        <View style={[styles.topBadgesRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.chipsGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.tagChip, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <CatIcon size={11} color="#ffffff" strokeWidth={2.4} style={{ marginRight: isRTL ? 0 : 3, marginLeft: isRTL ? 3 : 0 }} />
              <Text style={styles.tagChipText}>{categoryLabels[group.category] ?? group.category}</Text>
            </View>
            <View style={styles.tagChip}>
              <Text style={styles.tagChipText}>{typeLabels[group.group_type] ?? group.group_type}</Text>
            </View>
            {group.premium_only && (
              <LinearGradient
                colors={['#eab308', '#f59e0b']}
                style={[styles.tagChip, { borderColor: 'transparent', flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              >
                <CrownIcon size={11} color="#ffffff" strokeWidth={2.4} style={{ marginRight: isRTL ? 0 : 3, marginLeft: isRTL ? 3 : 0 }} />
                <Text style={styles.tagChipText}>{t('ekip.premium')}</Text>
              </LinearGradient>
            )}
          </View>

          {/* Status badge */}
          {(isOwner || myRequest) && (
            <View>
              {isOwner ? (
                <GlassBadgeIcon icon="Crown" label={t('activity.owner')} color="amber" solid />
              ) : myRequest ? (
                <GlassBadgeIcon
                  icon={myRequest.status === 'accepted' ? 'CheckCircle2' : 'Clock'}
                  label={myRequest.status === 'accepted' ? t('activity.joinedBadge') : t('activity.pendingBadge')}
                  color={myRequest.status === 'accepted' ? 'green' : 'blue'}
                  solid
                />
              ) : null}
            </View>
          )}
        </View>

        {/* Date pill */}
        <View style={[styles.datePill, isRTL ? styles.datePillRTL : styles.datePillLTR]}>
          <CalendarIcon size={12} color="#ffffff" strokeWidth={2.2} style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }} />
          <Text style={styles.datePillText}>
            {dateStr} · {timeStr}
          </Text>
        </View>
      </View>

      <EkipCardBody group={group} isRTL={isRTL} />
      {group.premium_only ? (
        <PremiumGoldBorder radius={24} />
      ) : variant === 'featured' ? (
        <FeaturedRgbBorder />
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  premiumCard: {
    borderColor: '#d4af37',
  },
  premiumCompactCard: {
    borderColor: '#d4af37',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  datePillLTR: {
    left: 12,
  },
  datePillRTL: {
    right: 12,
    flexDirection: 'row-reverse',
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

export const EkipCard = React.memo(EkipCardComponent);
