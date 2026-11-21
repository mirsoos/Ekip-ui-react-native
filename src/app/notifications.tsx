import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { useI18n } from '../lib/i18n';

export default function NotificationsRoute() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('notifications.title')}
        onBack={() => router.back()}
      />
      <View style={styles.content}>
        <NotificationsScreen
          onBack={() => router.back()}
          onOpenConversation={(convId) => router.push(`/chat/${convId}`)}
        />
      </View>
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
