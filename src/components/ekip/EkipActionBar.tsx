import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassButton } from '../Glass';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useAppData } from '../../lib/appData';
import { useI18n } from '../../lib/i18n';
import type { Group } from '../../types/database';

export function EkipActionBarComponent({
  group,
  onOpenProfile,
  onOpenChat,
  onOpenJoinSheet,
  onCancelRequest,
}: {
  group: Group;
  onOpenProfile?: (userId: string) => void;
  onOpenChat?: (conversationId: string) => void;
  onOpenJoinSheet?: () => void;
  onCancelRequest?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { me, members, requests, conversations } = useAppData();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const ClockIcon = getIcon('Clock');

  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enterAnim.setValue(0);
    Animated.spring(enterAnim, {
      toValue: 1,
      bounciness: 4,
      speed: 14,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  const enterTranslateY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [95, 0],
  });

  const groupMembers = members.filter((m) => m.group_id === group.id && m.status === 'active');
  const myRequest = requests.find((r) => r.group_id === group.id && r.user_id === 'me');
  const isOwner = group.owner_id === 'me';
  const isMember = groupMembers.some((m) => m.user_id === 'me');

  const levelOk = !group.required_level || me.level >= group.required_level;
  const honorOk = !group.required_honor || me.honor_score >= group.required_honor;
  const ageOk =
    (!group.age_min || (me.age ?? 0) >= group.age_min) &&
    (!group.age_max || (me.age ?? 0) <= group.age_max);
  const genderOk =
    !group.gender_preference ||
    group.gender_preference === 'any' ||
    me.gender === group.gender_preference;
  const premiumOk = !group.premium_only || me.is_premium;
  const eligible = levelOk && honorOk && ageOk && genderOk && premiumOk;
  const spotsLeft = group.max_members ? group.max_members - group.member_count : null;
  const full = spotsLeft !== null && spotsLeft <= 0;

  const handleStartChat = () => {
    if (!onOpenChat) return;
    const existing = conversations.find((c) => c.group_id === group.id);
    if (existing) onOpenChat(existing.id);
    else onOpenChat('c2');
  };

  return (
    <View
      style={[
        styles.outerContainer,
        {
          paddingBottom: Platform.OS === 'web' ? 12 : Math.max(12, insets.bottom + 6),
        },
      ]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          styles.dockContainer,
          {
            borderColor: colors.glassBorderStrong,
            transform: [{ translateY: enterTranslateY }],
          },
        ]}
      >
        {/* 360° Liquid Glass Lens */}
        <LiquidLens
          borderRadius={36}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        {isOwner ? (
          <View style={styles.row}>
            <View style={{ flex: 1, zIndex: 10 }}>
              <GlassButton variant="secondary" icon="Edit" fullWidth>
                {t('common.edit')}
              </GlassButton>
            </View>
            <View style={{ flex: 1, zIndex: 10 }}>
              <GlassButton variant="secondary" icon="Users" fullWidth>
                {t('ekip.manage')}
              </GlassButton>
            </View>
          </View>
        ) : isMember || myRequest?.status === 'accepted' ? (
          <View style={styles.row}>
            <View style={{ flex: 1, zIndex: 10 }}>
              <GlassButton
                variant="secondary"
                icon="MessageCircle"
                fullWidth
                onPress={handleStartChat}
              >
                {t('nav.chat')}
              </GlassButton>
            </View>
            <View style={{ flex: 1, zIndex: 10 }}>
              <GlassButton variant="secondary" icon="CheckCircle2" fullWidth>
                {t('ekip.deployed')}
              </GlassButton>
            </View>
          </View>
        ) : myRequest?.status === 'pending' ? (
          <View style={styles.row}>
            <View style={styles.pendingIndicator}>
              <ClockIcon size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.pendingText, { color: colors.textSecondary }]}>
                {t('ekip.pendingClearance')}
              </Text>
            </View>
            <View style={{ zIndex: 10 }}>
              <GlassButton variant="secondary" icon="X" onPress={onCancelRequest}>
                {t('ekip.cancelRequest')}
              </GlassButton>
            </View>
          </View>
        ) : (
          <View style={{ width: '100%', zIndex: 10 }}>
            <GlassButton
              fullWidth
              size="lg"
              icon="UserPlus"
              onPress={onOpenJoinSheet}
              disabled={!eligible || full}
            >
              {!eligible
                ? t('ekip.clearanceNotMet')
                : full
                ? t('ekip.squadFull')
                : group.auto_accept
                ? t('ekip.deployNow')
                : t('common.requestJoin')}
            </GlassButton>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

export const EkipActionBar = React.memo(EkipActionBarComponent);

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    zIndex: 900,
  },
  dockContainer: {
    position: 'relative',
    height: 70,
    borderRadius: 36,
    borderWidth: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
          elevation: 14,
        }),
    overflow: 'visible',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  pendingIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: 10,
  },
  pendingText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
