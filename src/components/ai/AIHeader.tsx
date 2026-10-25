import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FloatingGlassHeader } from '../common/FloatingGlassHeader';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export function AIHeader({
  onBack,
  onOpenMenu,
}: {
  onBack: () => void;
  onOpenMenu?: () => void;
}) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const Sparkles = getIcon('Sparkles');
  const MoreIcon = getIcon('MoreVertical');

  return (
    <FloatingGlassHeader
      onBack={onBack}
      leading={
        <View style={[styles.aiAvatar, { borderColor: colors.glassBorderStrong }]}>
          <LinearGradient
            colors={['#8b5cf6', '#ec4899']}
            style={styles.aiAvatarGrad}
          >
            <Sparkles size={18} color="#ffffff" strokeWidth={2.4} />
          </LinearGradient>
        </View>
      }
      title={isRTL ? 'دستیار هوشمند اکیپ' : 'Ekip AI Assistant'}
      subtitle={isRTL ? 'پیشنهاد دورهمی و کافه‌گردی' : 'Hangout & Event Planning'}
      trailing={
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onOpenMenu}
          style={[
            styles.moreBtn,
            { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
          ]}
        >
          <MoreIcon size={18} color={colors.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>
      }
    />
  );
}

const styles = StyleSheet.create({
  aiAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1,
    zIndex: 10,
  },
  aiAvatarGrad: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 10,
  },
});
