import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Group, Profile } from '../../types/database';

export function EkipRequirementsCard({
  group,
  user,
}: {
  group: Group;
  user: Profile;
}) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const Shield = getIcon('Shield');
  const Check = getIcon('Check');
  const X = getIcon('X');

  const rules: { label: string; passed: boolean; desc: string }[] = [];

  if (group.required_level) {
    rules.push({
      label: isRTL ? `حداقل سطح ${group.required_level}` : `Level ${group.required_level}+`,
      passed: user.level >= group.required_level,
      desc: isRTL ? `سطح شما: ${user.level}` : `Your level is ${user.level}`,
    });
  }

  if (group.required_honor) {
    rules.push({
      label: isRTL ? `حداقل امتیاز ${group.required_honor}` : `Honor ${group.required_honor}+`,
      passed: user.honor_score >= group.required_honor,
      desc: isRTL ? `امتیاز شما: ${user.honor_score}` : `Your score is ${user.honor_score}`,
    });
  }

  if (group.age_min || group.age_max) {
    const min = group.age_min ?? 0;
    const max = group.age_max ?? 999;
    const age = user.age ?? 0;
    rules.push({
      label: isRTL ? `محدوده سنی ${min} تا ${max === 999 ? 'بدون سقف' : max}` : `Age ${min}-${max === 999 ? '∞' : max}`,
      passed: age >= min && age <= max,
      desc: isRTL ? `سن شما: ${age}` : `Your age is ${age}`,
    });
  }

  if (group.gender_preference && group.gender_preference !== 'any') {
    const genderLabel = group.gender_preference === 'male' ? (isRTL ? 'فقط آقا' : 'Male only') : (isRTL ? 'فقط خانم' : 'Female only');
    rules.push({
      label: genderLabel,
      passed: user.gender === group.gender_preference,
      desc: isRTL ? `جنسیت شما: ${user.gender === 'male' ? 'آقا' : 'خانم'}` : `Your gender: ${user.gender ?? 'Not set'}`,
    });
  }

  if (group.premium_only) {
    rules.push({
      label: isRTL ? 'فقط اعضای ویژه' : 'Premium Members Only',
      passed: Boolean(user.is_premium),
      desc: user.is_premium
        ? (isRTL ? 'اشتراک فعال است' : 'Active subscription')
        : (isRTL ? 'نیاز به اشتراک ویژه' : 'Upgrade required'),
    });
  }

  if (rules.length === 0) return null;

  return (
    <GlassCard variant="thin" style={styles.card}>
      <View style={styles.header}>
        <Shield size={16} color="#f472b6" strokeWidth={2.4} style={{ marginRight: 6 }} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {isRTL ? 'شرایط حضور در برنامه' : 'Participation Requirements'}
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
    padding: 14,
    borderRadius: 22,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  ruleLabel: {
    fontSize: 12,
    fontWeight: '600',
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
