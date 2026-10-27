import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassButton, GlassInput, GlassSegmented } from '../components/Glass';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { Toast } from '../components/Overlays';
import { allInterests } from '../lib/demoData';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import type { Gender } from '../types/database';

const AVATAR_PRESETS = [
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/1220794/pexels-photo-1220794.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
];

export function PersonalInfoScreenComponent({
  onBack,
  onOpenVerification,
}: {
  onBack: () => void;
  onOpenVerification?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { me, updateMe } = useAppData();
  const { colors } = useTheme();
  const { isRTL, t } = useI18n();

  const [firstName, setFirstName] = useState(me.first_name);
  const [lastName, setLastName] = useState(me.last_name);
  const [username, setUsername] = useState(me.username);
  const [job, setJob] = useState(me.job ?? '');
  const [city, setCity] = useState(me.city ?? '');
  const [bio, setBio] = useState(me.bio ?? '');
  const [age, setAge] = useState(me.age ? String(me.age) : '28');
  const [gender, setGender] = useState<Gender>(me.gender ?? 'male');
  const [selectedAvatar, setSelectedAvatar] = useState(me.avatar_url ?? AVATAR_PRESETS[0]);
  const [interests, setInterests] = useState<string[]>(me.interests ?? ['بوردگیم', 'کافه‌گردی']);
  const [toast, setToast] = useState('');

  const toggleInterest = (tag: string) => {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    updateMe({
      first_name: firstName,
      last_name: lastName,
      username,
      job: job || null,
      city: city || null,
      bio: bio || null,
      age: parseInt(age) || null,
      gender,
      avatar_url: selectedAvatar,
      interests,
    });
    setToast(isRTL ? 'اطلاعات کاربری با موفقیت به‌روزرسانی شد' : 'Dossier updated successfully');
    setTimeout(() => {
      setToast('');
      onBack();
    }, 1500);
  };

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
        {/* Avatar Preset Selector */}
        <View style={{ gap: 8 }}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            {isRTL ? 'تصویر پروفایل' : 'Operator Avatar'}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
          >
            {AVATAR_PRESETS.map((url) => {
              const isSelected = selectedAvatar === url;
              return (
                <TouchableOpacity
                  key={url}
                  activeOpacity={0.8}
                  onPress={() => setSelectedAvatar(url)}
                  style={[
                    styles.avatarChoice,
                    isSelected && { borderColor: '#f472b6', borderWidth: 2 },
                  ]}
                >
                  <Image source={{ uri: url }} style={styles.avatarImg} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Inputs */}
        <View style={{ gap: 12, marginTop: 14 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <GlassInput
                placeholder={isRTL ? 'نام' : 'First Name'}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={{ flex: 1 }}>
              <GlassInput
                placeholder={isRTL ? 'نام خانوادگی' : 'Last Name'}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <GlassInput
            icon="User"
            placeholder={isRTL ? 'نام کاربری (شناسه)' : 'Callsign (username)'}
            value={username}
            onChangeText={setUsername}
          />

          <GlassInput
            icon="Briefcase"
            placeholder={isRTL ? 'سمت / مهارت اصلی' : 'Tactical Role / Rank'}
            value={job}
            onChangeText={setJob}
          />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 2 }}>
              <GlassInput
                icon="MapPin"
                placeholder={isRTL ? 'شهر / منطقه' : 'Sector HQ / City'}
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={{ flex: 1 }}>
              <GlassInput
                icon="Calendar"
                placeholder={isRTL ? 'سن' : 'Age'}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
          </View>

          <GlassInput
            placeholder={isRTL ? 'بیوگرافی و معرفی کوتاه...' : 'Operational Bio & Clearance Summary...'}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
          />

          <View style={{ marginTop: 4 }}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              {isRTL ? 'جنسیت' : 'Gender'}
            </Text>
            <GlassSegmented
              options={[
                { label: isRTL ? 'آقا' : 'Male', value: 'male' },
                { label: isRTL ? 'خانم' : 'Female', value: 'female' },
                { label: isRTL ? 'سایر' : 'Other', value: 'other' },
              ]}
              value={gender ?? 'male'}
              onChange={(v) => setGender(v as Gender)}
            />
          </View>

          {/* Interests */}
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              {isRTL ? 'مهارت‌ها و حوزه‌های فعالیت' : 'Operational Disciplines & Skills'}
            </Text>
            <View style={styles.chipsWrap}>
              {allInterests.map((interest) => {
                const active = interests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interest}
                    activeOpacity={0.8}
                    onPress={() => toggleInterest(interest)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? '#f472b6' : colors.glassThinBg,
                        borderColor: active ? '#f472b6' : colors.glassBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: active ? '#ffffff' : colors.textSecondary },
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <GlassButton size="lg" fullWidth onPress={handleSave}>
              {isRTL ? 'ذخیره تغییرات' : 'Save Dossier Changes'}
            </GlassButton>
          </View>
        </View>
      </ScrollView>

      <Toast message={toast} visible={Boolean(toast)} />
    </View>
  );
}

export const PersonalInfoScreen = React.memo(PersonalInfoScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 85,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  avatarChoice: {
    width: 60,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
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
    fontWeight: '600',
  },
});
