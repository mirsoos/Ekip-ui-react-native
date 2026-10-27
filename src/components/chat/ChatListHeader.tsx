import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationButton } from '../NotificationButton';
import { GlassInput } from '../Glass';
import { FrostedGlass } from '../FrostedGlass';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export function ChatListHeaderComponent({
  unreadTotal,
  notificationsCount,
  search,
  onChangeSearch,
  onOpenNotifications,
}: {
  unreadTotal: number;
  notificationsCount: number;
  search: string;
  onChangeSearch: (val: string) => void;
  onOpenNotifications: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();

  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enterAnim.setValue(0);
    Animated.spring(enterAnim, {
      toValue: 1,
      bounciness: 4,
      speed: 14,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  const enterTranslateY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-85, 0],
  });

  return (
    <View
      style={[
        styles.outerContainer,
        {
          paddingTop: Platform.OS === 'web' ? 10 : Math.max(10, insets.top + 6),
        },
      ]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? 'rgba(11, 14, 23, 0.88)' : 'rgba(255, 255, 255, 0.88)',
            borderColor: colors.glassBorderStrong,
            transform: [{ translateY: enterTranslateY }],
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

        <View style={[styles.headerTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ flex: 1, zIndex: 10 }}>
            <Text style={[styles.heading, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('chat.encryptedComms')}
            </Text>
            <Text style={[styles.subheading, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('chat.unreadTransmissions', { count: unreadTotal })}
            </Text>
          </View>
          <View style={{ zIndex: 10 }}>
            <NotificationButton
              unreadCount={notificationsCount}
              onPress={onOpenNotifications}
            />
          </View>
        </View>

        <View style={{ marginTop: 12, zIndex: 10 }}>
          <GlassInput
            icon="Search"
            placeholder={t('chat.searchChannels')}
            value={search}
            onChangeText={onChangeSearch}
            style={{
              backgroundColor: isDark ? '#101625' : '#f0f4fa',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

export const ChatListHeader = React.memo(ChatListHeaderComponent);

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    zIndex: 900,
  },
  container: {
    position: 'relative',
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 12,
    marginTop: 2,
  },
});
