import React, { useState } from 'react';
import { Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ProfileScreen, ProfileHeader } from '@/src/features/profile';
import { ScreenLayout } from '@/src/components/common/ScreenLayout';
import { useAuthStore } from '@/src/store/authStore';
import { useUserStore } from '@/src/store/userStore';

export default function UserProfileRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const me = useAuthStore((s) => s.me);
  const profiles = useUserStore((s) => s.profiles);
  const profileId = typeof id === 'string' ? id : id?.[0] || 'me';
  const isOwn = !profileId || profileId === 'me' || profileId === me.id;
  const profile = isOwn ? me : (profiles.find((p) => p.id === profileId) ?? me);
  const [scrollY] = useState(() => new Animated.Value(0));

  return (
    <ScreenLayout header={<ProfileHeader profile={profile} isOwnProfile={isOwn} onBack={() => router.back()} onOpenSettings={() => router.push('/settings')} scrollY={scrollY} />}>
      <ProfileScreen
        userId={profileId}
        isOwnProfile={isOwn}
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
