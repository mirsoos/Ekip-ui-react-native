import React, { type ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getIcon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { GlassAvatar } from './GlassAvatar';
import {
  GLASS_THEME_STYLES,
  LIST_ROW_STYLES,
  LIST_CHEVRON_STYLES,
  LIST_LEADING_STYLES,
  LIST_NO_LEADING_STYLE,
  TEXT_DIRECTION_STYLES,
} from './theme';

export interface GlassListItemProps {
  icon?: IconName;
  iconBg?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  avatar?: string | null;
  avatarName?: string;
}

export function GlassListItemComponent({
  icon,
  iconBg,
  title,
  subtitle,
  right,
  onPress,
  showChevron,
  avatar,
  avatarName,
}: GlassListItemProps) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const { isRTL } = useI18n();
  const IconComp = icon ? getIcon(icon) : null;
  const ChevronIcon = getIcon(isRTL ? 'ChevronLeft' : 'ChevronRight');
  const hasLeading = Boolean(avatar || IconComp);
  const direction = isRTL ? 'rtl' : 'ltr';

  const content = (
    <View style={[styles.listItemRow, LIST_ROW_STYLES[direction]]}>
      {avatar ? (
        <GlassAvatar src={avatar} name={avatarName ?? title} size={40} />
      ) : IconComp ? (
        <View
          style={[
            styles.listIconBox,
            { backgroundColor: iconBg ?? 'rgba(244, 114, 182, 0.2)' },
          ]}
        >
          <IconComp size={18} color="#ffffff" strokeWidth={2.2} />
        </View>
      ) : null}

      <View
        style={hasLeading ? LIST_LEADING_STYLES[direction] : LIST_NO_LEADING_STYLE}
      >
        <Text
          style={[
            styles.listTitle,
            themeStyles.listTitle,
            TEXT_DIRECTION_STYLES[direction],
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.listSubtitle,
              themeStyles.listSubtitle,
              TEXT_DIRECTION_STYLES[direction],
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {right}
      {showChevron && (
        <ChevronIcon
          size={18}
          color={colors.textTertiary}
          style={LIST_CHEVRON_STYLES[direction]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export const GlassListItem = React.memo(GlassListItemComponent);

const styles = StyleSheet.create({
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  listIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  listSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
