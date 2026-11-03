// --- START OF FILE AISuggestionsSheet.tsx ---

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard, GlassButton } from '../Glass';
import { GlassSheet } from '../Overlays';
import { AiEkipLogo } from '../common/AiEkipLogo';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

interface Suggestion {
  textFa: string;
  textEn: string;
  applyTitleFa?: string;
  applyTitleEn?: string;
}

const suggestions: Suggestion[] = [
  {
    textFa: 'عنوانی خودمانی و جذاب مثل «دورهمی بوردگیم و کافه‌گردی آخر هفته»',
    textEn: 'Use a catchy title like "Weekend Boardgame & Cafe Hangout"',
    applyTitleFa: 'دورهمی بوردگیم و کافه‌گردی آخر هفته',
    applyTitleEn: 'Weekend Boardgame & Cafe Hangout',
  },
  {
    textFa: 'افزودن ۳ تا ۵ تگ مرتبط (مثل #کافه #بوردگیم #دورهمی) برای دیده شدن بهتر',
    textEn: 'Add 3 to 5 relevant tags (e.g., #cafe #boardgames) for better visibility',
  },
  {
    textFa: 'مشخص کردن نام کافه یا آدرس دقیق برای ایجاد حس اعتماد در اعضا',
    textEn: 'Specify the exact venue name or neighborhood to build trust',
  },
  {
    textFa: 'تعیین بازه سنی متناسب با برنامه (مثلاً ۲۰ تا ۳۵ سال)',
    textEn: 'Set an appropriate age range for the activity (e.g., 20 to 35)',
  },
  {
    textFa: 'فعال‌سازی پذیرش خودکار برای پیوستن سریع و بدون معطلی بچه‌ها',
    textEn: 'Enable Auto-Accept so members can join immediately without waiting',
  },
];

export function AISuggestionsSheetComponent({
  open,
  onClose,
  onApplyTitle,
}: {
  open: boolean;
  onClose: () => void;
  onApplyTitle?: (title: string) => void;
  onApplyDescription?: (description: string) => void;
}) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const rowDir = isRTL ? ('row-reverse' as const) : ('row' as const);
  const textAlign = isRTL ? ('right' as const) : ('left' as const);

  return (
    <GlassSheet
      open={open}
      onClose={onClose}
      title={isRTL ? 'پیشنهادات هوشمند ساخت اکیپ' : 'AI Ekip Suggestions'}
    >
      <View style={{ gap: 10 }}>
        {suggestions.map((s, i) => {
          const titleToApply = isRTL ? s.applyTitleFa : s.applyTitleEn;
          return (
            <GlassCard key={i} variant="thin" style={[styles.card, { flexDirection: rowDir }]}>
              <View style={styles.iconBox}>
                <AiEkipLogo size={22} />
              </View>
              <View
                style={{
                  flex: 1,
                  marginLeft: isRTL ? 0 : 10,
                  marginRight: isRTL ? 10 : 0,
                }}
              >
                <Text style={[styles.text, { color: colors.textSecondary, textAlign }]}>
                  {isRTL ? s.textFa : s.textEn}
                </Text>
                {titleToApply && onApplyTitle && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      onApplyTitle(titleToApply);
                      onClose();
                    }}
                    style={{ marginTop: 4, alignSelf: isRTL ? 'flex-end' : 'flex-start' }}
                  >
                    <Text style={[styles.applyBtn, { textAlign }]}>
                      {isRTL ? 'اعمال این عنوان' : 'Apply this title'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </GlassCard>
          );
        })}

        <View style={{ marginTop: 6 }}>
          <GlassButton fullWidth variant="secondary" onPress={onClose}>
            {isRTL ? 'بستن' : 'Close'}
          </GlassButton>
        </View>
      </View>
    </GlassSheet>
  );
}

export const AISuggestionsSheet = React.memo(AISuggestionsSheetComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 18,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(244, 114, 182, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    lineHeight: 18,
  },
  applyBtn: {
    color: '#f472b6',
    fontSize: 11,
    fontWeight: '700',
  },
});