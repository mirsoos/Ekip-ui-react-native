import React, { useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ProfileScreen } from '../../screens/ProfileScreen';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { MotionView } from '../../components/common/MotionView';
import { useAuthStore } from '../../store/authStore';
import type { Group } from '../../types/database';

export default function ProfileRoute() {
  const router = useRouter();
  const me = useAuthStore((s) => s.me);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleOpenGroup = (group: Group) => {
    router.push(`/ekip/${group.id}`);
  };

  return (
    <View style={styles.container}>
      <ProfileHeader
        profile={me}
        isOwnProfile={true}
        onBack={() => router.back()}
        onOpenSettings={() => router.push('/settings')}
        scrollY={scrollY}
      />

      <MotionView style={styles.motionContainer}>
        <ProfileScreen
          userId="me"
          isOwnProfile={true}
          onBack={() => router.back()}
          onOpenGroup={handleOpenGroup}
          onOpenSettings={() => router.push('/settings')}
          onOpenPersonalInfo={() => router.push('/settings/personal-info')}
          onOpenVerification={() => router.push('/settings/verification')}
          scrollY={scrollY}
        />
      </MotionView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  motionContainer: {
    flex: 1,
  },
});
