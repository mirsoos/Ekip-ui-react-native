import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { GlassButton, GlassInput, GlassToggle, GlassBackButton, GlassSegmented } from '../components/Glass';
import { LiquidLens } from '../components/LiquidLens';
import { StepProgressBar } from '../components/common/StepProgressBar';
import { CoverPicker } from '../components/create/CoverPicker';
import { CategoryTypeSelector } from '../components/create/CategoryTypeSelector';
import { TagSelector } from '../components/create/TagSelector';
import { AISuggestionsSheet } from '../components/create/AISuggestionsSheet';
import { getIcon } from '../lib/icons';
import { allInterests } from '../lib/demoData';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import type { Group, GroupCategory, GroupType } from '../types/database';

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

export const CreateScreen = React.forwardRef<
  CreateScreenHandle,
  {
    onBack: () => void;
    onCreated: (group: Group) => void;
    onStateChange?: (state: { step: number; canProceed: boolean }) => void;
  }
>(function CreateScreen({ onBack, onCreated, onStateChange }, ref) {
  const { me, addGroup, addNotification } = useAppData();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GroupCategory>('entertainment');
  const [groupType, setGroupType] = useState<GroupType>('group');
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
  const [avgCost, setAvgCost] = useState('');
  const [coverUrl, setCoverUrl] = useState(coverOptions[0]);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [eventDate, setEventDate] = useState('2026-10-20');
  const [eventTime, setEventTime] = useState('18:00');
  const [showAI, setShowAI] = useState(false);

  const Sparkles = getIcon('Sparkles');

  const canProceed = (): boolean => {
    if (step === 0) return title.trim().length > 2 && description.trim().length > 5;
    if (step === 1) return Boolean(minMembers && city);
    if (step === 2) return true;
    if (step === 3) return Boolean(eventDate && eventTime);
    return true;
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleCreate();
    }
  };

  const handlePrev = () => {
    if (step === 0) onBack();
    else setStep(step - 1);
  };

  React.useImperativeHandle(ref, () => ({
    handleNext,
    handlePrev,
    openAI: () => setShowAI(true),
    canProceed,
    step,
    totalSteps,
  }));

  React.useEffect(() => {
    onStateChange?.({ step, canProceed: canProceed() });
  }, [step, title, description, minMembers, city, eventDate, eventTime]);

  const handleCreate = () => {
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
      member_count: 1,
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
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'web' && {
            paddingTop: 80 + insets.top,
            paddingBottom: 135 + insets.bottom,
          },
        ]}
      >
        {step === 0 && (
          <View key={0} className="animate-raise" style={{ gap: 14 }}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              {t('create.step0Title')}
            </Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
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
              onChangeGroupType={setGroupType}
            />
          </View>
        )}

        {step === 1 && (
          <View key={1} className="animate-raise" style={{ gap: 14 }}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              {t('create.step1Title')}
            </Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
              {t('create.step1Sub')}
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
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
          </View>
        )}

        {step === 2 && (
          <View key={2} className="animate-raise" style={{ gap: 14 }}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              {t('create.step2Title')}
            </Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
              {t('create.step2Sub')}
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
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

            <View style={{ flexDirection: 'row', gap: 10 }}>
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
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                {t('create.genderPref')}
              </Text>
              <GlassSegmented
                options={[
                  { label: t('create.genderAny'), value: 'any' },
                  { label: t('create.genderMale'), value: 'male' },
                  { label: t('create.genderFemale'), value: 'female' },
                ]}
                value={genderPref}
                onChange={setGenderPref}
              />
            </View>
          </View>
        )}

        {step === 3 && (
          <View key={3} className="animate-raise" style={{ gap: 14 }}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              {t('create.step3Title')}
            </Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
              {t('create.step3Sub')}
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <GlassInput
                  icon="Calendar"
                  placeholder="Date (YYYY-MM-DD)"
                  value={eventDate}
                  onChangeText={setEventDate}
                />
              </View>
              <View style={{ flex: 1 }}>
                <GlassInput
                  icon="Clock"
                  placeholder="Time (HH:MM)"
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
          </View>
        )}
      </ScrollView>

      <AISuggestionsSheet
        open={showAI}
        onClose={() => setShowAI(false)}
        onApplyTitle={setTitle}
        onApplyDescription={setDescription}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 110,
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
  footerWrap: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 98 : 88,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 80,
  },
  continueButton: {
    position: 'relative',
    height: 52,
    borderRadius: 36,
    borderWidth: 1,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
