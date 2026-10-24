import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassButton, GlassBackButton, GlassAvatar, GlassBadgeIcon, GlassSegmented } from '../components/Glass';
import { GlassSheet, Toast } from '../components/Overlays';
import { getIcon } from '../lib/icons';
import { useI18n } from '../lib/i18n';

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

export function VerificationScreen({ onBack }: VerificationScreenProps) {
  const { me, updateMe, addNotification } = useAppData();
  const { isRTL } = useI18n();

  const [isVerified, setIsVerified] = useState(me.is_verified ?? true);
  const [isIdentityVerified, setIsIdentityVerified] = useState(me.is_identity_verified ?? true);

  const [showDocModal, setShowDocModal] = useState(false);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('national_id');
  const [docDetails, setDocDetails] = useState<DocumentDetails>({
    type: 'national_id',
    docNumber: '۰۰۸۳۹۲۱۰۱۴',
    country: isRTL ? 'جمهوری اسلامی ایران' : 'Iran',
    expiryDate: '1410/05',
  });

  const [faceScanStep, setFaceScanStep] = useState<'idle' | 'scanning' | 'smiling' | 'success'>('idle');
  const [docScanning, setDocScanning] = useState(false);

  const ShieldCheck = getIcon('ShieldCheck');
  const Check = getIcon('Check');
  const Lock = getIcon('Lock');
  const Camera = getIcon('Camera');
  const Sparkles = getIcon('Sparkles');
  const Award = getIcon('Award');
  const Zap = getIcon('Zap');
  const Smartphone = getIcon('Smartphone');
  const Mail = getIcon('Mail');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleVerification = () => {
    const newStatus = !isVerified;
    setIsVerified(newStatus);
    setIsIdentityVerified(newStatus);
    updateMe({ is_verified: newStatus, is_identity_verified: newStatus });
    showToast(newStatus ? (isRTL ? 'نشان تایید هویت فعال شد' : 'Verified badge activated') : (isRTL ? 'نشان تایید هویت غیرفعال شد' : 'Verified badge deactivated'));
    addNotification({
      type: 'system',
      title: isRTL ? 'وضعیت تایید هویت' : 'Verification Status Changed',
      body: newStatus
        ? (isRTL ? 'پروفایل شما با موفقیت تایید هویت شد.' : 'Your profile is now verified.')
        : (isRTL ? 'نشان تایید هویت از حساب شما حذف شد.' : 'Your verified status was removed.'),
      icon: 'Shield',
    });
  };

  const startFaceScan = () => {
    setShowFaceModal(true);
    setFaceScanStep('scanning');

    setTimeout(() => {
      setFaceScanStep('smiling');
    }, 1800);

    setTimeout(() => {
      setFaceScanStep('success');
      setIsIdentityVerified(true);
      setIsVerified(true);
      updateMe({ is_verified: true, is_identity_verified: true });
    }, 3600);
  };

  const handleScanDocument = () => {
    setDocScanning(true);
    setTimeout(() => {
      setDocScanning(false);
      setShowDocModal(false);
      setIsIdentityVerified(true);
      setIsVerified(true);
      updateMe({ is_verified: true, is_identity_verified: true });
      showToast(isRTL ? 'مدرک هویتی با موفقیت اسکن و رمزنگاری شد!' : 'ID document successfully scanned and encrypted!');
      addNotification({
        type: 'system',
        title: isRTL ? 'مدرک تایید شد' : 'Document Approved',
        body: isRTL ? 'مدرک شناسایی با موفقیت احراز گردید.' : `${selectedDocType === 'driver_license' ? "Driver's License" : selectedDocType === 'passport' ? 'Passport' : 'National ID'} verified.`,
        icon: 'BadgeCheck',
      });
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingTop: 84, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <GlassCard variant="thick" style={styles.heroCard}>
          <View style={styles.avatarWrap}>
            <GlassAvatar
              src={me.avatar_url}
              name={`${me.first_name} ${me.last_name}`}
              size={84}
            />
            <View style={styles.avatarShield}>
              <ShieldCheck size={18} color="#fff" />
            </View>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.heroName}>{me.first_name} {me.last_name}</Text>
            {isVerified && <GlassBadgeIcon icon="Verified" label={isRTL ? 'تایید شده' : 'Verified'} color="pink" />}
          </View>
          <Text style={styles.heroHandle}>@{me.username}</Text>

          <View style={styles.statusPill}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>
              {isVerified
                ? (isRTL ? 'احراز هویت سطح ۲ • هویت معتبر' : 'Level 2 Verified • Trusted Identity')
                : (isRTL ? 'در حال بررسی احراز هویت' : 'Verification Under Review')}
            </Text>
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>۹۹.۴٪</Text>
              <Text style={styles.statLbl}>{isRTL ? 'تطابق بیومتریک' : 'Match Score'}</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxBorder]}>
              <Text style={styles.statVal}>{isRTL ? 'سطح ۲' : 'Tier 2'}</Text>
              <Text style={styles.statLbl}>{isRTL ? 'سطح اعتماد' : 'Trust Tier'}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>AES-256</Text>
              <Text style={styles.statLbl}>{isRTL ? 'رمزنگاری شده' : 'Encrypted'}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Verification Checkpoints */}
        <Text style={styles.sectionHeading}>
          {isRTL ? 'مراحل احراز هویت' : 'VERIFICATION MILESTONES'}
        </Text>

        <GlassCard style={styles.cardItem}>
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(236,72,153,0.15)' }]}>
              <Camera size={20} color="#ec4899" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemTitle}>
                {isRTL ? 'اسکن بیومتریک چهره' : 'Biometric Face Scan'}
              </Text>
              <Text style={styles.itemDesc}>
                {isRTL ? 'تشخیص زنده بودن سه‌بعدی' : '3D dynamic liveness detection'}
              </Text>
            </View>
            <GlassButton
              variant={isIdentityVerified ? 'secondary' : 'primary'}
              size="sm"
              onPress={startFaceScan}
            >
              {isIdentityVerified ? (isRTL ? 'اسکن دوباره' : 'Re-scan') : (isRTL ? 'اسکن' : 'Scan')}
            </GlassButton>
          </View>
        </GlassCard>

        <GlassCard style={styles.cardItem}>
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
              <Lock size={20} color="#3b82f6" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemTitle}>
                {isRTL ? 'کارت شناسایی معتبر' : 'Government Photo ID'}
              </Text>
              <Text style={styles.itemDesc}>
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
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
              <Smartphone size={20} color="#10b981" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemTitle}>
                {isRTL ? 'احراز شماره موبایل' : 'Phone Authentication'}
              </Text>
              <Text style={styles.itemDesc}>+98 912 ••• 0199 · {isRTL ? 'تایید شده' : 'Verified'}</Text>
            </View>
            <Check size={18} color="#10b981" />
          </View>
        </GlassCard>

        <GlassCard style={styles.cardItem}>
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(245,158,11,0.15)' }]}>
              <Mail size={20} color="#f59e0b" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemTitle}>
                {isRTL ? 'ایمیل سازمانی' : 'Institutional Email'}
              </Text>
              <Text style={styles.itemDesc}>vance@ekip-command.mil · {isRTL ? 'تایید شده' : 'Verified'}</Text>
            </View>
            <Check size={18} color="#10b981" />
          </View>
        </GlassCard>

        {/* Benefits Section */}
        <Text style={styles.sectionHeading}>
          {isRTL ? 'مزایای کاربر تایید شده' : 'VERIFIED OPERATOR PERKS'}
        </Text>
        <GlassCard style={styles.cardItem}>
          <View style={styles.perkRow}>
            <Award size={18} color="#ec4899" />
            <Text style={styles.perkText}>
              {isRTL ? 'اولویت بالا در ساخت و میزبانی اکیپ‌ها' : 'High-priority squad creation and hosting'}
            </Text>
          </View>
          <View style={[styles.perkRow, { marginTop: 12 }]}>
            <Zap size={18} color="#ec4899" />
            <Text style={styles.perkText}>
              {isRTL ? 'عضویت بدون معطلی در مأموریت‌های خصوصی' : 'Instant admission to private tactical missions'}
            </Text>
          </View>
          <View style={[styles.perkRow, { marginTop: 12 }]}>
            <Sparkles size={18} color="#ec4899" />
            <Text style={styles.perkText}>
              {isRTL ? 'نشان شیشه‌ای متمایز تایید هویت' : 'Distinguished pink liquid glass identity badge'}
            </Text>
          </View>
        </GlassCard>

        {/* Manual override / toggle action */}
        <View style={{ marginTop: 20 }}>
          <GlassButton
            variant={isVerified ? 'secondary' : 'primary'}
            onPress={handleToggleVerification}
          >
            {isVerified
              ? (isRTL ? 'غیرفعال‌سازی موقت نشان تایید' : 'Disable Verified Badge')
              : (isRTL ? 'درخواست تایید دستی مدارک' : 'Request Manual Verification')}
          </GlassButton>
        </View>
      </ScrollView>

      {/* Doc Modal */}
      <GlassSheet
        open={showDocModal}
        onClose={() => setShowDocModal(false)}
        title={isRTL ? 'تایید مدرک شناسایی' : 'Document Verification'}
      >
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.label}>{isRTL ? 'نوع مدرک' : 'DOCUMENT TYPE'}</Text>
          <View style={{ marginTop: 8 }}>
            <GlassSegmented
              options={[
                { label: isRTL ? 'کارت ملی' : 'National ID', value: 'national_id', icon: 'UserCheck' },
                { label: isRTL ? 'گذرنامه' : 'Passport', value: 'passport', icon: 'Globe' },
                { label: isRTL ? 'گواهینامه' : "Driver's License", value: 'driver_license', icon: 'Award' },
              ]}
              value={selectedDocType}
              onChange={(v) => setSelectedDocType(v as DocumentType)}
            />
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>{isRTL ? 'شماره مدرک' : 'DOCUMENT NUMBER'}</Text>
          <TextInput
            style={styles.input}
            value={docDetails.docNumber}
            onChangeText={(txt) => setDocDetails((prev) => ({ ...prev, docNumber: txt }))}
            placeholderTextColor="rgba(255,255,255,0.4)"
          />

          <Text style={[styles.label, { marginTop: 16 }]}>{isRTL ? 'کشور صادرکننده' : 'ISSUING JURISDICTION'}</Text>
          <TextInput
            style={styles.input}
            value={docDetails.country}
            onChangeText={(txt) => setDocDetails((prev) => ({ ...prev, country: txt }))}
            placeholderTextColor="rgba(255,255,255,0.4)"
          />

          <View style={{ marginTop: 24 }}>
            <GlassButton
              variant="primary"
              onPress={handleScanDocument}
              disabled={docScanning}
            >
              {docScanning
                ? (isRTL ? 'در حال اعتبارسنجی و رمزنگاری...' : 'Encrypting & Validating...')
                : (isRTL ? 'ثبت و ارسال مدرک شناسایی' : 'Submit ID Document')}
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
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <View style={styles.scannerCircle}>
            <Camera size={40} color="#ec4899" />
          </View>

          <Text style={styles.scanStatusText}>
            {faceScanStep === 'scanning' && (isRTL ? 'در حال اسکن نقاط بیومتریک چهره...' : 'Scanning biometric points...')}
            {faceScanStep === 'smiling' && (isRTL ? 'لطفاً پلک بزنید یا لبخند بزنید...' : 'Please blink or smile naturally...')}
            {faceScanStep === 'success' && (isRTL ? '✓ تطابق بیومتریک ۹۹.۷٪ با موفقیت تایید شد!' : '✓ 99.7% Biometric Match Confirmed!')}
          </Text>

          <Text style={styles.scanDesc}>
            {faceScanStep === 'success'
              ? (isRTL ? 'نمایه رمزنگاری شده چهره شما در سامانه ثبت گردید.' : 'Your cryptographic face profile has been anchored.')
              : (isRTL ? 'چهره خود را درون کادر نگه داشته و از نور مناسب مطمئن شوید.' : 'Keep your face inside the focal area and ensure good lighting.')}
          </Text>

          {faceScanStep === 'success' && (
            <View style={{ marginTop: 20, width: '100%' }}>
              <GlassButton variant="primary" onPress={() => setShowFaceModal(false)}>
                {isRTL ? 'تکمیل' : 'Done'}
              </GlassButton>
            </View>
          )}
        </View>
      </GlassSheet>

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
  heroCard: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 24,
    borderColor: 'rgba(236,72,153,0.3)',
    borderWidth: 1,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  avatarShield: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ec4899',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  heroHandle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(236,72,153,0.1)',
    borderColor: 'rgba(236,72,153,0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ec4899',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ec4899',
  },
  heroStatsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  statLbl: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 4,
  },
  cardItem: {
    padding: 14,
    borderRadius: 18,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  itemDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  perkText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
  },
  scannerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#ec4899',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(236,72,153,0.1)',
    marginBottom: 16,
  },
  scanStatusText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  scanDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
