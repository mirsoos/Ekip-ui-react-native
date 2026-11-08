// --- START OF FILE ChatScreens.tsx ---

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
  BackHandler,
  Keyboard,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { ChatContainer } from '../features/chat';
import { GlassEmpty } from '../components/Glass';
import { ChatListItem } from '../components/chat/ChatListItem';
import { ChatListItemSkeleton } from '../components/skeleton';
import { useI18n } from '../lib/i18n';
import { getMultiRowContentPaddingTop } from '../lib/headerLayout';
import type { Conversation } from '../types/database';

const extractConversationKey = (conversation: Conversation) => conversation.id;

export function ChatListScreenComponent({
  onOpenConversation,
  onOpenNotifications,
  search = '',
  isLoading = false,
  initialScrollOffset = 0,
  onScrollOffsetChange,
}: {
  onOpenConversation: (id: string) => void;
  onOpenNotifications: () => void;
  search?: string;
  isLoading?: boolean;
  initialScrollOffset?: number;
  onScrollOffsetChange?: (offset: number) => void;
}) {
  const insets = useSafeAreaInsets();
  const { conversations } = useAppData();
  const { t } = useI18n();

  const flatListRef = useRef<FlatList<Conversation>>(null);
  const initialOffset = useMemo(
    () => (initialScrollOffset > 0 ? { x: 0, y: initialScrollOffset } : undefined),
    [initialScrollOffset]
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScrollOffsetChange?.(e.nativeEvent.contentOffset.y);
    },
    [onScrollOffsetChange]
  );

  useEffect(() => {
    if (initialScrollOffset > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: initialScrollOffset, animated: false });
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [initialScrollOffset]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  const onSelectConversation = useCallback(
    (conversationId: string) => onOpenConversation(conversationId),
    [onOpenConversation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Conversation }) => (
      <ChatListItem
        conversation={item}
        conversationId={item.id}
        onSelectConversation={onSelectConversation}
      />
    ),
    [onSelectConversation]
  );

  const contentContainerStyle = useMemo(
    () => [
      styles.listContent,
      {
        paddingTop: getMultiRowContentPaddingTop(insets.top),
        paddingBottom: 100 + insets.bottom,
      },
    ],
    [insets.top, insets.bottom]
  );

  const emptyComponent = useMemo(() => {
    if (isLoading) {
      return (
        <>
          <ChatListItemSkeleton />
          <ChatListItemSkeleton />
          <ChatListItemSkeleton />
          <ChatListItemSkeleton />
        </>
      );
    }
    if (filtered.length === 0) {
      return (
        <GlassEmpty
          icon="MessageCircle"
          title={t('chat.noCommsLogs')}
          subtitle={t('chat.noCommsLogsSub')}
        />
      );
    }
    return undefined;
  }, [filtered.length, isLoading, t]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        contentOffset={initialOffset}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={isLoading ? [] : filtered}
        keyExtractor={extractConversationKey}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={50}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        ListEmptyComponent={emptyComponent}
      />
    </View>
  );
}

export const ChatListScreen = React.memo(ChatListScreenComponent);

export function ConversationScreenComponent({
  conversationId,
  onBack,
}: {
  conversationId: string;
  onBack: () => void;
}) {
  const { conversations, me } = useAppData();

  const conv = useMemo(
    () => conversations.find((c) => c.id === conversationId),
    [conversations, conversationId]
  );

  useEffect(() => {
    Keyboard.dismiss();
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => {
      Keyboard.dismiss();
      sub.remove();
    };
  }, [onBack]);

  if (!conv) return null;

  return (
    <View style={styles.container}>
      <ChatContainer
        conversationId={conversationId}
        isGroupChat={conv.type === 'group'}
        currentUserId={me.id || 'me'}
        onBack={onBack}
      />
    </View>
  );
}

export const ConversationScreen = React.memo(ConversationScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 8,
  },
});
