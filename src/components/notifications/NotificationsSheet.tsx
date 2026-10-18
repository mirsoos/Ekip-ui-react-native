import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppData } from '../../lib/appData';
import { GlassSheet, Toast } from '../Overlays';
import { GlassEmpty, GlassSegmented } from '../Glass';
import { NotificationItem } from './NotificationItem';
import { useTheme } from '../../lib/theme';
import type { Group } from '../../types/database';

export function NotificationsSheet({
  open,
  onClose,
  onOpenConversation,
  onOpenGroup,
  onOpenSettings,
}: {
  open: boolean;
  onClose: () => void;
  onOpenConversation?: (id: string) => void;
  onOpenGroup?: (group: Group) => void;
  onOpenSettings?: () => void;
}) {
  const { notifications, groups, markNotificationRead, markAllNotificationsRead } = useAppData();
  const { colors } = useTheme();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2400);
  };

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'unread') return !n.is_read;
      return true;
    });
  }, [notifications, filter]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    showToast('All notifications marked as read');
  };

  const handleItemPress = (n: (typeof notifications)[0]) => {
    markNotificationRead(n.id);
    if (n.type === 'chat' && onOpenConversation) {
      onClose();
      onOpenConversation('c1');
    } else if (n.type === 'group_request' && onOpenGroup && groups[0]) {
      onClose();
      onOpenGroup(groups[0]);
    }
  };

  return (
    <>
      <GlassSheet open={open} onClose={onClose} title="Notifications">
        <View style={styles.topControl}>
          <View style={{ flex: 1 }}>
            <GlassSegmented
              options={[
                { label: 'All', value: 'all' },
                { label: `Unread (${unreadCount})`, value: 'unread' },
              ]}
              value={filter}
              onChange={(v) => setFilter(v as 'all' | 'unread')}
            />
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllRead} style={styles.markBtn}>
              <Text style={styles.markText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginTop: 10 }}>
          {filtered.length === 0 ? (
            <GlassEmpty
              icon="Bell"
              title="No notifications"
              subtitle={
                filter === 'unread'
                  ? 'All notifications have been reviewed.'
                  : 'You have no notifications at this time.'
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
      </GlassSheet>

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />
    </>
  );
}

const styles = StyleSheet.create({
  topControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  markBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  markText: {
    color: '#f472b6',
    fontSize: 12,
    fontWeight: '700',
  },
});
