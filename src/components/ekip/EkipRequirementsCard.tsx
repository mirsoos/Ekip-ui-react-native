import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import type { Group, Profile } from '../../types/database';

export function EkipRequirementsCard({
  group,
  user,
}: {
  group: Group;
  user: Profile;
}) {
  const { colors } = useTheme();
  const Shield = getIcon('Shield');
  const Check = getIcon('Check');
  const X = getIcon('X');

  const rules: { label: string; passed: boolean; desc: string }[] = [];

  if (group.required_level) {
    rules.push({
      label: `Level ${group.required_level}+`,
      passed: user.level >= group.required_level,
      desc: `Your level is ${user.level}`,
    });
  }

  if (group.required_honor) {
    rules.push({
      label: `Honor ${group.required_honor}+`,
      passed: user.honor_score >= group.required_honor,
      desc: `Your score is ${user.honor_score}`,
    });
  }

  if (group.age_min || group.age_max) {
    const min = group.age_min ?? 0;
    const max = group.age_max ?? 999;
    const age = user.age ?? 0;
    rules.push({
      label: `Age ${min}-${max === 999 ? '∞' : max}`,
      passed: age >= min && age <= max,
      desc: `Your age is ${age}`,
    });
  }

  if (group.gender_preference && group.gender_preference !== 'any') {
    rules.push({
      label: `${group.gender_preference} only`,
      passed: user.gender === group.gender_preference,
      desc: `Your gender: ${user.gender ?? 'Not set'}`,
    });
  }

  if (group.premium_only) {
    rules.push({
      label: 'Omega / Premium Clearance',
      passed: Boolean(user.is_premium),
      desc: user.is_premium ? 'Active subscription' : 'Upgrade required',
    });
  }

  if (rules.length === 0) return null;

  return (
    <GlassCard variant="thin" style={styles.card}>
      <View style={styles.header}>
        <Shield size={16} color="#f472b6" strokeWidth={2.4} style={{ marginRight: 6 }} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Clearance Requirements
        </Text>
      </View>

      <View style={{ gap: 8 }}>
        {rules.map((rule) => (
          <View key={rule.label} style={styles.ruleRow}>
            <Text style={[styles.ruleLabel, { color: colors.textSecondary }]}>
              {rule.label}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.ruleDesc, { color: colors.textTertiary }]}>
                {rule.desc}
              </Text>
              <View
                style={[
                  styles.checkCircle,
                  {
                    backgroundColor: rule.passed
                      ? 'rgba(34, 197, 94, 0.2)'
                      : 'rgba(239, 68, 68, 0.2)',
                  },
                ]}
              >
                {rule.passed ? (
                  <Check size={11} color="#22c55e" strokeWidth={3} />
                ) : (
                  <X size={11} color="#ef4444" strokeWidth={3} />
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  ruleLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  ruleDesc: {
    fontSize: 11,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
