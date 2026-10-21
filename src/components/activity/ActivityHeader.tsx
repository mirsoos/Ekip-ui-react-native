import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { GlassSegmented } from '../Glass';
import { NotificationButton } from '../NotificationButton';
import { LiquidLens } from '../LiquidLens';
import { useTheme } from '../../lib/theme';

export function ActivityHeader({
  unreadCount,
  tab,
  onChangeTab,
  onOpenNotifications,
}: {
  unreadCount: number;
  tab: string;
  onChangeTab: (tab: string) => void;
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

        <View style={styles.titleRow}>
          <Text style={[styles.heading, { color: colors.textPrimary }]}>
            My Ekip
          </Text>
          <NotificationButton
            unreadCount={unreadCount}
            onPress={onOpenNotifications}
          />
        </View>

        <View style={{ marginTop: 12, zIndex: 10 }}>
          <GlassSegmented
            options={[
              { label: 'Created', value: 'created', icon: 'Crown' },
              { label: 'Joined', value: 'joined', icon: 'Users' },
              { label: 'Requested', value: 'requested', icon: 'Clock' },
            ]}
            value={tab}
            onChange={onChangeTab}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
