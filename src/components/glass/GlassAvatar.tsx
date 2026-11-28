import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../lib/theme';
import { SubscriptionBorder } from '../common/SubscriptionBorder';
import type { Profile, SubscriptionTier } from '../../types/database';

export const AVATAR_BORDER_SCALE = 1.38;

export function getUserTier(user?: Partial<Profile> | null): SubscriptionTier {
  if (!user) return 'free';
  if (user.subscription_tier === 'business_premium' || (user.is_premium && user.is_business)) {
    return 'business_premium';
  }
  if (user.subscription_tier === 'premium' || user.is_premium) {
    return 'premium';
  }
  return 'free';
}

export interface AvatarMetrics {
  avatarSize: number;
  borderSize: number;
  borderPadding: number;
  containerSize: number;
}

export function getAvatarMetrics(
  size: number = 44,
  includeBorderPadding: boolean = true
): AvatarMetrics {
  const avatarSize = size;
  const borderSize = Math.round(size * AVATAR_BORDER_SCALE);
  const borderPadding = Math.round((borderSize - size) / 2);
  const containerSize = includeBorderPadding ? borderSize : size;

  return {
    avatarSize,
    borderSize,
    borderPadding,
    containerSize,
  };
}

export interface GlassAvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
  ring?: boolean;
  online?: boolean;
  verified?: boolean;
  subscriptionTier?: SubscriptionTier;
  isPremium?: boolean;
  isBusiness?: boolean;
  user?: Partial<Profile> | null;
  style?: StyleProp<ViewStyle>;
  includeBorderPadding?: boolean;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
}

export function VerifiedBadge({
  size = 16,
  color = '#3b82f6',
  checkColor = '#ffffff',
  style,
}: {
  size?: number;
  color?: string;
  checkColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ width: size, height: size }, style]} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
          fill={color}
          stroke={color}
          strokeWidth={1}
        />
        <Path
          d="m16 9-5.5 5.5L8 12"
          fill="none"
          stroke={checkColor}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export function GlassAvatarComponent({
  src,
  name,
  size = 44,
  ring = true,
  online,
  verified,
  subscriptionTier,
  isPremium,
  isBusiness,
  user,
  style,
  includeBorderPadding = true,
  pointerEvents,
}: GlassAvatarProps) {
  const { colors } = useTheme();
  const avatarSrc = src !== undefined ? src : user?.avatar_url;
  const rawName = name ?? (user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '');
  const initials = rawName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const tier: SubscriptionTier =
    subscriptionTier ??
    (isBusiness && isPremium
      ? 'business_premium'
      : isPremium
      ? 'premium'
      : getUserTier(user));

  const isVerified = verified !== undefined ? verified : (user?.is_verified ?? false);
  const isOnline = online === true;
  const hasSubscriptionBorder = tier === 'business_premium' || tier === 'premium';

  const { avatarSize, borderSize, containerSize } = getAvatarMetrics(
    size,
    includeBorderPadding
  );

  const badgeSize = Math.max(14, Math.round(avatarSize * 0.36));
  const badgeOffset = Math.max(0, Math.round(badgeSize * 0.08));
  const onlineSize = Math.max(9, Math.round(avatarSize * 0.26));
  const avatarOffset = (containerSize - avatarSize) / 2;
  const borderOffset = (containerSize - borderSize) / 2;

  return (
    <View
      pointerEvents={pointerEvents}
      style={[
        {
          width: containerSize,
          height: containerSize,
          position: 'relative',
          overflow: 'visible',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <View
        style={[
          styles.avatarContainer,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            borderWidth: hasSubscriptionBorder ? 0 : ring ? 1.5 : 0,
            borderColor: colors.glassBorderStrong,
          },
        ]}
      >
        {avatarSrc ? (
          <Image
            source={{ uri: avatarSrc }}
            style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            recyclingKey={avatarSrc}
            transition={200}
          />
        ) : (
          <LinearGradient
            colors={['#f472b6', '#3b82f6']}
            style={[
              styles.avatarFallback,
              { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
            ]}
          >
            <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: avatarSize * 0.38 }}>
              {initials}
            </Text>
          </LinearGradient>
        )}
      </View>

      {hasSubscriptionBorder && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: borderSize,
            height: borderSize,
            top: borderOffset,
            left: borderOffset,
            zIndex: 10,
          }}
        >
          <SubscriptionBorder tier={tier} size={borderSize} />
        </View>
      )}

      {isVerified && (
        <View
          pointerEvents="none"
          style={[
            styles.verifiedBadge,
            {
              bottom: avatarOffset - badgeOffset,
              left: avatarOffset - badgeOffset,
              zIndex: 15,
            },
          ]}
        >
          <VerifiedBadge size={badgeSize} color="#3b82f6" checkColor="#ffffff" />
        </View>
      )}

      {isOnline && (
        <View
          pointerEvents="none"
          style={[
            styles.onlineBadge,
            {
              width: onlineSize,
              height: onlineSize,
              borderRadius: onlineSize / 2,
              bottom: avatarOffset,
              right: avatarOffset,
              zIndex: 15,
            },
          ]}
        />
      )}
    </View>
  );
}

export const GlassAvatar = React.memo(GlassAvatarComponent);

const styles = StyleSheet.create({
  avatarContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#22c55e',
    borderColor: '#ffffff',
    borderWidth: 1.5,
  },
});
