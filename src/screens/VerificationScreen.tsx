// --- START OF FILE VerificationScreen.tsx ---

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import {
  GlassCard,
  GlassButton,
  GlassAvatar,
  GlassBadgeIcon,
} from '../components/Glass';
import { TactileSegmented } from '../components/common/TactileSegmented';
import { GlassSheet } from '../components/Overlays';
import { getIcon } from '../lib/icons';
import { useTheme, spacing, radii, sharedStyles } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { useToast } from '../lib/ToastContext';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';

interface VerificationScreenProps {
  onBack: () => void;
}

type DocumentType = 'driver_license' | 'passport' | 'national_id';

interface DocumentDetails {
  type: DocumentType;
  docNumber: string;
  country: string;
  expiryDate: string;
}

const Check = getIcon('Check');
const Lock = getIcon('Lock');
const Camera = getIcon('Camera');
const Sparkles = getIcon('Sparkles');
const Award = getIcon('Award');
const Zap = getIcon('Zap');
const Smartphone = getIcon('Smartphone');
const Mail = getIcon('Mail');

export function VerificationScreen({ onBack }: VerificationScreenProps) {
  const insets = useSafeAreaInsets();
  const { me, updateMe, addNotification } = useAppData();
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const { showToast } = useToast();

  const [isVerified, setIsVerified] = useState(me.is_verified ?? true);
  const [isIdentityVerified, setIsIdentityVerified] = useState(me.is_identity_verified ?? true);

  const [showDocModal, setShowDocModal] = useState(false);
  const [showFaceModal, setShowFaceModal] = useState(false);

  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('national_id');
  const [docDetails, setDocDetails] = useState<DocumentDetails>({
    type: 'national_id',
    docNumber: '۰۰۸۳۹۲۱۰۱۴',
    country: isRTL ? 'جمهوری اسلامی ایران' : 'Iran',
    expiryDate: '1410/05',
  });

  const [faceScanStep, setFaceScanStep] = useState<'idle' | 'scanning' | 'smiling' | 'success'>('idle');
  const [docScanning, setDocScanning] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showDocModal) {
        setShowDocModal(false);
        return true;
      }
      if (showFaceModal) {
        setShowFaceModal(false);
        return true;
      }
      onBack();
      return true;
    });
    const timers = timersRef.current;
    return () => {
      sub.remove();
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onBack, showDocModal, showFaceModal]);

  const handleToggleVerification = () => {
    const newStatus = !isVerified;
    setIsVerified(newStatus);
    setIsIdentityVerified(newStatus);
    updateMe({ is_verified: newStatus, is_identity_verified: newStatus });
    showToast(
      newStatus
        ? isRTL
          ? 'نشان تایید هویت فعال شد'
          : 'Verified badge activated'
        : isRTL
        ? 'نشان تایید هویت غیرفعال شد'
        : 'Verified badge deactivated'
    );
    addNotification({
      type: 'system',
      title: isRTL ? 'وضعیت تایید هویت' : 'Verification Status Changed',
      body: newStatus
        ? isRTL
          ? 'پروفایل شما با موفقیت تایید هویت شد.'
          : 'Your profile is now verified.'
        : isRTL
        ? 'نشان تایید هویت از حساب شما حذف شد.'
        : 'Your verified status was removed.',
      icon: 'Shield',
    });
  };

  const startFaceScan = () => {
    setShowFaceModal(true);
    setFaceScanStep('scanning');

    const t1 = setTimeout(() => {
      setFaceScanStep('smiling');
    }, 1800);

    const t2 = setTimeout(() => {
      setFaceScanStep('success');
      setIsIdentityVerified(true);
      setIsVerified(true);
      updateMe({ is_verified: true, is_identity_verified: true });
    }, 3600);

    timersRef.current.push(t1, t2);
  };

  const handleScanDocument = () => {
    setDocScanning(true);
    const t = setTimeout(() => {
      setDocScanning(false);
      setShowDocModal(false);
      setIsIdentityVerified(true);
      setIsVerified(true);
      updateMe({ is_verified: true, is_identity_verified: true });
      showToast(
        isRTL
          ? 'مدرک هویتی با موفقیت اسکن و رمزنگاری شد!'
          : 'ID document successfully scanned and encrypted!'
      );
      addNotification({
        type: 'system',
        title: isRTL ? 'مدرک تایید شد' : 'Document Approved',
        body: isRTL
          ? 'مدرک شناسایی با موفقیت احراز گردید.'
          : `${
              selectedDocType === 'driver_license'
                ? "Driver's License"
                : selectedDocType === 'passport'
                ? 'Passport'
                : 'National ID'
            } verified.`,
        icon: 'BadgeCheck',
      });
    }, 2000);
    timersRef.current.push(t);
  };

  const docOptions = useMemo(
    () => [
      { label: isRTL ? 'کارت ملی' : 'National ID', value: 'national_id', icon: 'UserCheck' as const },
      { label: isRTL ? 'گذرنامه' : 'Passport', value: 'passport', icon: 'Globe' as const },
      { label: isRTL ? 'گواهینامه' : "Driver's License", value: 'driver_license', icon: 'Award' as const },
    ],
    [isRTL]
  );

  const rowDir = isRTL ? ('row-reverse' as const) : ('row' as const);
  const textAlign = isRTL ? ('right' as const) : ('left' as const);
  const textSpacing = {
    marginLeft: isRTL ? 0 : 12,
    marginRight: isRTL ? 12 : 0,
  };

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
        {/* Hero Card */}
        <GlassCard
          variant="thick"
          style={[styles.heroCard, { borderColor: colors.glassBorderActive, borderWidth: 1 }]}
        >
          <View style={styles.avatarWrap}>
            <GlassAvatar
              user={me}
              src={me.avatar_url}
              name={`${me.first_name} ${me.last_name}`}
              size={84}
            />
          </View>

          <View style={[styles.nameRow, { flexDirection: rowDir }]}>
            <Text style={[styles.heroName, { color: colors.textPrimary }]}>
              {me.first_name} {me.last_name}
            </Text>
            {isVerified && (
              <GlassBadgeIcon
                icon="Verified"
                label={isRTL ? 'تایید شده' : 'Verified'}
                color="pink"
              />
            )}
          </View>
          <Text style={[styles.heroHandle, { color: colors.textSecondary }]}>
            @{me.username}
          </Text>

          <View
            style={[
              styles.statusPill,
              {
                flexDirection: rowDir,
                backgroundColor: colors.glassPillBg,
                borderColor: colors.glassBorderActive,
              },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: colors.brandPink }]} />
            <Text style={[styles.statusText, { color: colors.brandPink }]}>
              {isVerified
                ? isRTL
                  ? 'حساب کاربری تایید شده • هویت معتبر'
                  : 'Verified Account • Trusted Profile'
                : isRTL
                ? 'در حال بررسی احراز هویت'
                : 'Verification Under Review'}
            </Text>
          </View>

          <View
            style={[
              styles.heroStatsRow,
              { flexDirection: rowDir, borderTopColor: colors.divider },
            ]}
          >
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: colors.textPrimary }]}>
                {isRTL ? '۹۹٪' : '99%'}
              </Text>
              <Text style={[styles.statLbl, { color: colors.textTertiary }]}>
                {isRTL ? 'اعتبار هویت' : 'Trust Score'}
              </Text>
            </View>
            <View
              style={[
                styles.statBox,
                styles.statBoxBorder,
                { borderColor: colors.divider },
              ]}
            >
              <Text style={[styles.statVal, { color: colors.textPrimary }]}>
                {isRTL ? 'سطح ۲' : 'Tier 2'}
              </Text>
              <Text style={[styles.statLbl, { color: colors.textTertiary }]}>
                {isRTL ? 'سطح کاربری' : 'Trust Tier'}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: colors.textPrimary }]}>AES-256</Text>
              <Text style={[styles.statLbl, { color: colors.textTertiary }]}>
                {isRTL ? 'رمزنگاری شده' : 'Encrypted'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Verification Checkpoints */}
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'مراحل احراز هویت' : 'VERIFICATION MILESTONES'}
        </Text>

        <GlassCard style={styles.cardItem}>
          <View style={[styles.itemRow, { flexDirection: rowDir }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.glassPillBg }]}>
              <Camera size={20} color={colors.brandPink} />
            </View>
            <View style={[{ flex: 1 }, textSpacing]}>
              <Text style={[styles.itemTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'اسکن بیومتریک چهره' : 'Biometric Face Scan'}
              </Text>
              <Text style={[styles.itemDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL ? 'تشخیص زنده بودن سه‌بعدی' : '3D dynamic liveness detection'}
              </Text>
            </View>
            <GlassButton
              variant={isIdentityVerified ? 'secondary' : 'primary'}
              size="sm"
              onPress={startFaceScan}
            >
              {isIdentityVerified
                ? isRTL
                  ? 'اسکن دوباره'
                  : 'Re-scan'
                : isRTL
                ? 'اسکن'
                : 'Scan'}
            </GlassButton>
          </View>
        </GlassCard>

        <GlassCard style={styles.cardItem}>
          <View style={[styles.itemRow, { flexDirection: rowDir }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.glassPillBg }]}>
              <Lock size={20} color={colors.brandBlue} />
            </View>
            <View style={[{ flex: 1 }, textSpacing]}>
              <Text style={[styles.itemTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'کارت شناسایی معتبر' : 'Government Photo ID'}
              </Text>
              <Text style={[styles.itemDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL ? 'کارت ملی یا گذرنامه' : "Passport or Driver's License"}
              </Text>
            </View>
            <GlassButton
              variant="secondary"
              size="sm"
              onPress={() => setShowDocModal(true)}
            >
              {isRTL ? 'تنظیمات' : 'Configure'}
            </GlassButton>
          </View>
        </GlassCard>

        <GlassCard style={styles.cardItem}>
          <View style={[styles.itemRow, { flexDirection: rowDir }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.glassPillBg }]}>
              <Smartphone size={20} color={colors.brandGreen} />
            </View>
            <View style={[{ flex: 1 }, textSpacing]}>
              <Text style={[styles.itemTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'احراز شماره موبایل' : 'Phone Authentication'}
              </Text>
              <Text style={[styles.itemDesc, { color: colors.textSecondary, textAlign }]}>
                +98 912 ••• 0199 · {isRTL ? 'تایید شده' : 'Verified'}
              </Text>
            </View>
            <Check size={18} color={colors.brandGreen} />
          </View>
        </GlassCard>

        <GlassCard style={styles.cardItem}>
          <View style={[styles.itemRow, { flexDirection: rowDir }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.glassPillBg }]}>
              <Mail size={20} color={colors.brandAmber} />
            </View>
            <View style={[{ flex: 1 }, textSpacing]}>
              <Text style={[styles.itemTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'ایمیل سازمانی' : 'Institutional Email'}
              </Text>
              <Text style={[styles.itemDesc, { color: colors.textSecondary, textAlign }]}>
                vance@ekip-command.mil · {isRTL ? 'تایید شده' : 'Verified'}
              </Text>
            </View>
            <Check size={18} color={colors.brandGreen} />
          </View>
        </GlassCard>

        {/* Benefits Section */}
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'مزایای کاربر تایید شده' : 'VERIFIED OPERATOR PERKS'}
        </Text>
        <GlassCard style={styles.cardItem}>
          <View style={[styles.perkRow, { flexDirection: rowDir }]}>
            <Award size={18} color={colors.brandPink} />
            <Text style={[styles.perkText, { color: colors.textPrimary, textAlign }]}>
              {isRTL
                ? 'اولویت بالا در ساخت و میزبانی اکیپ‌ها'
                : 'High-priority squad creation and hosting'}
            </Text>
          </View>
          <View style={[styles.perkRow, { marginTop: spacing.md, flexDirection: rowDir }]}>
            <Zap size={18} color={colors.brandPink} />
            <Text style={[styles.perkText, { color: colors.textPrimary, textAlign }]}>
              {isRTL
                ? 'عضویت بدون معطلی در مأموریت‌های خصوصی'
                : 'Instant admission to private tactical missions'}
            </Text>
          </View>
          <View style={[styles.perkRow, { marginTop: spacing.md, flexDirection: rowDir }]}>
            <Sparkles size={18} color={colors.brandPink} />
            <Text style={[styles.perkText, { color: colors.textPrimary, textAlign }]}>
              {isRTL
                ? 'نشان شیشه‌ای متمایز تایید هویت'
                : 'Distinguished pink liquid glass identity badge'}
            </Text>
          </View>
        </GlassCard>

        {/* Manual override / toggle action */}
        <View style={{ marginTop: spacing.xl }}>
          <GlassButton
            variant={isVerified ? 'secondary' : 'primary'}
            fullWidth
            onPress={handleToggleVerification}
          >
            {isVerified
              ? isRTL
                ? 'غیرفعال‌سازی موقت نشان تایید'
                : 'Disable Verified Badge'
              : isRTL
              ? 'درخواست تایید دستی مدارک'
              : 'Request Manual Verification'}
          </GlassButton>
        </View>
      </ScrollView>

      {/* Doc Modal */}
      <GlassSheet
        open={showDocModal}
        onClose={() => setShowDocModal(false)}
        title={isRTL ? 'تایید مدرک شناسایی' : 'Document Verification'}
      >
        <View style={{ paddingVertical: spacing.sm }}>
          <Text style={[styles.label, { color: colors.textSecondary, textAlign }]}>
            {isRTL ? 'نوع مدرک' : 'DOCUMENT TYPE'}
          </Text>
          <View style={{ marginTop: spacing.sm }}>
            <TactileSegmented
              options={docOptions}
              value={selectedDocType}
              onChange={(v) => setSelectedDocType(v as DocumentType)}
            />
          </View>

          <Text
            style={[
              styles.label,
              { marginTop: spacing.lg, color: colors.textSecondary, textAlign },
            ]}
          >
            {isRTL ? 'شماره مدرک' : 'DOCUMENT NUMBER'}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.glassInputBg,
                borderColor: colors.glassBorder,
                color: colors.textPrimary,
                textAlign,
              },
            ]}
            value={docDetails.docNumber}
            onChangeText={(txt) => setDocDetails((prev) => ({ ...prev, docNumber: txt }))}
            placeholderTextColor={colors.textTertiary}
          />

          <Text
            style={[
              styles.label,
              { marginTop: spacing.lg, color: colors.textSecondary, textAlign },
            ]}
          >
            {isRTL ? 'کشور صادرکننده' : 'ISSUING JURISDICTION'}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.glassInputBg,
                borderColor: colors.glassBorder,
                color: colors.textPrimary,
                textAlign,
              },
            ]}
            value={docDetails.country}
            onChangeText={(txt) => setDocDetails((prev) => ({ ...prev, country: txt }))}
            placeholderTextColor={colors.textTertiary}
          />

          <View style={{ marginTop: spacing.xxl }}>
            <GlassButton
              variant="primary"
              fullWidth
              onPress={handleScanDocument}
              disabled={docScanning}
            >
              {docScanning
                ? isRTL
                  ? 'در حال اعتبارسنجی و رمزنگاری...'
                  : 'Encrypting & Validating...'
                : isRTL
                ? 'ثبت و ارسال مدرک شناسایی'
                : 'Submit ID Document'}
            </GlassButton>
          </View>
        </View>
      </GlassSheet>

      {/* Face Scan Modal */}
      <GlassSheet
        open={showFaceModal}
        onClose={() => setShowFaceModal(false)}
        title={isRTL ? 'اسکن سه‌بعدی بیومتریک' : '3D Biometric Liveness'}
      >
        <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
          <View
            style={[
              styles.scannerCircle,
              {
                borderColor: colors.brandPink,
                backgroundColor: colors.glassPillBg,
              },
            ]}
          >
            <Camera size={40} color={colors.brandPink} />
          </View>

          <Text style={[styles.scanStatusText, { color: colors.textPrimary }]}>
            {faceScanStep === 'scanning' &&
              (isRTL ? 'در حال اسکن نقاط بیومتریک چهره...' : 'Scanning biometric points...')}
            {faceScanStep === 'smiling' &&
              (isRTL
                ? 'لطفاً پلک بزنید یا لبخند بزنید...'
                : 'Please blink or smile naturally...')}
            {faceScanStep === 'success' &&
              (isRTL
                ? '✓ تطابق بیومتریک ۹۹.۷٪ با موفقیت تایید شد!'
                : '✓ 99.7% Biometric Match Confirmed!')}
          </Text>

          <Text style={[styles.scanDesc, { color: colors.textSecondary }]}>
            {faceScanStep === 'success'
              ? isRTL
                ? 'نمایه رمزنگاری شده چهره شما در سامانه ثبت گردید.'
                : 'Your cryptographic face profile has been anchored.'
              : isRTL
              ? 'چهره خود را درون کادر نگه داشته و از نور مناسب مطمئن شوید.'
              : 'Keep your face inside the focal area and ensure good lighting.'}
          </Text>

          {faceScanStep === 'success' && (
            <View style={{ marginTop: spacing.xl, width: '100%' }}>
              <GlassButton variant="primary" fullWidth onPress={() => setShowFaceModal(false)}>
                {isRTL ? 'تکمیل' : 'Done'}
              </GlassButton>
            </View>
          )}
        </View>
      </GlassSheet>
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
  heroCard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: radii.xl,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  nameRow: {
    ...sharedStyles.row,
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '700',
  },
  heroHandle: {
    fontSize: 13,
    marginTop: spacing.xxs,
  },
  statusPill: {
    ...sharedStyles.row,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.input,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radii.badge,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  heroStatsRow: {
    ...sharedStyles.row,
    width: '100%',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '700',
  },
  statLbl: {
    fontSize: 10,
    marginTop: spacing.xxs,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  cardItem: {
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
  },
  itemRow: {
    ...sharedStyles.row,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: radii.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemDesc: {
    fontSize: 11,
    marginTop: spacing.xxs,
  },
  perkRow: {
    ...sharedStyles.row,
    gap: spacing.sm,
  },
  perkText: {
    fontSize: 13,
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: radii.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
  },
  scannerCircle: {
    width: 90,
    height: 90,
    borderRadius: radii.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  scanStatusText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  scanDesc: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});