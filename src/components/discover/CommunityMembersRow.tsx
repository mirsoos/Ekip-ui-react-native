import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard, GlassAvatar } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Profile } from '../../types/database';

export function CommunityMembersRow({
  profiles,
  onOpenProfile,
}: {
  profiles: Profile[];
  onOpenProfile: (id: string) => void;
}) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const UsersIcon = getIcon('Users');

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <UsersIcon size={16} color="#f472b6" strokeWidth={2.4} style={{ marginRight: 6 }} />
        <Text style={[styles.heading, { color: colors.textPrimary }]}>
          {t('discover.activeInSector')}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
      >
        {profiles.map((p) => (
          <TouchableOpacity
            key={p.id}
            activeOpacity={0.75}
            onPress={() => onOpenProfile(p.id)}
          >
            <GlassCard variant="thin" style={styles.memberCard}>
              <GlassAvatar
                src={p.avatar_url}
                name={`${p.first_name} ${p.last_name}`}
                size={36}
                ring={false}
              />
              <Text
                style={[styles.memberName, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {p.first_name}
              </Text>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
  },
  memberCard: {
    width: 70,
    height: 82,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  memberName: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
});
