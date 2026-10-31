import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { GlassInput, GlassBackButton, GlassCard } from '../Glass';
import { StepProgressBar } from '../common/StepProgressBar';
import { FrostedGlass } from '../FrostedGlass';
import { LanguageSwitcherPill } from '../common/LanguageSwitcherPill';
import { Icons } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { useAppData } from '../../lib/appData';
import { allInterests } from '../../lib/demoData';
import { HEADER_METRICS, getHeaderTopInset, getSinglePillContentPaddingTop } from '../../lib/headerLayout';

const totalSteps = 4;

const MOOD_EMOJIS = [
  '🔥', '☕', '🎲', '🏕️', '🍕', '🎉',
  '😎', '🎵', '⚡', '🌙', '💼', '🚀',
  '🏖️', '🎮', '🍿', '💡', '🎨', '🚲',
];

export function RegisterWizardComponent({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const { updateMe } = useAppData();

  const [step, setStep] = useState(0);

  // Step 0: Real User Avatar & Credentials
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  // Step 1: Info & Location
  const [age, setAge] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [city, setCity] = useState(isRTL ? 'تهران - سعادت‌آباد' : 'Tehran - Saadat Abad');
  const [job, setJob] = useState('');
  const [isSearchable, setIsSearchable] = useState(true);

  // Step 2: Mood (Emoji only)
  const [selectedMood, setSelectedMood] = useState('🔥');

  // Step 3: Interests, Real Custom Banner & Confirmation
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    allInterests[0] || 'کافه‌گردی',
    allInterests[1] || 'بوردگیم',
  ]);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(true);

  const pickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedAvatar(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Failed to pick avatar image:', err);
    }
  };

  const pickBanner = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setBannerUrl(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Failed to pick banner image:', err);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const canProceed = () => {
    if (step === 0) return username.trim().length >= 3 && password.length >= 6;
    if (step === 1) return age.trim().length > 0 && city.trim().length > 0;
    if (step === 2) return Boolean(selectedMood);
    if (step === 3) return selectedInterests.length >= 1 && acceptTerms;
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      updateMe({
        username: username.trim(),
        avatar_url: selectedAvatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
        banner_url: bannerUrl,
        age: parseInt(age, 10) || null,
        city: city.trim() || null,
        job: job.trim() || null,
        interests: selectedInterests,
        mood: selectedMood,
      });
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step === 0) onBack();
    else setStep(step - 1);
  };

  const isFinal = step === totalSteps - 1;
  const NextIcon = isFinal ? Icons.Check : isRTL ? Icons.ArrowLeft : Icons.ArrowRight;

  return (
    <View style={styles.root}>
      {/* 360° Liquid Glass Header with Language Switcher */}
      <View
        style={[
          styles.headerOuter,
          {
            paddingTop: getHeaderTopInset(insets.top),
          },
        ]}
        pointerEvents="box-none"
      >
        <View
          style={[
            styles.headerContainer,
            { flexDirection: isRTL ? 'row-reverse' : 'row', borderColor: colors.glassBorderStrong },
          ]}
        >
          <FrostedGlass
            borderRadius={36}
            marginWidth={16}
            scale={36}
            blurDeviation={2.0}
            overlayOpacity={isDark ? 0.08 : 0.15}
            style={StyleSheet.absoluteFill}
          />
          <GlassBackButton onPress={handlePrev} style={{ zIndex: 10 }} />
          <View style={{ flex: 1, marginHorizontal: 8, zIndex: 10 }}>
            <StepProgressBar currentStep={step} totalSteps={totalSteps} />
          </View>
          <LanguageSwitcherPill style={{ zIndex: 10 }} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: getSinglePillContentPaddingTop(insets.top),
            paddingBottom: 110 + insets.bottom,
          },
        ]}
      >
        {/* STEP 0: عکس و حساب کاربری */}
        {step === 0 && (
          <View key={0} className="animate-raise" style={{ gap: 16 }}>
            <View>
              <Text style={[styles.title, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'عکس و حساب کاربری' : 'Photo & Account'}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL
                  ? 'عکس پروفایل، نام کاربری اختصاصی و رمز عبور خود را وارد کنید.'
                  : 'Set your profile photo, unique username, and password.'}
              </Text>
            </View>

            {/* Single Prominent Avatar with Camera/Gallery Upload Button */}
            <View style={styles.avatarSection}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={pickAvatar}
                style={[
                  styles.avatarHeroWrapper,
                  !selectedAvatar && {
                    borderStyle: 'dashed',
                    borderColor: 'rgba(236,72,153,0.6)',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  },
                ]}
              >
                {selectedAvatar ? (
                  <Image source={{ uri: selectedAvatar }} style={styles.avatarHeroImg} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Icons.User size={38} color={colors.textTertiary} strokeWidth={1.8} />
                  </View>
                )}
                <View
                  style={[
                    styles.avatarCameraBadge,
                    { backgroundColor: '#ec4899', borderColor: colors.bgCanvas },
                  ]}
                >
                  {selectedAvatar ? (
                    <Icons.Camera size={16} color="#ffffff" strokeWidth={2.4} />
                  ) : (
                    <Icons.Plus size={18} color="#ffffff" strokeWidth={2.6} />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={[styles.avatarHint, { color: colors.textSecondary }]}>
                {selectedAvatar
                  ? (isRTL ? 'برای تغییر عکس پروفایل لمس کنید' : 'Tap to change profile picture')
                  : (isRTL ? 'برای انتخاب عکس از گالری لمس کنید' : 'Tap to choose photo from gallery')}
              </Text>
            </View>

            {/* Inputs */}
            <View style={{ gap: 12 }}>
              <GlassInput
                icon="User"
                placeholder={isRTL ? 'نام کاربری (مثال: alex_8)' : 'Username (e.g. alex_8)'}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <GlassInput
                icon="Lock"
                placeholder={isRTL ? 'رمز عبور (حداقل ۶ کاراکتر)' : 'Password (min 6 characters)'}
                value={password}
                onChangeText={setPassword}
                secure
              />
              <GlassInput
                icon="Sparkles"
                placeholder={isRTL ? 'کد دعوت (اختیاری)' : 'Invite Code (Optional)'}
                value={inviteCode}
                onChangeText={setInviteCode}
                autoCapitalize="characters"
              />
            </View>
          </View>
        )}

        {/* STEP 1: مشخصات و موقعیت */}
        {step === 1 && (
          <View key={1} className="animate-raise" style={{ gap: 16 }}>
            <View>
              <Text style={[styles.title, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'مشخصات و موقعیت' : 'Details & Location'}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL
                  ? 'سن، تاریخ تولد، شهر سکونت و شغل خود را مشخص کنید.'
                  : 'Enter your age, birth date, city, and occupation.'}
              </Text>
            </View>

            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <GlassInput
                    icon="Calendar"
                    placeholder={isRTL ? 'سن (مثال: ۲۴)' : 'Age (e.g. 24)'}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1.3 }}>
                  <GlassInput
                    icon="Clock"
                    placeholder={isRTL ? 'تاریخ تولد (مثال: ۱۳۷۸/۰۵)' : 'Birth Date (YYYY/MM)'}
                    value={birthDate}
                    onChangeText={setBirthDate}
                  />
                </View>
              </View>

              <GlassInput
                icon="MapPin"
                placeholder={isRTL ? 'شهر و منطقه سکونت' : 'City & District'}
                value={city}
                onChangeText={setCity}
              />

              <GlassInput
                icon="Briefcase"
                placeholder={isRTL ? 'شغل و حرفه (مثال: طراح محصول)' : 'Occupation (e.g. Designer)'}
                value={job}
                onChangeText={setJob}
              />
            </View>

            {/* Checkbox: Searchable */}
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => setIsSearchable(!isSearchable)}
            >
              <GlassCard
                variant="thin"
                style={[
                  styles.searchableCard,
                  isSearchable && { borderColor: 'rgba(244, 114, 182, 0.4)' },
                ]}
              >
                <View style={[styles.searchableRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.searchableIconBox, { backgroundColor: 'rgba(236,72,153,0.15)' }]}>
                    <Icons.Search size={20} color="#ec4899" />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 10 }}>
                    <Text
                      style={[
                        styles.searchableTitle,
                        { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' },
                      ]}
                    >
                      {isRTL ? 'پروفایل من در جستجوی اعضا قابل مشاهده باشد' : 'Profile Discoverable in Search'}
                    </Text>
                    <Text
                      style={[
                        styles.searchableDesc,
                        { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' },
                      ]}
                    >
                      {isRTL
                        ? 'به سایر کاربران اجازه پیدا کردن حساب و دعوت شما به دورهمی‌ها را می‌دهد.'
                        : 'Allows other users to find your profile and invite you to hangouts.'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isSearchable ? '#ec4899' : 'transparent',
                        borderColor: isSearchable ? '#ec4899' : colors.glassBorder,
                      },
                    ]}
                  >
                    {isSearchable && <Icons.Check size={13} color="#ffffff" strokeWidth={3} />}
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: مود و حس‌وحال (Emoji-only Mood Selector) */}
        {step === 2 && (
          <View key={2} className="animate-raise" style={{ gap: 16 }}>
            <View>
              <Text style={[styles.title, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'مود و حس‌وحال شما' : 'Your Vibe & Mood'}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL
                  ? 'یک ایموجی برای مود و حس‌وحال فعلی‌تان انتخاب کنید:'
                  : 'Pick an emoji that represents your current mood:'}
              </Text>
            </View>

            {/* Selected Mood Hero Display */}
            <View style={styles.selectedMoodBanner}>
              <Text style={styles.selectedMoodBigEmoji}>{selectedMood}</Text>
            </View>

            {/* Pure Emoji Grid */}
            <View style={styles.emojiGrid}>
              {MOOD_EMOJIS.map((emoji) => {
                const isSelected = selectedMood === emoji;
                return (
                  <TouchableOpacity
                    key={emoji}
                    activeOpacity={0.75}
                    onPress={() => setSelectedMood(emoji)}
                    style={[
                      styles.emojiButton,
                      {
                        backgroundColor: isSelected ? 'rgba(236,72,153,0.18)' : colors.glassThinBg,
                        borderColor: isSelected ? '#ec4899' : colors.glassBorder,
                      },
                    ]}
                  >
                    <Text style={styles.emojiItemText}>{emoji}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 3: علایق، بنر و پیش‌نمایش پروفایل */}
        {step === 3 && (
          <View key={3} className="animate-raise" style={{ gap: 16 }}>
            <View>
              <Text style={[styles.title, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'علایق و پیش‌نمایش پروفایل' : 'Interests & Profile Preview'}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL
                  ? 'علایق خود را مشخص کنید و پیش‌نمایش پروفایل کاربری خود را ببینید.'
                  : 'Select your hobbies and preview how your profile looks.'}
              </Text>
            </View>

            {/* Interests Chips Selector */}
            <View style={{ gap: 8 }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL ? 'علایق و سرگرمی‌ها (حداقل ۱ مورد)' : 'Interests & Activities (pick at least 1)'}
              </Text>
              <View style={[styles.chipsWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                {allInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <TouchableOpacity
                      key={interest}
                      activeOpacity={0.78}
                      onPress={() => toggleInterest(interest)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected ? 'rgba(244, 114, 182, 0.2)' : colors.glassThinBg,
                          borderColor: isSelected ? '#ec4899' : colors.glassBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? '#f472b6' : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {interest}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Profile Preview Card with Banner (matching ProfileScreen.tsx) */}
            <View style={{ marginTop: 8 }}>
              <View style={[styles.previewSectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginBottom: 0 }]}>
                  {isRTL ? 'پیش‌نمایش پروفایل شما' : 'Profile Preview'}
                </Text>

                {/* Button to Add/Change Banner */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={pickBanner}
                  style={[
                    styles.bannerActionBtn,
                    {
                      borderColor: colors.glassBorderStrong,
                      backgroundColor: colors.glassThinBg,
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                    },
                  ]}
                >
                  <Icons.Image size={14} color="#f472b6" style={{ marginHorizontal: 4 }} />
                  <Text style={[styles.bannerActionText, { color: colors.textPrimary }]}>
                    {bannerUrl
                      ? (isRTL ? 'تغییر بنر' : 'Change Banner')
                      : (isRTL ? 'انتخاب بنر از گالری' : 'Pick Banner')}
                  </Text>
                </TouchableOpacity>
              </View>

              <GlassCard variant="thick" style={styles.previewCard}>
                {/* Banner Area */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={pickBanner}
                  style={styles.previewBannerWrap}
                >
                  {bannerUrl ? (
                    <>
                      <Image source={{ uri: bannerUrl }} style={styles.previewBannerImg} />
                      <LinearGradient
                        colors={['rgba(0,0,0,0.15)', 'transparent', 'rgba(0,0,0,0.65)']}
                        style={StyleSheet.absoluteFill}
                      />
                      <View style={styles.bannerOverlayPill}>
                        <Icons.Image size={12} color="#ffffff" />
                        <Text style={styles.bannerOverlayPillText}>
                          {isRTL ? 'تغییر کاور' : 'Change Cover'}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <View
                      style={[
                        styles.previewBannerImg,
                        styles.bannerEmptyWrap,
                        { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' },
                      ]}
                    >
                      <Icons.Image size={20} color={colors.textTertiary} />
                      <Text style={[styles.bannerEmptyText, { color: colors.textTertiary }]}>
                        {isRTL ? 'انتخاب تصویر بنر از گالری (اختیاری)' : 'Add Banner from Gallery (Optional)'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Avatar overlapping banner bottom */}
                <View style={[styles.previewAvatarOverlap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={pickAvatar}
                    style={styles.previewAvatarBtn}
                  >
                    {selectedAvatar ? (
                      <Image source={{ uri: selectedAvatar }} style={styles.previewAvatar} />
                    ) : (
                      <View
                        style={[
                          styles.previewAvatar,
                          styles.previewAvatarPlaceholder,
                          { backgroundColor: colors.glassThinBg },
                        ]}
                      >
                        <Icons.User size={26} color={colors.textTertiary} strokeWidth={1.8} />
                      </View>
                    )}
                    <View
                      style={[
                        styles.previewAvatarEditDot,
                        { backgroundColor: '#ec4899', borderColor: colors.bgCanvas },
                      ]}
                    >
                      <Icons.Camera size={11} color="#ffffff" strokeWidth={2.4} />
                    </View>
                  </TouchableOpacity>
                  <View style={{ flex: 1, marginHorizontal: 12, justifyContent: 'flex-end', paddingBottom: 4 }}>
                    <Text
                      style={[
                        styles.previewUsername,
                        { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' },
                      ]}
                    >
                      @{username || 'username'}
                    </Text>
                    <Text
                      style={[
                        styles.previewMeta,
                        { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' },
                      ]}
                    >
                      {city} {job ? `· ${job}` : ''} {age ? `· ${age} سال` : ''}
                    </Text>
                  </View>
                </View>

                {/* Badges: Mood Emoji + Selected Interests */}
                <View style={[styles.previewBadgeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.previewBadgePill, { backgroundColor: 'rgba(236,72,153,0.18)' }]}>
                    <Text style={{ fontSize: 14 }}>{selectedMood}</Text>
                    <Text style={[styles.previewBadgeText, { color: '#ec4899', marginHorizontal: 4 }]}>
                      {isRTL ? 'مود انتخابی' : 'Active Vibe'}
                    </Text>
                  </View>
                  <View style={[styles.previewBadgePill, { backgroundColor: colors.glassThinBg }]}>
                    <Text style={[styles.previewBadgeText, { color: colors.textSecondary }]}>
                      {selectedInterests.length} {isRTL ? 'علاقه انتخابی' : 'selected interests'}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </View>

            {/* Terms checkbox */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAcceptTerms(!acceptTerms)}
              style={[styles.termsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: acceptTerms ? '#ec4899' : 'transparent',
                    borderColor: acceptTerms ? '#ec4899' : colors.glassBorder,
                  },
                ]}
              >
                {acceptTerms && <Icons.Check size={13} color="#ffffff" strokeWidth={3} />}
              </View>
              <Text
                style={[
                  styles.termsText,
                  { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {isRTL
                  ? 'شرایط و قوانین عضویت در اپلیکیشن اکیپ را می‌پذیرم.'
                  : 'I agree to the Ekip Community Guidelines & Terms of Service.'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 360° Liquid Glass Continue Button */}
      <View
        style={[
          styles.footerWrap,
          {
            paddingBottom: Platform.OS === 'web' ? 12 : Math.max(12, insets.bottom + 6),
          },
        ]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          disabled={!canProceed()}
          style={[
            styles.continueButton,
            {
              borderColor: colors.glassBorderStrong,
              opacity: canProceed() ? 1 : 0.45,
            },
          ]}
        >
          <FrostedGlass
            borderRadius={36}
            marginWidth={16}
            scale={36}
            blurDeviation={2.0}
            overlayOpacity={isDark ? 0.08 : 0.15}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.buttonContent}>
            <Text style={[styles.continueText, { color: colors.textPrimary }]}>
              {isFinal ? (isRTL ? 'ثبت‌نام و ورود به برنامه' : 'Complete & Enter App') : t('create.continue')}
            </Text>
            <NextIcon
              size={18}
              color={colors.textPrimary}
              strokeWidth={2.4}
              style={{
                position: 'absolute',
                ...(isRTL ? { left: 22 } : { right: 22 }),
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: HEADER_METRICS.marginHorizontal,
    zIndex: 900,
  },
  headerContainer: {
    position: 'relative',
    height: HEADER_METRICS.pillHeight,
    borderRadius: 36,
    borderWidth: 1,
    paddingVertical: HEADER_METRICS.paddingVertical,
    paddingHorizontal: HEADER_METRICS.paddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.35,
          shadowRadius: 24,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.35,
          shadowRadius: 24,
          elevation: 10,
        }),
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 88,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 6,
    lineHeight: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  avatarHeroWrapper: {
    position: 'relative',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2.5,
    borderColor: '#ec4899',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarHeroImg: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
  },
  avatarHint: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: '600',
  },
  searchableCard: {
    padding: 14,
    borderRadius: 22,
    marginTop: 4,
  },
  searchableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchableIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchableTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  searchableDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMoodBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 22,
    backgroundColor: 'rgba(236,72,153,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(236,72,153,0.4)',
    marginBottom: 4,
  },
  selectedMoodBigEmoji: {
    fontSize: 48,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiItemText: {
    fontSize: 24,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
  previewSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bannerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  bannerActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  previewCard: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 0,
  },
  previewBannerWrap: {
    position: 'relative',
    height: 100,
    width: '100%',
  },
  previewBannerImg: {
    width: '100%',
    height: '100%',
  },
  bannerEmptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 6,
  },
  bannerEmptyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bannerOverlayPill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bannerOverlayPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  previewAvatarOverlap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    marginTop: -30,
    zIndex: 10,
  },
  previewAvatarBtn: {
    position: 'relative',
  },
  previewAvatar: {
    width: 60,
    height: 60,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#ec4899',
  },
  previewAvatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAvatarEditDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  previewUsername: {
    fontSize: 16,
    fontWeight: '800',
  },
  previewMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  previewBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  previewBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  previewBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 900,
  },
  continueButton: {
    position: 'relative',
    height: 56,
    borderRadius: 36,
    borderWidth: 1,
    overflow: 'visible',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
          elevation: 14,
        }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    position: 'relative',
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export const RegisterWizard = React.memo(RegisterWizardComponent);
