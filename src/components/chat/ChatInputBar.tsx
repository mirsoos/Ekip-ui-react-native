import React, { useRef, useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FrostedGlass } from '../FrostedGlass';
import { getIcon } from '../../lib/icons';
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

  const handleChange = (text: string) => {
    if (!isControlled) setInternalText(text);
    controlledOnChange?.(text);
  };

  const handleSend = () => {
    if (!currentText.trim()) return;
    if (onSendMessage) {
      onSendMessage(currentText.trim());
      if (!isControlled) setInternalText('');
    } else if (onSend) {
      onSend();
    }
  };

  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();
  const SendIcon = getIcon('Send');

  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enterAnim.setValue(0);
    Animated.spring(enterAnim, {
      toValue: 1,
      bounciness: 4,
      speed: 14,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  const enterTranslateY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [85, 0],
  });

  return (
    <View
      style={[
        styles.outerContainer,
        {
          paddingBottom: Platform.OS === 'web' ? 10 : Math.max(10, insets.bottom + 6),
        },
      ]}
      pointerEvents="box-none"
    >
      <Animated.View
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
              },
            ]}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSend}
          disabled={!currentText.trim()}
          style={[styles.sendBtn, { opacity: currentText.trim() ? 1 : 0.4 }]}
        >
          <LinearGradient
            colors={['#f472b6', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sendGrad}
          >
            <SendIcon size={16} color="#ffffff" strokeWidth={2.6} />
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
    borderRadius: 19,
    overflow: 'hidden',
    zIndex: 10,
  },
  sendGrad: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
