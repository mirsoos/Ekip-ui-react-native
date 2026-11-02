import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard, GlassAvatar, GlassEmpty, GlassBadgeIcon } from '../Glass';
import { GlassSheet } from '../Overlays';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { GroupMember } from '../../types/database';

export interface MembersSheetProps {
  open: boolean;
  onClose: () => void;
  members: GroupMember[];
  onOpenProfile?: (userId: string) => void;
}

export function MembersSheetComponent({
  open,
  onClose,
  members,
  onOpenProfile,
}: MembersSheetProps) {
  const { colors } = useTheme();
  const { t, isRTL } = useI18n();
  const ChevronRight = getIcon(isRTL ? 'ChevronLeft' : 'ChevronRight');

  const handleProfilePress = (userId: string) => {
    if (onOpenProfile) {
      onClose();
      onOpenProfile(userId);
    }
  };

  return (
    <GlassSheet open={open} onClose={onClose} title={isRTL ? 'اعضای اکیپ' : 'Ekip Members'}>
      <View style={{ gap: 10 }}>
        {members.length === 0 ? (
          <GlassEmpty
            icon="Users"
            title={isRTL ? 'هیچ عضوی یافت نشد' : 'No members found'}
            subtitle={isRTL ? 'هنوز کسی به این اکیپ ملحق نشده است.' : 'No one has joined this Ekip yet.'}
          />
        ) : (
          members.map((m) => {
            const profile = m.profile;
            if (!profile) return null;
            const isOwner = m.role === 'owner';

            return (
              <GlassCard key={m.id} variant="thin" style={styles.card}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => handleProfilePress(profile.id)}
                  style={[styles.profileRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                >
                  <GlassAvatar
                    user={profile}
                    src={profile.avatar_url}
                    name={`${profile.first_name} ${profile.last_name}`}
                    size={42}
                  />

                  <View style={{ flex: 1, marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }}>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.name, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                        {profile.first_name} {profile.last_name}
                      </Text>
                      {isOwner && (
                        <GlassBadgeIcon icon="Crown" label={t('activity.owner')} color="amber" solid />
                      )}
                      {profile.is_verified && <GlassBadgeIcon icon="Verified" label="" color="blue" />}
                      {profile.is_premium && <GlassBadgeIcon icon="Crown" label="" color="amber" />}
                    </View>

                    <Text style={[styles.meta, { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                      {isRTL ? `سطح ${profile.level} · اعتبار ${profile.honor_score}` : `Level ${profile.level} · Honor ${profile.honor_score}`} {profile.city ? `· ${profile.city}` : ''}
                    </Text>
                  </View>

                  <ChevronRight size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              </GlassCard>
            );
          })
        )}
      </View>
    </GlassSheet>
  );
}

export const MembersSheet = React.memo(MembersSheetComponent);

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  meta: {
    fontSize: 11,
    marginTop: 2,
  },
});
