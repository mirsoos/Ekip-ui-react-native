// --- START OF FILE LocationScreen.tsx ---

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
import { useAppData } from '../lib/appData';
import { GlassCard, GlassButton, LiquidGlassToggle } from '../components/Glass';
import { GlassSheet, Toast } from '../components/Overlays';
import { cities } from '../lib/demoData';
import { getIcon } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';

interface LocationScreenProps {
  onBack: () => void;
}

interface SavedPlace {
  id: string;
  name: string;
  address: string;
  category: 'favorite' | 'home' | 'work';
}

export function LocationScreen({ onBack }: LocationScreenProps) {
  const insets = useSafeAreaInsets();
  const { me, updateMe, addNotification } = useAppData();
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();

  const initialPlaces: SavedPlace[] = isRTL
    ? [
        { id: 'p1', name: 'خانه', address: 'تهران، سعادت‌آباد، خیابان سرو', category: 'home' },
        { id: 'p2', name: 'محل کار / دفتر', address: 'تهران، کارخانه نوآوری آزادی', category: 'work' },
        { id: 'p3', name: 'کافه محبوب دورهمی', address: 'تهران، خیابان انقلاب، کافه بوردگیم فکری', category: 'favorite' },
      ]
    : [
        { id: 'p1', name: 'Home', address: 'Saadat Abad, Sarv St', category: 'home' },
        { id: 'p2', name: 'Work / Office', address: 'Azadi Innovation Factory', category: 'work' },
        { id: 'p3', name: 'Favorite Cafe', address: 'Enghelab St, Fekri Boardgame Cafe', category: 'favorite' },
      ];

  const [selectedCity, setSelectedCity] = useState(me.city || cities[0]);
  const [discoveryRadius, setDiscoveryRadius] = useState<number>(15);
  const [backgroundRadar, setBackgroundRadar] = useState(true);
  const [spotlightMyCity, setSpotlightMyCity] = useState(true);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(initialPlaces);

  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MapPin = getIcon('MapPin');
  const Compass = getIcon('Compass');
  const Navigation = getIcon('Navigation');
  const Check = getIcon('Check');
  const Trash = getIcon('Trash');

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showAddPlaceModal) {
        setShowAddPlaceModal(false);
        return true;
      }
      onBack();
      return true;
    });
    return () => {
      sub.remove();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [onBack, showAddPlaceModal]);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => setToastMessage(''), 2600);
  }, []);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    updateMe({ city });
    showToast(
      isRTL ? `منطقه رادار به «${city}» تغییر یافت` : `Primary discovery city updated to ${city}`
    );
    addNotification({
      type: 'system',
      title: isRTL ? 'منطقه عملیاتی به‌روزرسانی شد' : 'Operational Sector Changed',
      body: isRTL
        ? `رادار اکتشاف شما اکنون روی ${city} تنظیم شده است.`
        : `Your discovery radar is now tuned to ${city}.`,
      icon: 'MapPin',
    });
  };

  const handleAddPlace = () => {
    if (!newPlaceName.trim()) {
      showToast(isRTL ? 'لطفاً نام مکان را وارد کنید' : 'Please provide a place label');
      return;
    }
    const place: SavedPlace = {
      id: `p-${Date.now()}`,
      name: newPlaceName.trim(),
      address: newPlaceAddress.trim() || selectedCity,
      category: 'favorite',
    };
    setSavedPlaces((prev) => [place, ...prev]);
    setNewPlaceName('');
    setNewPlaceAddress('');
    setShowAddPlaceModal(false);
    showToast(isRTL ? 'مکان برگزیده جدید اضافه شد' : 'Saved favorite location added');
  };

  const handleRemovePlace = (id: string, name: string) => {
    setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
    showToast(isRTL ? `مکان «${name}» از لیست حذف شد` : `Removed "${name}" from saved places`);
  };

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
          paddingBottom: 60 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Radar Card */}
        <GlassCard variant="thick" style={styles.heroCard}>
          <View style={[styles.heroHeader, { flexDirection: rowDir }]}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
              <Navigation size={22} color="#10b981" />
            </View>
            <View style={[{ flex: 1 }, textSpacing]}>
              <Text style={[styles.heroTitle, { color: colors.textPrimary, textAlign }]}>
                {selectedCity}
              </Text>
              <Text style={[styles.heroDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? `موقعیت فعلی · فاصله جستجوی اکیپ‌ها: ${discoveryRadius} کیلومتر`
                  : `Current Hub · Search Distance: ${discoveryRadius} km`}
              </Text>
            </View>
          </View>

          {/* Radius selector buttons */}
          <View style={[styles.radiusRow, { flexDirection: rowDir }]}>
            {[5, 10, 15, 25, 50].map((r) => {
              const active = discoveryRadius === r;
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => {
                    setDiscoveryRadius(r);
                    showToast(
                      isRTL
                        ? `فاصله جستجو روی ${r} کیلومتر تنظیم شد`
                        : `Search radius set to ${r} km`
                    );
                  }}
                  style={[
                    styles.radiusBtn,
                    {
                      backgroundColor: active ? 'rgba(16,185,129,0.2)' : colors.glassThinBg,
                      borderColor: active ? '#10b981' : colors.glassBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.radiusBtnText,
                      {
                        color: active ? '#10b981' : colors.textSecondary,
                        fontWeight: active ? '700' : '600',
                      },
                    ]}
                  >
                    {r} {isRTL ? 'ک.م' : 'km'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

        {/* City Hubs */}
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'انتخاب شهر یا منطقه' : 'SELECT CITY & NEIGHBORHOOD'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 4, flexDirection: rowDir, flexGrow: 1 }}
          >
            {cities.map((c) => {
              const isSelected = selectedCity === c;
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => handleCityChange(c)}
                  style={[
                    styles.cityChip,
                    {
                      flexDirection: rowDir,
                      backgroundColor: isSelected ? 'rgba(236,72,153,0.15)' : colors.glassThinBg,
                      borderColor: isSelected ? '#ec4899' : colors.glassBorder,
                    },
                  ]}
                >
                  <MapPin size={12} color={isSelected ? '#ec4899' : colors.textTertiary} />
                  <Text
                    style={[
                      styles.cityChipText,
                      {
                        color: isSelected ? '#ec4899' : colors.textSecondary,
                        fontWeight: isSelected ? '700' : '600',
                      },
                    ]}
                  >
                    {c}
                  </Text>
                  {isSelected && <Check size={12} color="#ec4899" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </GlassCard>

        {/* Location Preferences */}
        <Text style={[styles.sectionHeading, { color: colors.textTertiary, textAlign }]}>
          {isRTL ? 'تنظیمات موقعیت مکانی' : 'LOCATION PREFERENCES'}
        </Text>
        <GlassCard style={styles.cardSection}>
          <View style={[styles.settingRow, { flexDirection: rowDir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'اعلان دورهمی‌های نزدیک من' : 'Nearby Hangout Alerts'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'اعلان هنگام تشکیل اکیپ جدید در محدوده ۲ کیلومتری'
                  : 'Alert when new Ekips form within 2km'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={backgroundRadar}
              onChange={setBackgroundRadar}
              size="sm"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={[styles.settingRow, { flexDirection: rowDir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                {isRTL ? 'اولویت نمایش اکیپ‌های منطقه من' : 'Spotlight My Local City'}
              </Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                {isRTL
                  ? 'پین کردن اکیپ‌های محلی در بالای فید اصلی'
                  : 'Pin local squads to the top of your feed'}
              </Text>
            </View>
            <LiquidGlassToggle
              checked={spotlightMyCity}
              onChange={setSpotlightMyCity}
              size="sm"
            />
          </View>
        </GlassCard>

        {/* Saved Places */}
        <View style={[styles.sectionHeadingRow, { flexDirection: rowDir }]}>
          <Text
            style={[
              styles.sectionHeading,
              { color: colors.textTertiary, marginTop: 0, marginBottom: 0 },
            ]}
          >
            {isRTL ? 'مکان‌های ذخیره شده' : 'SAVED LOCATIONS'}
          </Text>
          <TouchableOpacity onPress={() => setShowAddPlaceModal(true)}>
            <Text style={styles.addText}>
              {isRTL ? '+ افزودن مکان' : '+ Add Place'}
            </Text>
          </TouchableOpacity>
        </View>

        <GlassCard style={styles.cardSection}>
          {savedPlaces.map((place, idx) => (
            <View key={place.id}>
              {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.divider }]} />}
              <View style={[styles.placeRow, { flexDirection: rowDir }]}>
                <View style={[styles.iconBox, { backgroundColor: colors.glassThinBg }]}>
                  <Compass size={18} color="#ec4899" />
                </View>
                <View style={[{ flex: 1 }, textSpacing]}>
                  <Text style={[styles.settingTitle, { color: colors.textPrimary, textAlign }]}>
                    {place.name}
                  </Text>
                  <Text style={[styles.settingDesc, { color: colors.textSecondary, textAlign }]}>
                    {place.address}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemovePlace(place.id, place.name)}
                  style={{ padding: 6 }}
                >
                  <Trash size={15} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </GlassCard>
      </ScrollView>

      {/* Add Place Sheet */}
      <GlassSheet
        open={showAddPlaceModal}
        onClose={() => setShowAddPlaceModal(false)}
        title={isRTL ? 'افزودن مکان برگزیده' : 'Add Favorite Place'}
      >
        <View style={{ paddingVertical: 10 }}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary, textAlign }]}>
            {isRTL ? 'نام مکان' : 'LABEL NAME'}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
                borderColor: colors.glassBorder,
                color: colors.textPrimary,
                textAlign,
              },
            ]}
            value={newPlaceName}
            onChangeText={setNewPlaceName}
            placeholder={isRTL ? 'مثلاً قرارگاه دیده‌بانی' : 'e.g. Squad Headquarters'}
            placeholderTextColor={colors.textTertiary}
          />

          <Text
            style={[
              styles.inputLabel,
              { marginTop: 14, color: colors.textSecondary, textAlign },
            ]}
          >
            {isRTL ? 'آدرس یا محدوده' : 'ADDRESS OR COORDINATES'}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
                borderColor: colors.glassBorder,
                color: colors.textPrimary,
                textAlign,
              },
            ]}
            value={newPlaceAddress}
            onChangeText={setNewPlaceAddress}
            placeholder={isRTL ? 'مثلاً بخش ۴، جاده خط‌الراس' : 'e.g. Checkpoint Delta, Sector 4'}
            placeholderTextColor={colors.textTertiary}
          />

          <View style={{ marginTop: 22 }}>
            <GlassButton variant="primary" fullWidth onPress={handleAddPlace}>
              {isRTL ? 'ذخیره مکان' : 'Save Place'}
            </GlassButton>
          </View>
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
    padding: 16,
    borderRadius: 22,
    borderColor: 'rgba(16,185,129,0.3)',
    borderWidth: 1,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  heroDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  radiusRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  radiusBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  radiusBtnText: {
    fontSize: 12,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 22,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  addText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ec4899',
  },
  cardSection: {
    padding: 14,
    borderRadius: 20,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  cityChipText: {
    fontSize: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 16,
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
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
});