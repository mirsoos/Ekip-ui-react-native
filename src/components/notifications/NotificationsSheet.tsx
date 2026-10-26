import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppData } from '../../lib/appData';
import { GlassSheet, Toast } from '../Overlays';
import { GlassEmpty, GlassSegmented } from '../Glass';
import { NotificationItem } from './NotificationItem';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Group } from '../../types/database';

export function NotificationsSheetComponent({
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
  const { t, isRTL } = useI18n();
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
    showToast(t('notifications.markedAllToast'));
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
      <GlassSheet open={open} onClose={onClose} title={t('notifications.title')}>
        <View style={[styles.topControl, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ flex: 1 }}>
            <GlassSegmented
              options={[
                { label: t('common.all'), value: 'all' },
                { label: t('notifications.unreadTab', { count: unreadCount }), value: 'unread' },
              ]}
              value={filter}
              onChange={(v) => setFilter(v as 'all' | 'unread')}
            />
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllRead} style={styles.markBtn}>
              <Text style={styles.markText}>{t('notifications.markAllRead')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginTop: 10 }}>
          {filtered.length === 0 ? (
            <GlassEmpty
              icon="Bell"
              title={isRTL ? 'هیچ اعلانی وجود ندارد' : 'No notifications'}
              subtitle={
                filter === 'unread'
                  ? (isRTL ? 'تمامی اعلان‌ها بررسی شده‌اند.' : 'All notifications have been reviewed.')
                  : (isRTL ? 'در حال حاضر هیچ اعلان جدیدی ندارید.' : 'You have no notifications at this time.')
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

export const NotificationsSheet = React.memo(NotificationsSheetComponent);
