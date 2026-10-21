import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NotificationButton } from '../NotificationButton';
import { GlassInput } from '../Glass';
import { LiquidLens } from '../LiquidLens';
import { useTheme } from '../../lib/theme';

export function ChatListHeader({
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
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View
        style={[
          styles.container,
          {
            borderColor: colors.glassBorderStrong,
          },
        ]}
      >
        {/* 360° Liquid Glass Lens */}
        <LiquidLens
          borderRadius={28}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.headerTop}>
          <View style={{ flex: 1, zIndex: 10 }}>
            <Text style={[styles.heading, { color: colors.textPrimary }]}>
              Encrypted Comms
            </Text>
            <Text style={[styles.subheading, { color: colors.textSecondary }]}>
              {unreadTotal} unread transmissions
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
            placeholder="Search channels & operators..."
            value={search}
            onChangeText={onChangeSearch}
            style={{
              backgroundColor: isDark ? '#101625' : '#f0f4fa',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    zIndex: 900,
  },
  container: {
    position: 'relative',
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
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
