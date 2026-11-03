// --- START OF FILE PlansScreen.tsx ---

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard, GlassButton } from '../components/Glass';
import { getIcon } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { useToast } from '../lib/ToastContext';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';

interface PlansScreenProps {
  onBack: () => void;
}

export function PlansScreenComponent({ onBack }: PlansScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const { showToast } = useToast();
  const Crown = getIcon('Crown');
  const Check = getIcon('Check');
  const Sparkles = getIcon('Sparkles');

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => {
      sub.remove();
    };
  }, [onBack]);

  const plans = isRTL
    ? [
        {
          id: 'free',
          name: 'کاربر عادی',
          price: 'رایگان',
          period: 'همیشگی',
          description: 'دسترسی استاندارد به دورهمی‌های عمومی و کشف اکیپ‌های اطراف',
          current: true,
          perks: [
            'عضویت در حداکثر ۵ اکیپ همزمان',
            'گفتگوی مستقیم با دوستان و اعضای اکیپ',
            'جستجوی دورهمی‌های اطراف تا شعاع ۱۵ کیلومتر',
            'شخصی‌سازی پایه پروفایل و علایق',
          ],
          color: '#3b82f6',
        },
        {
          id: 'pro',
          name: 'عضو طلایی (Ekip Pro)',
          price: '۶۹,۰۰۰ ت',
          period: 'ماهانه',
          description: 'امکانات ویژه برای میزبانان فعال، برگزارکنندگان ایونت و تفریحات',
          current: false,
          recommended: true,
          perks: [
            'ساخت و میزبانی نامحدود اکیپ‌ها و دورهمی‌ها',
            'پین شدن و اولویت نمایش در صفحه کاوش',
            'نشان طلایی در پروفایل و کنار نام در چت',
            'پوسته‌های شیشه‌ای اختصاصی چت و نشان‌های خاص',
            'دسترسی کامل به دستیار هوشمند برنامه‌ریزی',
          ],
          color: '#ec4899',
        },
        {
          id: 'elite',
          name: 'میزبان ویژه (Ekip VIP)',
          price: '۱۴۹,۰۰۰ ت',
          period: 'ماهانه',
          description: 'بالاترین سطح دسترسی برای برگزارکنندگان رویدادهای بزرگ و کافه‌ها',
          current: false,
          perks: [
            'تمامی امکانات سطح عضو طلایی',
            'تیک رسمی تایید هویت و اصالت حساب',
            'محدوده جستجوی نامحدود در تمام شهرهای کشور',
            'تخفیف‌های اختصاصی کافه‌ها و بوردگیم‌های همکار',
            'پشتیبانی اختصاصی و اولویت در پیشنهادات هفتگی',
          ],
          color: '#f59e0b',
        },
      ]
    : [
        {
          id: 'free',
          name: 'Standard',
          price: '$0',
          period: 'forever',
          description: 'Standard access to public hangouts and nearby discovery',
          current: true,
          perks: [
            'Join up to 5 concurrent Ekips',
            'Direct messaging with friends & members',
            'Discovery range up to 15km',
            'Basic profile & interests setup',
          ],
          color: '#3b82f6',
        },
        {
          id: 'pro',
          name: 'Ekip Pro',
          price: '$4.99',
          period: 'month',
          description: 'Advanced perks for community hosts and active event planners',
          current: false,
          recommended: true,
          perks: [
            'Unlimited active Ekip hosting',
            'Priority placement on Discover feed',
            'Golden badge on profile & chats',
            'Custom glass themes and exclusive stickers',
            'Unlimited AI Assistant hangout planner',
          ],
          color: '#ec4899',
        },
        {
          id: 'elite',
          name: 'Ekip VIP',
          price: '$9.99',
          period: 'month',
          description: 'Top tier for premier organizers, communities & cafes',
          current: false,
          perks: [
            'All Ekip Pro features included',
            'Official verified blue checkmark',
            'Nationwide discovery without radius limits',
            'Exclusive cafe partner discounts',
            'VIP priority support line',
          ],
          color: '#f59e0b',
        },
      ];

  const rowDir = isRTL ? ('row-reverse' as const) : ('row' as const);
  const textAlign = isRTL ? ('right' as const) : ('left' as const);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            alignItems: 'center',
            paddingTop: getSinglePillContentPaddingTop(insets.top),
            paddingBottom: 40 + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Info */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Crown size={32} color="#ec4899" strokeWidth={2.4} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {isRTL ? 'ارتقای حساب کاربری' : 'Upgrade Membership'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isRTL
              ? 'با پلن‌های ویژه اکیپ، دورهمی‌های پرطرفدارتری بسازید و از امکانات اختصاصی لذت ببرید.'
              : 'Unlock premium perks, host unlimited hangouts, and stand out in your city.'}
          </Text>
        </View>

        {/* Plans List */}
        <View style={styles.plansList}>
          {plans.map((p) => (
            <GlassCard
              key={p.id}
              glow={p.recommended}
              style={[
                styles.planCard,
                p.recommended && styles.recommendedCard,
              ]}
            >
              {p.recommended && (
                <View
                  style={[
                    styles.recommendedBadge,
                    isRTL ? { left: 14 } : { right: 14 },
                    { flexDirection: rowDir },
                  ]}
                >
                  <Sparkles size={12} color="#ffffff" strokeWidth={2.5} />
                  <Text style={styles.recommendedBadgeText}>
                    {isRTL ? 'پیشنهاد ویژه' : 'POPULAR'}
                  </Text>
                </View>
              )}

              <View style={[styles.planHeader, p.recommended && { marginTop: 18 }]}>
                <View>
                  <Text style={[styles.planName, { color: colors.textPrimary, textAlign }]}>
                    {p.name}
                  </Text>
                  <Text style={[styles.planDesc, { color: colors.textSecondary, textAlign }]}>
                    {p.description}
                  </Text>
                </View>
                <View style={[styles.priceContainer, { flexDirection: rowDir }]}>
                  <Text style={[styles.priceText, { color: p.color }]}>
                    {p.price}
                  </Text>
                  <Text style={[styles.periodText, { color: colors.textTertiary }]}>
                    / {p.period}
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.divider }]} />

              {/* Perks */}
              <View style={styles.perksList}>
                {p.perks.map((perk, idx) => (
                  <View key={idx} style={[styles.perkItem, { flexDirection: rowDir }]}>
                    <View style={[styles.checkCircle, { backgroundColor: `${p.color}20` }]}>
                      <Check size={12} color={p.color} strokeWidth={3} />
                    </View>
                    <Text style={[styles.perkText, { color: colors.textPrimary, textAlign }]}>
                      {perk}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.actionContainer}>
                <GlassButton
                  variant={p.current ? 'secondary' : p.recommended ? 'primary' : 'secondary'}
                  fullWidth
                  onPress={() => {
                    if (p.current) {
                      showToast(
                        isRTL
                          ? 'این پلن در حال حاضر برای شما فعال است'
                          : 'You are currently on this tier'
                      );
                    } else {
                      showToast(
                        isRTL
                          ? `درخواست ارتقا به ${p.name} ثبت شد`
                          : `Upgrade requested for ${p.name}`
                      );
                    }
                  }}
                >
                  {p.current
                    ? isRTL
                      ? 'پلن فعلی شما'
                      : 'Current Tier'
                    : isRTL
                    ? `انتخاب ${p.name}`
                    : `Select ${p.name}`}
                </GlassButton>
              </View>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export const PlansScreen = React.memo(PlansScreenComponent);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    maxWidth: 420,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  plansList: {
    width: '100%',
    maxWidth: 460,
    gap: 16,
  },
  planCard: {
    padding: 20,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  recommendedCard: {
    borderColor: 'rgba(236, 72, 153, 0.4)',
    borderWidth: 1.5,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ec4899',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  recommendedBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planHeader: {
    marginTop: 6,
    marginBottom: 14,
  },
  planName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  planDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceText: {
    fontSize: 26,
    fontWeight: '900',
  },
  periodText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginBottom: 14,
  },
  perksList: {
    gap: 10,
    marginBottom: 18,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: {
    fontSize: 13,
    flex: 1,
  },
  actionContainer: {
    marginTop: 4,
  },
});