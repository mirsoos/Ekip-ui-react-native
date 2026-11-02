import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassInput, GlassAvatar } from '../Glass';
import { NotificationButton } from '../NotificationButton';
import { FrostedGlass } from '../FrostedGlass';
import { Icons } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { HEADER_METRICS, getHeaderTopInset } from '../../lib/headerLayout';
import type { Profile } from '../../types/database';

export interface DiscoverHeaderProps {
  user: Profile;
  unreadCount: number;
  search: string;
  onChangeSearch: (val: string) => void;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  onOpenNotifications: () => void;
  onOpenOwnProfile: () => void;
}

export function DiscoverHeaderComponent({
  user,
  unreadCount,
  search,
  onChangeSearch,
  hasActiveFilters,
  onOpenFilters,
  onOpenNotifications,
  onOpenOwnProfile,
}: DiscoverHeaderProps) {
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
            <Text style={[styles.titleText, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL ? 'اکیپ' : 'Ekip'}
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
            <View
              style={[
                styles.locationInfo,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              {user.city && (
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                  style={[styles.locationText, { color: colors.textSecondary, flexShrink: 1 }]}
                >
                  {user.city}
                </Text>
              )}
              <TouchableOpacity
                activeOpacity={0.75}
                style={[styles.locationButton, { borderColor: colors.glassBorderStrong }]}
              >
                <FrostedGlass
                  borderRadius={19}
                  marginWidth={8}
                  scale={20}
                  blurDeviation={1.6}
                  overlayOpacity={isDark ? 0.1 : 0.22}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.locationIconWrap}>
                  <Icons.MapPin size={18} color={colors.textPrimary} strokeWidth={2.4} />
                </View>
              </TouchableOpacity>
            </View>
            <NotificationButton
              unreadCount={unreadCount}
              onPress={onOpenNotifications}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onOpenOwnProfile}
            >
              <GlassAvatar
                user={user}
                src={user.avatar_url}
                name={`${user.first_name} ${user.last_name}`}
                size={38}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.searchRow, { zIndex: 10, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ flex: 1 }}>
            <GlassInput
              icon="Search"
              placeholder={t('discover.searchPlaceholder')}
              value={search}
              onChangeText={onChangeSearch}
              style={{
                backgroundColor: isDark ? '#101625' : '#f0f4fa',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
              }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onOpenFilters}
            style={[
              styles.filterBtn,
              {
                borderColor: hasActiveFilters
                  ? colors.accentPink
                  : colors.glassBorderStrong,
              },
            ]}
          >
            <FrostedGlass
              borderRadius={20}
              marginWidth={9}
              scale={22}
              blurDeviation={1.6}
              overlayOpacity={
                hasActiveFilters
                  ? 0.25
                  : isDark
                  ? 0.10
                  : 0.22
              }
              style={StyleSheet.absoluteFill}
            />
            {hasActiveFilters && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: 'rgba(244, 114, 182, 0.20)',
                    borderRadius: 20,
                    zIndex: 1,
                    pointerEvents: 'none',
                  },
                ]}
              />
            )}
            <View style={styles.filterIconWrap}>
              <Icons.SlidersHorizontal
                size={18}
                color={hasActiveFilters ? colors.accentPink : colors.textPrimary}
                strokeWidth={2.2}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export const DiscoverHeader = React.memo(DiscoverHeaderComponent);

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
    marginBottom: 10,
    zIndex: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  locationInfo: {
    maxWidth: 150,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 4,
        }),
  },
  locationIconWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.22,
          shadowRadius: 6,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.22,
          shadowRadius: 6,
          elevation: 4,
        }),
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  filterIconWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
