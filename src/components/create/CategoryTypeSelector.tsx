import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassSegmented } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import type { GroupCategory, GroupType } from '../../types/database';

export function CategoryTypeSelector({
  category,
  groupType,
  onChangeCategory,
  onChangeGroupType,
}: {
  category: GroupCategory;
  groupType: GroupType;
  onChangeCategory: (cat: GroupCategory) => void;
  onChangeGroupType: (type: GroupType) => void;
}) {
  const { colors } = useTheme();
  const PartyPopper = getIcon('PartyPopper');
  const Briefcase = getIcon('Briefcase');

  return (
    <View style={{ gap: 14 }}>
      {/* Category Selection */}
      <View>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Mission Category</Text>
        <View style={styles.gridRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onChangeCategory('entertainment')}
            style={{ flex: 1 }}
          >
            <GlassCard
              variant={category === 'entertainment' ? 'default' : 'thin'}
              style={[
                styles.categoryCard,
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
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.categoryTitle, { color: colors.textPrimary }]}>
                  Entertainment
                </Text>
                <Text style={[styles.categorySubtitle, { color: colors.textTertiary }]}>
                  Social & R&R
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
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.categoryTitle, { color: colors.textPrimary }]}>
                  Work / Ops
                </Text>
                <Text style={[styles.categorySubtitle, { color: colors.textTertiary }]}>
                  Tactical & Briefing
                </Text>
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>
      </View>

      {/* Group Format */}
      <View>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Squad Format</Text>
        <GlassSegmented
          options={[
            { label: 'Solo', value: 'solo', icon: 'User' },
            { label: 'Duo', value: 'couple', icon: 'Users' },
            { label: 'Squad', value: 'group', icon: 'Layers' },
          ]}
          value={groupType}
          onChange={(v) => onChangeGroupType(v as GroupType)}
        />
      </View>
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
});
