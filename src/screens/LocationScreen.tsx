import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useAppData } from '../lib/appData';
import { GlassCard, GlassButton, GlassBackButton } from '../components/Glass';
import { GlassSheet, Toast } from '../components/Overlays';
import { cities } from '../lib/demoData';
import { getIcon } from '../lib/icons';

interface LocationScreenProps {
  onBack: () => void;
}

interface SavedPlace {
  id: string;
  name: string;
  address: string;
  category: 'favorite' | 'home' | 'work';
}

const INITIAL_SAVED_PLACES: SavedPlace[] = [
  { id: 'p1', name: 'Home Base', address: 'Marina District, San Francisco, CA', category: 'home' },
  { id: 'p2', name: 'Design Studio', address: 'SoMa, 2nd St, San Francisco, CA', category: 'work' },
  { id: 'p3', name: 'Ferry Building Meetup Spot', address: '1 Ferry Building, San Francisco, CA', category: 'favorite' },
];

export function LocationScreen({ onBack }: LocationScreenProps) {
  const { me, updateMe, addNotification } = useAppData();

  const [selectedCity, setSelectedCity] = useState(me.city || 'San Francisco');
  const [discoveryRadius, setDiscoveryRadius] = useState<number>(15);
  const [preciseLocationSharing, setPreciseLocationSharing] = useState(true);
  const [backgroundRadar, setBackgroundRadar] = useState(true);
  const [spotlightMyCity, setSpotlightMyCity] = useState(true);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(INITIAL_SAVED_PLACES);

  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState<'favorite' | 'home' | 'work'>('favorite');

  const [toastMessage, setToastMessage] = useState('');

  const MapPin = getIcon('MapPin');
  const Compass = getIcon('Compass');
  const Navigation = getIcon('Navigation');
  const Check = getIcon('Check');
  const Trash = getIcon('Trash');
  const Plus = getIcon('Plus');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    updateMe({ city });
    showToast(`Primary discovery city updated to ${city}`);
    addNotification({
      type: 'system',
      title: 'Location Updated',
      body: `Your active radar has been relocated to ${city}.`,
      icon: 'MapPin',
    });
  };

  const handleAddPlace = () => {
    if (!newPlaceName.trim() || !newPlaceAddress.trim()) {
      showToast('Please enter both place name and address');
      return;
    }

    const place: SavedPlace = {
      id: `place-${Date.now()}`,
      name: newPlaceName.trim(),
      address: newPlaceAddress.trim(),
      category: newPlaceCategory,
    };

    setSavedPlaces((prev) => [place, ...prev]);
    setNewPlaceName('');
    setNewPlaceAddress('');
    setShowAddPlaceModal(false);
    showToast('Saved favorite location added');
  };

  const handleRemovePlace = (id: string, name: string) => {
    setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
    showToast(`Removed "${name}" from saved places`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingTop: 84, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Current Radar Card */}
        <GlassCard variant="thick" style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(16,185,129,0.15)' }]}>
              <Navigation size={22} color="#10b981" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.heroTitle}>{selectedCity}</Text>
              <Text style={styles.heroDesc}>
                Current Hub · Active Discovery Radius: {discoveryRadius} km
              </Text>
            </View>
          </View>

          {/* Radius selector buttons */}
          <View style={styles.radiusRow}>
            {[5, 10, 15, 25, 50].map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => {
                  setDiscoveryRadius(r);
                  showToast(`Radar radius set to ${r} km`);
                }}
                style={[
                  styles.radiusBtn,
                  discoveryRadius === r && styles.radiusBtnActive,
                ]}
              >
                <Text style={[styles.radiusBtnText, discoveryRadius === r && styles.radiusBtnTextActive]}>
                  {r}km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Tactical City Hubs */}
        <Text style={styles.sectionHeading}>SELECT OPERATIONAL SECTOR</Text>
        <GlassCard style={styles.cardSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
            {cities.map((c) => {
              const isSelected = selectedCity === c;
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => handleCityChange(c)}
                  style={[
                    styles.cityChip,
                    isSelected && styles.cityChipActive,
                  ]}
                >
                  <MapPin size={12} color={isSelected ? '#ec4899' : 'rgba(255,255,255,0.6)'} />
                  <Text style={[styles.cityChipText, isSelected && styles.cityChipTextActive]}>
                    {c}
                  </Text>
                  {isSelected && <Check size={12} color="#ec4899" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </GlassCard>

        {/* Location Preferences */}
        <Text style={styles.sectionHeading}>RADAR TELEMETRY</Text>
        <GlassCard style={styles.cardSection}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Background Geofence Radar</Text>
              <Text style={styles.settingDesc}>Alert when squad events start within 2km</Text>
            </View>
            <Switch
              value={backgroundRadar}
              onValueChange={setBackgroundRadar}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Spotlight My Local City</Text>
              <Text style={styles.settingDesc}>Pin local squads to the top of your feed</Text>
            </View>
            <Switch
              value={spotlightMyCity}
              onValueChange={setSpotlightMyCity}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#ec4899' }}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>

        {/* Saved Places */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeading}>SAVED LOCATIONS</Text>
          <TouchableOpacity onPress={() => setShowAddPlaceModal(true)}>
            <Text style={styles.addText}>+ Add Place</Text>
          </TouchableOpacity>
        </View>

        <GlassCard style={styles.cardSection}>
          {savedPlaces.map((place, idx) => (
            <View key={place.id}>
              {idx > 0 && <View style={styles.divider} />}
              <View style={styles.placeRow}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
                  <Compass size={18} color="#ec4899" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.settingTitle}>{place.name}</Text>
                  <Text style={styles.settingDesc}>{place.address}</Text>
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
        title="Add Favorite Place"
      >
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.inputLabel}>LABEL NAME</Text>
          <TextInput
            style={styles.input}
            value={newPlaceName}
            onChangeText={setNewPlaceName}
            placeholder="e.g. Squad Headquarters"
            placeholderTextColor="rgba(255,255,255,0.4)"
          />

          <Text style={[styles.inputLabel, { marginTop: 14 }]}>ADDRESS OR COORDINATES</Text>
          <TextInput
            style={styles.input}
            value={newPlaceAddress}
            onChangeText={setNewPlaceAddress}
            placeholder="e.g. 742 Evergreen Terrace"
            placeholderTextColor="rgba(255,255,255,0.4)"
          />

          <View style={{ marginTop: 22 }}>
            <GlassButton variant="primary" onClick={handleAddPlace}>
              Save Place
            </GlassButton>
          </View>
        </View>
      </GlassSheet>

      <Toast message={toastMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.4)',
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroCard: {
    padding: 16,
    borderRadius: 20,
    borderColor: 'rgba(16,185,129,0.3)',
    borderWidth: 1,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  heroDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  radiusRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  radiusBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  radiusBtnActive: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderColor: '#10b981',
  },
  radiusBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  radiusBtnTextActive: {
    color: '#fff',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginTop: 22,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 4,
  },
  addText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ec4899',
    marginTop: 14,
  },
  cardSection: {
    padding: 16,
    borderRadius: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  settingDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 10,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  cityChipActive: {
    backgroundColor: 'rgba(236,72,153,0.15)',
    borderColor: 'rgba(236,72,153,0.5)',
  },
  cityChipText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  cityChipTextActive: {
    color: '#fff',
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
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
});
