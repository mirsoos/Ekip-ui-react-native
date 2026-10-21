import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, CHAT_THEMES, type ChatThemeId } from '../lib/theme';
import { GlassCard, GlassBackButton, GlassAvatar } from '../components/Glass';
import { Toast } from '../components/Overlays';
import { getIcon } from '../lib/icons';

interface ChatThemeScreenProps {
  onBack: () => void;
}

export function ChatThemeScreen({ onBack }: ChatThemeScreenProps) {
  const { chatTheme, setChatTheme } = useTheme();
  const [toastMsg, setToastMsg] = useState('');

  const Check = getIcon('Check');
  const Palette = getIcon('Palette');
  const Sparkles = getIcon('Sparkles');

  const selectedConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  const handleSelectTheme = (id: ChatThemeId) => {
    setChatTheme(id);
    setToastMsg(`Chat theme changed to ${CHAT_THEMES[id].name}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingTop: 84, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Live Preview Card */}
        <Text style={styles.sectionHeading}>LIVE CHAT PREVIEW</Text>
        <GlassCard variant="thick" style={styles.previewCard}>
          {/* Micro Chat Header */}
          <View style={styles.previewHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <GlassAvatar name="Alex Rivera" size={32} online />
              <View>
                <Text style={styles.previewSender}>Alpha Lead · Alex</Text>
                <Text style={styles.previewStatus}>Active now in Squad Chat</Text>
              </View>
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{selectedConfig.name}</Text>
            </View>
          </View>

          {/* Sample Messages */}
          <View style={styles.bubblesContainer}>
            {/* Incoming */}
            <View style={styles.incomingRow}>
              <GlassAvatar name="Alex Rivera" size={24} />
              <View style={[styles.bubble, styles.incomingBubble]}>
                <Text style={[styles.senderName, { color: selectedConfig.accentHex }]}>Alex Rivera</Text>
                <Text style={styles.incomingText}>Ready for tonight's mission briefing? Squad is ready! 🚀</Text>
                <Text style={styles.timestamp}>18:42</Text>
              </View>
            </View>

            {/* Outgoing */}
            <View style={styles.outgoingRow}>
              <View style={[styles.bubble, styles.outgoingBubble, { backgroundColor: selectedConfig.accentHex }]}>
                <Text style={styles.outgoingText}>Roger that! Telemetry synced. See you at briefing. 🔥</Text>
                <Text style={[styles.timestamp, { color: 'rgba(255,255,255,0.7)' }]}>18:43</Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Theme List */}
        <Text style={styles.sectionHeading}>AVAILABLE THEMES</Text>
        <View style={{ gap: 10 }}>
          {Object.values(CHAT_THEMES).map((item) => {
            const isSelected = chatTheme === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelectTheme(item.id)}
                activeOpacity={0.8}
              >
                <GlassCard
                  style={[
                    styles.themeCard,
                    isSelected && styles.themeCardActive,
                  ]}
                >
                  <View style={[styles.swatchBox, { backgroundColor: item.accentHex }]}>
                    <Palette size={20} color="#fff" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={styles.themeName}>{item.name}</Text>
                      {isSelected && (
                        <View style={styles.activePill}>
                          <Text style={styles.activeText}>Active</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.themeDesc}>{item.description}</Text>
                  </View>
                  {isSelected && <Check size={18} color="#ec4899" />}
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Toast message={toastMsg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  previewCard: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 20,
    minHeight: 180,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  previewSender: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  previewStatus: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '500',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  badgeText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  bubblesContainer: {
    marginTop: 16,
    gap: 12,
  },
  incomingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  outgoingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  incomingBubble: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderBottomLeftRadius: 4,
  },
  outgoingBubble: {
    borderBottomRightRadius: 4,
  },
  senderName: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  incomingText: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
  },
  outgoingText: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'right',
    marginTop: 4,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
  },
  themeCardActive: {
    borderColor: '#ec4899',
    backgroundColor: 'rgba(236,72,153,0.12)',
  },
  swatchBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  themeDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  activePill: {
    backgroundColor: 'rgba(236,72,153,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeText: {
    fontSize: 10,
    color: '#ec4899',
    fontWeight: '700',
  },
});
