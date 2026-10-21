import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export function ChatInputBar({
  value,
  onChange,
  onSend,
  placeholder = 'Type a message...',
}: {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  placeholder?: string;
}) {
  const { colors, isDark } = useTheme();
  const SendIcon = getIcon('Send');

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View
        style={[
          styles.dockContainer,
          {
            borderColor: colors.glassBorderStrong,
          },
        ]}
      >
        {/* 360° Liquid Glass Lens */}
        <LiquidLens
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
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            style={[styles.input, { color: colors.textPrimary }]}
            onSubmitEditing={onSend}
            returnKeyType="send"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onSend}
          disabled={!value.trim()}
          style={[styles.sendBtn, { opacity: value.trim() ? 1 : 0.4 }]}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
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
