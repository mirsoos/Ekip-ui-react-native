import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassAvatar, GlassBadgeIcon, GlassButton } from '../Glass';
import { InfoPill } from '../common/InfoPill';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Profile } from '../../types/database';

export function ProfileHeaderCard({
  profile,
  isOwnProfile,
  isFriend,
  onAddFriend,
  onOpenActions,
  onOpenVerification,
  hideAvatar = false,
}: {
  profile: Profile;
  isOwnProfile: boolean;
  isFriend: boolean;
  onAddFriend?: () => void;
  onOpenActions?: () => void;
  onOpenVerification?: () => void;
  hideAvatar?: boolean;
}) {
  const { colors } = useTheme();
  const { t, isRTL } = useI18n();
  const MoreHorizontal = getIcon('MoreHorizontal');
  const Smile = getIcon('Smile');

  const genderLabels: Record<string, string> = {
    male: t('create.genderMale'),
    female: t('create.genderFemale'),
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.avatarWrap}>
          {hideAvatar ? (
            <View style={{ width: 88, height: 88 }} />
          ) : (
            <GlassAvatar
              src={profile.avatar_url}
              name={`${profile.first_name} ${profile.last_name}`}
              size={88}
            />
          )}
        </View>

        {!isOwnProfile && (
          <View style={[styles.actionsGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {onOpenActions && (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onOpenActions}
                style={[
                  styles.moreBtn,
                  { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
                ]}
              >
                <MoreHorizontal size={20} color={colors.textPrimary} strokeWidth={2.2} />
              </TouchableOpacity>
            )}

            {onAddFriend && (
              <GlassButton size="sm" icon="UserPlus" onPress={onAddFriend}>
                {isFriend ? t('profile.connected') : t('profile.connect')}
              </GlassButton>
            )}
          </View>
        )}
      </View>

      <View style={{ marginTop: 12, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <View style={[styles.nameRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.name, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
            {profile.first_name} {profile.last_name}
          </Text>
          {profile.is_verified && (
            <TouchableOpacity activeOpacity={0.8} onPress={onOpenVerification}>
              <GlassBadgeIcon icon="Verified" label={t('common.verified')} color="pink" />
            </TouchableOpacity>
          )}
          {profile.is_premium && (
            <GlassBadgeIcon icon="Crown" label={t('ekip.premium')} color="amber" />
          )}
        </View>

        <Text style={[styles.handle, { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' }]}>
          @{profile.username}
        </Text>

        {profile.bio && (
          <Text style={[styles.bio, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {profile.bio}
          </Text>
        )}

        {/* Quick info pills */}
        <View style={[styles.pillsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {profile.age && <InfoPill icon="Calendar" label={t('profile.yearsOld', { age: profile.age })} />}
          {profile.gender && <InfoPill icon="User" label={genderLabels[profile.gender] ?? profile.gender} />}
          {profile.city && <InfoPill icon="MapPin" label={profile.city} />}
          {profile.job && <InfoPill icon="Briefcase" label={profile.job} />}
          {profile.personality_type && (
            <InfoPill icon="Sparkles" label={profile.personality_type} />
          )}
        </View>

        {/* Mood status */}
        {profile.mood && (
          <View
            style={[
              styles.moodBox,
              { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
            ]}
          >
            <Smile size={16} color="#f472b6" style={{ marginRight: 6 }} />
            <Text style={[styles.moodLabel, { color: colors.textTertiary }]}>{isRTL ? 'وضعیت:' : 'Status:'}</Text>
            <Text style={[styles.moodVal, { color: colors.textPrimary }]}>{profile.mood}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: -45,
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  avatarWrap: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  moreBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
  },
  handle: {
    fontSize: 13,
    marginTop: 2,
  },
  bio: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  moodBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
  },
  moodLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  moodVal: {
    fontSize: 12,
    fontWeight: '700',
  },
});
