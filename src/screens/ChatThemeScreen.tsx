// --- START OF FILE ChatThemeScreen.tsx ---

import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useChatTheme,
  useTheme,
  colors as themeColors,
  CHAT_THEMES,
  type ChatThemeId,
  spacing,
  radii,
  sharedStyles,
} from '../lib/theme';
import { GlassCard, GlassAvatar } from '../components/Glass';
import { getIcon } from '../lib/icons';
import { useI18n } from '../lib/i18n';
import { useToast } from '../lib/ToastContext';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';

interface ChatThemeScreenProps {
  onBack: () => void;
}

const Check = getIcon('Check');
const Palette = getIcon('Palette');

export function ChatThemeScreen({ onBack }: ChatThemeScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { chatTheme, setChatTheme } = useChatTheme();
  const { isRTL } = useI18n();
  const { showToast } = useToast();

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
          paddingHorizontal: spacing.screenPadding,
          paddingBottom: spacing.bottomNavClearance + insets.bottom,
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
            <View style={{ flexDirection: rowDir, alignItems: 'center', gap: spacing.md }}>
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
                { backgroundColor: colors.glassPillBg },
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
                    backgroundColor: colors.glassInputBg,
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
                <Text style={[styles.timestamp, { color: colors.white }]}>18:43</Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Theme List */}
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'تم‌های شیشه‌ای گفتگو' : 'AVAILABLE THEMES'}
        </Text>
        <View style={{ gap: spacing.sm }}>
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
                    isSelected && [styles.themeCardActive, { borderColor: colors.glassBorderActive }],
                  ]}
                >
                  <View style={[styles.swatchBox, { backgroundColor: item.accentHex }]}>
                    <Palette size={20} color={colors.white} />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: isRTL ? 0 : 14,
                      marginRight: isRTL ? 14 : 0,
                    }}
                  >
                    <View style={{ flexDirection: rowDir, alignItems: 'center', gap: spacing.sm }}>
                      <Text style={[styles.themeName, { color: colors.textPrimary, textAlign }]}>
                        {item.name}
                      </Text>
                      {isSelected && (
                        <View style={[styles.activePill, { backgroundColor: colors.glassPillBg }]}>
                          <Text style={[styles.activeText, { color: colors.brandPink }]}>
                            {isRTL ? 'فعال' : 'Active'}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.themeDesc, { color: colors.textSecondary, textAlign }]}>
                      {item.description}
                    </Text>
                  </View>
                  {isSelected && <Check size={18} color={colors.brandPink} />}
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
    ...sharedStyles.screenContainer,
  },
  content: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  previewCard: {
    padding: spacing.screenPadding,
    borderRadius: radii.xl,
    marginBottom: spacing.xl,
  },
  previewHeader: {
    ...sharedStyles.rowBetween,
    paddingBottom: spacing.md,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  bubblesContainer: {
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  incomingRow: {
    ...sharedStyles.row,
    alignItems: 'flex-end',
    gap: spacing.sm,
    maxWidth: '85%',
  },
  outgoingRow: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
  },
  incomingBubble: {
    borderBottomLeftRadius: radii.xxs,
  },
  outgoingBubble: {
    borderBottomRightRadius: radii.xxs,
  },
  senderName: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: spacing.xxs,
  },
  incomingText: {
    fontSize: 12,
    lineHeight: 17,
  },
  outgoingText: {
    fontSize: 12,
    color: themeColors.palette.white,
    lineHeight: 17,
  },
  timestamp: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  themeCard: {
    ...sharedStyles.row,
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  themeCardActive: {
    borderWidth: 1.5,
  },
  swatchBox: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeName: {
    fontSize: 15,
    fontWeight: '700',
  },
  themeDesc: {
    fontSize: 11,
    marginTop: spacing.xxs,
  },
  activePill: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radii.xs,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});