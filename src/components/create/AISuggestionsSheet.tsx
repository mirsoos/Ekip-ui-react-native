import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard, GlassButton } from '../Glass';
import { GlassSheet } from '../Overlays';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

interface Suggestion {
  text: string;
  applyTitle?: string;
  applyDescription?: string;
}

const suggestions: Suggestion[] = [
  {
    text: 'عنوانی خودمانی و جذاب مثل «دورهمی بوردگیم و کافه‌گردی آخر هفته»',
    applyTitle: 'دورهمی بوردگیم و کافه‌گردی آخر هفته',
  },
  {
    text: 'افزودن ۳ تا ۵ تگ مرتبط (مثل #کافه #بوردگیم #دورهمی) برای دیده شدن بهتر',
  },
  {
    text: 'مشخص کردن نام کافه یا آدرس دقیق برای ایجاد حس اعتماد در اعضا',
  },
  {
    text: 'تعیین بازه سنی متناسب با برنامه (مثلاً ۲۰ تا ۳۵ سال)',
  },
  {
    text: 'فعال‌سازی پذیرش خودکار برای پیوستن سریع و بدون معطلی بچه‌ها',
  },
];

export function AISuggestionsSheetComponent({
  open,
  onClose,
  onApplyTitle,
  onApplyDescription,
}: {
  open: boolean;
  onClose: () => void;
  onApplyTitle?: (title: string) => void;
  onApplyDescription?: (description: string) => void;
}) {
  const { colors } = useTheme();
  const Sparkles = getIcon('Sparkles');

  return (
    <GlassSheet open={open} onClose={onClose} title="پیشنهادات هوشمند ساخت اکیپ">
      <View style={{ gap: 10 }}>
        {suggestions.map((s, i) => (
          <GlassCard key={i} variant="thin" style={styles.card}>
            <View style={styles.iconBox}>
              <Sparkles size={16} color="#f472b6" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.text, { color: colors.textSecondary }]}>
                {s.text}
              </Text>
              {s.applyTitle && onApplyTitle && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    onApplyTitle(s.applyTitle!);
                    onClose();
                  }}
                  style={{ marginTop: 4 }}
                >
                  <Text style={styles.applyBtn}>اعمال این عنوان</Text>
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>
        ))}

        <View style={{ marginTop: 6 }}>
          <GlassButton fullWidth variant="secondary" onPress={onClose}>
            بستن
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
    textAlign: 'right',
  },
  applyBtn: {
    color: '#f472b6',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
});
