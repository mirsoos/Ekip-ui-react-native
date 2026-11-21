import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, I18nManager, Text, TextInput } from 'react-native';
import { Stack, useRouter, usePathname, Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '../lib/theme';
import { AppDataProvider } from '../lib/appData';
import { ToastProvider } from '../lib/ToastContext';
import { AuroraBackground } from '../components/AuroraBackground';
import { BottomNav, type TabKey } from '../components/BottomNav';
import { Loading } from '../screens/Loading';
import { useAuthStore } from '../store/authStore';

// Global Persian/Arabic font family mapping for native platforms
if (Platform.OS !== 'web') {
  try {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  } catch (e) {}

  const defaultFontFamily = 'IranianSans';
  const OriginalText = Text;
  // @ts-ignore
  const CustomText = React.forwardRef((props: any, ref: any) => {
    return React.createElement(OriginalText, {
      ...props,
      ref,
      style: [{ fontFamily: defaultFontFamily }, props?.style],
    });
  });
  Object.assign(CustomText, OriginalText);

  const OriginalTextInput = TextInput;
  // @ts-ignore
  const CustomTextInput = React.forwardRef((props: any, ref: any) => {
    return React.createElement(OriginalTextInput, {
      ...props,
      ref,
      style: [{ fontFamily: defaultFontFamily }, props?.style],
    });
  });
  Object.assign(CustomTextInput, OriginalTextInput);

  try {
    const rn = require('react-native');
    Object.defineProperty(rn, 'Text', {
      configurable: true,
      enumerable: true,
      get: () => CustomText,
    });
    Object.defineProperty(rn, 'TextInput', {
      configurable: true,
      enumerable: true,
      get: () => CustomTextInput,
    });
  } catch (e) {}
}

function MainNavigationShell() {
  const { isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);

  // Active tab derivation
  let activeTab: TabKey = 'discover';
  if (pathname.includes('/activity')) activeTab = 'activity';
  else if (pathname.includes('/create')) activeTab = 'create';
  else if (pathname.includes('/chat')) activeTab = 'chat';
  else if (pathname.includes('/profile')) activeTab = 'profile';

  // Fixed BottomNav visibility: visible on tab roots
  const isTabRoute =
    pathname === '/' ||
    pathname === '/(tabs)' ||
    pathname.startsWith('/(tabs)/') ||
    pathname === '/discover' ||
    pathname === '/activity' ||
    pathname === '/create' ||
    pathname === '/chat' ||
    pathname === '/profile';

  const showBottomNav = isAuthenticated && isTabRoute;

  const handleTabChange = (tab: TabKey) => {
    switch (tab) {
      case 'discover':
        router.push('/(tabs)/discover');
        break;
      case 'activity':
        router.push('/(tabs)/activity');
        break;
      case 'create':
        router.push('/(tabs)/create');
        break;
      case 'chat':
        router.push('/(tabs)/chat');
        break;
      case 'profile':
        router.push('/(tabs)/profile');
        break;
    }
  };

  return (
    <View style={styles.rootContainer}>
      <AuroraBackground isDark={isDark} />

      <View style={styles.contentLayer}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: Platform.OS === 'ios' ? 'default' : 'fade',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="ekip/[id]" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="profile/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="ai" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="notifications" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
      </View>

      {/* Universal 3-Tier: Stable Layout-Level BottomNav Dock */}
      {showBottomNav && (
        <BottomNav active={activeTab} onChange={handleTabChange} />
      )}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IranianSans: require('../../assets/fonts/IranianSans.ttf'),
    'Iranian Sans': require('../../assets/fonts/IranianSans.ttf'),
    IRANSans: require('../../assets/fonts/IRANSans.ttf'),
  });

  const [isLoading, setIsLoading] = useState(true);

  if (!fontsLoaded || isLoading) {
    return <Loading onFinish={() => setIsLoading(false)} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <BottomSheetModalProvider>
            <ThemeProvider>
              <AppDataProvider>
                <ToastProvider>
                  <StatusBar style="auto" />
                  <MainNavigationShell />
                </ToastProvider>
              </AppDataProvider>
            </ThemeProvider>
          </BottomSheetModalProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    position: 'relative',
  },
  contentLayer: {
    flex: 1,
  },
});
