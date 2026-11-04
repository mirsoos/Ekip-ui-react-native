import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FloatingGlassHeader } from '../common/FloatingGlassHeader';
import { AiEkipLogo } from '../common/AiEkipLogo';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export const AIHeader = React.memo(function AIHeader({
  onBack,
  onOpenMenu,
}: {
  onBack: () => void;
  onOpenMenu?: () => void;
}) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const MoreIcon = getIcon('MoreVertical');

  return (
    <FloatingGlassHeader
      onBack={onBack}
      leading={
        <View style={[styles.aiAvatar, { borderColor: colors.glassBorderStrong, backgroundColor: colors.glassThinBg }]}>
          <AiEkipLogo size={30} />
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
          <MoreIcon size={20} color={colors.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>
      }
    />
  );
});

const styles = StyleSheet.create({
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarGrad: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 10,
  },
});
