import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function IndexRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }
  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)/discover" />;
}
