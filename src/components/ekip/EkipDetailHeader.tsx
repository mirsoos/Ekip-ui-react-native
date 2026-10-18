import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const { colors } = useTheme();
  const BackIcon = getIcon('ArrowLeft');
  const ShareIcon = getIcon('Share');
  const BookmarkIcon = getIcon('Bookmark');

  return (
    <View style={styles.container}>
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: colors.glassThinBg }]} />
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.65)']}
        style={styles.gradient}
      />

      {/* Back button */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onBack}
        style={[
          styles.actionBtn,
          styles.backBtn,
          { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
        ]}
      >
        <BackIcon size={20} color={colors.textPrimary} strokeWidth={2.4} />
      </TouchableOpacity>

      {/* Top right actions */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onShare}
          style={[
            styles.actionBtn,
            { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
          ]}
        >
          <ShareIcon size={18} color={colors.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>

        {onBookmark && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onBookmark}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
            ]}
          >
            <BookmarkIcon size={18} color={colors.textPrimary} strokeWidth={2.2} />
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
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  rightActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
});
