// --- START OF FILE SettingsScreen.tsx ---

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '@/src/lib/appData';
import { GlassCard, GlassListItem, GlassButton, GlassAvatar } from '@/src/components/glass';
import { GlassSheet } from '@/src/components/common';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsDivider } from '../components/SettingsDivider';
import { HorizonThemeToggle } from '@/src/components/common/HorizonThemeToggle';
import { getIcon, Icons } from '@/src/lib/icons';
import { useTheme, brandColors, spacing, radii, sharedStyles } from '@/src/lib/theme';
import { useI18n, LANGUAGES } from '@/src/lib/i18n';
import { useToast } from '@/src/lib/ToastContext';
import { getSinglePillContentPaddingTop } from '@/src/lib/headerLayout';

const Moon = getIcon('Moon');
const Sun = getIcon('Sun');
const Crown = getIcon('Crown');
const Check = getIcon('Check');

export function SettingsScreenComponent({
  onBack,
  onOpenPlans,
  onOpenPersonalInfo,
  onOpenVerification,
  onOpenPrivacy,
  onOpenSecurity,
  onOpenNotifications,
  onOpenLocation,
  onOpenChatTheme,
  onOpenOnboarding,
  onSignOut,
}: {
  onBack: () => void;
  onOpenPlans: () => void;
  onOpenPersonalInfo: () => void;
  onOpenVerification?: () => void;
  onOpenPrivacy?: () => void;
  onOpenSecurity?: () => void;
  onOpenNotifications?: () => void;
  onOpenLocation?: () => void;
  onOpenChatTheme?: () => void;
  onOpenOnboarding?: () => void;
  onSignOut: () => void;
}) {
  const { me } = useAppData();
  const insets = useSafeAreaInsets();
  const { theme, toggle, colors } = useTheme();
  const { language, setLanguage, t, isRTL } = useI18n();
  const { showToast } = useToast();
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);
  const [crashTrigger, setCrashTrigger] = useState(false);

  if (crashTrigger) {
    setCrashTrigger(false);
    throw new Error('Simulated test error for ErrorBoundary verification.');
  }

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showLanguageSheet) {
        setShowLanguageSheet(false);
        return true;
      }
      if (showPremiumSheet) {
        setShowPremiumSheet(false);
        return true;
      }
      onBack();
      return true;
    });
    return () => {
      sub.remove();
    };
  }, [onBack, showLanguageSheet, showPremiumSheet]);

  const ChevronIcon = isRTL ? Icons.ChevronLeft : Icons.ChevronRight;

  const rowDir = isRTL ? ('row-reverse' as const) : ('row' as const);
  const textAlign = isRTL ? ('right' as const) : ('left' as const);
  const textSpacing = {
    marginLeft: isRTL ? 0 : 12,
    marginRight: isRTL ? 12 : 0,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: getSinglePillContentPaddingTop(insets.top),
            paddingBottom: spacing.bottomNavClearance + insets.bottom,
          },
        ]}
      >
        {/* Profile Card Shortcut */}
        <TouchableOpacity activeOpacity={0.8} onPress={onOpenPersonalInfo}>
          <GlassCard style={[styles.profileCard, { flexDirection: rowDir }]}>
            <GlassAvatar
              user={me}
              src={me.avatar_url}
              name={`${me.first_name} ${me.last_name}`}
              size={54}
            />
            <View style={[{ flex: 1 }, textSpacing]}>
              <Text
                style={[styles.profileName, { color: colors.textPrimary, textAlign }]}
                numberOfLines={1}
              >
                {me.first_name} {me.last_name}
              </Text>
              <Text style={[styles.profileHandle, { color: colors.textTertiary, textAlign }]}>
                @{me.username} · {me.job}
              </Text>
            </View>
            <ChevronIcon size={18} color={colors.textTertiary} />
          </GlassCard>
        </TouchableOpacity>

        {/* Tier-1 / Ekip Plus Banner */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setShowPremiumSheet(true)}
          style={{ marginTop: spacing.md }}
        >
          <GlassCard glow style={[styles.plusCard, { flexDirection: rowDir }]}>
            <View style={[styles.plusIconCircle, { backgroundColor: colors.glassPillBg }]}>
              <Crown size={22} color={colors.brandAmber} strokeWidth={2.4} />
            </View>
            <View style={[{ flex: 1 }, textSpacing]}>
              <Text style={[styles.plusTitle, { color: colors.textPrimary, textAlign }]}>
                {t('settings.plusTitle')}
              </Text>
              <Text style={[styles.plusSub, { color: colors.textSecondary, textAlign }]}>
                {t('settings.plusSub')}
              </Text>
            </View>
            <ChevronIcon size={18} color={colors.textTertiary} />
          </GlassCard>
        </TouchableOpacity>

        {/* Account Section */}
        <View style={{ marginTop: spacing.xl }}>
          <SettingsSection title={t('settings.account')}>
            <GlassCard style={styles.sectionCard}>
              <GlassListItem
                icon="User"
                iconBg={`${colors.brandBlue}33`}
                title={t('settings.personalInfo')}
                subtitle={t('settings.personalInfoSub')}
                onPress={onOpenPersonalInfo}
                showChevron
              />
              <SettingsDivider />
              <GlassListItem
                icon="ShieldCheck"
                iconBg={`${colors.brandPink}33`}
                title={t('settings.verification')}
                subtitle={t('settings.verificationSub')}
                onPress={onOpenVerification}
                right={
                  <View
                    style={[
                      styles.verifiedBadge,
                      {
                        backgroundColor: colors.glassPillBg,
                        borderColor: colors.glassBorderActive,
                      },
                    ]}
                  >
                    <Text style={styles.verifiedText}>
                      {me.is_verified ? t('common.verified') : isRTL ? 'در انتظار' : 'Pending'}
                    </Text>
                  </View>
                }
                showChevron
              />
              <SettingsDivider />
              <GlassListItem
                icon="Lock"
                iconBg={`${colors.brandPurple}33`}
                title={t('settings.privacy')}
                subtitle={t('settings.privacySub')}
                onPress={onOpenPrivacy}
                showChevron
              />
              <SettingsDivider />
              <GlassListItem
                icon="Fingerprint"
                iconBg={`${colors.brandGreen}33`}
                title={isRTL ? 'امنیت و ورود دو مرحله‌ای' : 'Security & 2FA'}
                subtitle={isRTL ? 'گذرواژه، کلیدهای امنیتی و نشست‌های فعال' : 'Cryptographic passkeys & sessions'}
                onPress={onOpenSecurity}
                showChevron
              />
              <SettingsDivider />
              <GlassListItem
                icon="MapPin"
                iconBg={`${colors.brandAmber}33`}
                title={t('settings.location')}
                subtitle={t('settings.locationSub')}
                onPress={onOpenLocation}
                showChevron
              />
            </GlassCard>
          </SettingsSection>
        </View>

        {/* Preferences / System Interface Section */}
        <View style={{ marginTop: spacing.xl }}>
          <SettingsSection title={t('settings.preferences')}>
            <GlassCard style={styles.sectionCard}>
              {/* Language Selector */}
              <GlassListItem
                icon="Globe"
                iconBg={`${colors.brandBlue}33`}
                title={t('settings.language')}
                subtitle={language === 'fa' ? 'فارسی (Persian)' : 'English (US)'}
                onPress={() => setShowLanguageSheet(true)}
                right={
                  <View
                    style={[
                      styles.langBadge,
                      {
                        backgroundColor: colors.glassPillBg,
                        borderColor: colors.glassBorderActive,
                      },
                    ]}
                  >
                    <Text style={styles.langText}>
                      {language === 'fa' ? '🇮🇷 فارسی' : '🇺🇸 English'}
                    </Text>
                  </View>
                }
                showChevron
              />
              <SettingsDivider />

              {/* Chat Theme */}
              <GlassListItem
                icon="Palette"
                iconBg={`${colors.brandPink}33`}
                title={t('settings.commsTheme')}
                subtitle={t('settings.commsThemeSub')}
                onPress={onOpenChatTheme}
                showChevron
              />
              <SettingsDivider />

              {/* Dark mode toggle */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={toggle}
                style={[styles.toggleRow, { flexDirection: rowDir }]}
              >
                <View style={{ flexDirection: rowDir, alignItems: 'center', flex: 1 }}>
                  <View style={[styles.iconBox, { backgroundColor: `${colors.brandIndigo}33` }]}>
                    {theme === 'dark' ? (
                      <Moon size={18} color={colors.white} strokeWidth={2.2} />
                    ) : (
                      <Sun size={18} color={colors.brandIndigo} strokeWidth={2.2} />
                    )}
                  </View>
                  <View style={[{ flex: 1 }, textSpacing]}>
                    <Text style={[styles.rowTitle, { color: colors.textPrimary, textAlign }]}>
                      {t('settings.darkMode')}
                    </Text>
                    <Text style={[styles.rowSub, { color: colors.textSecondary, textAlign }]}>
                      {t('settings.darkModeSub')}
                    </Text>
                  </View>
                </View>
                <HorizonThemeToggle isDark={theme === 'dark'} onToggle={toggle} size={36} />
              </TouchableOpacity>
              <SettingsDivider />

              {/* Notification protocols */}
              <GlassListItem
                icon="Bell"
                iconBg={`${colors.danger}33`}
                title={t('settings.notifications')}
                subtitle={t('settings.notificationsSub')}
                onPress={onOpenNotifications}
                showChevron
              />

              {onOpenOnboarding && (
                <>
                  <SettingsDivider />
                  <GlassListItem
                    icon="Compass"
                    iconBg={`${colors.brandPink}33`}
                    title={isRTL ? 'تور و راهنمای برنامه' : 'App Tour & Onboarding'}
                    subtitle={
                      isRTL ? 'مشاهده اسلایدهای راهنمای اکیپ' : 'View the 4 introductory slides'
                    }
                    onPress={onOpenOnboarding}
                    showChevron
                  />
                </>
              )}
            </GlassCard>
          </SettingsSection>
        </View>

        {/* Test Error Boundary Simulator */}
        <View style={{ marginTop: spacing.xl }}>
          <GlassButton
            variant="secondary"
            fullWidth
            icon="AlertCircle"
            onPress={() => setCrashTrigger(true)}
          >
            {t('settings.testError')}
          </GlassButton>
        </View>

        {/* Danger Zone */}
        <View style={{ marginTop: spacing.xxl, marginBottom: spacing.huge }}>
          <GlassButton variant="danger" fullWidth onPress={onSignOut} icon="LogOut">
            {t('settings.signOut')}
          </GlassButton>
        </View>
      </ScrollView>

      {/* Language Selection Bottom Sheet */}
      <GlassSheet
        open={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
        title={t('settings.selectLanguage')}
      >
        <View style={{ gap: spacing.md, paddingVertical: spacing.sm }}>
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.8}
                onPress={() => {
                  setLanguage(lang.code);
                  showToast(t('settings.langChanged', { lang: lang.nativeName }));
                  setShowLanguageSheet(false);
                }}
              >
                <GlassCard
                  variant={isSelected ? 'thick' : 'thin'}
                  style={[
                    styles.langOptionCard,
                    { flexDirection: rowDir },
                    isSelected && {
                      borderColor: colors.brandPink,
                      borderWidth: 1.5,
                      backgroundColor: `${colors.brandPink}20`,
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: rowDir,
                      alignItems: 'center',
                      gap: spacing.md,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{lang.flag}</Text>
                    <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                      <Text style={[styles.langOptionTitle, { color: colors.textPrimary }]}>
                        {lang.nativeName}
                      </Text>
                      <Text style={[styles.langOptionSub, { color: colors.textTertiary }]}>
                        {lang.name}
                      </Text>
                    </View>
                  </View>

                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <Check size={16} color={colors.white} strokeWidth={3} />
                    </View>
                  )}
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </GlassSheet>

      {/* Premium Management Bottom Sheet */}
      <GlassSheet
        open={showPremiumSheet}
        onClose={() => setShowPremiumSheet(false)}
        title={isRTL ? 'مدیریت اشتراک ویژه' : 'Manage Subscription'}
      >
        <View style={{ gap: spacing.md, paddingVertical: spacing.sm }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              lineHeight: 20,
              textAlign,
            }}
          >
            {isRTL
              ? 'اشتراک ویژه اکیپ‌پلاس شما فعال است و به تمامی امکانات پیشرفته، اولویت نمایش و استایل‌های اختصاصی دسترسی دارید.'
              : 'Your Tier-1 Operational Plus clearance is active with unrestricted radar access, biometric prioritization, and custom holographic styles.'}
          </Text>
          <GlassButton
            fullWidth
            onPress={() => {
              setShowPremiumSheet(false);
              onOpenPlans();
            }}
          >
            {isRTL ? 'مشاهده پلن‌ها و اشتراک‌ها' : 'View All Tiers & Plans'}
          </GlassButton>
          <GlassButton
            fullWidth
            variant="secondary"
            onPress={() => setShowPremiumSheet(false)}
          >
            {isRTL ? 'بستن' : 'Close'}
          </GlassButton>
        </View>
      </GlassSheet>
    </View>
  );
}

export const SettingsScreen = React.memo(SettingsScreenComponent);

const styles = StyleSheet.create({
  container: {
    ...sharedStyles.screenContainer,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.huge,
  },
  profileCard: {
    ...sharedStyles.row,
    padding: spacing.md,
    borderRadius: radii.xl,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileHandle: {
    fontSize: 12,
    marginTop: spacing.xxs,
  },
  plusCard: {
    ...sharedStyles.row,
    padding: spacing.md,
    borderRadius: radii.xl,
  },
  plusIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  plusSub: {
    fontSize: 11,
    marginTop: spacing.xxs,
    lineHeight: 15,
  },
  sectionCard: {
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  verifiedBadge: {
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
  },
  verifiedText: {
    color: brandColors.brandPink,
    fontSize: 10,
    fontWeight: '700',
  },
  toggleRow: {
    ...sharedStyles.rowBetween,
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: radii.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 12,
    marginTop: spacing.xxs,
  },
  langBadge: {
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    marginHorizontal: spacing.xxs,
  },
  langText: {
    color: brandColors.brandBlue,
    fontSize: 11,
    fontWeight: '700',
  },
  langOptionCard: {
    ...sharedStyles.rowBetween,
    padding: spacing.screenPadding,
    borderRadius: radii.card,
  },
  langOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  langOptionSub: {
    fontSize: 12,
    marginTop: spacing.xxs,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: radii.pill,
    backgroundColor: brandColors.brandPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
