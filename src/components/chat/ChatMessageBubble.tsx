import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassAvatar } from '../Glass';
import { useTheme, CHAT_THEMES } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Message } from '../../types/database';

export function ChatMessageBubble({
  message,
  isMe,
  showAvatar = false,
}: {
  message: Message;
  isMe: boolean;
  showAvatar?: boolean;
}) {
  const { colors, chatTheme } = useTheme();
  const { isRTL } = useI18n();
  const themeConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  const time = new Date(message.created_at).toLocaleTimeString(isRTL ? 'fa-IR' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <View
      // @ts-ignore
      className={Platform.OS === 'web' ? 'animate-rise' : undefined}
      style={[
        styles.row,
        { justifyContent: isMe ? 'flex-end' : 'flex-start' },
      ]}
    >
      {!isMe && (
        <View style={{ width: 28, marginRight: 8, alignSelf: 'flex-end' }}>
          {showAvatar && (
            <GlassAvatar
              src={message.sender?.avatar_url}
              name={message.sender?.first_name ?? 'User'}
              size={28}
              ring={false}
            />
          )}
        </View>
      )}

      {isMe ? (
        <LinearGradient
          colors={themeConfig.myBubbleGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.myBubble]}
        >
          <Text style={[styles.bubbleText, { color: themeConfig.myBubbleText }]}>
            {message.body}
          </Text>
          <Text style={styles.myTime}>{time}</Text>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.bubble,
            styles.theirBubble,
            {
              backgroundColor: themeConfig.theirBubbleBg,
              borderColor: colors.glassBorder,
            },
          ]}
        >
          <Text style={[styles.senderName, { color: themeConfig.accentHex }]}>
            {message.sender?.first_name} {message.sender?.last_name}
          </Text>
          <Text style={[styles.bubbleText, { color: colors.textPrimary }]}>
            {message.body}
          </Text>
          <Text style={[styles.theirTime, { color: colors.textTertiary }]}>{time}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myBubble: {
    borderBottomRightRadius: 6,
  },
  theirBubble: {
    borderBottomLeftRadius: 6,
    borderWidth: 1,
  },
  senderName: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 19,
  },
  myTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  theirTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});
