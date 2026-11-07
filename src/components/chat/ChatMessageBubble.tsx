// --- START OF FILE ChatMessageBubble.tsx ---

import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassAvatar, getAvatarMetrics } from '../Glass';
import { useChatTheme, useTheme, CHAT_THEMES } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { Icons } from '../../lib/icons';
import type { Message } from '../../types/database';

export interface ChatMessageBubbleProps {
  message: Message;
  isMe: boolean;
  showAvatar?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
  onLongPress?: (message: Message) => void;
  onPress?: (message: Message) => void;
  onRetry?: (message: Message) => void;
}

export function ChatMessageBubbleComponent({
  message,
  isMe,
  showAvatar = false,
  isFirstInGroup = true,
  isLastInGroup = true,
  onLongPress,
  onPress,
  onRetry,
}: ChatMessageBubbleProps) {
  const { colors, isDark } = useTheme();
  const { chatTheme } = useChatTheme();
  const { isRTL, t } = useI18n();
  const themeConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  const avatarSlotWidth = getAvatarMetrics(28).containerSize;

  const time = new Date(message.created_at).toLocaleTimeString(isRTL ? 'fa-IR' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const textAlign = isRTL ? ('right' as const) : ('left' as const);

  // Grouped border radius logic
  const myBubbleShape = {
    borderTopRightRadius: isFirstInGroup ? 20 : 6,
    borderBottomRightRadius: isLastInGroup ? 6 : 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  };

  const theirBubbleShape = {
    borderTopLeftRadius: isFirstInGroup ? 20 : 6,
    borderBottomLeftRadius: isLastInGroup ? 6 : 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  };

  const handlePress = () => {
    if (message.status === 'failed' && onRetry) {
      onRetry(message);
    } else {
      onPress?.(message);
    }
  };

  const handleLongPress = () => {
    onLongPress?.(message);
  };

  const renderStatus = () => {
    if (!isMe) return null;
    const status = message.status ?? 'read';

    if (status === 'sending') {
      return <Icons.Clock size={11} color="rgba(255, 255, 255, 0.7)" strokeWidth={2} style={styles.statusIcon} />;
    }
    if (status === 'failed') {
      return (
        <TouchableOpacity
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          onPress={() => onRetry?.(message)}
          style={styles.failedBadge}
        >
          <Icons.AlertCircle size={13} color="#ef4444" strokeWidth={2.4} />
        </TouchableOpacity>
      );
    }
    if (status === 'read') {
      return (
        <View style={styles.statusDoubleCheck}>
          <Icons.Check size={11} color="#60a5fa" strokeWidth={2.6} />
          <Icons.Check size={11} color="#60a5fa" strokeWidth={2.6} style={{ marginLeft: -6 }} />
        </View>
      );
    }
    // 'sent' or 'delivered'
    return <Icons.Check size={11} color="rgba(255, 255, 255, 0.75)" strokeWidth={2.4} style={styles.statusIcon} />;
  };

  return (
    <View
      // @ts-ignore
      className={Platform.OS === 'web' ? 'animate-rise' : undefined}
      style={[
        styles.row,
        {
          justifyContent: isMe ? 'flex-end' : 'flex-start',
          marginBottom: isLastInGroup ? 8 : 3,
        },
      ]}
    >
      {!isMe && (
        <View style={{ width: avatarSlotWidth, marginRight: 8, alignSelf: 'flex-end', alignItems: 'center' }}>
          {showAvatar && (
            <GlassAvatar
              user={message.sender}
              src={message.sender?.avatar_url}
              name={message.sender?.first_name ?? 'User'}
              size={28}
              ring={false}
            />
          )}
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={300}
        style={styles.touchableBubble}
      >
        {isMe ? (
          <LinearGradient
            colors={themeConfig.myBubbleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, myBubbleShape]}
          >
            {/* Quoted reply if replying */}
            {message.reply_to && (
              <View style={[styles.quotedContainer, { backgroundColor: 'rgba(0, 0, 0, 0.18)' }]}>
                <View style={[styles.quotedBar, { backgroundColor: '#ffffff' }]} />
                <View style={styles.quotedBody}>
                  <Text style={styles.quotedSender} numberOfLines={1}>
                    {message.reply_to.sender?.first_name ?? t('chat.reply')}
                  </Text>
                  <Text style={styles.quotedText} numberOfLines={1}>
                    {message.reply_to.body}
                  </Text>
                </View>
              </View>
            )}

            {/* Media Attachment if present */}
            {message.media_url && (
              <Image source={{ uri: message.media_url }} style={styles.mediaPreview} resizeMode="cover" />
            )}

            {/* Message Body */}
            <Text
              style={[
                styles.bubbleText,
                { color: themeConfig.myBubbleText, textAlign },
                message.is_deleted && styles.deletedText,
              ]}
            >
              {message.is_deleted ? t('chat.deletedMessage') : message.body}
            </Text>

            <View style={[styles.metaRow, { alignSelf: 'flex-end' }]}>
              <Text style={styles.myTime}>{time}</Text>
              {renderStatus()}
            </View>
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.bubble,
              theirBubbleShape,
              {
                backgroundColor: themeConfig.theirBubbleBg,
                borderColor: colors.glassBorder,
              },
            ]}
          >
            {/* Sender name for first message in group */}
            {isFirstInGroup && message.sender && (
              <Text style={[styles.senderName, { color: themeConfig.accentHex, textAlign }]}>
                {message.sender.first_name} {message.sender.last_name}
              </Text>
            )}

            {/* Quoted reply if replying */}
            {message.reply_to && (
              <View
                style={[
                  styles.quotedContainer,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                  },
                ]}
              >
                <View style={[styles.quotedBar, { backgroundColor: themeConfig.accentHex }]} />
                <View style={styles.quotedBody}>
                  <Text style={[styles.quotedSender, { color: themeConfig.accentHex }]} numberOfLines={1}>
                    {message.reply_to.sender?.first_name ?? t('chat.reply')}
                  </Text>
                  <Text style={[styles.quotedText, { color: colors.textSecondary }]} numberOfLines={1}>
                    {message.reply_to.body}
                  </Text>
                </View>
              </View>
            )}

            {/* Media Attachment if present */}
            {message.media_url && (
              <Image source={{ uri: message.media_url }} style={styles.mediaPreview} resizeMode="cover" />
            )}

            <Text
              style={[
                styles.bubbleText,
                { color: colors.textPrimary, textAlign },
                message.is_deleted && styles.deletedText,
              ]}
            >
              {message.is_deleted ? t('chat.deletedMessage') : message.body}
            </Text>

            <View style={[styles.metaRow, { alignSelf: 'flex-end' }]}>
              <Text style={[styles.theirTime, { color: colors.textTertiary }]}>{time}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  touchableBubble: {
    maxWidth: '78%',
  },
  bubble: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  senderName: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  bubbleText: {
    fontSize: 14.5,
    lineHeight: 20,
  },
  deletedText: {
    fontStyle: 'italic',
    opacity: 0.7,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  myTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  theirTime: {
    fontSize: 10,
  },
  statusIcon: {
    marginLeft: 2,
  },
  statusDoubleCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
  },
  failedBadge: {
    marginLeft: 3,
  },
  quotedContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginBottom: 6,
    overflow: 'hidden',
  },
  quotedBar: {
    width: 3,
    borderRadius: 2,
    marginRight: 6,
  },
  quotedBody: {
    flex: 1,
  },
  quotedSender: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 1,
  },
  quotedText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  mediaPreview: {
    width: 220,
    height: 160,
    borderRadius: 12,
    marginBottom: 6,
  },
});

export const ChatMessageBubble = React.memo(ChatMessageBubbleComponent);
