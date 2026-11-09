import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pin } from 'lucide-react-native';
import type { Message, ReplyPreview } from '../../types/chat.types';
import { StatusIndicator } from './StatusIndicator';
import { MarkdownRenderer } from '../RichText/MarkdownRenderer';
import { HighlightedText } from '../Search/HighlightedText';
import { useIsMessageSearchMatching, useChatSearchQuery } from '../../store/chatStore';
import { useTheme, useChatTheme, CHAT_THEMES } from '../../../../lib/theme';

export interface TextMessageProps {
  message: Message;
  isMe: boolean;
  onRetry?: () => void;
  onPressReply?: (replyTo: ReplyPreview) => void;
  textColor?: string;
}

const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const MatchingSearchText = React.memo(function MatchingSearchText({
  text,
  textColor,
}: {
  text: string;
  textColor: string;
}) {
  const searchQuery = useChatSearchQuery();
  return (
    <HighlightedText
      text={text}
      searchQuery={searchQuery}
      style={[styles.messageText, { color: textColor }]}
      highlightColor="#eab308"
      highlightTextColor="#0f172a"
    />
  );
});

export const TextMessage = React.memo(function TextMessage({
  message,
  isMe,
  onRetry,
  onPressReply,
  textColor,
}: TextMessageProps) {
  const { colors } = useTheme();
  const { chatTheme } = useChatTheme();
  const themeConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  const timeStr = React.useMemo(() => formatMessageTime(message.createdAt), [message.createdAt]);

  const defaultTextColor = isMe ? themeConfig.myBubbleText : themeConfig.theirBubbleText;
  const resolvedTextColor = textColor || defaultTextColor;

  const isSearchMatching = useIsMessageSearchMatching(message.id);

  return (
    <View style={styles.container}>
      {/* Pinned Message Badge Indicator */}
      {message.isPinned && (
        <View style={styles.pinnedRow}>
          <Pin size={11} color="#eab308" />
          <Text style={styles.pinnedText}>Pinned</Text>
        </View>
      )}

      {/* Quoted / Replied-to banner */}
      {message.replyTo && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressReply?.(message.replyTo!)}
          style={[
            styles.replyContainer,
            isMe ? styles.replyContainerOutgoing : styles.replyContainerIncoming,
          ]}
        >
          <View
            style={[
              styles.replyBar,
              { backgroundColor: themeConfig.accentHex },
            ]}
          />
          <View style={styles.replyContent}>
            <Text
              numberOfLines={1}
              style={[
                styles.replyAuthor,
                { color: themeConfig.accentHex },
              ]}
            >
              {message.replyTo.senderName}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.replyText,
                { color: isMe ? 'rgba(255,255,255,0.75)' : colors.textSecondary },
              ]}
            >
              {message.replyTo.type === 'image' ? '📷 Photo' : message.replyTo.text}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Main message text: HighlightedText when searching, or zero-lag MarkdownRenderer */}
      {isSearchMatching ? (
        <MatchingSearchText text={message.text} textColor={resolvedTextColor} />
      ) : (
        <MarkdownRenderer
          content={message.text}
          isMe={isMe}
          baseColor={resolvedTextColor}
          linkPreviewData={message.linkPreview}
        />
      )}

      {/* Error reason if dispatch failed */}
      {message.status === 'FAILED' && (
        <TouchableOpacity onPress={onRetry} activeOpacity={0.7} style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {message.error || 'Dispatch failed. Tap to retry.'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Timestamp & Delivery status footer */}
      <View style={styles.footerRow}>
        {message.isEdited && (
          <Text
            style={[
              styles.editedText,
              { color: isMe ? 'rgba(255, 255, 255, 0.55)' : colors.textTertiary },
            ]}
          >
            edited
          </Text>
        )}
        <Text
          style={[
            styles.timestampText,
            { color: isMe ? 'rgba(255, 255, 255, 0.7)' : colors.textTertiary },
          ]}
        >
          {timeStr}
        </Text>
        {isMe && (
          <StatusIndicator
            status={message.status}
            onRetry={onRetry}
            color="rgba(255, 255, 255, 0.65)"
            readColor={themeConfig.accentHex}
          />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  pinnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  pinnedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#eab308',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  replyContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
  },
  replyContainerOutgoing: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  replyContainerIncoming: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  replyBar: {
    width: 3,
    borderRadius: 2,
    marginRight: 8,
  },
  replyBarOutgoing: {
    backgroundColor: '#38bdf8',
  },
  replyBarIncoming: {
    backgroundColor: '#06b6d4',
  },
  replyContent: {
    flex: 1,
    justifyContent: 'center',
  },
  replyAuthor: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 1,
  },
  replyText: {
    fontSize: 12,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  errorContainer: {
    marginTop: 6,
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorText: {
    fontSize: 12,
    color: '#fca5a5',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    marginTop: 3,
  },
  editedText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  timestampText: {
    fontSize: 11,
  },
});
