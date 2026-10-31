import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatTheme, CHAT_THEMES, type ChatThemeId } from '../lib/theme';
import { GlassCard, GlassAvatar } from '../components/Glass';
import { Toast } from '../components/Overlays';
import { getIcon } from '../lib/icons';
import { useI18n } from '../lib/i18n';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';

interface ChatThemeScreenProps {
  onBack: () => void;
}

export function ChatThemeScreen({ onBack }: ChatThemeScreenProps) {
  const insets = useSafeAreaInsets();
  const { chatTheme, setChatTheme } = useChatTheme();
  const { isRTL } = useI18n();
  const [toastMsg, setToastMsg] = useState('');

  const Check = getIcon('Check');
  const Palette = getIcon('Palette');

  const selectedConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  const handleSelectTheme = (id: ChatThemeId) => {
    setChatTheme(id);
    setToastMsg(isRTL ? `تم چت به «${CHAT_THEMES[id].name}» تغییر یافت` : `Chat theme changed to ${CHAT_THEMES[id].name}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          paddingTop: getSinglePillContentPaddingTop(insets.top),
          paddingBottom: 60 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Preview Card */}
        <Text style={styles.sectionHeading}>
          {isRTL ? 'پیش‌نمایش زنده گفتگو' : 'LIVE CHAT PREVIEW'}
        </Text>
        <GlassCard variant="thick" style={styles.previewCard}>
          {/* Micro Chat Header */}
          <View style={styles.previewHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <GlassAvatar name={isRTL ? 'النا روستوا' : 'Alex Rivera'} size={32} online />
              <View>
                <Text style={styles.previewSender}>
                  {isRTL ? 'سرگروه آلفا · النا' : 'Alpha Lead · Alex'}
                </Text>
                <Text style={styles.previewStatus}>
                  {isRTL ? 'اکنون فعال در کانال اکیپ' : 'Active now in Squad Chat'}
                </Text>
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
              <GlassAvatar name={isRTL ? 'النا روستوا' : 'Alex Rivera'} size={24} />
              <View style={[styles.bubble, styles.incomingBubble]}>
                <Text style={[styles.senderName, { color: selectedConfig.accentHex }]}>
                  {isRTL ? 'النا روستوا' : 'Alex Rivera'}
                </Text>
                <Text style={styles.incomingText}>
                  {isRTL
                    ? 'برای جلسه توجیهی عملیات آماده‌ای؟ اعضای تیم منتظرند! 🚀'
                    : "Ready for tonight's mission briefing? Squad is ready! 🚀"}
                </Text>
                <Text style={styles.timestamp}>18:42</Text>
              </View>
            </View>

            {/* Outgoing */}
            <View style={styles.outgoingRow}>
              <View style={[styles.bubble, styles.outgoingBubble, { backgroundColor: selectedConfig.accentHex }]}>
                <Text style={styles.outgoingText}>
                  {isRTL
                    ? 'دریافت شد! تله‌متری هماهنگ است. در جلسه می‌بینمت. 🔥'
                    : 'Roger that! Telemetry synced. See you at briefing. 🔥'}
                </Text>
                <Text style={[styles.timestamp, { color: 'rgba(255,255,255,0.7)' }]}>18:43</Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Theme List */}
        <Text style={styles.sectionHeading}>
          {isRTL ? 'تم‌های شیشه‌ای گفتگو' : 'AVAILABLE THEMES'}
        </Text>
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
                          <Text style={styles.activeText}>
                            {isRTL ? 'فعال' : 'Active'}
                          </Text>
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

      <Toast message={toastMsg} visible={Boolean(toastMsg)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  previewStatus: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  bubblesContainer: {
    paddingTop: 14,
    gap: 12,
  },
  incomingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '85%',
  },
  outgoingRow: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 18,
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
    fontSize: 12,
    color: '#fff',
    lineHeight: 17,
  },
  outgoingText: {
    fontSize: 12,
    color: '#fff',
    lineHeight: 17,
  },
  timestamp: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
  },
  themeCardActive: {
    borderColor: '#ec4899',
    borderWidth: 1.5,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(236,72,153,0.2)',
  },
  activeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ec4899',
  },
});
