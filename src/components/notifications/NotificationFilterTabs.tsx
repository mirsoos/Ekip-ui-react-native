import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TactileSegmented } from '../common/TactileSegmented';
import { useI18n } from '../../lib/i18n';

export function NotificationFilterTabs({
  filter,
  onChangeFilter,
  unreadCount,
  onMarkAllRead,
}: {
  filter: 'all' | 'unread';
  onChangeFilter: (f: 'all' | 'unread') => void;
  unreadCount: number;
  onMarkAllRead: () => void;
}) {
  const { t, isRTL } = useI18n();

  return (
    <View style={[styles.container, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={{ flex: 1 }}>
        <TactileSegmented
          options={[
            { label: t('common.all'), value: 'all' },
            {
              label: t('notifications.unread'),
              value: 'unread',
              badgeCount: unreadCount,
            },
          ]}
          value={filter}
          onChange={(v) => onChangeFilter(v as 'all' | 'unread')}
        />
      </View>

      {unreadCount > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onMarkAllRead}
          style={styles.markBtn}
        >
          <Text style={styles.markText}>{t('notifications.markAllRead')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
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
