import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassSegmented } from '../Glass';
import { useTheme } from '../../lib/theme';

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
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <GlassSegmented
          options={[
            { label: 'All', value: 'all' },
            { label: `Unread (${unreadCount})`, value: 'unread' },
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
          <Text style={styles.markText}>Mark all read</Text>
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
