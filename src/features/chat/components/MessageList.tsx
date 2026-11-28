import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Text,
  type ListRenderItemInfo,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useChatMessage, useChatStore, useChatIsSelectionMode } from '../store/chatStore';
import { MessageBubble } from './MessageBubble';
import { useI18n } from '../../../lib/i18n';
import { useTheme, useChatTheme, CHAT_THEMES, type ChatThemeConfig, type ThemeColors } from '../../../lib/theme';
import type { Message, Attachment, ReplyPreview, BubbleLayout } from '../types/chat.types';

const DATE_FORMATTER_FA = new Intl.DateTimeFormat('fa-IR', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const DATE_FORMATTER_EN = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const DATE_LABEL_CACHE = new Map<string, string>();
const MAX_DATE_CACHE_SIZE = 200;

const toggleSelectStable = (id: string) => {
  useChatStore.getState().toggleMessageSelection(id);
};

function formatDateSeparator(timestamp: number, isRTL?: boolean): string {
  const date = new Date(timestamp);
  const now = new Date();

  const dYear = date.getFullYear();
  const dMonth = date.getMonth();
  const dDay = date.getDate();

  const nYear = now.getFullYear();
  const nMonth = now.getMonth();
  const nDay = now.getDate();

  if (dYear === nYear && dMonth === nMonth && dDay === nDay) {
    return isRTL ? 'امروز' : 'Today';
  }

  const yesterday = new Date(nYear, nMonth, nDay - 1);
  if (
    dYear === yesterday.getFullYear() &&
    dMonth === yesterday.getMonth() &&
    dDay === yesterday.getDate()
  ) {
    return isRTL ? 'دیروز' : 'Yesterday';
  }

  const dayKey = dYear * 10000 + (dMonth + 1) * 100 + dDay;
  const cacheKey = `${dayKey}_${isRTL ? 'fa' : 'en'}`;
  const cached = DATE_LABEL_CACHE.get(cacheKey);
  if (cached !== undefined) return cached;

  const formatted = (isRTL ? DATE_FORMATTER_FA : DATE_FORMATTER_EN).format(date);
  if (DATE_LABEL_CACHE.size >= MAX_DATE_CACHE_SIZE) {
    const oldestKey = DATE_LABEL_CACHE.keys().next().value;
    if (oldestKey !== undefined) {
      DATE_LABEL_CACHE.delete(oldestKey);
    }
  }
  DATE_LABEL_CACHE.set(cacheKey, formatted);
  return formatted;
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
  conversationId: string;
  isRTL: boolean;
  themeConfig: ChatThemeConfig;
  colors: ThemeColors;
  isGroupChat?: boolean;
  currentUserId?: string;
  onReply: (message: Message) => void;
  onLongPress: (message: Message, layout?: BubbleLayout) => void;
  onRetry: (messageId: string) => void;
  onPressMedia?: (attachment: Attachment, index?: number, allAttachments?: Attachment[]) => void;
  onPressReply?: (replyTo: ReplyPreview) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
}

// Atomized single-message row subscriber with zero Reanimated allocations & primitive selectors
const ConnectedMessageRow = React.memo(function ConnectedMessageRow({
  messageId,
  conversationId,
  isRTL,
  themeConfig,
  colors,
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
  const olderCacheRef = useRef<{ ids?: string[]; msgId?: string; val: number }>({ val: -1 });
  const olderCreatedAt = useChatStore((s) => {
    const ids = s.conversationMessageIds[conversationId];
    if (!ids) return -1;
    if (olderCacheRef.current.ids === ids && olderCacheRef.current.msgId === messageId) {
      return olderCacheRef.current.val;
    }
    const idx = ids.indexOf(messageId);
    const val =
      idx < 0 || idx === ids.length - 1
        ? -1
        : ids[idx + 1]
        ? s.messages[ids[idx + 1]]?.createdAt ?? -1
        : -1;
    olderCacheRef.current = { ids, msgId: messageId, val };
    return val;
  });

  const isSelectionMode = useChatIsSelectionMode();
  const isSelectedInSelection = useChatStore(
    (s) => s.isSelectionMode && s.selectedMessageIds.includes(messageId)
  );
  const isSelected = useChatStore((s) => s.selectedMessage?.id === messageId);
  const isDimmed = useChatStore(
    (s) => s.selectedMessage !== null && s.selectedMessage.id !== messageId
  );

  if (!message) return null;

  const showDateSeparator =
    olderCreatedAt === -1 || !isSameDay(message.createdAt, olderCreatedAt);

  return (
    <View
      style={[
        styles.rowWrapper,
        isSelected && styles.rowElevated,
        isDimmed && styles.rowDimmed,
      ]}
    >
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
        isSelected={isSelected}
        isSelectionMode={isSelectionMode}
        isSelectedInSelection={isSelectedInSelection}
        themeConfig={themeConfig}
        colors={colors}
        onReply={onReply}
        onLongPress={onLongPress}
        onRetry={onRetry}
        onPressMedia={onPressMedia}
        onPressReply={onPressReply}
        onToggleReaction={onToggleReaction}
        onToggleSelect={toggleSelectStable}
      />
    </View>
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
  const { isRTL } = useI18n();
  const { colors } = useTheme();
  const { chatTheme } = useChatTheme();
  const themeConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  // Key extractor
  const keyExtractor = useCallback((item: string) => item, []);

  // Item type selector for recycling templates
  const getItemType = useCallback((item: string) => {
    const msg = useChatStore.getState().messages[item];
    return msg?.attachments && msg.attachments.length > 0 ? 'media' : 'text';
  }, []);

  // Memoized render item (independent of messageIds to avoid full-list re-renders)
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>) => (
      <ConnectedMessageRow
        messageId={item}
        conversationId={conversationId}
        isRTL={isRTL}
        themeConfig={themeConfig}
        colors={colors}
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
      conversationId,
      isRTL,
      themeConfig,
      colors,
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
        drawDistance={400}
        inverted={true}
        scrollsToTop={false}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        keyboardShouldPersistTaps="handled"
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        onScroll={onScroll}
        scrollEventThrottle={100}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dynamicContentContainerStyle}
        ListHeaderComponent={listHeaderComponent}
        ListFooterComponent={listFooterComponent}
        // Inverted anchoring & smooth pagination
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        removeClippedSubviews={false}
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
