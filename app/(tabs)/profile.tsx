import React, { useState } from 'react';
import { Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ProfileScreen, ProfileHeader } from '@/src/features/profile';
import { ScreenLayout } from '@/src/components/common/ScreenLayout';
import { useAuthStore } from '@/src/store/authStore';

export default function ProfileRoute() {
  const router = useRouter();
  const me = useAuthStore((s) => s.me);
  const [scrollY] = useState(() => new Animated.Value(0));

  return (
    <ScreenLayout
      header={
        <ProfileHeader
          profile={me}
          isOwnProfile={true}
          onBack={() => router.back()}
          onOpenSettings={() => router.push('/settings')}
          scrollY={scrollY}
        />
      }
    >
      <ProfileScreen
        userId="me"
        isOwnProfile={true}
        onBack={() => router.back()}
        onOpenGroup={(g) => router.push({ pathname: '/group/[id]', params: { id: g.id } })}
        onOpenSettings={() => router.push('/settings')}
        onOpenPersonalInfo={() => router.push('/settings/personal-info')}
        onOpenVerification={() => router.push('/settings/verification')}
        scrollY={scrollY}
      />
    </ScreenLayout>
  );
}
