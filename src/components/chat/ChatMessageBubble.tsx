import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassAvatar } from '../Glass';
import { useTheme, CHAT_THEMES } from '../../lib/theme';
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
  const themeConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  const time = new Date(message.created_at).toLocaleTimeString('en-US', {
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
              borderColor: themeConfig.theirBubbleBorder,
            },
          ]}
        >
          {message.sender && (
            <Text style={[styles.senderName, { color: themeConfig.accentHex }]}>
              {message.sender.first_name} {message.sender.last_name}
            </Text>
          )}
          <Text style={[styles.bubbleText, { color: themeConfig.theirBubbleText }]}>
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
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  myBubble: {
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  senderName: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 19,
  },
  myTime: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'right',
    marginTop: 3,
  },
  theirTime: {
    fontSize: 9,
    textAlign: 'right',
    marginTop: 3,
  },
});
