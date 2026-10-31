import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassSegmented, GlassAvatar } from '../Glass';
import { NotificationButton } from '../NotificationButton';
import { FrostedGlass } from '../FrostedGlass';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { HEADER_METRICS, getHeaderTopInset } from '../../lib/headerLayout';
import type { Profile } from '../../types/database';

export function ActivityHeaderComponent({
  user,
  unreadCount,
  tab,
  onChangeTab,
  onOpenNotifications,
  onOpenOwnProfile,
}: {
  user?: Profile;
  unreadCount: number;
  tab: string;
  onChangeTab: (tab: string) => void;
  onOpenNotifications: () => void;
  onOpenOwnProfile?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();

  return (
    <View
      style={[
        styles.outerContainer,
        {
          paddingTop: getHeaderTopInset(insets.top),
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.container,
          {
            borderColor: colors.glassBorderStrong,
          },
        ]}
      >
        {/* 360° Frosted Glass */}
        <FrostedGlass
          borderRadius={28}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ flex: 1, zIndex: 10 }}>
            {user?.city ? (
              <Text style={[styles.cityText, { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' }]}>
                {user.city}
              </Text>
            ) : null}
            <Text style={[styles.titleText, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('activity.myEkip')}
            </Text>
          </View>

          <View
            style={[
              styles.topActions,
              {
                zIndex: 10,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: 8,
              },
            ]}
          >
            <NotificationButton
              unreadCount={unreadCount}
              onPress={onOpenNotifications}
            />
            {user && onOpenOwnProfile ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onOpenOwnProfile}
              >
                <GlassAvatar
                  src={user.avatar_url}
                  name={`${user.first_name} ${user.last_name}`}
                  size={38}
                  online
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={{ zIndex: 10 }}>
          <GlassSegmented
            options={[
              { label: t('activity.created'), value: 'created', icon: 'Crown' },
              { label: t('activity.joined'), value: 'joined', icon: 'Users' },
              { label: t('activity.requestsTab'), value: 'requested', icon: 'Clock' },
            ]}
            value={tab}
            onChange={onChangeTab}
          />
        </View>
      </View>
    </View>
  );
}

export const ActivityHeader = React.memo(ActivityHeaderComponent);

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: HEADER_METRICS.marginHorizontal,
    zIndex: 900,
  },
  container: {
    position: 'relative',
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: HEADER_METRICS.paddingHorizontal,
    paddingTop: HEADER_METRICS.paddingVertical,
    paddingBottom: 10,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
          elevation: 14,
        }),
    overflow: 'visible',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: HEADER_METRICS.actionButtonSize,
    paddingHorizontal: 8,
    marginBottom: 10,
    zIndex: 10,
  },
  cityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
