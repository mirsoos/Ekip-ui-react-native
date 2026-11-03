// --- START OF FILE ChatThemeScreen.tsx ---

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatTheme, useTheme, CHAT_THEMES, type ChatThemeId } from '../lib/theme';
import { GlassCard, GlassAvatar } from '../components/Glass';
import { getIcon } from '../lib/icons';
import { useI18n } from '../lib/i18n';
import { useToast } from '../lib/ToastContext';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';

interface ChatThemeScreenProps {
  onBack: () => void;
}

export function ChatThemeScreen({ onBack }: ChatThemeScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { chatTheme, setChatTheme } = useChatTheme();
  const { isRTL } = useI18n();
  const { showToast } = useToast();

  const Check = getIcon('Check');
  const Palette = getIcon('Palette');

  const selectedConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => {
      sub.remove();
    };
  }, [onBack]);

  const handleSelectTheme = useCallback(
    (id: ChatThemeId) => {
      setChatTheme(id);
      showToast(
        isRTL
          ? `تم چت به «${CHAT_THEMES[id].name}» تغییر یافت`
          : `Chat theme changed to ${CHAT_THEMES[id].name}`
      );
    },
    [isRTL, setChatTheme, showToast]
  );

  const rowDir = isRTL ? ('row-reverse' as const) : ('row' as const);
  const textAlign = isRTL ? ('right' as const) : ('left' as const);

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
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'پیش‌نمایش زنده گفتگو' : 'LIVE CHAT PREVIEW'}
        </Text>
        <GlassCard variant="thick" style={styles.previewCard}>
          {/* Micro Chat Header */}
          <View
            style={[
              styles.previewHeader,
              { flexDirection: rowDir, borderBottomColor: colors.divider },
            ]}
          >
            <View style={{ flexDirection: rowDir, alignItems: 'center', gap: 10 }}>
              <GlassAvatar name={isRTL ? 'النا روستوا' : 'Alex Rivera'} size={32} online />
              <View>
                <Text style={[styles.previewSender, { color: colors.textPrimary, textAlign }]}>
                  {isRTL ? 'سرگروه آلفا · النا' : 'Alpha Lead · Alex'}
                </Text>
                <Text style={[styles.previewStatus, { color: colors.textTertiary, textAlign }]}>
                  {isRTL ? 'اکنون فعال در کانال اکیپ' : 'Active now in Squad Chat'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.badgePill,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)' },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.textPrimary }]}>
                {selectedConfig.name}
              </Text>
            </View>
          </View>

          {/* Sample Messages */}
          <View style={styles.bubblesContainer}>
            {/* Incoming */}
            <View style={[styles.incomingRow, { flexDirection: rowDir }]}>
              <GlassAvatar name={isRTL ? 'النا روستوا' : 'Alex Rivera'} size={24} />
              <View
                style={[
                  styles.bubble,
                  styles.incomingBubble,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)',
                  },
                ]}
              >
                <Text style={[styles.senderName, { color: selectedConfig.accentHex, textAlign }]}>
                  {isRTL ? 'النا روستوا' : 'Alex Rivera'}
                </Text>
                <Text style={[styles.incomingText, { color: colors.textPrimary, textAlign }]}>
                  {isRTL
                    ? 'برای جلسه توجیهی عملیات آماده‌ای؟ اعضای تیم منتظرند! 🚀'
                    : "Ready for tonight's mission briefing? Squad is ready! 🚀"}
                </Text>
                <Text style={[styles.timestamp, { color: colors.textTertiary }]}>18:42</Text>
              </View>
            </View>

            {/* Outgoing */}
            <View style={styles.outgoingRow}>
              <View
                style={[
                  styles.bubble,
                  styles.outgoingBubble,
                  { backgroundColor: selectedConfig.accentHex },
                ]}
              >
                <Text style={[styles.outgoingText, { textAlign }]}>
                  {isRTL
                    ? 'دریافت شد! تله‌متری هماهنگ است. در جلسه می‌بینمت. 🔥'
                    : 'Roger that! Telemetry synced. See you at briefing. 🔥'}
                </Text>
                <Text style={[styles.timestamp, { color: 'rgba(255,255,255,0.75)' }]}>18:43</Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Theme List */}
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
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
                    { flexDirection: rowDir },
                    isSelected && styles.themeCardActive,
                  ]}
                >
                  <View style={[styles.swatchBox, { backgroundColor: item.accentHex }]}>
                    <Palette size={20} color="#fff" />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: isRTL ? 0 : 14,
                      marginRight: isRTL ? 14 : 0,
                    }}
                  >
                    <View style={{ flexDirection: rowDir, alignItems: 'center', gap: 8 }}>
                      <Text style={[styles.themeName, { color: colors.textPrimary, textAlign }]}>
                        {item.name}
                      </Text>
                      {isSelected && (
                        <View style={styles.activePill}>
                          <Text style={styles.activeText}>
                            {isRTL ? 'فعال' : 'Active'}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.themeDesc, { color: colors.textSecondary, textAlign }]}>
                      {item.description}
                    </Text>
                  </View>
                  {isSelected && <Check size={18} color="#ec4899" />}
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
    letterSpacing: 1,
    marginBottom: 8,
    marginHorizontal: 4,
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
  },
  previewSender: {
    fontSize: 13,
    fontWeight: '700',
  },
  previewStatus: {
    fontSize: 10,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
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
    lineHeight: 17,
  },
  outgoingText: {
    fontSize: 12,
    color: '#fff',
    lineHeight: 17,
  },
  timestamp: {
    fontSize: 9,
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
  },
  themeDesc: {
    fontSize: 11,
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