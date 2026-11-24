import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform, I18nManager } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useFonts } from 'expo-font';

import { ThemeProvider, useTheme } from '../src/lib/theme';
import { I18nProvider } from '../src/lib/i18n';
import { AppDataProvider } from '../src/lib/appData';
import { ToastProvider } from '../src/lib/ToastContext';
import { ErrorBoundary } from '../src/components/common/ErrorBoundary';
import { AppChrome } from '../src/components/common/AppChrome';
import { AuroraBackground } from '../src/components/AuroraBackground';
import { NotificationsSheet } from '../src/components/notifications/NotificationsSheet';
import { Loading } from '../src/screens/Loading';
import { useAuthStore } from '../src/store/authStore';
import { useNotificationStore } from '../src/store/notificationStore';

if (Platform.OS !== 'web') {
  try {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  } catch {}
}

function NavigationGuard({ isLoading }: { isLoading: boolean }) {
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);

  useEffect(() => {
    if (isLoading) return;

    const firstSegment = segments[0];
    const inAuth = firstSegment === 'auth';
    const inOnboarding = firstSegment === 'onboarding';

    if (!isAuthenticated) {
      if (!inAuth) {
        router.replace('/auth');
      }
    } else if (!isOnboarded) {
      if (!inOnboarding) {
        router.replace('/onboarding');
      }
    } else {
      if (inAuth || inOnboarding) {
        router.replace('/(tabs)/discover');
      }
    }
  }, [isAuthenticated, isOnboarded, segments, isLoading, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'none',
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="group/[id]" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="profile/[id]" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="settings/personal-info" />
      <Stack.Screen name="settings/verification" />
      <Stack.Screen name="settings/security" />
      <Stack.Screen name="settings/privacy" />
      <Stack.Screen name="settings/location" />
      <Stack.Screen name="settings/chat-theme" />
      <Stack.Screen name="settings/plans" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="ai" />
    </Stack>
  );
}

function MainLayout() {
  const router = useRouter();
  const { isDark } = useTheme();
  const isSheetOpen = useNotificationStore((s) => s.isSheetOpen);
  const closeSheet = useNotificationStore((s) => s.closeSheet);
  const [fontsLoaded] = useFonts({
    IranianSans: require('../assets/fonts/IranianSans.ttf'),
    'Iranian Sans': require('../assets/fonts/IranianSans.ttf'),
    IRANSans: require('../assets/fonts/IRANSans.ttf'),
  });

  const [isLoading, setIsLoading] = useState(true);
  const finishLoading = useCallback(() => setIsLoading(false), []);

  return (
    <AppChrome>
      <View
        nativeID="phone-container"
        style={[
          styles.phoneContainer,
          Platform.OS === 'web' && {
            boxShadow: isDark
              ? '0 0 60px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)'
              : '0 0 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          },
        ]}
      >
        <AuroraBackground isDark={isDark} />
        <NavigationGuard isLoading={isLoading} />
        <NotificationsSheet
          open={isSheetOpen}
          onClose={closeSheet}
          onOpenConversation={(cid) => router.push({ pathname: '/chat/[id]', params: { id: cid } })}
          onOpenGroup={(g) => router.push({ pathname: '/group/[id]', params: { id: g.id } })}
          onOpenSettings={() => router.push('/settings')}
        />
        {isLoading && (
          <Loading
            minDuration={2000}
            onFinish={finishLoading}
            canFinish={fontsLoaded || Platform.OS === 'web'}
          />
        )}
      </View>
    </AppChrome>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <ThemeProvider>
            <AppDataProvider>
              <ToastProvider>
                <BottomSheetModalProvider>
                  <KeyboardProvider preload={false}>
                    <ErrorBoundary>
                      <MainLayout />
                    </ErrorBoundary>
                  </KeyboardProvider>
                </BottomSheetModalProvider>
              </ToastProvider>
            </AppDataProvider>
          </ThemeProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  phoneContainer: {
    flex: 1,
    position: 'relative',
    maxWidth: Platform.OS === 'web' ? 440 : undefined,
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
});
