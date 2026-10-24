import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GlassCard, GlassButton } from '../components/Glass';
import { Toast } from '../components/Overlays';
import { getIcon } from '../lib/icons';
import { useI18n } from '../lib/i18n';

interface PlansScreenProps {
  onBack: () => void;
}

export function PlansScreen({ onBack }: PlansScreenProps) {
  const { isRTL } = useI18n();
  const Crown = getIcon('Crown');
  const Check = getIcon('Check');
  const Sparkles = getIcon('Sparkles');

  const [toastMessage, setToastMessage] = useState('');

  const plans = isRTL
    ? [
        {
          id: 'free',
          name: 'نیروی عملیاتی',
          price: 'رایگان',
          period: 'همیشگی',
          description: 'دسترسی استاندارد به اکیپ‌های عمومی و رادار منطقه',
          current: true,
          perks: [
            'عضویت در حداکثر ۵ اکیپ همزمان',
            'پیام‌رسانی مستقیم با اعضای تایید شده',
            'شعاع رادار استاندارد (۱۵ کیلومتر)',
            'شخصی‌سازی پایه پروفایل و مشخصات',
          ],
          color: '#3b82f6',
        },
        {
          id: 'pro',
          name: 'سرگروه تاکتیکی',
          price: '۹۹,۰۰۰ ت',
          period: 'ماهانه',
          description: 'امکانات پیشرفته برای سرگروه‌ها و برگزارکنندگان اکیپ',
          current: false,
          recommended: true,
          perks: [
            'ساخت و میزبانی نامحدود اکیپ‌ها',
            'اولویت نمایش در فید و رادار منطقه',
            'اشتراک مختصات زنده GPS با دقت بالا',
            'تم‌های شیشه‌ای سفارشی و مدال‌های ویژه',
            'دستیار هوش مصنوعی با برنامه‌ریزی دقیق',
          ],
          color: '#ec4899',
        },
        {
          id: 'elite',
          name: 'فرمانده ارشد',
          price: '۲۴۹,۰۰۰ ت',
          period: 'ماهانه',
          description: 'بالاترین سطح دسترسی برای سازمان‌ها، تیم‌های بزرگ و VIP',
          current: false,
          perks: [
            'تمام امکانات سطح سرگروه',
            'نشان طلایی فرمانده و احراز هویت ویژه',
            'دسترسی اختصاصی به سرورهای با امنیت کوانتومی',
            'پشتیبانی VIP و اولویت در استقرار',
          ],
          color: '#f59e0b',
        },
      ]
    : [
        {
          id: 'free',
          name: 'Operative',
          price: '$0',
          period: 'forever',
          description: 'Standard access to community squads and radar discovery',
          current: true,
          perks: [
            'Join up to 5 concurrent squads',
            'Direct messaging with verified members',
            'Standard radar discovery range (15km)',
            'Basic profile customization',
          ],
          color: '#3b82f6',
        },
        {
          id: 'pro',
          name: 'Squad Leader',
          price: '$9.99',
          period: 'month',
          description: 'Advanced capabilities for squad creators and community organizers',
          current: false,
          recommended: true,
          perks: [
            'Unlimited active squad hosting',
            'Priority feed ranking on tactical radar',
            'High-precision live GPS coordinate sharing',
            'Custom glass themes and squad badges',
            'AI Assistant co-pilot with deep scheduling',
          ],
          color: '#ec4899',
        },
        {
          id: 'elite',
          name: 'Tactical Commander',
          price: '$24.99',
          period: 'month',
          description: 'Maximum tier for enterprise leaders, VIPs & large networks',
          current: false,
          perks: [
            'All Squad Leader tier capabilities',
            'Exclusive golden badge & identity endorsement',
            'Direct access to quantum encrypted channels',
            'Dedicated tactical support line',
          ],
          color: '#f59e0b',
        },
      ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingTop: 90, paddingBottom: 60 }}>
        <View style={styles.heroBadge}>
          <View style={styles.crownIcon}>
            <Crown size={32} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>
            {isRTL ? 'طرح‌های اشتراک اکانت' : 'Clearance & Subscriptions'}
          </Text>
          <Text style={styles.heroDesc}>
            {isRTL
              ? 'امکانات پیشرفته تاکتیکی، اولویت در رادار و مدال‌های اختصاصی را باز کنید'
              : 'Unlock advanced sector radar range, priority deployment & tactical honors'}
          </Text>
        </View>

        {plans.map((p) => (
          <GlassCard
            key={p.id}
            variant="thin"
            style={[
              styles.planCard,
              p.recommended && styles.recommendedCard,
            ]}
          >
            {p.recommended && (
              <View style={styles.recommendedBadge}>
                <Sparkles size={12} color="#fff" />
                <Text style={styles.recommendedText}>
                  {isRTL ? 'محبوب‌ترین طرح' : 'MOST POPULAR'}
                </Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <View>
                <Text style={[styles.planName, { color: p.color }]}>{p.name}</Text>
                <Text style={styles.planDesc}>{p.description}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.planPrice}>{p.price}</Text>
                <Text style={styles.planPeriod}>/{p.period}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.perksList}>
              {p.perks.map((perk, i) => (
                <View key={i} style={styles.perkItem}>
                  <Check size={16} color={p.color} />
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 16 }}>
              {p.current ? (
                <GlassButton variant="secondary" disabled>
                  {isRTL ? 'طرح فعال فعلی شما' : 'Current Active Plan'}
                </GlassButton>
              ) : (
                <GlassButton
                  variant={p.recommended ? 'primary' : 'secondary'}
                  onPress={() => {
                    setToastMessage(isRTL ? `طرح «${p.name}» انتخاب گردید` : `Selected ${p.name} plan checkout`);
                  }}
                >
                  {isRTL ? `ارتقا به طرح ${p.name}` : `Upgrade to ${p.name}`}
                </GlassButton>
              )}
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />
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
  heroBadge: {
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 10,
  },
  crownIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#f59e0b',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  heroDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24,
  },
  planCard: {
    padding: 18,
    borderRadius: 22,
    marginBottom: 16,
  },
  recommendedCard: {
    borderColor: '#ec4899',
    borderWidth: 1.5,
    backgroundColor: 'rgba(236,72,153,0.08)',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ec4899',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 12,
    gap: 4,
  },
  recommendedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.8,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planName: {
    fontSize: 17,
    fontWeight: '700',
  },
  planDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    maxWidth: 200,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  planPeriod: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 14,
  },
  perksList: {
    gap: 10,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  perkText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
  },
});
