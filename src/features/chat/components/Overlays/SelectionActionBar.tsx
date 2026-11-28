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
  SlideOutDown,
} from 'react-native-reanimated';
import { Trash2, Forward, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  useChatIsSelectionMode,
  useChatSelectedMessageIds,
  useChatStore,
} from '../../store/chatStore';
import { useTheme } from '../../../../lib/theme';
import { useI18n } from '../../../../lib/i18n';

export interface SelectionActionBarProps {
  conversationId: string;
  onForwardSelected?: (messageIds: string[]) => void;
  onDeleteSelected?: (messageIds: string[]) => void;
}

export const SelectionActionBar = React.memo(function SelectionActionBar({
  conversationId,
  onForwardSelected,
  onDeleteSelected,
}: SelectionActionBarProps) {
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();

  const isSelectionMode = useChatIsSelectionMode();
  const selectedMessageIds = useChatSelectedMessageIds();
  const exitSelection = useChatStore((s) => s.exitSelectionMode);
  const deleteBatch = useChatStore((s) => s.deleteMessagesBatch);

  const count = selectedMessageIds.length;

  const handleExit = useCallback(() => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {}
    }
    exitSelection();
  }, [exitSelection]);

  const handleDelete = useCallback(() => {
    if (count === 0) return;
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {}
    }
    if (onDeleteSelected) {
      onDeleteSelected(selectedMessageIds);
    } else {
      deleteBatch(conversationId, selectedMessageIds);
    }
  }, [count, selectedMessageIds, onDeleteSelected, deleteBatch, conversationId]);

  const handleForward = useCallback(() => {
    if (count === 0) return;
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    if (onForwardSelected) {
      onForwardSelected(selectedMessageIds);
    } else {
      exitSelection();
    }
  }, [count, selectedMessageIds, onForwardSelected, exitSelection]);

  if (!isSelectionMode) return null;

  const countText = isRTL
    ? `${count} پیام انتخاب شده`
    : `${count} message${count !== 1 ? 's' : ''} selected`;

  return (
    <Animated.View
      entering={SlideInDown.duration(180)}
      exiting={SlideOutDown.duration(160)}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.96)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.1)',
        },
      ]}
    >
      <View style={[styles.contentRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {/* Cancel / Exit */}
        <TouchableOpacity
          onPress={handleExit}
          style={styles.closeBtn}
          activeOpacity={0.7}
          accessibilityLabel="Cancel selection"
        >
          <X size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Selected count */}
        <Text style={[styles.countText, { color: colors.textPrimary }]}>
          {countText}
        </Text>

        <View style={styles.spacer} />

        {/* Forward button */}
        <TouchableOpacity
          onPress={handleForward}
          disabled={count === 0}
          style={[styles.actionBtn, count === 0 && styles.disabledBtn]}
          activeOpacity={0.7}
          accessibilityLabel="Forward selected"
        >
          <Forward size={20} color={count === 0 ? colors.textTertiary : colors.accent} />
        </TouchableOpacity>

        {/* Delete button */}
        <TouchableOpacity
          onPress={handleDelete}
          disabled={count === 0}
          style={[styles.actionBtn, count === 0 && styles.disabledBtn]}
          activeOpacity={0.7}
          accessibilityLabel="Delete selected"
        >
          <Trash2 size={20} color={count === 0 ? colors.textTertiary : '#ef4444'} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    zIndex: 100,
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
        elevation: 12,
      },
    }),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  countText: {
    fontSize: 15,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  disabledBtn: {
    opacity: 0.4,
  },
});
