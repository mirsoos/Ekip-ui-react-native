// --- START OF FILE SecurityScreen.tsx ---

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard, GlassButton, LiquidGlassToggle } from '../components/Glass';
import { GlassSheet } from '../components/Overlays';
import { getIcon } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { useToast } from '../lib/ToastContext';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';

interface SecurityScreenProps {
  onBack: () => void;
}

interface ActiveDevice {
  id: string;
  name: string;
  platform: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
  type: 'phone' | 'laptop' | 'tablet';
}

const INITIAL_DEVICES_EN: ActiveDevice[] = [
  {
    id: 'dev-1',
    name: 'Pixel 9 Pro',
    platform: 'Android 15 · Ekip Mobile',
    location: 'Tehran, Saadat Abad',
    ip: '82.165.197.42',
    lastActive: 'Active now',
    isCurrent: true,
    type: 'phone',
  },
  {
    id: 'dev-2',
    name: 'MacBook Pro 16"',
    platform: 'macOS Sequoia · Safari 18.2',
    location: 'Tehran, Saadat Abad',
    ip: '82.165.197.42',
    lastActive: '2 hours ago',
    isCurrent: false,
    type: 'laptop',
  },
];

const INITIAL_DEVICES_FA: ActiveDevice[] = [
  {
    id: 'dev-1',
    name: 'Pixel 9 Pro',
    platform: 'اندروید ۱۵ · اپلیکیشن اکیپ',
    location: 'تهران، سعادت‌آباد',
    ip: '82.165.197.42',
    lastActive: 'اکنون فعال',
    isCurrent: true,
    type: 'phone',
  },
  {
    id: 'dev-2',
    name: 'MacBook Pro 16"',
    platform: 'مک او اس · وب اکیپ',
    location: 'تهران، سعادت‌آباد',
    ip: '82.165.197.42',
    lastActive: '۲ ساعت پیش',
    isCurrent: false,
    type: 'laptop',
  },
];

const RECOVERY_CODES = [
  'EKIP-89A2-94CF',
  'EKIP-47K1-82MN',
  'EKIP-93X9-11QA',
  'EKIP-60Z3-88PP',
];

export function SecurityScreen({ onBack }: SecurityScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();
  const { showToast } = useToast();

  const [passkeyRegistered, setPasskeyRegistered] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const [devices, setDevices] = useState<ActiveDevice[]>(
    isRTL ? INITIAL_DEVICES_FA : INITIAL_DEVICES_EN
  );

  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showRecoverySheet, setShowRecoverySheet] = useState(false);

  const ShieldCheck = getIcon('ShieldCheck');
  const Lock = getIcon('Lock');
  const Key = getIcon('Key');
  const Smartphone = getIcon('Smartphone');
  const Laptop = getIcon('Laptop');
  const Tablet = getIcon('Tablet');
  const Trash = getIcon('Trash');
  const ChevronRight = getIcon(isRTL ? 'ChevronLeft' : 'ChevronRight');

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showPasswordSheet) {
        setShowPasswordSheet(false);
        return true;
      }
      if (showRecoverySheet) {
        setShowRecoverySheet(false);
        return true;
      }
      onBack();
      return true;
    });
    return () => {
      sub.remove();
    };
  }, [onBack, showPasswordSheet, showRecoverySheet]);

  const handleRevokeDevice = (id: string, name: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    showToast(isRTL ? `نشست دستگاه «${name}» پایان یافت` : `Session on ${name} revoked`);
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast(isRTL ? 'لطفاً تمامی فیلدها را پر کنید' : 'Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(isRTL ? 'رمزهای جدید یکسان نیستند' : 'New passwords do not match');
      return;
    }
    setShowPasswordSheet(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast(isRTL ? 'رمز عبور با موفقیت تغییر کرد' : 'Master password updated successfully');
  };

  const rowDir = isRTL ? ('row-reverse' as const) : ('row' as const);
  const textAlign = isRTL ? ('right' as const) : ('left' as const);
  const textSpacing = {
    marginLeft: isRTL ? 0 : 12,
    marginRight: isRTL ? 12 : 0,
  };
  const inputThemeStyle = {
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
    borderColor: colors.glassBorder,
    color: colors.textPrimary,
    textAlign,
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
        {/* Passkey / Biometrics Card */}
        <GlassCard variant="thick" style={styles.heroCard}>
          <View style={[styles.heroHeader, { flexDirection: rowDir }]}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
              <ShieldCheck size={22} color="#10b981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'ورود امن با پس‌کی و بیومتریک' : 'Biometric & Passkey Access'}
              </Text>
              <Text style={[styles.heroDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'استاندارد سخت‌افزاری رمزنگاری FIDO2 و اثر انگشت'
                  : 'FIDO2 WebAuthn & biometric cryptographic hardware key'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={passkeyRegistered}
              onChange={(val) => {
                setPasskeyRegistered(val);
                showToast(
                  val
                    ? isRTL
                      ? 'پس‌کی سخت‌افزاری فعال شد'
                      : 'Hardware passkey registered'
                    : isRTL
                    ? 'پس‌کی غیرفعال شد'
                    : 'Hardware passkey revoked'
                );
              }}
              size="sm"
            />
          </View>
        </GlassCard>

        {/* Multi-Factor Authentication */}
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'پروتکل‌های تایید هویت' : 'AUTHENTICATION PROTOCOLS'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <View style={[styles.settingRow, { flexDirection: rowDir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'تایید هویت دومرحله‌ای (2FA)' : 'Two-Factor Authentication (2FA)'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'درخواست کد یکبار مصرف در هر بار ورود'
                  : 'Require TOTP code or passkey for every login'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={twoFactorEnabled}
              onChange={setTwoFactorEnabled}
              size="sm"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={[styles.settingRow, { flexDirection: rowDir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'قفل بیومتریک هنگام باز کردن برنامه' : 'Biometric Unlock on Open'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'درخواست اثر انگشت یا تشخیص چهره هنگام ورود'
                  : 'Prompt fingerprint or face unlock upon launch'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={biometricEnabled}
              onChange={setBiometricEnabled}
              size="sm"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={[styles.settingRow, { flexDirection: rowDir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'هشدار فعالیت‌های مشکوک' : 'Suspicious Activity Alerts'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'اعلان آنی در صورت ورود از دستگاه یا منطقه جدید'
                  : 'Instant notification upon login from new sector'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={loginAlerts}
              onChange={setLoginAlerts}
              size="sm"
            />
          </View>
        </GlassCard>

        {/* Credentials & Keys */}
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'اطلاعات امنیتی و رمزها' : 'CREDENTIALS'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <TouchableOpacity
            style={[styles.actionRow, { flexDirection: rowDir }]}
            onPress={() => setShowPasswordSheet(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(236,72,153,0.15)' }]}>
              <Lock size={18} color="#ec4899" />
            </View>
            <View style={[{ flex: 1 }, textSpacing]}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'تغییر رمز عبور اصلی' : 'Change Master Password'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL ? 'آخرین تغییر: ۲۴ روز پیش' : 'Last updated 24 days ago'}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <TouchableOpacity
            style={[styles.actionRow, { flexDirection: rowDir }]}
            onPress={() => setShowRecoverySheet(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(245,158,11,0.15)' }]}>
              <Key size={18} color="#f59e0b" />
            </View>
            <View style={[{ flex: 1 }, textSpacing]}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'کدهای بازیابی اضطراری' : 'Backup Recovery Codes'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'کدهای یکبار مصرف برای مواقع اضطراری'
                  : 'Emergency one-time access tokens'}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </GlassCard>

        {/* Active Sessions */}
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? `دستگاه‌های فعال (${devices.length})` : `ACTIVE SESSIONS (${devices.length})`}
        </Text>
        <GlassCard style={styles.cardSection}>
          {devices.map((dev, idx) => (
            <View key={dev.id}>
              {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.divider }]} />}
              <View style={[styles.deviceItem, { flexDirection: rowDir }]}>
                <View style={[styles.iconBox, { backgroundColor: colors.glassThinBg }]}>
                  {dev.type === 'phone' ? (
                    <Smartphone size={20} color={colors.textPrimary} />
                  ) : dev.type === 'laptop' ? (
                    <Laptop size={20} color={colors.textPrimary} />
                  ) : (
                    <Tablet size={20} color={colors.textPrimary} />
                  )}
                </View>
                <View style={[{ flex: 1 }, textSpacing]}>
                  <View style={{ flexDirection: rowDir, alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                      {dev.name}
                    </Text>
                    {dev.isCurrent && (
                      <Text style={styles.currentBadge}>
                        {isRTL ? 'این دستگاه' : 'This Device'}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                    {dev.platform}
                  </Text>
                  <Text
                    style={[
                      styles.settingDesc,
                      { marginTop: 2, color: colors.textTertiary, textAlign },
                    ]}
                  >
                    {dev.location} · {dev.lastActive}
                  </Text>
                </View>
                {!dev.isCurrent && (
                  <TouchableOpacity
                    onPress={() => handleRevokeDevice(dev.id, dev.name)}
                    style={{ padding: 6 }}
                  >
                    <Trash size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </GlassCard>
      </ScrollView>

      {/* Change Password Sheet */}
      <GlassSheet
        open={showPasswordSheet}
        onClose={() => setShowPasswordSheet(false)}
        title={isRTL ? 'به‌روزرسانی رمز عبور' : 'Update Master Password'}
      >
        <View style={{ paddingVertical: 10 }}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary, textAlign }]}>
            {isRTL ? 'رمز عبور فعلی' : 'CURRENT PASSWORD'}
          </Text>
          <TextInput
            style={[styles.input, inputThemeStyle]}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholderTextColor={colors.textTertiary}
          />

          <Text
            style={[
              styles.inputLabel,
              { marginTop: 14, color: colors.textSecondary, textAlign },
            ]}
          >
            {isRTL ? 'رمز عبور جدید' : 'NEW PASSWORD'}
          </Text>
          <TextInput
            style={[styles.input, inputThemeStyle]}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor={colors.textTertiary}
          />

          <Text
            style={[
              styles.inputLabel,
              { marginTop: 14, color: colors.textSecondary, textAlign },
            ]}
          >
            {isRTL ? 'تکرار رمز عبور جدید' : 'CONFIRM NEW PASSWORD'}
          </Text>
          <TextInput
            style={[styles.input, inputThemeStyle]}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor={colors.textTertiary}
          />

          <View style={{ marginTop: 22 }}>
            <GlassButton variant="primary" fullWidth onPress={handleUpdatePassword}>
              {isRTL ? 'ذخیره رمز عبور جدید' : 'Save New Password'}
            </GlassButton>
          </View>
        </View>
      </GlassSheet>

      {/* Recovery Codes Sheet */}
      <GlassSheet
        open={showRecoverySheet}
        onClose={() => setShowRecoverySheet(false)}
        title={isRTL ? 'کدهای بازیابی اضطراری' : 'Emergency Recovery Codes'}
      >
        <View style={{ paddingVertical: 10 }}>
          <Text
            style={{
              fontSize: 13,
              color: colors.textSecondary,
              marginBottom: 14,
              textAlign,
            }}
          >
            {isRTL
              ? 'این کدهای اضطراری را در مکانی امن و آفلاین نگهداری کنید. هر کد فقط یک بار قابل استفاده است.'
              : 'Store these emergency keys in a secure offline vault. Each key can only be used once.'}
          </Text>

          <View style={[styles.codesGrid, { flexDirection: rowDir }]}>
            {RECOVERY_CODES.map((code) => (
              <View
                key={code}
                style={[
                  styles.codePill,
                  {
                    backgroundColor: colors.glassThinBg,
                    borderColor: colors.glassBorder,
                  },
                ]}
              >
                <Text style={[styles.codeText, { color: colors.textPrimary }]}>{code}</Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 20 }}>
            <GlassButton
              variant="secondary"
              fullWidth
              onPress={() => {
                showToast(
                  isRTL
                    ? 'کدهای بازیابی در حافظه کپی شدند'
                    : 'Recovery codes copied to clipboard'
                );
              }}
            >
              {isRTL ? 'کپی تمامی کدها' : 'Copy All Codes'}
            </GlassButton>
          </View>
        </View>
      </GlassSheet>
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
  heroCard: {
    padding: 16,
    borderRadius: 22,
    borderColor: 'rgba(16,185,129,0.3)',
    borderWidth: 1,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  heroDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 22,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  cardSection: {
    padding: 14,
    borderRadius: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 14,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  currentBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  codesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  codePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 13,
    letterSpacing: 1,
  },
});