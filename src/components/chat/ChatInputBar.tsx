import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const { colors } = useTheme();
  const SendIcon = getIcon('Send');

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.glassThickBg,
            borderColor: colors.glassBorder,
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
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendBtn: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  sendGrad: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
