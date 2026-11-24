import React, { useRef } from 'react';
import { useRouter } from 'expo-router';
import { AIAssistant, type AIAssistantHandle } from '../src/screens/AIAssistant';
import { AIHeader } from '../src/components/ai/AIHeader';
import { ChatInputBar } from '../src/components/chat/ChatInputBar';
import { ScreenLayout } from '../src/components/common/ScreenLayout';
import { useI18n } from '../src/lib/i18n';

export default function AIRoute() {
  const router = useRouter();
  const { t } = useI18n();
  const aiRef = useRef<AIAssistantHandle>(null);

  return (
    <ScreenLayout
      header={<AIHeader onBack={() => router.back()} />}
      footer={
        <ChatInputBar
          onSendMessage={(text) => aiRef.current?.sendMessage(text)}
          placeholder={t('chat.queryCommandAI')}
        />
      }
    >
      <AIAssistant ref={aiRef} onBack={() => router.back()} />
    </ScreenLayout>
  );
}
