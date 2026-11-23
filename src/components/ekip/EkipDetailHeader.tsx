import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FloatingGlassHeader } from '../common/FloatingGlassHeader';
import { FrostedGlass } from '../FrostedGlass';
import { Icons } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Group } from '../../types/database';

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
