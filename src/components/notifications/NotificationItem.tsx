import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard } from '../Glass';
import { getIcon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Notification } from '../../types/database';

const typeConfig: Record<string, { color: string; bg: string }> = {
  chat: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
  friend_request: { color: '#f472b6', bg: 'rgba(244, 114, 182, 0.15)' },
  group_request: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
  admin: { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)' },
  ticket: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
  subscription: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
  discount: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  report: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  achievement: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
};

export function NotificationItemComponent({
  notification,
  onPress,
}: {
  notification: Notification;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const IconComp = getIcon(notification.icon as IconName);
  const cfg = typeConfig[notification.type] ?? typeConfig.admin;

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={{ marginBottom: 8 }}>
      <GlassCard
        variant={notification.is_read ? 'thin' : 'default'}
        style={[
          styles.card,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
          !notification.is_read && { borderColor: 'rgba(244, 114, 182, 0.4)' },
        ]}
      >
        <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
          <IconComp size={20} color={cfg.color} strokeWidth={2.2} />
        </View>

        <View
          style={{
            flex: 1,
            marginLeft: isRTL ? 0 : 12,
            marginRight: isRTL ? 12 : 0,
          }}
        >
          <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text
              style={[
                styles.title,
                { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' },
              ]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            {!notification.is_read && <View style={styles.unreadDot} />}
          </View>

          <Text
            style={[
              styles.body,
              { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' },
            ]}
            numberOfLines={2}
          >
            {notification.body}
          </Text>

          <Text
            style={[
              styles.time,
              { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' },
            ]}
          >
            {formatNotificationTime(notification.created_at, isRTL)}
          </Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

export const NotificationItem = React.memo(NotificationItemComponent);

function formatNotificationTime(iso: string, isRTL: boolean): string {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return isRTL ? 'همین الان' : 'Just now';
  if (diff < 3600000) return isRTL ? `${Math.floor(diff / 60000)} دقیقه پیش` : `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return isRTL ? `${Math.floor(diff / 3600000)} ساعت پیش` : `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return isRTL ? `${Math.floor(diff / 86400000)} روز پیش` : `${Math.floor(diff / 86400000)}d ago`;
  return date.toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 20,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f472b6',
    marginLeft: 8,
  },
  body: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
  },
  time: {
    fontSize: 10,
    marginTop: 6,
  },
});
