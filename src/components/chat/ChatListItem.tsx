import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard, GlassAvatar } from '../Glass';
import { useTheme } from '../../lib/theme';
import type { Conversation } from '../../types/database';

export function ChatListItem({
  conversation,
  onPress,
}: {
  conversation: Conversation;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={{ marginBottom: 8 }}>
      <GlassCard
        variant={conversation.unread_count > 0 ? 'default' : 'thin'}
        style={styles.card}
      >
        <GlassAvatar
          src={conversation.avatar_url}
          name={conversation.title}
          size={48}
          online={conversation.type === 'direct'}
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.topRow}>
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
              {conversation.title}
            </Text>
            <Text style={[styles.time, { color: colors.textTertiary }]}>
              {formatChatTime(conversation.last_message_at ?? '')}
            </Text>
          </View>

          <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={1}>
            {conversation.last_message}
          </Text>
        </View>

        {conversation.unread_count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{conversation.unread_count}</Text>
          </View>
        )}
      </GlassCard>
    </TouchableOpacity>
  );
}

function formatChatTime(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 22,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  time: {
    fontSize: 10,
  },
  message: {
    fontSize: 12,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
});
