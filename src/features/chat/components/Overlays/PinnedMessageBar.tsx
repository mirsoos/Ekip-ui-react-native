import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  SlideInDown,
  SlideOutUp,
} from 'react-native-reanimated';
import { Pin, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  useChatPinnedMessageIds,
  useChatActivePinnedIndex,
  useChatMessage,
  useChatStore,
} from '../../store/chatStore';
import { useTheme } from '../../../../lib/theme';
import { useI18n } from '../../../../lib/i18n';

export interface PinnedMessageBarProps {
  conversationId: string;
  topOffset?: number;
  onPressPinned?: (messageId: string) => void;
  onUnpin?: (messageId: string) => void;
}

export const PinnedMessageBar = React.memo(function PinnedMessageBar({
  conversationId,
  topOffset = 70,
  onPressPinned,
  onUnpin,
}: PinnedMessageBarProps) {
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();

  const pinnedIds = useChatPinnedMessageIds(conversationId);
  const activeIndex = useChatActivePinnedIndex(conversationId);

  const currentPinnedId = pinnedIds.length > 0 ? pinnedIds[activeIndex % pinnedIds.length] : null;
  const currentMessage = useChatMessage(currentPinnedId || '');

  const cyclePinned = useChatStore((s) => s.cyclePinnedMessage);
  const unpinMessage = useChatStore((s) => s.pinMessage);
  const requestJump = useChatStore((s) => s.requestJumpToMessage);

  const handlePress = useCallback(() => {
    if (!currentPinnedId) return;

    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }

    if (pinnedIds.length > 1) {
      const nextId = cyclePinned(conversationId);
      if (nextId) {
        requestJump(conversationId, nextId);
        onPressPinned?.(nextId);
        return;
      }
    }

    requestJump(conversationId, currentPinnedId);
    onPressPinned?.(currentPinnedId);
  }, [currentPinnedId, pinnedIds.length, cyclePinned, conversationId, requestJump, onPressPinned]);

  const handleUnpin = useCallback(
    (e: any) => {
      e?.stopPropagation?.();
      if (!currentPinnedId) return;

      if (Platform.OS !== 'web') {
        try {
          Haptics.selectionAsync();
        } catch {}
      }

      if (onUnpin) {
        onUnpin(currentPinnedId);
      } else {
        unpinMessage(conversationId, currentPinnedId);
      }
    },
    [currentPinnedId, onUnpin, unpinMessage, conversationId]
  );

  if (!currentPinnedId || !currentMessage || pinnedIds.length === 0) {
    return null;
  }

  const previewText = currentMessage.text
    ? currentMessage.text
    : currentMessage.attachments?.length
    ? `📎 ${currentMessage.attachments[0].type}`
    : 'Pinned message';

  const titleText =
    pinnedIds.length > 1
      ? isRTL
        ? `پیام سنجاق شده (${(activeIndex % pinnedIds.length) + 1} از ${pinnedIds.length})`
        : `Pinned Message (${(activeIndex % pinnedIds.length) + 1} of ${pinnedIds.length})`
      : isRTL
      ? 'پیام سنجاق شده'
      : 'Pinned Message';

  return (
    <Animated.View
      entering={SlideInDown.duration(200)}
      exiting={SlideOutUp.duration(180)}
      style={[
        styles.container,
        {
          top: topOffset,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.94)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={[styles.touchArea, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      >
        <View style={styles.accentBar} />
        <View style={styles.pinIconWrap}>
          <Pin size={13} color="#eab308" />
        </View>

        <View style={styles.contentWrap}>
          <Text
            style={[
              styles.headerTitle,
              { color: '#eab308', textAlign: isRTL ? 'right' : 'left' },
            ]}
            numberOfLines={1}
          >
            {titleText}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' },
            ]}
            numberOfLines={1}
          >
            {previewText}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleUnpin}
          style={styles.closeBtn}
          accessibilityLabel="Unpin message"
        >
          <X size={15} color={colors.textTertiary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 75,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
      },
    }),
  },
  touchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    gap: 8,
  },
  accentBar: {
    width: 3,
    height: 28,
    borderRadius: 1.5,
    backgroundColor: '#eab308',
  },
  pinIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
