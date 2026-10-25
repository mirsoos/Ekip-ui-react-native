import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassBackButton } from '../Glass';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Profile } from '../../types/database';

export function ProfileHeader({
  profile,
  isOwnProfile,
  onBack,
  onOpenSettings,
  scrollY,
}: {
  profile: Profile;
  isOwnProfile: boolean;
  onBack?: () => void;
  onOpenSettings: () => void;
  scrollY: Animated.Value;
}) {
  const { theme, toggle, colors, isDark } = useTheme();
  const { isRTL } = useI18n();
  const Sun = getIcon('Sun');
  const Moon = getIcon('Moon');
  const SettingsIcon = getIcon('Settings');

  const SCROLL_DISTANCE = 65;
  const isIOS = Platform.OS === 'ios';
  const targetTranslateY = isIOS ? -140 : -142;
  const targetTranslateX = isRTL
    ? (!isOwnProfile && onBack ? -29 : 15)
    : (!isOwnProfile && onBack ? 29 : -15);

  const initialDocked = ((scrollY as any)?._value ?? 0) >= 60;
  const [isDocked, setIsDocked] = useState(initialDocked);
  const [isMounted, setIsMounted] = useState(initialDocked);
  const capsuleAnim = useRef(new Animated.Value(initialDocked ? 1 : 0)).current;
  const isDockedRef = useRef(initialDocked);

  // Avatar entrance animation when navigating into Profile screen
  const avatarEnterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    avatarEnterAnim.setValue(0);
    Animated.spring(avatarEnterAnim, {
      toValue: 1,
      bounciness: 6,
      speed: 12,
      useNativeDriver: false,
    }).start();
  }, [profile.id]);

  useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      const docked = value >= 60;
      if (docked !== isDockedRef.current) {
        isDockedRef.current = docked;
        setIsDocked(docked);
        if (docked) {
          setIsMounted(true);
          capsuleAnim.stopAnimation();
          Animated.spring(capsuleAnim, {
            toValue: 1,
            bounciness: 4,
            speed: 14,
            useNativeDriver: false,
          }).start();
        } else {
          capsuleAnim.stopAnimation();
          Animated.timing(capsuleAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: false,
          }).start(({ finished }) => {
            if (finished) {
              setIsMounted(false);
            }
          });
        }
      }
    });
    return () => {
      scrollY.removeListener(id);
    };
  }, [scrollY, capsuleAnim]);

  // Entrance & Exit animations for header capsule and unscrolled bar
  const capsuleTranslateY = capsuleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-85, 0],
  });

  const unscrolledTranslateY = capsuleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });

  // GPU-Accelerated Transforms for the Avatar
  const translateY = scrollY.interpolate({
    inputRange: [-100, 0, SCROLL_DISTANCE],
    outputRange: [100, 0, targetTranslateY],
    extrapolateRight: 'clamp',
  });

  const translateX = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, targetTranslateX],
    extrapolate: 'clamp',
  });

  const scale = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 38 / 88],
    extrapolate: 'clamp',
  });

  // Avatar page entrance animations
  const avatarEnterOpacity = avatarEnterAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.8, 1],
  });

  const avatarEnterScale = avatarEnterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 1],
  });

  const avatarEnterTranslateY = avatarEnterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const combinedTranslateY = Animated.add(translateY, avatarEnterTranslateY);
  const combinedScale = Animated.multiply(scale, avatarEnterScale);

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      {/* Docked Authentic Liquid Glass Header Capsule with Slide Enter/Exit */}
      {isMounted && (
        <Animated.View
          style={[
            styles.container,
            {
              flexDirection: isRTL ? 'row-reverse' : 'row',
              borderColor: colors.glassBorderStrong,
              transform: [{ translateY: capsuleTranslateY }],
            },
          ]}
          pointerEvents={isDocked ? 'auto' : 'none'}
        >
          <LiquidLens
            borderRadius={36}
            marginWidth={16}
            scale={36}
            blurDeviation={2.0}
            overlayOpacity={isDark ? 0.08 : 0.15}
            style={StyleSheet.absoluteFill}
          />

          {!isOwnProfile && onBack ? (
            <GlassBackButton onPress={onBack} style={{ marginRight: 6, zIndex: 10 }} />
          ) : null}

          {/* Reserved slot for docked avatar */}
          <View style={{ width: 40 }} />

          {/* Title that appears when docked */}
          <View style={styles.titleWrap}>
            <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
              {profile.first_name} {profile.last_name}
            </Text>
            <Text style={[styles.status, { color: colors.textTertiary }]} numberOfLines={1}>
              {profile.is_verified ? 'Verified Operative' : 'Sector Operative'}
            </Text>
          </View>

          {/* Right Action Buttons */}
          <View style={styles.rightActions}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={toggle}
              style={[
                styles.actionBtn,
                { borderColor: colors.glassBorderStrong },
              ]}
            >
              <LiquidLens
                borderRadius={19}
                marginWidth={8}
                scale={20}
                blurDeviation={1.6}
                overlayOpacity={isDark ? 0.10 : 0.22}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.iconWrap}>
                {theme === 'dark' ? (
                  <Sun size={18} color="#eab308" strokeWidth={2.4} />
                ) : (
                  <Moon size={18} color="#6366f1" strokeWidth={2.4} />
                )}
              </View>
            </TouchableOpacity>

            {isOwnProfile && (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onOpenSettings}
                style={[
                  styles.actionBtn,
                  { borderColor: colors.glassBorderStrong },
                ]}
              >
                <LiquidLens
                  borderRadius={19}
                  marginWidth={8}
                  scale={20}
                  blurDeviation={1.6}
                  overlayOpacity={isDark ? 0.10 : 0.22}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.iconWrap}>
                  <SettingsIcon size={18} color={colors.textPrimary} strokeWidth={2.2} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}

      {/* Top actions bar when unscrolled (no capsule, no shadow, no border) */}
      <Animated.View
        style={[
          styles.unscrolledBar,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            transform: [{ translateY: unscrolledTranslateY }],
          },
        ]}
        pointerEvents={isDocked ? 'none' : 'box-none'}
      >
        {!isOwnProfile && onBack ? (
          <GlassBackButton onPress={onBack} style={{ zIndex: 30 }} />
        ) : (
          <View />
        )}

        <View style={styles.rightActions}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={toggle}
            style={[
              styles.actionBtn,
              { borderColor: colors.glassBorderStrong },
            ]}
          >
            <LiquidLens
              borderRadius={19}
              marginWidth={8}
              scale={20}
              blurDeviation={1.6}
              overlayOpacity={isDark ? 0.10 : 0.22}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.iconWrap}>
              {theme === 'dark' ? (
                <Sun size={18} color="#eab308" strokeWidth={2.4} />
              ) : (
                <Moon size={18} color="#6366f1" strokeWidth={2.4} />
              )}
            </View>
          </TouchableOpacity>

          {isOwnProfile && (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={onOpenSettings}
              style={[
                styles.actionBtn,
                { borderColor: colors.glassBorderStrong },
              ]}
            >
              <LiquidLens
                borderRadius={19}
                marginWidth={8}
                scale={20}
                blurDeviation={1.6}
                overlayOpacity={isDark ? 0.10 : 0.22}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.iconWrap}>
                <SettingsIcon size={18} color={colors.textPrimary} strokeWidth={2.2} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* GPU-Accelerated Shrinking Avatar */}
      <Animated.View
        style={[
          styles.avatarContainer,
          {
            [isRTL ? 'right' : 'left']: 16,
            opacity: avatarEnterOpacity,
            transform: [
              { translateY: combinedTranslateY },
              { translateX },
              { scale: combinedScale },
            ],
            borderColor: colors.glassBorderStrong,
          },
        ]}
        pointerEvents="none"
      >
        {profile.avatar_url ? (
          <Image
            source={{ uri: profile.avatar_url }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={['#f472b6', '#3b82f6']}
            style={styles.avatarFallback}
          >
            <Text style={styles.avatarInitials}>
              {profile.first_name?.[0] ?? ''}{profile.last_name?.[0] ?? ''}
            </Text>
          </LinearGradient>
        )}
      </Animated.View>
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 36,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
    overflow: 'visible',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.16)',
        } as any)
      : {}),
  },
  unscrolledBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 12 : 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    height: 54,
  },
  titleWrap: {
    flex: 1,
    marginLeft: 6,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  status: {
    fontSize: 11,
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 20,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  iconWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    top: 136,
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 950,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 30,
  },
});
