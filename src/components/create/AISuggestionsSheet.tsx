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
    text: 'افزودن عنوان تاکتیکی مانند "گشت شبانه در منطقه کوهستانی"',
    applyTitle: 'گشت شبانه در منطقه کوهستانی',
  },
  {
    text: 'مشخص کردن ۳ تا ۵ تگ تخصصی جهت تطبیق هوشمند اپراتورها',
  },
  {
    text: 'تعیین سطح آمادگی رزمی برای جذب اپراتورهای ارشد و باسابقه',
  },
  {
    text: 'ثبت دقیق مختصات و نام پایگاه استقرار جهت هماهنگی روان اعضا',
  },
  {
    text: 'فعال‌سازی پذیرش خودکار جهت استقرار فوری و بدون معطلی تیم',
  },
];

export function AISuggestionsSheet({
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
    <GlassSheet open={open} onClose={onClose} title="پیشنهادات هوش مصنوعی">
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
                  <Text style={styles.applyBtn}>اعمال این پیشنهاد</Text>
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
