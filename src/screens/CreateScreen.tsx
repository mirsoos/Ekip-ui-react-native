import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
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
  const { colors, isDark } = useTheme();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GroupCategory>('entertainment');
  const [groupType, setGroupType] = useState<GroupType>('group');
  const [minMembers, setMinMembers] = useState('2');
  const [maxMembers, setMaxMembers] = useState('10');
  const [city, setCity] = useState(me.city ?? 'Sector 7 - Command HQ');
  const [locationName, setLocationName] = useState('');
  const [tags, setTags] = useState<string[]>(['Tactical Ops', 'Reconnaissance']);
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

  const canProceed = () => {
    if (step === 0) return title.trim().length > 2 && description.trim().length > 5;
    if (step === 1) return minMembers && city;
    if (step === 2) return true;
    if (step === 3) return eventDate && eventTime;
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
    canProceed: () => Boolean(canProceed()),
    step,
    totalSteps,
  }));

  React.useEffect(() => {
    onStateChange?.({ step, canProceed: Boolean(canProceed()) });
  }, [step, title, description, category, minMembers, maxMembers, eventDate, eventTime]);

  const handleCreate = () => {
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      owner_id: 'me',
      title,
      description,
      category,
      group_type: groupType,
      min_members: parseInt(minMembers) || 2,
      max_members: maxMembers ? parseInt(maxMembers) : null,
      city,
      location_name: locationName || null,
      latitude: 37.7749,
      longitude: -122.4194,
      tags,
      age_min: ageMin ? parseInt(ageMin) : null,
      age_max: ageMax ? parseInt(ageMax) : null,
      required_level: requiredLevel ? parseInt(requiredLevel) : null,
      required_honor: requiredHonor ? parseInt(requiredHonor) : null,
      gender_preference: genderPref as Group['gender_preference'],
      avg_cost: avgCost ? parseFloat(avgCost) : null,
      cover_url: coverUrl,
      premium_only: premiumOnly,
      visibility: 'public',
      auto_accept: autoAccept,
      is_repeating: isRepeating,
      event_date: `${eventDate}T${eventTime}:00Z`,
      views: 1,
      member_count: 1,
      created_at: new Date().toISOString(),
      owner: me,
    };

    addGroup(newGroup);
    addNotification({
      type: 'group_request',
      title: 'Squad Commissioned',
      body: `"${title}" has been registered and broadcast across ${city}.`,
      icon: 'Rocket',
    });
    onCreated(newGroup);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {step === 0 && (
          <View key={0} className="animate-raise" style={{ gap: 14 }}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              Operation Overview
            </Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
              Define the title, tactical objective, and format.
            </Text>

            <GlassInput
              placeholder="Operation Title (e.g. Dawn Recon Patrol)"
              value={title}
              onChangeText={setTitle}
            />

            <GlassInput
              placeholder="Detailed Mission Directives & Objectives..."
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
              Muster Point & Squad Size
            </Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
              Determine squad capacity and rendezvous coordinates.
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <GlassInput
                  placeholder="Min Operators"
                  value={minMembers}
                  onChangeText={setMinMembers}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <GlassInput
                  placeholder="Max Operators"
                  value={maxMembers}
                  onChangeText={setMaxMembers}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <GlassInput
              icon="MapPin"
              placeholder="Sector / Base City"
              value={city}
              onChangeText={setCity}
            />

            <GlassInput
              placeholder="Specific Rendezvous Point (e.g. Checkpoint Alpha)"
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
              Clearance & Eligibility
            </Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
              Optionally set clearance prerequisites for candidates.
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <GlassInput
                  placeholder="Min Level Required"
                  value={requiredLevel}
                  onChangeText={setRequiredLevel}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <GlassInput
                  placeholder="Min Honor Score"
                  value={requiredHonor}
                  onChangeText={setRequiredHonor}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <GlassInput
                  placeholder="Min Age"
                  value={ageMin}
                  onChangeText={setAgeMin}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <GlassInput
                  placeholder="Max Age"
                  value={ageMax}
                  onChangeText={setAgeMax}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Gender Preference
              </Text>
              <GlassSegmented
                options={[
                  { label: 'Any', value: 'any' },
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
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
              Schedule & Deployment
            </Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
              Pick operational muster time and cover imagery.
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
                label="Automatic Clearance (Instant Join)"
              />
              <GlassToggle
                checked={isRepeating}
                onChange={setIsRepeating}
                label="Recurring Mission Schedule"
              />
              <GlassToggle
                checked={premiumOnly}
                onChange={setPremiumOnly}
                label="Tier-1 / Omega Clearance Only"
              />
            </View>
          </View>
        )}
      </ScrollView>

      <AISuggestionsSheet
        open={showAI}
        onClose={() => setShowAI(false)}
        onApplyTitle={setTitle}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    zIndex: 50,
  },
  aiBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 84,
    paddingBottom: 185,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  stepSub: {
    fontSize: 13,
    marginTop: -4,
    marginBottom: 6,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 12,
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
