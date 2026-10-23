import React, { useRef, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassBackButton } from '../Glass';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export interface EkipDetailHeaderProps {
  coverUrl: string;
  onBack: () => void;
  onShare: () => void;
  onBookmark?: () => void;
}

export function EkipDetailHeader({
  coverUrl,
  onBack,
  onShare,
  onBookmark,
}: EkipDetailHeaderProps) {
  const { colors, isDark } = useTheme();
  const ShareIcon = getIcon('Share');
  const BookmarkIcon = getIcon('Bookmark');

  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enterAnim.setValue(0);
    Animated.spring(enterAnim, {
      toValue: 1,
      bounciness: 4,
      speed: 14,
      useNativeDriver: false,
    }).start();
  }, []);

  const enterTranslateY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-85, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: enterTranslateY }],
        },
      ]}
    >
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: colors.glassThinBg }]} />
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.65)']}
        style={styles.gradient}
      />

      {/* Back button with authentic Liquid Glass */}
      <GlassBackButton onPress={onBack} style={styles.backBtn} />

      {/* Top right actions with authentic Liquid Glass */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onShare}
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
            <ShareIcon size={18} color={colors.textPrimary} strokeWidth={2.2} />
          </View>
        </TouchableOpacity>

        {onBookmark && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onBookmark}
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
              <BookmarkIcon size={18} color={colors.textPrimary} strokeWidth={2.2} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 220,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
  },
  iconWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 20,
  },
  rightActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 20,
  },
});
