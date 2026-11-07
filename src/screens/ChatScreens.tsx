// --- START OF FILE ChatScreens.tsx ---

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Keyboard,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { GlassEmpty } from '../components/Glass';
import { ChatListItem } from '../components/chat/ChatListItem';
import { ChatMessageBubble } from '../components/chat/ChatMessageBubble';
import { ChatListItemSkeleton } from '../components/skeleton';
import { useI18n } from '../lib/i18n';
import { getMultiRowContentPaddingTop, getSinglePillContentPaddingTop } from '../lib/headerLayout';
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
  const insets = useSafeAreaInsets();
  const { conversations, messages } = useAppData();
  const scrollRef = useRef<any>(null);
  const prevCountRef = useRef<number>(0);

  const conv = useMemo(
    () => conversations.find((c) => c.id === conversationId),
    [conversations, conversationId]
  );
  const convMessages = messages[conversationId] ?? [];

  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      setKeyboardHeight(e?.endCoordinates?.height ?? 0);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    };
    const onHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  useEffect(() => {
    if (convMessages.length > prevCountRef.current) {
      const animated = prevCountRef.current > 0;
      prevCountRef.current = convMessages.length;
      const timer = setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated });
      }, 30);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = convMessages.length;
  }, [convMessages.length]);

  const handleContentSizeChange = useCallback(() => {
    scrollRef.current?.scrollToEnd({ animated: false });
  }, []);

  if (!conv) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={[
          styles.messagesContent,
          {
            paddingTop: getSinglePillContentPaddingTop(insets.top),
            paddingBottom: 75 + insets.bottom + keyboardHeight,
          },
        ]}
        onContentSizeChange={handleContentSizeChange}
      >
        {convMessages.map((m) => (
          <ChatMessageBubble
            key={m.id}
            message={m}
            isMe={m.sender_id === 'me'}
          />
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
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
  messagesContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
    gap: 12,
  },
});