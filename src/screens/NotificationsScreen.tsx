import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { NotificationFilterTabs } from '../components/notifications/NotificationFilterTabs';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { GlassEmpty } from '../components/Glass';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';

export function NotificationsScreenComponent({
  onBack,
  onOpenConversation,
}: {
  onBack: () => void;
  onOpenConversation?: (id: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.is_read : true));

  const handleItemPress = (n: (typeof notifications)[0]) => {
    markNotificationRead(n.id);
    if (n.type === 'chat' && onOpenConversation) {
      onOpenConversation('c1');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: getSinglePillContentPaddingTop(insets.top),
            paddingBottom: 40 + insets.bottom,
          },
        ]}
      >
        <NotificationFilterTabs
          filter={filter}
          onChangeFilter={setFilter}
          unreadCount={unreadCount}
          onMarkAllRead={markAllNotificationsRead}
        />

        <View key={filter} className="animate-raise" style={{ gap: 8 }}>
          {filtered.length === 0 ? (
            <GlassEmpty
              icon="Bell"
              title="All clear"
              subtitle="No alerts or transmissions pending in this channel."
            />
          ) : (
            filtered.map((item) => (
              <NotificationItem
                key={item.id}
                notification={item}
                onPress={() => handleItemPress(item)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export const NotificationsScreen = React.memo(NotificationsScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
