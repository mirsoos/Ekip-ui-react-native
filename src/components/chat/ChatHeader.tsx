import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { GlassAvatar } from '../Glass';
import { FloatingGlassHeader } from '../common/FloatingGlassHeader';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Conversation } from '../../types/database';

export const ChatHeader = React.memo(function ChatHeader({
  conversation,
  onBack,
  onOpenMenu,
}: {
  conversation: Conversation;
  onBack: () => void;
  onOpenMenu?: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const isGroup = conversation.type === 'group';
  const MoreIcon = getIcon('MoreVertical');

  return (
    <FloatingGlassHeader
      onBack={onBack}
      leading={
        <GlassAvatar
          src={conversation.avatar_url}
          name={conversation.title}
          size={38}
          online={!isGroup}
        />
      }
      title={conversation.title}
      subtitle={isGroup ? t('chat.channel') : t('chat.encryptedLink')}
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
});

const styles = StyleSheet.create({
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
