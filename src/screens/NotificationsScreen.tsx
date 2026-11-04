// --- START OF FILE NotificationsScreen.tsx ---

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  BackHandler,
  Platform,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { NotificationFilterTabs } from '../components/notifications/NotificationFilterTabs';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { GlassEmpty } from '../components/Glass';
import { useI18n } from '../lib/i18n';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';

export function NotificationsScreenComponent({
  onBack,
  onOpenConversation,
  initialScrollOffset = 0,
  onScrollOffsetChange,
}: {
  onBack: () => void;
  onOpenConversation?: (id: string) => void;
  initialScrollOffset?: number;
  onScrollOffsetChange?: (offset: number) => void;
}) {
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();
  const { isRTL } = useI18n();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const scrollRef = useRef<any>(null);
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
        scrollRef.current?.scrollTo({ y: initialScrollOffset, animated: false });
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [initialScrollOffset]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const filtered = useMemo(
    () => notifications.filter((n) => (filter === 'unread' ? !n.is_read : true)),
    [notifications, filter]
  );

  const handleItemPress = useCallback(
    (n: (typeof notifications)[0]) => {
      markNotificationRead(n.id);
      if (n.type === 'chat' && onOpenConversation) {
        onOpenConversation('c1');
      }
    },
    [markNotificationRead, onOpenConversation]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentOffset={initialOffset}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
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

        <View style={{ gap: 8 }}>
          {filtered.length === 0 ? (
            <GlassEmpty
              icon="Bell"
              title={isRTL ? 'هیچ اعلانی وجود ندارد' : 'All clear'}
              subtitle={
                isRTL
                  ? 'در حال حاضر هیچ اعلان یا پیام جدیدی در این بخش ندارید.'
                  : 'No alerts or transmissions pending in this channel.'
              }
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