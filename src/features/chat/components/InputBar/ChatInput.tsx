import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import { KeyboardController } from 'react-native-keyboard-controller';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Paperclip, X, CornerUpLeft } from 'lucide-react-native';
import { FrostedGlass } from '../../../../components/FrostedGlass';
import { SendButton } from './SendButton';
import { AttachmentPicker } from './AttachmentPicker';
import { AudioRecorder } from '../VoiceNote/AudioRecorder';
import { draftStorage } from '../../lib/draftStorage';
import { useTheme, useChatTheme, CHAT_THEMES } from '../../../../lib/theme';
import { useI18n } from '../../../../lib/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Message, Attachment } from '../../types/chat.types';

export interface ChatInputProps {
  conversationId?: string;
  onSendMessage: (text: string, attachments?: Attachment[]) => void;
  replyingTo: Message | null;
  onClearReply: () => void;
  placeholder?: string;
  isAttachmentPickerOpen?: boolean;
  onSetAttachmentPickerOpen?: (open: boolean) => void;
  onTyping?: (action: 'typing' | null) => void;
  bottomInsetAnimatedStyle?: any;
}

export const ChatInput = React.memo(function ChatInput({
  conversationId = 'default_chat',
  onSendMessage,
  replyingTo,
  onClearReply,
  placeholder = 'Type a message...',
  isAttachmentPickerOpen = false,
  onSetAttachmentPickerOpen,
  onTyping,
  bottomInsetAnimatedStyle,
}: ChatInputProps) {
  const { colors, isDark } = useTheme();
  const { chatTheme } = useChatTheme();
  const { isRTL, t } = useI18n();
  const insets = useSafeAreaInsets();
  const themeConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  // Restore draft instantly from MMKV-compatible storage
  const [text, setText] = useState<string>(() => draftStorage.getDraft(conversationId));
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [inputHeight, setInputHeight] = useState<number>(38);
  const [localPickerOpen, setLocalPickerOpen] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  // Default is ALWAYS 'send' mode
  const [inputMode, setInputMode] = useState<'send' | 'voice'>('send');

  const hasText = text.trim().length > 0 || attachments.length > 0;
  const isSendVisible = hasText || inputMode === 'send';
  const sendOpacity = useSharedValue(isSendVisible ? 1 : 0);
  const micOpacity = useSharedValue(isSendVisible ? 0 : 1);

  useEffect(() => {
    sendOpacity.value = withTiming(isSendVisible ? 1 : 0, {
      duration: 150,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    micOpacity.value = withTiming(isSendVisible ? 0 : 1, {
      duration: 150,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isSendVisible, sendOpacity, micOpacity]);

  const sendAnimStyle = useAnimatedStyle(() => ({
    opacity: sendOpacity.value,
  }));

  const micAnimStyle = useAnimatedStyle(() => ({
    opacity: micOpacity.value,
  }));

  const inputRef = useRef<any>(null);
  const draftSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingThrottleRef = useRef<number>(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-restore draft if conversationId changes
  useEffect(() => {
    const saved = draftStorage.getDraft(conversationId);
    setText(saved);
  }, [conversationId]);

  // Debounced draft auto-save
  const handleTextChange = useCallback(
    (newText: string) => {
      setText(newText);
      if (newText.length === 0) {
        setInputHeight(38);
      }
      if (newText.trim().length > 0 && inputMode !== 'send') {
        setInputMode('send');
      }

      if (draftSaveTimeoutRef.current) {
        clearTimeout(draftSaveTimeoutRef.current);
      }
      draftSaveTimeoutRef.current = setTimeout(() => {
        draftStorage.saveDraft(conversationId, newText);
      }, 300);

      // Debounced typing event emission (every 2s while actively typing)
      const now = Date.now();
      if (now - typingThrottleRef.current > 2000) {
        typingThrottleRef.current = now;
        onTyping?.('typing');
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        onTyping?.(null);
      }, 3000);
    },
    [conversationId, onTyping, inputMode]
  );

  const pickerVisible =
    onSetAttachmentPickerOpen !== undefined ? isAttachmentPickerOpen : localPickerOpen;
  const setPickerVisible = useCallback(
    (open: boolean) => {
      if (onSetAttachmentPickerOpen) {
        onSetAttachmentPickerOpen(open);
      } else {
        setLocalPickerOpen(open);
      }
    },
    [onSetAttachmentPickerOpen]
  );

  // Keyboard Dismissal on Attachment click
  const handleOpenAttachment = useCallback(() => {
    Keyboard.dismiss();
    try {
      KeyboardController.dismiss();
    } catch {}

    let presented = false;
    const showPicker = () => {
      if (!presented) {
        presented = true;
        setPickerVisible(true);
      }
    };

    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    let timer: ReturnType<typeof setTimeout> | null = null;
    const sub = Keyboard.addListener(hideEvent, () => {
      if (timer) clearTimeout(timer);
      sub.remove();
      showPicker();
    });

    timer = setTimeout(() => {
      sub.remove();
      showPicker();
    }, 120);
  }, [setPickerVisible]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;

    // 1. Cancel pending draft auto-save timer IMMEDIATELY to prevent resurrecting sent text
    if (draftSaveTimeoutRef.current) {
      clearTimeout(draftSaveTimeoutRef.current);
      draftSaveTimeoutRef.current = null;
    }

    // 2. Clear persistent draft in storage
    draftStorage.clearDraft(conversationId);

    // 3. Clear local state and text input
    setText('');
    inputRef.current?.clear?.();
    setAttachments([]);
    setInputHeight(38);

    onSendMessage(trimmed, attachments.length > 0 ? attachments : undefined);
    onTyping?.(null);
    onClearReply?.();
  }, [text, attachments, onSendMessage, conversationId, onTyping, onClearReply]);

  const handleSendVoiceNote = useCallback(
    (voiceAttachment: Attachment) => {
      onSendMessage('', [voiceAttachment]);
    },
    [onSendMessage]
  );

  const handleSendPress = useCallback(() => {
    if (hasText) {
      handleSend();
    } else {
      // User requested: "اگر متن خالی بود و روی دکمه send تاچ کرد سوییچ میشه روی voice"
      setInputMode('voice');
    }
  }, [hasText, handleSend]);

  const handleSwitchToSend = useCallback(() => {
    setInputMode('send');
  }, []);

  // Web keyboard shortcuts: Enter sends, Shift+Enter newlines
  const handleKeyPress = useCallback(
    (e: any) => {
      if (Platform.OS === 'web') {
        const nativeEvent = (e?.nativeEvent || e) as KeyboardEvent;
        if (nativeEvent.key === 'Enter' && !nativeEvent.shiftKey) {
          e.preventDefault?.();
          handleSend();
        }
      }
    },
    [handleSend]
  );

  const handleAddAttachment = useCallback((att: Attachment) => {
    setAttachments((prev) => [...prev, att]);
  }, []);

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Dynamic line & height calculation for flawless multiline display
  const lineCount = text ? text.split('\n').length : 1;
  const isLineBreak = lineCount > 1;
  const estimatedLineHeight = 22;
  const verticalPadding = Platform.OS === 'ios' ? 16 : 14;
  const heightForLines = lineCount * estimatedLineHeight + verticalPadding;
  const computedHeight = text.trim().length === 0
    ? 38
    : Math.max(inputHeight, isLineBreak ? heightForLines : 38);
  const effectiveHeight = Math.max(38, Math.min(128, computedHeight));
  const isMultiline = isLineBreak || effectiveHeight > 42;

  return (
    <View
      style={[
        styles.outerContainer,
        { paddingBottom: Math.max(6, insets.bottom) + 2 },
      ]}
      pointerEvents="box-none"
    >
      {/* 1. Reply to message banner preview with Reanimated entrance & exit */}
      {replyingTo && (
        <Animated.View
          entering={SlideInDown.duration(150)}
          exiting={SlideOutDown.duration(150)}
          style={styles.replyBannerWrapper}
        >
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            style={[
              styles.replyBanner,
              {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: themeConfig.accentHex + '4D',
              },
            ]}
          >
            <View style={[styles.replyBar, { backgroundColor: themeConfig.accentHex }]} />
            <View style={styles.replyContent}>
              <View style={styles.replyHeaderRow}>
                <CornerUpLeft size={12} color={themeConfig.accentHex} />
                <Text style={[styles.replyAuthor, { color: themeConfig.accentHex }]} numberOfLines={1}>
                  Reply to {replyingTo.sender.name || 'User'}
                </Text>
              </View>
              <Text style={[styles.replyPreviewText, { color: colors.textSecondary }]} numberOfLines={1}>
                {replyingTo.attachments?.length
                  ? '📷 Photo'
                  : replyingTo.text || 'Message'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClearReply} style={styles.closeReplyBtn} activeOpacity={0.7}>
              <X size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}

      {/* 2. Staged attachments preview tray */}
      {attachments.length > 0 && (
        <View style={styles.attachmentTray}>
          {attachments.map((item) => (
            <View key={item.id} style={styles.trayItem}>
              {item.type === 'image' ? (
                <Image source={{ uri: item.url }} style={styles.trayImage} />
              ) : (
                <View style={styles.trayFallback}>
                  <Text style={styles.trayFallbackText}>📎 {item.type}</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => handleRemoveAttachment(item.id)}
                style={styles.trayRemoveBtn}
                activeOpacity={0.7}
              >
                <X size={12} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* 3. Floating 360° Frosted Glass Dock Container (matching AIAssistant ChatInputBar) */}
      <View
        style={[
          styles.dockContainer,
          {
            borderColor: colors.glassBorderStrong,
            borderRadius: isMultiline ? 24 : 36,
          },
        ]}
      >
        <FrostedGlass
          borderRadius={isMultiline ? 24 : 36}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.40)' : 'rgba(255, 255, 255, 0.45)' },
          ]}
        />

        {/* Attachment Picker button */}
        {!isRecordingVoice && (
          <TouchableOpacity
            onPress={handleOpenAttachment}
            style={[
              styles.attachBtn,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
              },
            ]}
            activeOpacity={0.75}
          >
            <Paperclip size={19} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Text Input Box */}
        {!isRecordingVoice && (
          <View
            style={[
              styles.inputBox,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                borderRadius: isMultiline ? 18 : 22,
                justifyContent: isMultiline ? 'flex-start' : 'center',
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={handleTextChange}
              placeholder={placeholder || t('chat.transmitDispatch') || (isRTL ? 'پیام خود را بنویسید...' : 'Type a message...')}
              placeholderTextColor={colors.textTertiary}
              multiline
              blurOnSubmit={false}
              enablesReturnKeyAutomatically
              underlineColorAndroid="transparent"
              onKeyPress={handleKeyPress}
              onContentSizeChange={(e) => {
                const height = e.nativeEvent.contentSize.height;
                if (height > 0) {
                  setInputHeight(Math.max(38, Math.min(128, height)));
                }
              }}
              scrollEnabled={effectiveHeight >= 126 || lineCount > 4}
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  textAlign: isRTL ? 'right' : 'left',
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                  height: effectiveHeight,
                },
              ]}
            />
          </View>
        )}

        {/* Action button container: Send Button on the right */}
        <View
          style={
            isRecordingVoice
              ? styles.recordingRowContainer
              : styles.actionBtnContainer
          }
        >
          <Animated.View
            pointerEvents={isSendVisible && !isRecordingVoice ? 'auto' : 'none'}
            style={[StyleSheet.absoluteFill, styles.centerBtn, sendAnimStyle]}
          >
            <SendButton
              onPress={handleSendPress}
              disabled={isRecordingVoice}
              accentColor={themeConfig.accentHex}
            />
          </Animated.View>
          <Animated.View
            pointerEvents={!isSendVisible || isRecordingVoice ? 'auto' : 'none'}
            style={[
              StyleSheet.absoluteFill,
              !isRecordingVoice && styles.centerBtn,
              micAnimStyle,
            ]}
          >
            <AudioRecorder
              onSendVoiceNote={handleSendVoiceNote}
              onStartRecording={() => onTyping?.('recording_voice' as any)}
              onCancelRecording={() => onTyping?.(null)}
              onRecordingStateChange={setIsRecordingVoice}
              onTapSwitchToSend={handleSwitchToSend}
              accentColor={themeConfig.accentHex}
            />
          </Animated.View>
        </View>
      </View>

      {/* Attachment Picker Modal */}
      <AttachmentPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelectAttachment={handleAddAttachment}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  replyBannerWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  replyBar: {
    width: 3,
    height: '100%',
    backgroundColor: '#38bdf8',
    borderRadius: 2,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38bdf8',
  },
  replyPreviewText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 1,
  },
  closeReplyBtn: {
    padding: 4,
    marginLeft: 8,
  },
  attachmentTray: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  trayItem: {
    width: 54,
    height: 54,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  trayImage: {
    width: '100%',
    height: '100%',
  },
  trayFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trayFallbackText: {
    fontSize: 10,
    color: '#cbd5e1',
  },
  trayRemoveBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dockContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 36,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.35,
        shadowRadius: 28,
      },
      android: {
        elevation: 0,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.35,
        shadowRadius: 28,
        elevation: 14,
      },
    }),
    overflow: 'visible',
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    zIndex: 10,
  },
  inputBox: {
    flex: 1,
    borderWidth: 1,
    zIndex: 10,
    minHeight: 38,
    maxHeight: 130,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'ios' ? 8 : 6,
    paddingBottom: Platform.OS === 'ios' ? 8 : 6,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
  actionBtnContainer: {
    width: 44,
    height: 44,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    zIndex: 10,
  },
  recordingRowContainer: {
    flex: 1,
    height: 44,
    position: 'relative',
    justifyContent: 'center',
    zIndex: 10,
  },
  centerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
