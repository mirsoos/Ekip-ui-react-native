import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FloatingGlassHeader } from '@/src/components/common/FloatingGlassHeader';
import { FrostedGlass } from '@/src/components/glass';
import { Icons } from '@/src/lib/icons';
import { useTheme } from '@/src/lib/theme';
import { useI18n } from '@/src/lib/i18n';
import type { Group } from '@/src/types/database';

export interface EkipDetailHeaderProps {
  group: Group;
  onBack: () => void;
  onShare?: () => void;
}

export const EkipDetailHeader = React.memo(function EkipDetailHeader({
  group,
  onBack,
  onShare,
}: EkipDetailHeaderProps) {
  const { colors, isDark } = useTheme();
  const { t } = useI18n();

  const isOwner = group.owner_id === 'me';
  const subtitle = isOwner
    ? t('ekip.manage')
    : group.category === 'work'
    ? t('discover.cat.work')
    : t('discover.cat.entertainment');

  return (
    <FloatingGlassHeader
      onBack={onBack}
      title={group.title}
      subtitle={subtitle}
      trailing={
        onShare ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onShare}
            style={[
              styles.headerActionBtn,
              { borderColor: colors.glassBorderStrong },
            ]}
          >
            <FrostedGlass
              borderRadius={21}
              marginWidth={9}
              scale={21}
              blurDeviation={1.6}
              overlayOpacity={isDark ? 0.1 : 0.22}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.headerIconWrap}>
              <Icons.Share size={20} color={colors.textPrimary} strokeWidth={2.2} />
            </View>
          </TouchableOpacity>
        ) : undefined
      }
    />
  );
});

const styles = StyleSheet.create({
  headerActionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  headerIconWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
