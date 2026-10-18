import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassAvatar, GlassBackButton } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import type { Conversation } from '../../types/database';

export function ChatHeader({
  conversation,
  onBack,
  onOpenMenu,
}: {
  conversation: Conversation;
  onBack: () => void;
  onOpenMenu?: () => void;
}) {
  const { colors } = useTheme();
  const isGroup = conversation.type === 'group';
  const MoreIcon = getIcon('MoreVertical');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.glassThickBg,
          borderBottomColor: colors.glassBorder,
        },
      ]}
    >
      <GlassBackButton onPress={onBack} style={{ marginRight: 10 }} />

      <GlassAvatar
        src={conversation.avatar_url}
        name={conversation.title}
        size={38}
        online={!isGroup}
      />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {conversation.title}
        </Text>
        <Text style={[styles.status, { color: colors.textTertiary }]}>
          {isGroup ? 'Squad Channel' : 'Encrypted Link · Active'}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onOpenMenu}
        style={[
          styles.moreBtn,
          { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
        ]}
      >
        <MoreIcon size={18} color={colors.textPrimary} strokeWidth={2.2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    zIndex: 50,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  status: {
    fontSize: 11,
    marginTop: 1,
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
