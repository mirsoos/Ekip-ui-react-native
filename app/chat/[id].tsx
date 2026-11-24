import React from 'react';
import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import { ConversationScreen } from '../../src/screens/ChatScreens';
import { ChatHeader } from '../../src/components/chat/ChatHeader';
import { ScreenLayout } from '../../src/components/common/ScreenLayout';
import { useAppData } from '../../src/lib/appData';

export default function ChatConversationRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { conversations } = useAppData();
  const convId = typeof id === 'string' ? id : id?.[0];
  const conv = conversations.find((c) => c.id === convId);

  if (!conv || !convId) return <Redirect href="/(tabs)/chat" />;

  return (
    <ScreenLayout
      header={<ChatHeader conversation={conv} onBack={() => router.back()} />}
      screenKey={`conversation-${convId}`}
    >
      <ConversationScreen conversationId={convId} onBack={() => router.back()} />
    </ScreenLayout>
  );
}
