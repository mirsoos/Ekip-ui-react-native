// --- START OF FILE ChatInputBar.tsx ---

import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform, Animated, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FrostedGlass } from '../FrostedGlass';
import { Icons } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export function ChatInputBarComponent({
  value: controlledValue,
  onChange: controlledOnChange,
  onSend,
  onSendMessage,
  placeholder = 'Type a message...',
}: {
  value?: string;
  onChange?: (val: string) => void;
  onSend?: () => void;
  onSendMessage?: (text: string) => void;
  placeholder?: string;
}) {
  const [internalText, setInternalText] = useState('');
  const isControlled = controlledValue !== undefined;
  const currentText = isControlled ? controlledValue : internalText;

  const handleChange = useCallback(
    (text: string) => {
      if (!isControlled) setInternalText(text);
      controlledOnChange?.(text);
    },
    [isControlled, controlledOnChange]
  );

  const handleSend = useCallback(() => {
    if (!currentText.trim()) return;
    if (onSendMessage) {
      onSendMessage(currentText.trim());
      if (!isControlled) setInternalText('');
    } else if (onSend) {
      onSend();
    }
  }, [currentText, isControlled, onSend, onSendMessage]);

  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      setKeyboardHeight(e?.endCoordinates?.height ?? 0);
    };
    const onHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const [enterAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    enterAnim.setValue(0);
    Animated.spring(enterAnim, {
      toValue: 1,
      bounciness: 4,
      speed: 14,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [enterAnim]);

  const enterTranslateY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [85, 0],
  });

  const hasText = Boolean(currentText.trim());

  return (
    <View
      style={[
        styles.outerContainer,
        {
          bottom: Platform.OS === 'ios' ? keyboardHeight : 0,
          paddingBottom:
            Platform.OS === 'web'
              ? 10
              : keyboardHeight > 0
              ? 8
              : Math.max(10, insets.bottom + 6),
        },
      ]}
      pointerEvents="box-none"
    >
      <Animated.View
        renderToHardwareTextureAndroid={true}
        style={[
          styles.dockContainer,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            borderColor: colors.glassBorderStrong,
            transform: [{ translateY: enterTranslateY }],
          },
        ]}
      >
        {/* 360° Frosted Glass */}
        <FrostedGlass
          borderRadius={36}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: isDark ? '#101625' : '#f0f4fa',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
        >
          <TextInput
            value={currentText}
            onChangeText={handleChange}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr',
              },
            ]}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSend}
          disabled={!hasText}
          style={[styles.sendBtn, { opacity: hasText ? 1 : 0.4 }]}
        >
          <LinearGradient
            colors={['#f472b6', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sendGrad}
          >
            <Icons.Send size={20} color="#ffffff" strokeWidth={2.4} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export const ChatInputBar = React.memo(ChatInputBarComponent);

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 6,
    zIndex: 900,
  },
  dockContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 36,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
          elevation: 14,
        }),
    overflow: 'visible',
  },
  inputBox: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    zIndex: 10,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 9 : 7,
    fontSize: 14,
  },
  sendBtn: {
    borderRadius: 21,
    overflow: 'hidden',
    zIndex: 10,
  },
  sendGrad: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});