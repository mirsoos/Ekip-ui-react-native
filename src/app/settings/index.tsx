import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SettingsScreen } from '../../screens/SettingsScreen';
import { useAuthStore } from '../../store/authStore';

export default function SettingsRoute() {
  const router = useRouter();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const handleSignOut = () => {
    setAuthenticated(false);
    router.replace('/auth');
  };

  return (
    <View style={styles.container}>
      <SettingsScreen
        onBack={() => router.back()}
        onOpenPlans={() => router.push('/settings/plans')}
        onOpenPersonalInfo={() => router.push('/settings/personal-info')}
        onOpenVerification={() => router.push('/settings/verification')}
        onOpenPrivacy={() => router.push('/settings/privacy')}
        onOpenSecurity={() => router.push('/settings/security')}
        onOpenNotifications={() => router.push('/notifications')}
        onOpenLocation={() => router.push('/settings/location')}
        onOpenChatTheme={() => router.push('/settings/theme')}
        onOpenOnboarding={() => router.push('/onboarding')}
        onSignOut={handleSignOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
