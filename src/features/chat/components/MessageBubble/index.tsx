import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
  SlideInRight,
  SlideInLeft,
} from 'react-native-reanimated';

import type { Message, Attachment, ReplyPreview, BubbleLayout } from '../../types/chat.types';
import { TextMessage } from './TextMessage';
import { MediaMessage } from './MediaMessage';
import { SwipeToReplyContainer } from '../Overlays/SwipeToReplyContainer';
import { ReactionBadge } from '../Reactions/ReactionBadge';
import { useIsMessageHighlighted, useChatStore } from '../../store/chatStore';
import { useChatTheme, CHAT_THEMES } from '../../../../lib/theme';

export interface MessageBubbleProps {
  message: Message;
  currentUserId?: string;
  isGroupChat?: boolean;
  onReply: (message: Message) => void;
  onLongPress: (message: Message, layout?: BubbleLayout) => void;
  onRetry: (messageId: string) => void;
  onPressMedia?: (attachment: Attachment, index?: number, allAttachments?: Attachment[]) => void;
  onPressReply?: (replyTo: ReplyPreview) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
}

function arePropsEqual(prev: MessageBubbleProps, next: MessageBubbleProps): boolean {
  if (prev.message.id !== next.message.id) return false;
  if (prev.message.status !== next.message.status) return false;
  if (prev.message.updatedAt !== next.message.updatedAt) return false;
  if (prev.message.text !== next.message.text) return false;
  if (prev.currentUserId !== next.currentUserId) return false;
  if (prev.isGroupChat !== next.isGroupChat) return false;
  if (prev.message.error !== next.message.error) return false;
  if (prev.message.attachments !== next.message.attachments) return false;
  if (prev.message.isPinned !== next.message.isPinned) return false;
  if (prev.message.isEdited !== next.message.isEdited) return false;

  const prevReactions = prev.message.reactions;
  const nextReactions = next.message.reactions;
  if (prevReactions !== nextReactions) {
    if (!prevReactions || !nextReactions) return false;
    const prevKeys = Object.keys(prevReactions);
    const nextKeys = Object.keys(nextReactions);
    if (prevKeys.length !== nextKeys.length) return false;
    for (const key of prevKeys) {
      const prevUsers = prevReactions[key] || [];
      const nextUsers = nextReactions[key] || [];
      if (prevUsers.length !== nextUsers.length) return false;
      const prevHasMe = prevUsers.includes(prev.currentUserId || 'me');
      const nextHasMe = nextUsers.includes(next.currentUserId || 'me');
      if (prevHasMe !== nextHasMe) return false;
    }
  }

  return true;
}

export const MessageBubble = React.memo(function MessageBubble({
  message,
  currentUserId = 'me',
  isGroupChat = false,
  onReply,
  onLongPress,
  onRetry,
  onPressMedia,
  onPressReply,
  onToggleReaction,
}: MessageBubbleProps) {
  const isMe = message.senderId === currentUserId;

  const { chatTheme } = useChatTheme();
  const themeConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  // Active Message Focus & Scale on Long Press
  const selectedMessage = useChatStore((s) => s.selectedMessage);
  const isSelected = selectedMessage?.id === message.id;
  const focusScale = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      focusScale.value = withTiming(1.02, {
        duration: 150,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      focusScale.value = withTiming(1.0, {
        duration: 150,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [isSelected, focusScale]);

  const focusStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: focusScale.value }],
      zIndex: isSelected ? 9999 : 1,
    };
  });

  // Targeted Quote-Jumping & Search Highlight Pulse
  const isHighlighted = useIsMessageHighlighted(message.id);
  const highlightAnim = useSharedValue(0);

  useEffect(() => {
    if (isHighlighted) {
      highlightAnim.value = withSequence(
        withTiming(1, { duration: 180 }),
        withTiming(0, { duration: 1200 })
      );
    }
  }, [isHighlighted, highlightAnim]);

  const highlightStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: highlightAnim.value,
    };
  });

  const bubbleRef = React.useRef<any>(null);

  const handleLongPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (bubbleRef.current && typeof bubbleRef.current.measureInWindow === 'function') {
      bubbleRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        onLongPress(message, { x, y, width, height });
      });
    } else {
      onLongPress(message);
    }
  }, [message, onLongPress]);

  const handleRetry = useCallback(() => {
    onRetry(message.id);
  }, [message.id, onRetry]);

  const handleReactionPress = useCallback(
    (emoji: string) => {
      onToggleReaction?.(message.id, emoji);
    },
    [message.id, onToggleReaction]
  );

  const hasMedia = message.attachments && message.attachments.length > 0;
  const primaryAttachment = hasMedia ? message.attachments![0] : null;

  // Reaction entries computation
  const reactionEntries = React.useMemo(() => {
    if (!message.reactions) return [];
    return Object.entries(message.reactions).filter(([_, users]) => users.length > 0);
  }, [message.reactions]);

  return (
    <SwipeToReplyContainer message={message} onReply={onReply}>
      <Animated.View
        entering={
          isMe
            ? SlideInRight.duration(250).easing(Easing.out(Easing.quad))
            : SlideInLeft.duration(250).easing(Easing.out(Easing.quad))
        }
        style={[
          styles.rowContainer,
          isMe ? styles.rowMe : styles.rowOther,
          isSelected && styles.elevatedRow,
        ]}
      >
        {/* Partner Avatar for Group Chats */}
        {!isMe && isGroupChat && (
          <View style={styles.avatarContainer}>
            {message.sender.avatarUrl ? (
              <Image
                source={{ uri: message.sender.avatarUrl }}
                style={styles.avatarImage}
                contentFit="cover"
                cachePolicy="memory-disk"
                recyclingKey={message.sender.id}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {(message.sender.name || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Message Bubble Content */}
        <View style={styles.bubbleCol}>
          {/* Sender Name in Group Chat */}
          {!isMe && isGroupChat && (
            <Text style={[styles.groupSenderName, { color: themeConfig.accentHex }]} numberOfLines={1}>
              {message.sender.name}
            </Text>
          )}

          <Animated.View ref={bubbleRef} style={focusStyle} collapsable={false}>
            <Pressable
              onLongPress={handleLongPress}
              delayLongPress={300}
              style={[
                styles.bubbleBase,
                isMe ? styles.bubbleMe : styles.bubbleOther,
                isSelected && styles.bubbleSelectedElevation,
                !isMe && {
                  backgroundColor: themeConfig.theirBubbleBg,
                  borderColor: themeConfig.theirBubbleBorder,
                  borderWidth: 1,
                },
              ]}
            >
              {/* Animated Highlight Pulse Overlay for Quote-Jumping & Search Focus */}
              <Animated.View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFill,
                  styles.highlightOverlay,
                  highlightStyle,
                ]}
              />

              {isMe ? (
                <LinearGradient
                  colors={themeConfig.myBubbleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientFill}
                >
                  {primaryAttachment ? (
                    <MediaMessage
                      message={message}
                      attachment={primaryAttachment}
                      isMe={isMe}
                      onRetry={handleRetry}
                      onPressMedia={onPressMedia}
                    />
                  ) : (
                    <TextMessage
                      message={message}
                      isMe={isMe}
                      onRetry={handleRetry}
                      onPressReply={onPressReply}
                      textColor={themeConfig.myBubbleText}
                    />
                  )}
                </LinearGradient>
              ) : (
                <View style={[styles.otherFill, { backgroundColor: themeConfig.theirBubbleBg }]}>
                  {primaryAttachment ? (
                    <MediaMessage
                      message={message}
                      attachment={primaryAttachment}
                      isMe={isMe}
                      onRetry={handleRetry}
                      onPressMedia={onPressMedia}
                    />
                  ) : (
                    <TextMessage
                      message={message}
                      isMe={isMe}
                      onRetry={handleRetry}
                      onPressReply={onPressReply}
                      textColor={themeConfig.theirBubbleText}
                    />
                  )}
                </View>
              )}
            </Pressable>
          </Animated.View>

          {/* Emoji Reaction Badges Pill Row */}
          {reactionEntries.length > 0 && (
            <View
              style={[
                styles.reactionsContainer,
                isMe ? styles.reactionsMe : styles.reactionsOther,
              ]}
            >
              {reactionEntries.map(([emoji, users]) => {
                const reactedByMe = users.includes(currentUserId);
                return (
                  <ReactionBadge
                    key={emoji}
                    emoji={emoji}
                    count={users.length}
                    hasReacted={reactedByMe}
                    onPress={handleReactionPress}
                    isMe={isMe}
                  />
                );
              })}
            </View>
          )}
        </View>
      </Animated.View>
    </SwipeToReplyContainer>
  );
}, arePropsEqual);

const styles = StyleSheet.create({
  rowContainer: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 3,
    flexDirection: 'row',
  },
  elevatedRow: {
    zIndex: 9999,
    elevation: 9999,
  },
  elevatedBubble: {
    zIndex: 9999,
    elevation: 9999,
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  rowOther: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarFallback: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  bubbleCol: {
    maxWidth: '82%',
  },
  groupSenderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38bdf8',
    marginBottom: 2,
    marginLeft: 6,
  },
  bubbleBase: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 1,
      },
    }),
  },
  bubbleSelectedElevation: {
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
        elevation: 12,
      },
    }),
  },
  bubbleMe: {
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    borderBottomLeftRadius: 4,
  },
  highlightOverlay: {
    backgroundColor: 'rgba(250, 204, 21, 0.45)', // Golden flash pulse
    zIndex: 99,
  },
  gradientFill: {
    width: '100%',
  },
  otherFill: {
    width: '100%',
    backgroundColor: '#1e293b',
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  reactionsMe: {
    justifyContent: 'flex-end',
  },
  reactionsOther: {
    justifyContent: 'flex-start',
  },
});
