import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AIAssistant, type AIAssistantHandle } from '../screens/AIAssistant';
import { AIHeader } from '../components/ai/AIHeader';
import { ChatInputBar } from '../components/chat/ChatInputBar';
import { useI18n } from '../lib/i18n';

export default function AIRoute() {
  const router = useRouter();
  const { t } = useI18n();
  const aiRef = useRef<AIAssistantHandle>(null);

  return (
    <View style={styles.container}>
      <AIHeader onBack={() => router.back()} />
      <View style={styles.content}>
        <AIAssistant ref={aiRef} onBack={() => router.back()} />
      </View>
      <ChatInputBar
        onSendMessage={(text) => aiRef.current?.sendMessage(text)}
        placeholder={t('chat.queryCommandAI')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
