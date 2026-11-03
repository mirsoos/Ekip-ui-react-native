// --- START OF FILE CreateScreen.tsx ---

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  Keyboard,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { GlassInput, GlassToggle } from '../components/Glass';
import { TactileSegmented } from '../components/common/TactileSegmented';
import { CoverPicker } from '../components/create/CoverPicker';
import { CategoryTypeSelector } from '../components/create/CategoryTypeSelector';
import { TagSelector } from '../components/create/TagSelector';
import { AISuggestionsSheet } from '../components/create/AISuggestionsSheet';
import { SelectMembersSheet } from '../components/create/SelectMembersSheet';
import { allInterests } from '../lib/demoData';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';
import type { Group, GroupCategory, GroupType, Profile } from '../types/database';

const coverOptions = [
  'https://images.pexels.com/photos/167964/pexels-photo-167964.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/1654748/pexels-photo-1654748.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/1677256/pexels-photo-1677256.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/6952383/pexels-photo-6952383.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
];

const totalSteps = 4;

export interface CreateScreenHandle {
  handleNext: () => void;
  handlePrev: () => void;
  openAI: () => void;
  canProceed: () => boolean;
  step: number;
  totalSteps: number;
}

export const CreateScreen = React.memo(
  React.forwardRef<
    CreateScreenHandle,
    {
      onBack: () => void;
      onCreated: (group: Group) => void;
      onStateChange?: (state: { step: number; canProceed: boolean }) => void;
    }
  >(function CreateScreen({ onBack, onCreated, onStateChange }, ref) {
    const { me, addGroup, addNotification } = useAppData();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const { t, isRTL } = useI18n();

    const [step, setStep] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<GroupCategory>('entertainment');
    const [groupType, setGroupType] = useState<GroupType>('solo');
    const [initialMembers, setInitialMembers] = useState<Profile[]>([]);
    const [showMembersSheet, setShowMembersSheet] = useState(false);
    const scrollViewRef = useRef<any>(null);
    const [minMembers, setMinMembers] = useState('2');
    const [maxMembers, setMaxMembers] = useState('10');
    const [city, setCity] = useState(me.city ?? 'بخش ۷ - ستاد فرماندهی');
    const [locationName, setLocationName] = useState('');
    const [tags, setTags] = useState<string[]>(['عملیات تاکتیکی', 'شناسایی و دیده‌بانی']);
    const [ageMin, setAgeMin] = useState('');
    const [ageMax, setAgeMax] = useState('');
    const [requiredLevel, setRequiredLevel] = useState('');
    const [requiredHonor, setRequiredHonor] = useState('');
    const [genderPref, setGenderPref] = useState('any');
    const [avgCost] = useState('');
    const [coverUrl, setCoverUrl] = useState(coverOptions[0]);
    const [premiumOnly, setPremiumOnly] = useState(false);
    const [autoAccept, setAutoAccept] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [eventDate, setEventDate] = useState('2026-10-20');
    const [eventTime, setEventTime] = useState('18:00');
    const [showAI, setShowAI] = useState(false);

    // انیمیشن ورود نرم هر مرحله روی موبایل و وب (معادل کلاس animate-raise)
    const stepAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      stepAnim.stopAnimation();
      stepAnim.setValue(0);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      Animated.timing(stepAnim, {
        toValue: 1,
        duration: 240,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }, [step, stepAnim]);

    const stepTranslateY = stepAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 0],
    });

    const canProceed = useCallback((): boolean => {
      if (step === 0) {
        const basicValid = title.trim().length > 2 && description.trim().length > 5;
        const membersValid =
          groupType === 'solo'
            ? true
            : groupType === 'couple'
            ? initialMembers.length === 1
            : initialMembers.length >= 1;
        return basicValid && membersValid;
      }
      if (step === 1) return Boolean(minMembers && city);
      if (step === 2) return true;
      if (step === 3) return Boolean(eventDate && eventTime);
      return true;
    }, [step, title, description, groupType, initialMembers.length, minMembers, city, eventDate, eventTime]);

    const toggleInitialMember = useCallback(
      (profile: Profile) => {
        setInitialMembers((prev) => {
          const exists = prev.some((m) => m.id === profile.id);
          if (exists) {
            return prev.filter((m) => m.id !== profile.id);
          }
          if (groupType === 'couple') {
            return [profile];
          }
          return [...prev, profile];
        });
      },
      [groupType]
    );

    const toggleTag = useCallback((tag: string) => {
      setTags((prev) =>
        prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
      );
    }, []);

    const handleCreate = useCallback(() => {
      Keyboard.dismiss();
      const newGroup: Group = {
        id: `g-${Date.now()}`,
        owner_id: 'me',
        title: title.trim(),
        description: description.trim(),
        category,
        group_type: groupType,
        min_members: parseInt(minMembers, 10) || 2,
        max_members: parseInt(maxMembers, 10) || 10,
        city: city.trim(),
        location_name: locationName.trim() || null,
        latitude: null,
        longitude: null,
        tags,
        age_min: ageMin ? parseInt(ageMin, 10) : null,
        age_max: ageMax ? parseInt(ageMax, 10) : null,
        required_level: requiredLevel ? parseInt(requiredLevel, 10) : null,
        required_honor: requiredHonor ? parseInt(requiredHonor, 10) : null,
        gender_preference: (genderPref as any) || 'any',
        avg_cost: avgCost ? parseInt(avgCost, 10) : 0,
        cover_url: coverUrl,
        premium_only: premiumOnly,
        visibility: 'public',
        auto_accept: autoAccept,
        is_repeating: isRepeating,
        event_date: `${eventDate}T${eventTime}:00Z`,
        views: 0,
        member_count: 1 + initialMembers.length,
        created_at: new Date().toISOString(),
        owner: me,
      };

      addGroup(newGroup);
      addNotification({
        type: 'group_request',
        title: isRTL ? 'اکیپ جدید مستقر شد' : 'Ekip Deployed',
        body: isRTL
          ? `اکیپ «${title}» با موفقیت در ${city} ثبت و منتشر گردید.`
          : `"${title}" has been registered and broadcast across ${city}.`,
        icon: 'Rocket',
      });
      onCreated(newGroup);
    }, [
      title,
      description,
      category,
      groupType,
      minMembers,
      maxMembers,
      city,
      locationName,
      tags,
      ageMin,
      ageMax,
      requiredLevel,
      requiredHonor,
      genderPref,
      avgCost,
      coverUrl,
      premiumOnly,
      autoAccept,
      isRepeating,
      eventDate,
      eventTime,
      initialMembers.length,
      me,
      addGroup,
      addNotification,
      isRTL,
      onCreated,
    ]);

    const handleNext = useCallback(() => {
      Keyboard.dismiss();
      if (step < totalSteps - 1) {
        setStep((prev) => prev + 1);
      } else {
        handleCreate();
      }
    }, [step, handleCreate]);

    const handlePrev = useCallback(() => {
      Keyboard.dismiss();
      if (step === 0) onBack();
      else setStep((prev) => prev - 1);
    }, [step, onBack]);

    // پشتیبانی از دکمه Back فیزیکی اندروید بین مراحل ۴ گانه
    useEffect(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (showAI) {
          setShowAI(false);
          return true;
        }
        if (showMembersSheet) {
          setShowMembersSheet(false);
          return true;
        }
        handlePrev();
        return true;
      });
      return () => sub.remove();
    }, [showAI, showMembersSheet, handlePrev]);

    React.useImperativeHandle(
      ref,
      () => ({
        handleNext,
        handlePrev,
        openAI: () => setShowAI(true),
        canProceed,
        step,
        totalSteps,
      }),
      [handleNext, handlePrev, canProceed, step]
    );

    useEffect(() => {
      onStateChange?.({ step, canProceed: canProceed() });
    }, [step, canProceed, onStateChange]);

    const handleChangeGroupType = useCallback((type: GroupType) => {
      setGroupType(type);
      if (type === 'couple') {
        setInitialMembers((prev) => (prev.length > 1 ? [prev[0]] : prev));
      }
      if (type !== 'solo') {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 120);
      }
    }, []);

    const handleOpenMembersSheet = useCallback(() => {
      Keyboard.dismiss();
      setShowMembersSheet(true);
    }, []);

    const handleCloseMembersSheet = useCallback(() => {
      setShowMembersSheet(false);
    }, []);

    const handleCloseAI = useCallback(() => {
      setShowAI(false);
    }, []);

    const genderOptions = useMemo(
      () => [
        { label: t('create.genderAny'), value: 'any' },
        { label: t('create.genderMale'), value: 'male' },
        { label: t('create.genderFemale'), value: 'female' },
      ],
      [t]
    );

    const rowDir = isRTL ? ('row-reverse' as const) : ('row' as const);
    const textAlign = isRTL ? ('right' as const) : ('left' as const);

    return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: getSinglePillContentPaddingTop(insets.top),
              paddingBottom: 175 + insets.bottom,
            },
          ]}
        >
          <Animated.View
            style={{
              gap: 14,
              opacity: stepAnim,
              transform: [{ translateY: stepTranslateY }],
            }}
          >
            {step === 0 && (
              <>
                <Text style={[styles.stepTitle, { color: colors.textPrimary, textAlign }]}>
                  {t('create.step0Title')}
                </Text>
                <Text style={[styles.stepSub, { color: colors.textSecondary, textAlign }]}>
                  {t('create.step0Sub')}
                </Text>

                <GlassInput
                  placeholder={t('create.titlePlaceholder')}
                  value={title}
                  onChangeText={setTitle}
                />

                <GlassInput
                  placeholder={t('create.descPlaceholder')}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                />

                <CategoryTypeSelector
                  category={category}
                  groupType={groupType}
                  onChangeCategory={setCategory}
                  onChangeGroupType={handleChangeGroupType}
                  initialMembers={initialMembers}
                  onOpenMembersSheet={handleOpenMembersSheet}
                />
              </>
            )}

            {step === 1 && (
              <>
                <Text style={[styles.stepTitle, { color: colors.textPrimary, textAlign }]}>
                  {t('create.step1Title')}
                </Text>
                <Text style={[styles.stepSub, { color: colors.textSecondary, textAlign }]}>
                  {t('create.step1Sub')}
                </Text>

                <View style={{ flexDirection: rowDir, gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <GlassInput
                      placeholder={t('create.minOperators')}
                      value={minMembers}
                      onChangeText={setMinMembers}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <GlassInput
                      placeholder={t('create.maxOperators')}
                      value={maxMembers}
                      onChangeText={setMaxMembers}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <GlassInput
                  icon="MapPin"
                  placeholder={t('create.cityPlaceholder')}
                  value={city}
                  onChangeText={setCity}
                />

                <GlassInput
                  placeholder={t('create.locationPlaceholder')}
                  value={locationName}
                  onChangeText={setLocationName}
                />

                <TagSelector
                  availableTags={allInterests}
                  selectedTags={tags}
                  onToggleTag={toggleTag}
                />
              </>
            )}

            {step === 2 && (
              <>
                <Text style={[styles.stepTitle, { color: colors.textPrimary, textAlign }]}>
                  {t('create.step2Title')}
                </Text>
                <Text style={[styles.stepSub, { color: colors.textSecondary, textAlign }]}>
                  {t('create.step2Sub')}
                </Text>

                <View style={{ flexDirection: rowDir, gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <GlassInput
                      placeholder={t('create.minLevel')}
                      value={requiredLevel}
                      onChangeText={setRequiredLevel}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <GlassInput
                      placeholder={t('create.minHonor')}
                      value={requiredHonor}
                      onChangeText={setRequiredHonor}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={{ flexDirection: rowDir, gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <GlassInput
                      placeholder={t('create.minAge')}
                      value={ageMin}
                      onChangeText={setAgeMin}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <GlassInput
                      placeholder={t('create.maxAge')}
                      value={ageMax}
                      onChangeText={setAgeMax}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary, textAlign }]}>
                    {t('create.genderPref')}
                  </Text>
                  <TactileSegmented
                    options={genderOptions}
                    value={genderPref}
                    onChange={setGenderPref}
                  />
                </View>
              </>
            )}

            {step === 3 && (
              <>
                <Text style={[styles.stepTitle, { color: colors.textPrimary, textAlign }]}>
                  {t('create.step3Title')}
                </Text>
                <Text style={[styles.stepSub, { color: colors.textSecondary, textAlign }]}>
                  {t('create.step3Sub')}
                </Text>

                <View style={{ flexDirection: rowDir, gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <GlassInput
                      icon="Calendar"
                      placeholder={t('create.datePlaceholder')}
                      value={eventDate}
                      onChangeText={setEventDate}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <GlassInput
                      icon="Clock"
                      placeholder={t('create.timePlaceholder')}
                      value={eventTime}
                      onChangeText={setEventTime}
                    />
                  </View>
                </View>

                <CoverPicker
                  options={coverOptions}
                  selectedUrl={coverUrl}
                  onSelect={setCoverUrl}
                />

                <View style={{ gap: 10, marginTop: 8 }}>
                  <GlassToggle
                    checked={autoAccept}
                    onChange={setAutoAccept}
                    label={t('create.autoAccept')}
                  />
                  <GlassToggle
                    checked={isRepeating}
                    onChange={setIsRepeating}
                    label={t('create.recurring')}
                  />
                  <GlassToggle
                    checked={premiumOnly}
                    onChange={setPremiumOnly}
                    label={t('discover.filterPremiumOnly')}
                  />
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>

        <AISuggestionsSheet
          open={showAI}
          onClose={handleCloseAI}
          onApplyTitle={setTitle}
          onApplyDescription={setDescription}
        />

        <SelectMembersSheet
          open={showMembersSheet}
          onClose={handleCloseMembersSheet}
          selectedMembers={initialMembers}
          onToggleMember={toggleInitialMember}
          maxSelection={groupType === 'couple' ? 1 : undefined}
        />
      </View>
    );
  })
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  stepSub: {
    fontSize: 13,
    marginTop: -8,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
});