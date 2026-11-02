import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassSegmented, GlassButton, GlassAvatar } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { GroupCategory, GroupType, Profile } from '../../types/database';

export function CategoryTypeSelector({
  category,
  groupType,
  onChangeCategory,
  onChangeGroupType,
  initialMembers = [],
  onOpenMembersSheet,
}: {
  category: GroupCategory;
  groupType: GroupType;
  onChangeCategory: (cat: GroupCategory) => void;
  onChangeGroupType: (type: GroupType) => void;
  initialMembers?: Profile[];
  onOpenMembersSheet?: () => void;
}) {
  const { colors } = useTheme();
  const { t, isRTL } = useI18n();
  const PartyPopper = getIcon('PartyPopper');
  const Briefcase = getIcon('Briefcase');

  const minRequired = groupType === 'solo' ? 0 : 1;
  const isCouple = groupType === 'couple';
  const hasEnough = isCouple ? initialMembers.length === 1 : initialMembers.length >= minRequired;
  const isVisible = groupType !== 'solo';

  const anim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  useEffect(() => {
    if (isVisible) {
      anim.setValue(0);
      Animated.spring(anim, {
        toValue: 1,
        bounciness: 4,
        speed: 14,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      anim.setValue(0);
    }
  }, [isVisible, anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-16, 0],
  });

  return (
    <View style={{ gap: 14 }}>
      {/* Category Selection */}
      <View>
        <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
          {t('create.category')}
        </Text>
        <View style={[styles.gridRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onChangeCategory('entertainment')}
            style={{ flex: 1 }}
          >
            <GlassCard
              variant={category === 'entertainment' ? 'default' : 'thin'}
              style={[
                styles.categoryCard,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
                category === 'entertainment' && { borderColor: '#f472b6', borderWidth: 2 },
              ]}
            >
              {category === 'entertainment' ? (
                <LinearGradient
                  colors={['#f472b6', '#ec4899']}
                  style={styles.iconBox}
                >
                  <PartyPopper size={20} color="#ffffff" />
                </LinearGradient>
              ) : (
                <View style={[styles.iconBox, { backgroundColor: colors.glassThinBg }]}>
                  <PartyPopper size={20} color={colors.textPrimary} />
                </View>
              )}
              <View style={{ marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }}>
                <Text style={[styles.categoryTitle, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t('discover.cat.entertainment')}
                </Text>
                <Text style={[styles.categorySubtitle, { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t('create.categoryEntertainmentSub')}
                </Text>
              </View>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onChangeCategory('work')}
            style={{ flex: 1 }}
          >
            <GlassCard
              variant={category === 'work' ? 'default' : 'thin'}
              style={[
                styles.categoryCard,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
                category === 'work' && { borderColor: '#3b82f6', borderWidth: 2 },
              ]}
            >
              {category === 'work' ? (
                <LinearGradient
                  colors={['#3b82f6', '#2563eb']}
                  style={styles.iconBox}
                >
                  <Briefcase size={20} color="#ffffff" />
                </LinearGradient>
              ) : (
                <View style={[styles.iconBox, { backgroundColor: colors.glassThinBg }]}>
                  <Briefcase size={20} color={colors.textPrimary} />
                </View>
              )}
              <View style={{ marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }}>
                <Text style={[styles.categoryTitle, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t('discover.cat.work')}
                </Text>
                <Text style={[styles.categorySubtitle, { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t('create.categoryWorkSub')}
                </Text>
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>
      </View>

      {/* Group Format */}
      <View>
        <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
          {t('create.squadFormat')}
        </Text>
        <GlassSegmented
          options={isRTL ? [
            { label: t('ekip.typeGroup'), value: 'group', icon: 'Layers' },
            { label: t('ekip.typeCouple'), value: 'couple', icon: 'Users' },
            { label: t('ekip.typeSolo'), value: 'solo', icon: 'User' },
          ] : [
            { label: t('ekip.typeSolo'), value: 'solo', icon: 'User' },
            { label: t('ekip.typeCouple'), value: 'couple', icon: 'Users' },
            { label: t('ekip.typeGroup'), value: 'group', icon: 'Layers' },
          ]}
          value={groupType}
          onChange={(v) => onChangeGroupType(v as GroupType)}
        />
      </View>

      {/* Introduce Members Button & Selected Preview (For duo/group) */}
      {isVisible && (
        <Animated.View
          style={[
            styles.membersSection,
            {
              opacity: anim,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={[styles.membersHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.label, { color: colors.textSecondary, marginBottom: 0 }]}>
              {isRTL ? 'معرفی اعضای اولیه اکیپ (الزامی)' : 'Introduce Initial Members (Required)'}
            </Text>
            <Text style={[styles.membersBadge, { color: hasEnough ? colors.accentPink : colors.textTertiary }]}>
              {isRTL
                ? `${initialMembers.length} نفر معرفی شده`
                : `${initialMembers.length} introduced`}
            </Text>
          </View>

          <GlassButton
            size="md"
            variant={hasEnough ? 'secondary' : 'primary'}
            icon="UserPlus"
            style={{ alignSelf: isRTL ? 'flex-end' : 'flex-start', minWidth: 150 }}
            onPress={onOpenMembersSheet}
          >
            {initialMembers.length === 0
              ? (isRTL ? 'معرفی اعضا' : 'Introduce Members')
              : (isRTL ? 'ویرایش اعضا' : 'Edit Members')}
          </GlassButton>

          {initialMembers.length > 0 && (
            <View style={[styles.selectedAvatarsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {initialMembers.map((m) => (
                <View key={m.id} style={[styles.memberChip, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <GlassAvatar user={m} src={m.avatar_url} name={`${m.first_name} ${m.last_name}`} size={24} ring={false} />
                  <Text style={[styles.memberChipName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {m.first_name}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {!hasEnough && (
            <Text style={[styles.warningText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {isCouple
                ? (isRTL ? '⚠️ برای ساخت اکیپ دونفره، باید دقیقاً ۱ نفر همراه معرفی کنید.' : '⚠️ For a duo ekip, you must introduce exactly 1 partner.')
                : (isRTL ? '⚠️ برای ساخت اکیپ چندنفره، حداقل باید ۱ نفر را معرفی کنید.' : '⚠️ For a group ekip, introduce at least 1 member.')}
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 2,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryCard: {
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
  categoryTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  categorySubtitle: {
    fontSize: 10,
    marginTop: 1,
  },
  membersSection: {
    gap: 8,
    marginTop: 4,
  },
  membersHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  membersBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  selectedAvatarsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  memberChipName: {
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 90,
  },
  warningText: {
    fontSize: 11,
    color: '#f59e0b',
    marginTop: 2,
    paddingHorizontal: 2,
  },
});

