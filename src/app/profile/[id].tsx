import React, { useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ProfileScreen } from '../../screens/ProfileScreen';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import type { Group } from '../../types/database';

export default function UserProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const profiles = useUserStore((s) => s.profiles);
  const me = useAuthStore((s) => s.me);
  const scrollY = useRef(new Animated.Value(0)).current;

  const profile = profiles.find((p) => p.id === id) ?? me;

  const handleOpenGroup = (group: Group) => {
    router.push(`/ekip/${group.id}`);
  };

  return (
    <View style={styles.container}>
      <ProfileHeader
        profile={profile}
        isOwnProfile={false}
        onBack={() => router.back()}
        onOpenSettings={() => router.push('/settings')}
        scrollY={scrollY}
      />

      <ProfileScreen
        userId={id || 'me'}
        isOwnProfile={false}
        onBack={() => router.back()}
        onOpenGroup={handleOpenGroup}
        onOpenSettings={() => router.push('/settings')}
        onOpenPersonalInfo={() => router.push('/settings/personal-info')}
        onOpenVerification={() => router.push('/settings/verification')}
        scrollY={scrollY}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
