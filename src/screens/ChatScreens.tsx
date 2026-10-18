import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppData } from '../lib/appData';
import { GlassInput, GlassEmpty } from '../components/Glass';
import { NotificationButton } from '../components/NotificationButton';
import { ChatListItem } from '../components/chat/ChatListItem';
import { ChatMessageBubble } from '../components/chat/ChatMessageBubble';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatInputBar } from '../components/chat/ChatInputBar';
import { useTheme } from '../lib/theme';

export function ChatListScreen({
  onOpenConversation,
  onOpenNotifications,
}: {
  onOpenConversation: (id: string) => void;
  onOpenNotifications: () => void;
}) {
  const { conversations, notifications } = useAppData();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  const unreadTotal = conversations.reduce((s, c) => s + c.unread_count, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.headerWrap,
          {
            backgroundColor: colors.glassThickBg,
            borderBottomColor: colors.glassBorder,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.heading, { color: colors.textPrimary }]}>
              Encrypted Comms
            </Text>
            <Text style={[styles.subheading, { color: colors.textSecondary }]}>
              {unreadTotal} unread transmissions
            </Text>
          </View>
          <NotificationButton
            unreadCount={notifications.filter((n) => !n.is_read).length}
            onPress={onOpenNotifications}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <GlassInput
            icon="Search"
            placeholder="Search channels & operators..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filtered.length === 0 ? (
          <GlassEmpty
            icon="MessageCircle"
            title="No comms logs"
            subtitle="Connect with squad operatives or start an encrypted transmission."
          />
        ) : (
          filtered.map((c) => (
            <ChatListItem
              key={c.id}
              conversation={c}
              onPress={() => onOpenConversation(c.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

export function ConversationScreen({
  conversationId,
  onBack,
}: {
  conversationId: string;
  onBack: () => void;
}) {
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
      <ChatHeader
        conversation={conv}
        onBack={onBack}
      />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {convMessages.map((msg, index) => {
          const isMe = msg.sender_id === 'me';
          return (
            <ChatMessageBubble
              key={msg.id || index}
              message={msg}
              isMe={isMe}
              showAvatar={!isMe && conv.type === 'group'}
            />
          );
        })}
      </ScrollView>

      <ChatInputBar
        value={input}
        onChange={setInput}
        onSend={handleSend}
        placeholder="Transmit secure dispatch..."
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrap: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    zIndex: 50,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 12,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 110,
  },
  messagesContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});
