import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard, GlassAvatar, GlassEmpty } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import type { Friendship } from '../../types/database';

export function FriendsList({
  friends,
  onOpenProfile,
}: {
  friends: Friendship[];
  onOpenProfile: (id: string) => void;
}) {
  const { colors } = useTheme();
  const ChevronRight = getIcon('ChevronRight');

  if (friends.length === 0) {
    return (
      <GlassEmpty
        icon="Users"
        title="No linked contacts"
        subtitle="Connect with active operatives across field operations."
      />
    );
  }

  return (
    <View style={{ gap: 8 }}>
      {friends.map((f) => {
        const p = f.profile;
        if (!p) return null;

        return (
          <TouchableOpacity
            key={f.id}
            activeOpacity={0.75}
            onPress={() => onOpenProfile(p.id)}
          >
            <GlassCard variant="thin" style={styles.card}>
              <GlassAvatar
                src={p.avatar_url}
                name={`${p.first_name} ${p.last_name}`}
                size={42}
              />

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                  {p.first_name} {p.last_name}
                </Text>
                <Text style={[styles.handle, { color: colors.textTertiary }]} numberOfLines={1}>
                  @{p.username} {p.job ? `· ${p.job}` : ''}
                </Text>
              </View>

              <ChevronRight size={18} color={colors.textTertiary} />
            </GlassCard>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  handle: {
    fontSize: 11,
    marginTop: 1,
  },
});
