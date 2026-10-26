import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassBackButton } from '../Glass';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

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
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();
  const ShareIcon = getIcon('Share');
  const BookmarkIcon = getIcon('Bookmark');
  const topInset = Platform.OS === 'web' ? 16 : Math.max(16, insets.top + 8);

  return (
    <View style={[styles.container, Platform.OS !== 'web' && { height: 220 + insets.top }]}>
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
      <GlassBackButton
        onPress={onBack}
        style={[
          styles.backBtn,
          {
            top: topInset,
            left: isRTL ? 'auto' : 16,
            right: isRTL ? 16 : 'auto',
          },
        ]}
      />

      {/* Top right actions with authentic Liquid Glass */}
      <View
        style={[
          styles.rightActions,
          {
            top: topInset,
            left: isRTL ? 16 : 'auto',
            right: isRTL ? 'auto' : 16,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
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
    </View>
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
    elevation: Platform.OS === 'android' ? 0 : 4,
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
    zIndex: 20,
  },
  rightActions: {
    position: 'absolute',
    top: 16,
    gap: 8,
    zIndex: 20,
  },
});
