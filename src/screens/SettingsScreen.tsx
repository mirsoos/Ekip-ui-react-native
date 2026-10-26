import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassListItem, GlassToggle, GlassButton, GlassAvatar } from '../components/Glass';
import { GlassSheet, Toast } from '../components/Overlays';
import { SettingsSection } from '../components/settings/SettingsSection';
import { SettingsDivider } from '../components/settings/SettingsDivider';
// ScreenHeader removed - rendered via SettingsHeader outside transition container
import { getIcon } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { useI18n, LANGUAGES } from '../lib/i18n';

export function SettingsScreen({
  onBack,
  onOpenPlans,
  onOpenPersonalInfo,
  onOpenVerification,
  onOpenPrivacy,
  onOpenSecurity,
  onOpenNotifications,
  onOpenLocation,
  onOpenChatTheme,
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
  onSignOut: () => void;
}) {
  const { me } = useAppData();
  const insets = useSafeAreaInsets();
  const { theme, toggle, colors } = useTheme();
  const { language, setLanguage, t, isRTL } = useI18n();
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [crashTrigger, setCrashTrigger] = useState(false);

  if (crashTrigger) {
    setTimeout(() => setCrashTrigger(false), 0);
    throw new Error('Simulated test error for ErrorBoundary verification.');
  }

  const ChevronRight = getIcon('ChevronRight');
  const Moon = getIcon('Moon');
  const Sun = getIcon('Sun');
  const Crown = getIcon('Crown');
  const Check = getIcon('Check');

  return (
    <View style={styles.container}>
      

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'web' && {
            paddingTop: 76 + insets.top,
            paddingBottom: 40 + insets.bottom,
          },
        ]}
      >
        {/* Profile Card Shortcut */}
        <TouchableOpacity activeOpacity={0.8} onPress={onOpenPersonalInfo}>
          <GlassCard style={styles.profileCard}>
            <GlassAvatar
              src={me.avatar_url}
              name={`${me.first_name} ${me.last_name}`}
              size={54}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]} numberOfLines={1}>
                {me.first_name} {me.last_name}
              </Text>
              <Text style={[styles.profileHandle, { color: colors.textTertiary }]}>
                @{me.username} · {me.job}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </GlassCard>
        </TouchableOpacity>

        {/* Tier-1 / Ekip Plus Banner */}
        <TouchableOpacity activeOpacity={0.85} onPress={() => setShowPremiumSheet(true)} style={{ marginTop: 14 }}>
          <GlassCard glow style={styles.plusCard}>
            <View style={styles.plusIconCircle}>
              <Crown size={22} color="#f59e0b" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.plusTitle, { color: colors.textPrimary }]}>
                {t('settings.plusTitle')}
              </Text>
              <Text style={[styles.plusSub, { color: colors.textSecondary }]}>
                {t('settings.plusSub')}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </GlassCard>
        </TouchableOpacity>

        {/* Account Section */}
        <View style={{ marginTop: 20 }}>
          <SettingsSection title={t('settings.account')}>
            <GlassCard style={styles.sectionCard}>
              <GlassListItem
                icon="User"
                iconBg="rgba(59, 130, 246, 0.2)"
                title={t('settings.personalInfo')}
                subtitle={t('settings.personalInfoSub')}
                onPress={onOpenPersonalInfo}
                showChevron
              />
              <SettingsDivider />
              <GlassListItem
                icon="ShieldCheck"
                iconBg="rgba(244, 114, 182, 0.22)"
                title={t('settings.verification')}
                subtitle={t('settings.verificationSub')}
                onPress={onOpenVerification}
                right={
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>
                      {me.is_verified ? t('common.verified') : 'Pending'}
                    </Text>
                  </View>
                }
                showChevron
              />
              <SettingsDivider />
              <GlassListItem
                icon="Lock"
                iconBg="rgba(168, 85, 247, 0.2)"
                title={t('settings.privacy')}
                subtitle={t('settings.privacySub')}
                onPress={onOpenPrivacy}
                showChevron
              />
              <SettingsDivider />
              <GlassListItem
                icon="Fingerprint"
                iconBg="rgba(16, 185, 129, 0.2)"
                title="Security & 2FA"
                subtitle="Cryptographic passkeys & sessions"
                onPress={onOpenSecurity}
                showChevron
              />
              <SettingsDivider />
              <GlassListItem
                icon="MapPin"
                iconBg="rgba(234, 179, 8, 0.2)"
                title={t('settings.location')}
                subtitle={t('settings.locationSub')}
                onPress={onOpenLocation}
                showChevron
              />
            </GlassCard>
          </SettingsSection>
        </View>

        {/* Preferences / System Interface Section */}
        <View style={{ marginTop: 20 }}>
          <SettingsSection title={t('settings.preferences')}>
            <GlassCard style={styles.sectionCard}>
              {/* Language Selector */}
              <GlassListItem
                icon="Globe"
                iconBg="rgba(59, 130, 246, 0.2)"
                title={t('settings.language')}
                subtitle={language === 'fa' ? 'فارسی (Persian)' : 'English (US)'}
                onPress={() => setShowLanguageSheet(true)}
                right={
                  <View style={styles.langBadge}>
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
                iconBg="rgba(244, 114, 182, 0.2)"
                title={t('settings.commsTheme')}
                subtitle={t('settings.commsThemeSub')}
                onPress={onOpenChatTheme}
                showChevron
              />
              <SettingsDivider />

              {/* Dark mode toggle */}
              <View style={styles.toggleRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                    {theme === 'dark' ? (
                      <Moon size={18} color="#ffffff" strokeWidth={2.2} />
                    ) : (
                      <Sun size={18} color="#ffffff" strokeWidth={2.2} />
                    )}
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                      {t('settings.darkMode')}
                    </Text>
                    <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                      {t('settings.darkModeSub')}
                    </Text>
                  </View>
                </View>
                <GlassToggle checked={theme === 'dark'} onChange={toggle} />
              </View>
              <SettingsDivider />

              {/* Notification protocols */}
              <GlassListItem
                icon="Bell"
                iconBg="rgba(239, 68, 68, 0.2)"
                title={t('settings.notifications')}
                subtitle={t('settings.notificationsSub')}
                onPress={onOpenNotifications}
                showChevron
              />
            </GlassCard>
          </SettingsSection>
        </View>

        {/* Test Error Boundary Simulator */}
        <View style={{ marginTop: 20 }}>
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
        <View style={{ marginTop: 24, marginBottom: 40 }}>
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
        <View style={{ gap: 10, paddingVertical: 8 }}>
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.8}
                onPress={() => {
                  setLanguage(lang.code);
                  setToastMessage(t('settings.langChanged', { lang: lang.nativeName }));
                  setShowLanguageSheet(false);
                }}
              >
                <GlassCard
                  variant={isSelected ? 'thick' : 'thin'}
                  style={[
                    styles.langOptionCard,
                    isSelected && {
                      borderColor: '#f472b6',
                      borderWidth: 1.5,
                      backgroundColor: 'rgba(244, 114, 182, 0.12)',
                    },
                  ]}
                >
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
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
                      <Check size={16} color="#ffffff" strokeWidth={3} />
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
        title="Manage Subscription"
      >
        <View style={{ gap: 14, paddingVertical: 10 }}>
          <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
            Your Tier-1 Operational Plus clearance is active with unrestricted radar access, biometric prioritization, and custom holographic styles.
          </Text>
          <GlassButton fullWidth onPress={() => { setShowPremiumSheet(false); onOpenPlans(); }}>
            View All Tiers & Plans
          </GlassButton>
          <GlassButton fullWidth variant="secondary" onPress={() => setShowPremiumSheet(false)}>
            Close
          </GlassButton>
        </View>
      </GlassSheet>

      {/* Toast Notification */}
      <Toast message={toastMessage} visible={Boolean(toastMessage)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 84,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 22,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileHandle: {
    fontSize: 12,
    marginTop: 2,
  },
  plusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 22,
  },
  plusIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  plusSub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  sectionCard: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(244, 114, 182, 0.15)',
    borderColor: 'rgba(244, 114, 182, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  verifiedText: {
    color: '#f472b6',
    fontSize: 10,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 12,
    marginTop: 2,
  },
  langBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginRight: 2,
  },
  langText: {
    color: '#3b82f6',
    fontSize: 11,
    fontWeight: '700',
  },
  langOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
  },
  langOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  langOptionSub: {
    fontSize: 12,
    marginTop: 2,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f472b6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
