import React, { useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  type ListRenderItemInfo,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { Text } from 'react-native';
import { useChatMessage, useChatStore } from '../store/chatStore';
import { MessageBubble } from './MessageBubble';
import { useI18n } from '../../../lib/i18n';
import type { Message, Attachment, ReplyPreview, BubbleLayout } from '../types/chat.types';

function formatDateSeparator(timestamp: number, isRTL?: boolean): string {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) return isRTL ? 'امروز' : 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isYesterday) return isRTL ? 'دیروز' : 'Yesterday';

  return date.toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isSameDay(t1: number, t2: number): boolean {
  const d1 = new Date(t1);
  const d2 = new Date(t2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}


interface MessageListProps {
  messageIds: string[];
  conversationId: string;
  isGroupChat?: boolean;
  currentUserId?: string;
  isLoadingHistory?: boolean;
  hasMoreHistory?: boolean;
  isLoadingNewer?: boolean;
  hasMoreNewer?: boolean;
  onLoadMoreHistory?: () => void;
  onLoadNewerMessages?: () => void;
  onReply: (message: Message) => void;
  onLongPress: (message: Message, layout?: BubbleLayout) => void;
  onRetry: (messageId: string) => void;
  onPressMedia?: (attachment: Attachment, index?: number, allAttachments?: Attachment[]) => void;
  onPressReply?: (replyTo: ReplyPreview) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  flashListRef?: React.RefObject<FlashList<any> | null>;
  containerRef?: React.RefObject<any>;
  onScroll?: (event: any) => void;
  contentPaddingTop?: number;
  contentPaddingBottom?: number;
}

interface RowItemProps {
  messageId: string;
  olderMessageId?: string;
  isOldest?: boolean;
  isGroupChat?: boolean;
  currentUserId?: string;
  onReply: (message: Message) => void;
  onLongPress: (message: Message, layout?: BubbleLayout) => void;
  onRetry: (messageId: string) => void;
  onPressMedia?: (attachment: Attachment, index?: number, allAttachments?: Attachment[]) => void;
  onPressReply?: (replyTo: ReplyPreview) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
}

// Atomized single-message row subscriber with date separator grouping
const ConnectedMessageRow = React.memo(function ConnectedMessageRow({
  messageId,
  olderMessageId,
  isOldest = false,
  isGroupChat,
  currentUserId,
  onReply,
  onLongPress,
  onRetry,
  onPressMedia,
  onPressReply,
  onToggleReaction,
}: RowItemProps) {
  const message = useChatMessage(messageId);
  const olderMessage = useChatMessage(olderMessageId || '');
  const { isRTL } = useI18n();

  const selectedMessageId = useChatStore((s) => s.selectedMessage?.id);
  const isSelected = selectedMessageId === messageId;
  const isDimmed = Boolean(selectedMessageId) && !isSelected;

  const rowOpacity = useSharedValue(1);

  useEffect(() => {
    rowOpacity.value = withTiming(isDimmed ? 0.35 : 1, {
      duration: 150,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isDimmed, rowOpacity]);

  const animatedRowStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: rowOpacity.value,
      zIndex: isSelected ? 9999 : 1,
    };
  });

  if (!message) return null;

  const showDateSeparator =
    isOldest ||
    (olderMessage && !isSameDay(message.createdAt, olderMessage.createdAt));

  return (
    <Animated.View style={[styles.rowWrapper, animatedRowStyle]}>
      {showDateSeparator && (
        <View style={styles.dateSeparatorContainer}>
          <View style={styles.dateSeparatorPill}>
            <Text style={styles.dateSeparatorText}>
              {formatDateSeparator(message.createdAt, isRTL)}
            </Text>
          </View>
        </View>
      )}
      <MessageBubble
        message={message}
        isGroupChat={isGroupChat}
        currentUserId={currentUserId}
        onReply={onReply}
        onLongPress={onLongPress}
        onRetry={onRetry}
        onPressMedia={onPressMedia}
        onPressReply={onPressReply}
        onToggleReaction={onToggleReaction}
      />
    </Animated.View>
  );
});

export const MessageList = React.memo(function MessageList({
  messageIds,
  conversationId,
  isGroupChat = false,
  currentUserId = 'me',
  isLoadingHistory = false,
  hasMoreHistory = true,
  isLoadingNewer = false,
  hasMoreNewer = false,
  onLoadMoreHistory,
  onLoadNewerMessages,
  onReply,
  onLongPress,
  onRetry,
  onPressMedia,
  onPressReply,
  onToggleReaction,
  flashListRef,
  containerRef,
  onScroll,
  contentPaddingTop = 80,
  contentPaddingBottom = 12,
}: MessageListProps) {
  // Key extractor
  const keyExtractor = useCallback((item: string) => item, []);

  // Item type selector for recycling templates
  const getItemType = useCallback((item: string) => {
    const msg = useChatStore.getState().messages[item];
    return msg?.attachments && msg.attachments.length > 0 ? 'media' : 'text';
  }, []);

  // Memoized render item
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<string>) => (
      <ConnectedMessageRow
        messageId={item}
        olderMessageId={messageIds[index + 1]}
        isOldest={index === messageIds.length - 1}
        isGroupChat={isGroupChat}
        currentUserId={currentUserId}
        onReply={onReply}
        onLongPress={onLongPress}
        onRetry={onRetry}
        onPressMedia={onPressMedia}
        onPressReply={onPressReply}
        onToggleReaction={onToggleReaction}
      />
    ),
    [
      messageIds,
      isGroupChat,
      currentUserId,
      onReply,
      onLongPress,
      onRetry,
      onPressMedia,
      onPressReply,
      onToggleReaction,
    ]
  );

  // In an inverted list, ListFooterComponent appears visually at the TOP of the chat
  // where older historical messages are loaded
  const listFooterComponent = useMemo(() => {
    if (!isLoadingHistory) return null;
    return (
      <View style={styles.historyLoader}>
        <ActivityIndicator size="small" color="#38bdf8" />
      </View>
    );
  }, [isLoadingHistory]);

  // ListHeaderComponent appears visually at the BOTTOM of the inverted chat
  // where newer messages are loaded during bidirectional paging
  const listHeaderComponent = useMemo(() => {
    if (!isLoadingNewer) return null;
    return (
      <View style={styles.historyLoader}>
        <ActivityIndicator size="small" color="#38bdf8" />
      </View>
    );
  }, [isLoadingNewer]);

  // Handle pagination when user scrolls to historical ceiling
  const handleEndReached = useCallback(() => {
    if (isLoadingHistory || !hasMoreHistory || !onLoadMoreHistory) return;
    onLoadMoreHistory();
  }, [isLoadingHistory, hasMoreHistory, onLoadMoreHistory]);

  const dynamicContentContainerStyle = useMemo(
    () => [
      styles.contentContainer,
      {
        paddingTop: contentPaddingBottom, // Visually at the bottom in inverted FlashList
        paddingBottom: contentPaddingTop, // Visually at the top under the floating header
      },
    ],
    [contentPaddingTop, contentPaddingBottom]
  );

  return (
    <View ref={containerRef} style={styles.listContainer}>
      <FlashList
        ref={flashListRef as any}
        data={messageIds}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={76}
        inverted={true}
        scrollsToTop={false}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        keyboardShouldPersistTaps="handled"
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dynamicContentContainerStyle}
        ListHeaderComponent={listHeaderComponent}
        ListFooterComponent={listFooterComponent}
        // Inverted anchoring & smooth pagination
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        // Fix common Android inverted clipping bug
        removeClippedSubviews={Platform.OS === 'android' ? false : true}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
  },
  contentContainer: {
    paddingVertical: 12,
  },
  historyLoader: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowWrapper: {
    width: '100%',
  },
  rowElevated: {
    zIndex: 9999,
    elevation: 9999,
  },
  rowDimmed: {
    opacity: 0.35,
  },
  dateSeparatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  dateSeparatorPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  dateSeparatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
});
