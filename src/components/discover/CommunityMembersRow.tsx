// --- START OF FILE CommunityMembersRow.tsx ---

import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard, GlassAvatar } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Profile } from '../../types/database';

const CommunityMemberItem = React.memo(function CommunityMemberItem({
  profile,
  onOpenProfile,
  textColor,
}: {
  profile: Profile;
  onOpenProfile: (id: string) => void;
  textColor: string;
}) {
  const handlePress = useCallback(() => {
    onOpenProfile(profile.id);
  }, [profile.id, onOpenProfile]);

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={handlePress}>
      <GlassCard variant="thin" style={styles.memberCard}>
        <GlassAvatar
          user={profile}
          src={profile.avatar_url}
          name={`${profile.first_name} ${profile.last_name}`}
          size={36}
          ring={false}
        />
        <Text
          style={[styles.memberName, { color: textColor }]}
          numberOfLines={1}
        >
          {profile.first_name}
        </Text>
      </GlassCard>
    </TouchableOpacity>
  );
});

export const CommunityMembersRow = React.memo(function CommunityMembersRow({
  profiles,
  onOpenProfile,
  isRTL,
}: {
  profiles: Profile[];
  onOpenProfile: (id: string) => void;
  isRTL: boolean;
}) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const UsersIcon = getIcon('Users');

  return (
    <View style={styles.container}>
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <UsersIcon
          size={16}
          color="#f472b6"
          strokeWidth={2.4}
          style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}
        />
        <Text style={[styles.heading, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
          {t('discover.activeInSector')}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
      >
        {profiles.map((p) => (
          <CommunityMemberItem
            key={p.id}
            profile={p}
            onOpenProfile={onOpenProfile}
            textColor={colors.textPrimary}
          />
        ))}
      </ScrollView>
    </View>
  );
});

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
  scrollContent: {
    gap: 10,
    paddingVertical: 4,
    flexGrow: 1,
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