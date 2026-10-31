import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { GlassInput, GlassEmpty } from '../components/Glass';
import { NotificationButton } from '../components/NotificationButton';
import { ChatListItem } from '../components/chat/ChatListItem';
import { ChatMessageBubble } from '../components/chat/ChatMessageBubble';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatInputBar } from '../components/chat/ChatInputBar';
import { ChatListItemSkeleton } from '../components/skeleton';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { getMultiRowContentPaddingTop, getSinglePillContentPaddingTop } from '../lib/headerLayout';
import type { Conversation } from '../types/database';

export function ChatListScreenComponent({
  onOpenConversation,
  onOpenNotifications,
  search = '',
  isLoading = false,
}: {
  onOpenConversation: (id: string) => void;
  onOpenNotifications: () => void;
  search?: string;
  isLoading?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { conversations } = useAppData();
  const { t } = useI18n();

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(query)
    );
  }, [conversations, search]);
  const onSelectConversation = useCallback(
    (conversationId: string) => onOpenConversation(conversationId),
    [onOpenConversation]
  );
  const keyExtractor = useCallback((conversation: Conversation) => conversation.id, []);
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

  return (
    <View style={styles.container}>
      <FlatList
        data={isLoading ? [] : filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: getMultiRowContentPaddingTop(insets.top, 119),
            paddingBottom: 90 + insets.bottom,
          },
        ]}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        updateCellsBatchingPeriod={50}
        windowSize={3}
        ListEmptyComponent={isLoading ? (
          <>
            <ChatListItemSkeleton />
            <ChatListItemSkeleton />
            <ChatListItemSkeleton />
            <ChatListItemSkeleton />
          </>
        ) : filtered.length === 0 ? (
          <GlassEmpty
            icon="MessageCircle"
            title={t('chat.noCommsLogs')}
            subtitle={t('chat.noCommsLogsSub')}
          />
        ) : undefined}
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
  const { conversations, messages, addMessage } = useAppData();
  const { colors } = useTheme();
  const [input, setInput] = useState('');
  const scrollRef = useRef<any>(null);

  const conv = conversations.find((c) => c.id === conversationId);
  const convMessages = messages[conversationId] ?? [];

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [convMessages.length]);

  if (!conv) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage(conversationId, input.trim());
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.messagesContent,
          {
            paddingTop: getSinglePillContentPaddingTop(insets.top),
            paddingBottom: 75 + insets.bottom,
          },
        ]}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
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
    paddingTop: 168,
    paddingBottom: 110,
    gap: 8,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 100,
    paddingBottom: 90,
    gap: 12,
  },
});
