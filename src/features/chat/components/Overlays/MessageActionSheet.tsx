import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  CornerUpLeft,
  Copy,
  Trash,
  RefreshCw,
  Edit3,
  Pin,
  Forward,
} from 'lucide-react-native';
import { ReactionBar } from '../Reactions/ReactionBar';
import { useTheme, useChatTheme, CHAT_THEMES } from '../../../../lib/theme';
import type { Message, BubbleLayout } from '../../types/chat.types';

export interface MessageActionSheetProps {
  visible: boolean;
  message: Message | null;
  bubbleLayout?: BubbleLayout | null;
  currentUserId?: string;
  onClose: () => void;
  onSelectReaction: (messageId: string, emoji: string) => void;
  onReply: (message: Message) => void;
  onCopyText: (text: string) => void;
  onRetry: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onEditMessage?: (message: Message) => void;
  onPinMessage?: (message: Message) => void;
  onForwardMessage?: (message: Message) => void;
  onDeleteForEveryone?: (messageId: string) => void;
}

const EDIT_TIME_LIMIT_MS = 15 * 60 * 1000;
const MENU_WIDTH = 210;
const MENU_HEIGHT = 220;
const REACTION_HEIGHT = 44;

export const MessageActionSheet = React.memo(function MessageActionSheet({
  visible,
  message,
  bubbleLayout,
  currentUserId = 'me',
  onClose,
  onSelectReaction,
  onReply,
  onCopyText,
  onRetry,
  onDelete,
  onEditMessage,
  onPinMessage,
  onForwardMessage,
  onDeleteForEveryone,
}: MessageActionSheetProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { chatTheme } = useChatTheme();
  const themeConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  const [isClosing, setIsClosing] = React.useState(false);
  const sheetScale = useSharedValue(0.94);
  const sheetOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible && message) {
      setIsClosing(false);
      sheetScale.value = withTiming(1, { duration: 140, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
      sheetOpacity.value = withTiming(1, { duration: 140, easing: Easing.out(Easing.quad) });

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } else {
      sheetScale.value = withTiming(0.94, { duration: 120, easing: Easing.out(Easing.quad) });
      sheetOpacity.value = withTiming(0, { duration: 120, easing: Easing.out(Easing.quad) });
    }

    return () => {
      cancelAnimation(sheetScale);
      cancelAnimation(sheetOpacity);
    };
  }, [visible, message, sheetScale, sheetOpacity]);

  const handleDismiss = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    sheetScale.value = withTiming(0.94, { duration: 120, easing: Easing.out(Easing.quad) });
    sheetOpacity.value = withTiming(0, { duration: 120, easing: Easing.out(Easing.quad) });

    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 130);
  }, [isClosing, onClose, sheetScale, sheetOpacity]);

  const animStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: sheetOpacity.value,
      transform: [{ scale: sheetScale.value }],
    };
  });

  if (!visible || !message) return null;

  const isMe = message.senderId === currentUserId;
  const isEditable = isMe && Date.now() - message.createdAt <= EDIT_TIME_LIMIT_MS;
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Compute floating coordinates attached directly to the message bubble
  let reactionTop: number;
  let menuTop: number;
  let horizontalStyle: { left?: number; right?: number } = {};

  if (bubbleLayout && bubbleLayout.y > 0) {
    const spaceBelow = screenHeight - (bubbleLayout.y + bubbleLayout.height) - insets.bottom;
    const placeMenuBelow = spaceBelow >= MENU_HEIGHT + 24;

    if (placeMenuBelow) {
      reactionTop = Math.max(insets.top + 8, bubbleLayout.y - REACTION_HEIGHT - 8);
      menuTop = bubbleLayout.y + bubbleLayout.height + 8;
    } else {
      reactionTop = Math.max(insets.top + 8, bubbleLayout.y - REACTION_HEIGHT - 8);
      menuTop = Math.max(insets.top + 8, reactionTop - MENU_HEIGHT - 8);
    }

    if (isMe) {
      horizontalStyle = {
        right: Math.max(16, screenWidth - (bubbleLayout.x + bubbleLayout.width)),
      };
    } else {
      horizontalStyle = {
        left: Math.max(16, bubbleLayout.x),
      };
    }
  } else {
    // Graceful center fallback if layout unmeasured
    reactionTop = Math.max(insets.top + 20, screenHeight * 0.38);
    menuTop = reactionTop + REACTION_HEIGHT + 12;
    horizontalStyle = isMe ? { right: 20 } : { left: 20 };
  }

  const handleActionPress = (action: () => void) => {
    action();
    handleDismiss();
  };

  const handleReactionSelect = (emoji: string) => {
    onSelectReaction(message.id, emoji);
    handleDismiss();
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* 1. Transparent Tap-Outside Backdrop */}
      <Pressable
        style={[StyleSheet.absoluteFill, styles.backdrop]}
        onPress={handleDismiss}
      />

      {/* 2. Floating Telegram Reaction Capsule attached above bubble */}
      <Animated.View
        style={[
          styles.floatingReaction,
          {
            top: reactionTop,
            ...horizontalStyle,
          },
          animStyle,
        ]}
        pointerEvents="auto"
      >
        <ReactionBar
          visible={visible}
          onSelectReaction={handleReactionSelect}
          onClose={handleDismiss}
          position="relative"
        />
      </Animated.View>

      {/* 3. Floating Compact Telegram Context Menu Card */}
      <Animated.View
        style={[
          styles.floatingMenuCard,
          {
            top: menuTop,
            width: MENU_WIDTH,
            ...horizontalStyle,
            backgroundColor: isDark ? 'rgba(24, 30, 44, 0.96)' : colors.glassCardBg,
            borderColor: colors.glassBorder,
          },
          animStyle,
        ]}
        pointerEvents="auto"
      >
        {/* Reply */}
        <TouchableOpacity
          onPress={() => handleActionPress(() => onReply(message))}
          style={styles.actionRow}
          activeOpacity={0.7}
        >
          <CornerUpLeft size={17} color={themeConfig.accentHex} />
          <Text style={[styles.actionText, { color: colors.textPrimary }]}>Reply</Text>
        </TouchableOpacity>

        {/* Copy Text */}
        {!!message.text && (
          <TouchableOpacity
            onPress={() => handleActionPress(() => onCopyText(message.text))}
            style={styles.actionRow}
            activeOpacity={0.7}
          >
            <Copy size={17} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textPrimary }]}>Copy Text</Text>
          </TouchableOpacity>
        )}

        {/* Edit Message (if owned and within time limit) */}
        {isEditable && onEditMessage && (
          <TouchableOpacity
            onPress={() => handleActionPress(() => onEditMessage(message))}
            style={styles.actionRow}
            activeOpacity={0.7}
          >
            <Edit3 size={17} color={themeConfig.accentHex} />
            <Text style={[styles.actionText, { color: colors.textPrimary }]}>Edit</Text>
          </TouchableOpacity>
        )}

        {/* Pin / Unpin */}
        {onPinMessage && (
          <TouchableOpacity
            onPress={() => handleActionPress(() => onPinMessage(message))}
            style={styles.actionRow}
            activeOpacity={0.7}
          >
            <Pin size={17} color="#eab308" />
            <Text style={[styles.actionText, { color: colors.textPrimary }]}>
              {message.isPinned ? 'Unpin' : 'Pin'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Forward */}
        {onForwardMessage && (
          <TouchableOpacity
            onPress={() => handleActionPress(() => onForwardMessage(message))}
            style={styles.actionRow}
            activeOpacity={0.7}
          >
            <Forward size={17} color={themeConfig.accentHex} />
            <Text style={[styles.actionText, { color: colors.textPrimary }]}>Forward</Text>
          </TouchableOpacity>
        )}

        {/* Retry Dispatch (if failed) */}
        {message.status === 'FAILED' && (
          <TouchableOpacity
            onPress={() => handleActionPress(() => onRetry(message.id))}
            style={styles.actionRow}
            activeOpacity={0.7}
          >
            <RefreshCw size={17} color="#38bdf8" />
            <Text style={[styles.actionText, { color: colors.textPrimary }]}>Retry</Text>
          </TouchableOpacity>
        )}

        {/* Delete */}
        <TouchableOpacity
          onPress={() => handleActionPress(() => onDelete(message.id))}
          style={styles.actionRow}
          activeOpacity={0.7}
        >
          <Trash size={17} color={colors.danger} />
          <Text style={[styles.actionText, { color: colors.danger }]}>Delete for Me</Text>
        </TouchableOpacity>

        {/* Delete for Everyone (if owned message) */}
        {isMe && onDeleteForEveryone && (
          <TouchableOpacity
            onPress={() => handleActionPress(() => onDeleteForEveryone(message.id))}
            style={[styles.actionRow, styles.lastActionRow]}
            activeOpacity={0.7}
          >
            <Trash size={17} color={colors.danger} />
            <Text style={[styles.actionText, { color: colors.danger }]}>
              Delete for Everyone
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'transparent',
    zIndex: 9998,
  },
  floatingReaction: {
    position: 'absolute',
    zIndex: 9999,
  },
  floatingMenuCard: {
    position: 'absolute',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 9999,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 20,
        elevation: 16,
      },
    }),
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
  },
  lastActionRow: {
    borderBottomWidth: 0,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
