import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { GlassAvatar } from '../Glass';
import { FloatingGlassHeader } from '../common/FloatingGlassHeader';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { useChatStore } from '../../features/chat/store/chatStore';
import type { Conversation } from '../../types/database';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getSinglePillContentPaddingTop } from '../../lib/headerLayout';

import { GlassSheet } from '../Overlays';
import { Ban } from 'lucide-react-native';

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
  const { t, isRTL } = useI18n();
  const isGroup = conversation.type === 'group';

  const [menuVisible, setMenuVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const MoreIcon = getIcon('MoreVertical');
  const SearchIcon = getIcon('Search');
  const BellIcon = getIcon('Bell');
  const TrashIcon = getIcon('Trash');

  const insets = useSafeAreaInsets();
  const headerOverlayHeight = getSinglePillContentPaddingTop(insets.top) + 24;

  const handleToggleMenu = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onOpenMenu) {
      onOpenMenu();
    } else {
      setMenuVisible((v) => !v);
    }
  }, [onOpenMenu]);

  const handleSearch = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setMenuVisible(false);
    useChatStore.getState().setSearchBarOpen(true);
  }, []);

  const handleToggleMute = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsMuted((prev) => !prev);
    setMenuVisible(false);
  }, []);

  const handleClearHistory = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setMenuVisible(false);
    useChatStore.getState().clearConversation(conversation.id);
  }, [conversation.id]);

  const handleBlockUser = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setMenuVisible(false);
  }, []);

  return (
    <>
      <View
        pointerEvents="none"
        style={[styles.headerTopScrim, { height: headerOverlayHeight }]}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.85)', 'rgba(0, 0, 0, 0.55)', 'rgba(0, 0, 0, 0.20)', 'rgba(0, 0, 0, 0)']}
          locations={[0, 0.45, 0.78, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <FloatingGlassHeader
        onBack={onBack}
        leading={
          <GlassAvatar
            user={conversation.user}
            src={conversation.avatar_url}
            name={conversation.title}
            size={38}
            online={!isGroup && !!conversation.user?.is_online}
          />
        }
        title={conversation.title}
        subtitle={isGroup ? t('chat.channel') : t('chat.encryptedLink')}
        trailing={
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleToggleMenu}
            style={[
              styles.moreBtn,
              { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
            ]}
          >
            <MoreIcon size={20} color={colors.textPrimary} strokeWidth={2.2} />
          </TouchableOpacity>
        }
      />

      <GlassSheet
        open={menuVisible}
        onClose={() => setMenuVisible(false)}
        title={conversation.title}
      >
        <View style={styles.sheetContent}>
          {/* Search in conversation */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSearch}
            style={[
              styles.sheetItem,
              { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.glassCardBg },
            ]}
          >
            <View style={[styles.sheetIconWrap, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <SearchIcon size={20} color="#38bdf8" strokeWidth={2} />
            </View>
            <View style={styles.sheetTextWrap}>
              <Text
                style={[
                  styles.sheetItemTitle,
                  { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {isRTL ? 'جستجو در گفتگو' : 'Search in chat'}
              </Text>
              <Text
                style={[
                  styles.sheetItemSub,
                  { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {isRTL ? 'یافتن پیام‌ها و رسانه‌ها' : 'Find messages, links and media'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Mute notifications */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleToggleMute}
            style={[
              styles.sheetItem,
              { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.glassCardBg },
            ]}
          >
            <View
              style={[
                styles.sheetIconWrap,
                { backgroundColor: isMuted ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)' },
              ]}
            >
              <BellIcon size={20} color={isMuted ? '#34d399' : '#fbbf24'} strokeWidth={2} />
            </View>
            <View style={styles.sheetTextWrap}>
              <Text
                style={[
                  styles.sheetItemTitle,
                  { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {isMuted
                  ? isRTL
                    ? 'صدادار کردن اعلان‌ها'
                    : 'Unmute notifications'
                  : isRTL
                  ? 'بی‌صدا کردن اعلان‌ها'
                  : 'Mute notifications'}
              </Text>
              <Text
                style={[
                  styles.sheetItemSub,
                  { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {isMuted
                  ? isRTL
                    ? 'دریافت صدا و بنر برای پیام‌های جدید'
                    : 'Receive sounds and banners'
                  : isRTL
                  ? 'عدم نمایش نوتیفیکیشن مزاحم'
                  : 'Silence chat notifications'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Clear history */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClearHistory}
            style={[
              styles.sheetItem,
              { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.glassCardBg },
            ]}
          >
            <View style={[styles.sheetIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <TrashIcon size={20} color="#ef4444" strokeWidth={2} />
            </View>
            <View style={styles.sheetTextWrap}>
              <Text
                style={[
                  styles.sheetItemTitle,
                  { color: '#ef4444', textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {isRTL ? 'پاک کردن تاریخچه' : 'Clear History'}
              </Text>
              <Text
                style={[
                  styles.sheetItemSub,
                  { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {isRTL ? 'حذف تمام پیام‌های این گفتگو' : 'Delete all messages in this conversation'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Block Contact */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBlockUser}
            style={[
              styles.sheetItem,
              { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: colors.glassCardBg },
            ]}
          >
            <View style={[styles.sheetIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Ban size={20} color="#ef4444" strokeWidth={2} />
            </View>
            <View style={styles.sheetTextWrap}>
              <Text
                style={[
                  styles.sheetItemTitle,
                  { color: '#ef4444', textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {isRTL ? 'مسدود کردن' : 'Block Contact'}
              </Text>
              <Text
                style={[
                  styles.sheetItemSub,
                  { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {isRTL ? 'جلوگیری از ارسال پیام و تماس' : 'Stop receiving messages from this contact'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </GlassSheet>
    </>
  );
});

const styles = StyleSheet.create({
  moreBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 10,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    gap: 14,
  },
  sheetIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTextWrap: {
    flex: 1,
  },
  sheetItemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  sheetItemSub: {
    fontSize: 12,
    marginTop: 2,
  },
  headerTopScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 80,
    pointerEvents: 'none',
  },
});
