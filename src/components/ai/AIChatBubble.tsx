import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export function AIChatBubble({
  role,
  body,
  chips,
  onSelectChip,
}: {
  role: 'user' | 'ai';
  body: string;
  chips?: string[];
  onSelectChip?: (chip: string) => void;
}) {
  const { colors } = useTheme();
  const Sparkles = getIcon('Sparkles');
  const isUser = role === 'user';

  return (
    <View
      style={[
        styles.row,
        { justifyContent: isUser ? 'flex-end' : 'flex-start' },
      ]}
    >
      <View style={{ maxWidth: '85%' }}>
        {!isUser && (
          <View style={styles.aiBadge}>
            <LinearGradient
              colors={['rgba(244, 114, 182, 0.4)', 'rgba(59, 130, 246, 0.4)']}
              style={styles.sparkleBox}
            >
              <Sparkles size={11} color="#f472b6" strokeWidth={2.4} />
            </LinearGradient>
            <Text style={[styles.aiLabel, { color: colors.textTertiary }]}>
              Ekip Tactical AI
            </Text>
          </View>
        )}

        {isUser ? (
          <LinearGradient
            colors={['#f472b6', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.userBubble]}
          >
            <Text style={styles.userText}>{body}</Text>
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.bubble,
              styles.aiBubble,
              { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
            ]}
          >
            <Text style={[styles.aiText, { color: colors.textPrimary }]}>{body}</Text>
          </View>
        )}

        {chips && chips.length > 0 && onSelectChip && (
          <View style={styles.chipsRow}>
            {chips.map((chip) => (
              <TouchableOpacity
                key={chip}
                activeOpacity={0.75}
                onPress={() => onSelectChip(chip)}
                style={[
                  styles.chipBtn,
                  { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
                ]}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 16,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  sparkleBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  userText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
  aiText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    color: '#f472b6',
    fontSize: 11,
    fontWeight: '700',
  },
});
