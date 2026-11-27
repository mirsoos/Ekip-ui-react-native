// --- START OF FILE App.tsx ---

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Animated, Easing, Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  ThemeProvider,
  useTheme,
  animationDurations,
} from './src/lib/theme';
import { AppDataProvider, useAppData } from './src/lib/appData';
import { BottomNav, type TabKey } from './src/components/navigation/BottomNav';
import { ChatHeader } from './src/features/chat/components/ChatHeader';
import { ChatListHeader } from './src/features/chat/components/ChatListHeader';
import { ChatInputBar } from './src/features/chat/components/ChatInputBar';
import { DiscoverHeader } from './src/features/discover/components/DiscoverHeader';
import { ActivityHeader } from './src/features/activity/components/ActivityHeader';
import { SettingsHeader } from './src/features/settings/components/SettingsHeader';
import { AIHeader } from './src/features/ai/components/AIHeader';
import { ProfileHeader } from './src/features/profile/components/ProfileHeader';
import { EkipDetailHeader } from './src/features/ekip/components/EkipDetailHeader';
import { EkipActionBar } from './src/features/ekip/components/EkipActionBar';
import { CreateContinueButton } from './src/features/create/components/CreateContinueButton';
import { CreateHeader } from './src/features/create/components/CreateHeader';
import { NotificationsSheet } from './src/features/notifications/components/NotificationsSheet';
import type { Group } from './src/types/database';

// Screens
import { AuthScreen } from './src/features/auth/screens/AuthScreen';
import { Onboarding } from './src/features/auth/screens/Onboarding';
import { DiscoverScreen, type DiscoverScreenHandle } from './src/features/discover/screens/DiscoverScreen';
import { EkipDetail, type EkipDetailHandle } from './src/features/ekip/screens/EkipDetail';
import { CreateScreen, type CreateScreenHandle } from './src/features/create/screens/CreateScreen';
import { ProfileScreen } from './src/features/profile/screens/ProfileScreen';
import { ActivityScreen } from './src/features/activity/screens/ActivityScreen';
import { ChatListScreen, ConversationScreen } from './src/features/chat/screens/ChatScreens';
import { NotificationsScreen } from './src/features/notifications/screens/NotificationsScreen';
import { AIAssistant, type AIAssistantHandle } from './src/features/ai/screens/AIAssistant';
import { SettingsScreen } from './src/features/settings/screens/SettingsScreen';
import { PlansScreen } from './src/features/settings/screens/PlansScreen';
import { PersonalInfoScreen } from './src/features/settings/screens/PersonalInfoScreen';
import { VerificationScreen } from './src/features/settings/screens/VerificationScreen';
import { PrivacyScreen } from './src/features/settings/screens/PrivacyScreen';
import { SecurityScreen } from './src/features/settings/screens/SecurityScreen';
import { LocationScreen } from './src/features/settings/screens/LocationScreen';
import { ChatThemeScreen } from './src/features/settings/screens/ChatThemeScreen';
import { Loading } from './src/features/auth/screens/Loading';

import { AuroraBackground } from './src/components/AuroraBackground';
import { ScreenTransition } from './src/components/common/ScreenTransition';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { I18nProvider, useI18n } from './src/lib/i18n';
import { ToastProvider } from './src/lib/ToastContext';

export type Screen =
  | { name: 'auth' }
  | { name: 'onboarding' }
  | { name: 'discover' }
  | { name: 'group'; group: Group }
  | { name: 'create' }
  | { name: 'profile'; userId: string }
  | { name: 'activity' }
  | { name: 'chatList' }
  | { name: 'conversation'; conversationId: string }
  | { name: 'notifications' }
  | { name: 'ai' }
  | { name: 'settings' }
  | { name: 'plans' }
  | { name: 'personalInfo' }
  | { name: 'verification' }
  | { name: 'privacy' }
  | { name: 'security' }
  | { name: 'location' }
  | { name: 'chatTheme' };

const AppChrome = React.memo(function AppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark } = useTheme();
  const [darkOverlayOpacity] = useState(() => new Animated.Value(0));
  const [lightOverlayOpacity] = useState(() => new Animated.Value(0));
  const prevThemeRef = useRef(isDark);

  useLayoutEffect(() => {
    if (prevThemeRef.current === isDark) return;
    const wasDark = prevThemeRef.current;
    prevThemeRef.current = isDark;

    if (Platform.OS === 'web') {
      // روی وب ترنزیشن 0.5 ثانیه‌ای با CSS در index.html به صورت یکپارچه اجرا می‌شود
      return;
    }

    // توقف هر انیمیشن قبلی به صورت فوری برای جلوگیری از انباشت لایه‌ها
    darkOverlayOpacity.stopAnimation();
    lightOverlayOpacity.stopAnimation();

    if (wasDark) {
      // تغییر از تیره به روشن: لایه تیره نرم فیدآوت شده تا تم روشن زیرین پدیدار شود
      lightOverlayOpacity.setValue(0);
      darkOverlayOpacity.setValue(0.65);
      Animated.timing(darkOverlayOpacity, {
        toValue: 0,
        duration: 450,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }).start();
    } else {
      // تغییر از روشن به تیره: لایه روشن نرم فیدآوت شده تا تم تیره زیرین پدیدار شود
      darkOverlayOpacity.setValue(0);
      lightOverlayOpacity.setValue(0.65);
      Animated.timing(lightOverlayOpacity, {
        toValue: 0,
        duration: 450,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }).start();
    }
  }, [darkOverlayOpacity, lightOverlayOpacity, isDark]);

  return (
    <SafeAreaView
      edges={Platform.OS === 'web' ? undefined : ['left', 'right']}
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#020306' : '#dde2ec' },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {Platform.OS === 'web' && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? '#020306' : '#dde2ec',
              backgroundImage: isDark
                ? 'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.6) 0%, rgba(2, 3, 6, 0.98) 100%)'
                : 'radial-gradient(ellipse at 50% 50%, rgba(241, 245, 249, 0.6) 0%, rgba(220, 226, 238, 0.98) 100%)',
            } as any,
          ]}
          pointerEvents="none"
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isDark ? 'rgba(2, 3, 6, 0.45)' : 'rgba(220, 226, 238, 0.45)',
              },
            ]}
          />
        </View>
      )}
      {children}
      {Platform.OS !== 'web' && (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.themeCurtain,
              {
                backgroundColor: '#04060c',
                opacity: darkOverlayOpacity,
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.themeCurtain,
              {
                backgroundColor: '#dde2ec',
                opacity: lightOverlayOpacity,
              },
            ]}
          />
        </>
      )}
    </SafeAreaView>
  );
});

const ActiveHeaderTransition = React.memo(function ActiveHeaderTransition({
  screenKey,
  children,
}: {
  screenKey: string;
  children: React.ReactNode;
}) {
  const isConversation = screenKey.startsWith('conversation');
  const anim = useRef(new Animated.Value(1)).current;
  const isFirstMount = useRef(true);
  const prevKeyRef = useRef(screenKey);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevKeyRef.current = screenKey;
      return;
    }

    const wasConversation = prevKeyRef.current.startsWith('conversation');
    prevKeyRef.current = screenKey;

    if (isConversation || wasConversation) {
      anim.setValue(1);
      return;
    }

    anim.stopAnimation();
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: animationDurations.headerEntrance,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [screenKey, anim, isConversation]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-36, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      renderToHardwareTextureAndroid
      style={[
        styles.headerOverlayWrapper,
        {
          opacity: anim,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
});

const ActiveBottomNavTransition = React.memo(function ActiveBottomNavTransition({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  const anim = useRef(new Animated.Value(show ? 1 : 0)).current;
  const wasShown = useRef(show);

  useEffect(() => {
    if (show !== wasShown.current) {
      anim.stopAnimation();
      Animated.timing(anim, {
        toValue: show ? 1 : 0,
        duration: 280,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
    wasShown.current = show;
  }, [show, anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0],
  });

  return (
    <Animated.View
      pointerEvents={show ? 'box-none' : 'none'}
      renderToHardwareTextureAndroid
      style={{
        opacity: anim,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
});

interface NotificationsSheetController {
  open: () => void;
}

const NotificationsSheetHost = React.memo(
  React.forwardRef<
    NotificationsSheetController,
    {
      onOpenConversation: (conversationId: string) => void;
    }
  >(function NotificationsSheetHost({ onOpenConversation }, ref) {
    const [open, setOpen] = useState(false);
    const openSheet = React.useCallback(() => setOpen(true), []);
    const closeSheet = React.useCallback(() => setOpen(false), []);

    React.useImperativeHandle(ref, () => ({ open: openSheet }), [openSheet]);

    return (
      <NotificationsSheet
        open={open}
        onClose={closeSheet}
        onOpenConversation={onOpenConversation}
      />
    );
  })
);

function MainContent() {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const { me, profiles, conversations, notifications, addMessage } = useAppData();

  const [fontsLoaded] = useFonts({
    IranianSans: require('./assets/fonts/IranianSans.ttf'),
    'Iranian Sans': require('./assets/fonts/IranianSans.ttf'),
    IRANSans: require('./assets/fonts/IRANSans.ttf'),
  });

  const [isLoading, setIsLoading] = useState(true);
  const finishLoading = React.useCallback(() => setIsLoading(false), []);
  const [authed, setAuthed] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState<TabKey>('discover');
  const [screen, setScreen] = useState<Screen>({ name: 'discover' });
  const handleAuthSuccess = React.useCallback(() => {
    setAuthed(true);
    setOnboarded(false);
  }, []);

  const [history, setHistory] = useState<Screen[]>([]);
  const historyRef = React.useRef(history);
  historyRef.current = history;
  const [createState, setCreateState] = useState({ step: 0, canProceed: false });
  const [chatSearch, setChatSearch] = useState('');
  const [discoverSearch, setDiscoverSearch] = useState('');
  const [activityTab, setActivityTab] = useState('created');
  const createRef = React.useRef<CreateScreenHandle>(null);
  const discoverRef = React.useRef<DiscoverScreenHandle>(null);
  const aiRef = React.useRef<AIAssistantHandle>(null);
  const ekipDetailRef = React.useRef<EkipDetailHandle>(null);
  const profileScrollY = React.useRef(new Animated.Value(0)).current;
  const profileScrollOffsets = React.useRef(new Map<string, number>());
  const activeProfileId = screen.name === 'profile' ? screen.userId : 'me';
  const activeProfileScrollOffset = profileScrollOffsets.current.get(activeProfileId) ?? 0;
  const saveActiveProfileScrollOffset = React.useCallback((offset: number) => {
    profileScrollOffsets.current.set(activeProfileId, offset);
  }, [activeProfileId]);

  const screenScrollOffsets = React.useRef(new Map<string, number>());
  const getScrollOffset = React.useCallback((key: string) => {
    return screenScrollOffsets.current.get(key) ?? 0;
  }, []);
  const saveScrollOffset = React.useCallback((key: string, offset: number) => {
    screenScrollOffsets.current.set(key, offset);
  }, []);

  const notificationsSheetRef = React.useRef<NotificationsSheetController>(null);

  const unreadNotificationsCount = React.useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const unreadConversationsTotal = React.useMemo(
    () => conversations.reduce((s, c) => s + c.unread_count, 0),
    [conversations]
  );

  const screenRef = React.useRef(screen);
  screenRef.current = screen;

  const clearHistory = React.useCallback(() => {
    if (historyRef.current.length === 0) return;
    historyRef.current = [];
    setHistory(historyRef.current);
  }, []);

  const push = React.useCallback((s: Screen) => {
    if (s.name === 'profile') {
      profileScrollY.setValue(profileScrollOffsets.current.get(s.userId) ?? 0);
    }
    const nextHistory = [...historyRef.current, screenRef.current];
    historyRef.current = nextHistory;
    setHistory(nextHistory);
    setScreen(s);
  }, [profileScrollY]);

  const pop = React.useCallback(() => {
    const currentHistory = historyRef.current;
    if (currentHistory.length === 0) {
      if (tab === 'chat') setScreen({ name: 'chatList' });
      else if (tab === 'profile') setScreen({ name: 'profile', userId: 'me' });
      else if (tab === 'activity') setScreen({ name: 'activity' });
      else if (tab === 'create') setScreen({ name: 'create' });
      else setScreen({ name: 'discover' });
      return;
    }
    const nextHistory = currentHistory.slice(0, -1);
    const previousScreen = currentHistory[currentHistory.length - 1];
    if (previousScreen.name === 'profile') {
      profileScrollY.setValue(profileScrollOffsets.current.get(previousScreen.userId) ?? 0);
    }
    historyRef.current = nextHistory;
    setHistory(nextHistory);
    setScreen(previousScreen);
  }, [profileScrollY, tab]);

  const switchTab = React.useCallback((t: TabKey) => {
    const currentScreen = screenRef.current;
    const targetScreenName = t === 'chat' ? 'chatList' : t;
    const alreadyOnTarget =
      currentScreen.name === targetScreenName &&
      (t !== 'profile' ||
        (currentScreen.name === 'profile' && currentScreen.userId === 'me'));
    if (historyRef.current.length === 0 && alreadyOnTarget) return;

    setTab(t);
    clearHistory();
    if (t === 'discover') setScreen({ name: 'discover' });
    else if (t === 'activity') setScreen({ name: 'activity' });
    else if (t === 'create') setScreen({ name: 'create' });
    else if (t === 'chat') setScreen({ name: 'chatList' });
    else if (t === 'profile') {
      profileScrollY.setValue(profileScrollOffsets.current.get('me') ?? 0);
      setScreen({ name: 'profile', userId: 'me' });
    }
  }, [clearHistory, profileScrollY]);

  const handleOpenGroup = React.useCallback((g: Group) => {
    push({ name: 'group', group: g });
  }, [push]);

  const handleOpenProfile = React.useCallback((uid: string) => {
    if (uid === 'me') {
      setTab('profile');
      clearHistory();
      profileScrollY.setValue(profileScrollOffsets.current.get('me') ?? 0);
      setScreen({ name: 'profile', userId: 'me' });
    } else {
      push({ name: 'profile', userId: uid });
    }
  }, [clearHistory, profileScrollY, push]);

  const handleOpenOwnProfile = React.useCallback(() => {
    setTab('profile');
    clearHistory();
    profileScrollY.setValue(profileScrollOffsets.current.get('me') ?? 0);
    setScreen({ name: 'profile', userId: 'me' });
  }, [clearHistory, profileScrollY]);

  const handleOpenAI = React.useCallback(() => {
    push({ name: 'ai' });
  }, [push]);

  const handleOpenNotifications = React.useCallback(() => {
    notificationsSheetRef.current?.open();
  }, []);

  const handleOpenConversation = React.useCallback((cid: string) => {
    push({ name: 'conversation', conversationId: cid });
  }, [push]);

  const handleOpenSettings = React.useCallback(() => {
    push({ name: 'settings' });
  }, [push]);

  const handleOpenPlans = React.useCallback(() => {
    push({ name: 'plans' });
  }, [push]);

  const handleOpenPersonalInfo = React.useCallback(() => {
    push({ name: 'personalInfo' });
  }, [push]);

  const handleOpenVerification = React.useCallback(() => {
    push({ name: 'verification' });
  }, [push]);

  const handleOpenPrivacy = React.useCallback(() => {
    push({ name: 'privacy' });
  }, [push]);

  const handleOpenSecurity = React.useCallback(() => {
    push({ name: 'security' });
  }, [push]);

  const handleOpenLocation = React.useCallback(() => {
    push({ name: 'location' });
  }, [push]);

  const handleOpenChatTheme = React.useCallback(() => {
    push({ name: 'chatTheme' });
  }, [push]);

  const handleOpenNotificationsScreen = React.useCallback(() => {
    push({ name: 'notifications' });
  }, [push]);

  const handleSignOut = React.useCallback(() => {
    setAuthed(false);
    setOnboarded(false);
    setTab('discover');
    setScreen({ name: 'discover' });
    clearHistory();
  }, [clearHistory]);

  const handleOpenFilters = React.useCallback(() => {
    discoverRef.current?.openFilters();
  }, []);


  const handleBackFromCreate = React.useCallback(() => {
    const currentHistory = historyRef.current;
    if (currentHistory.length > 0) {
      const nextHistory = currentHistory.slice(0, -1);
      historyRef.current = nextHistory;
      setHistory(nextHistory);
      setScreen(currentHistory[currentHistory.length - 1]);
      return;
    }

    setTab('discover');
    setScreen({ name: 'discover' });
    clearHistory();
  }, [clearHistory]);

  const handleGroupCreated = React.useCallback((g: Group) => {
    clearHistory();
    setScreen({ name: 'group', group: g });
    setTab('activity');
  }, [clearHistory]);

  const mainTabs: TabKey[] = ['discover', 'activity', 'create', 'chat', 'profile'];
  const currentMainIndex = mainTabs.indexOf(tab);
  const isAppReady = authed && onboarded;
  const isMainScreen =
    isAppReady &&
    history.length === 0 &&
    (screen.name === 'discover' ||
      screen.name === 'activity' ||
      screen.name === 'create' ||
      screen.name === 'chatList' ||
      (screen.name === 'profile' && screen.userId === 'me'));

  const handleSwipeNextTab = React.useCallback(() => {
    if (currentMainIndex < mainTabs.length - 1) {
      switchTab(mainTabs[currentMainIndex + 1]);
    }
  }, [currentMainIndex, switchTab]);

  const handleSwipePrevTab = React.useCallback(() => {
    if (currentMainIndex > 0) {
      switchTab(mainTabs[currentMainIndex - 1]);
    }
  }, [currentMainIndex, switchTab]);

  const handleGoHome = React.useCallback(() => {
    setTab('discover');
    clearHistory();
    setScreen({ name: 'discover' });
  }, [clearHistory]);

  const handleCreatePrev = React.useCallback(() => {
    createRef.current?.handlePrev();
  }, []);

  const handleCreateOpenAI = React.useCallback(() => {
    createRef.current?.openAI();
  }, []);

  const handleCreateNext = React.useCallback(() => {
    createRef.current?.handleNext();
  }, []);

  const handleOnboardingComplete = React.useCallback(() => {
    setOnboarded(true);
    if (historyRef.current.length > 0) {
      pop();
    } else {
      setTab('discover');
      clearHistory();
      setScreen({ name: 'discover' });
    }
  }, [clearHistory, pop]);

  const isDiscoverActive = isAppReady && isMainScreen && screen.name === 'discover';
  const isActivityActive = isAppReady && isMainScreen && screen.name === 'activity';
  const isCreateActive = isAppReady && isMainScreen && screen.name === 'create';
  const isChatListActive = isAppReady && isMainScreen && screen.name === 'chatList';
  const isOwnProfileActive =
    isAppReady &&
    isMainScreen &&
    screen.name === 'profile' &&
    (screen.userId === 'me' || !screen.userId);

  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS === 'web') return;
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isTabScreen =
    ['discover', 'activity', 'create', 'chatList'].includes(screen.name) ||
    (screen.name === 'profile' && screen.userId === 'me');

  const showBottomNav = !isKeyboardVisible && isTabScreen;
  const activeHeaderKey = `${screen.name}-${
    'userId' in screen
      ? screen.userId
      : 'conversationId' in screen
      ? screen.conversationId
      : 'group' in screen
      ? screen.group.id
      : ''
  }-${history.length}`;
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
        {!authed ? (
          <View style={styles.screenContainer}>
            <ScreenTransition screenKey="auth">
              <AuthScreen onComplete={handleAuthSuccess} />
            </ScreenTransition>
          </View>
        ) : !onboarded || screen.name === 'onboarding' ? (
          <View style={styles.screenContainer}>
            <ScreenTransition screenKey="onboarding">
              <Onboarding onComplete={handleOnboardingComplete} />
            </ScreenTransition>
          </View>
        ) : (
          <View style={styles.screenContainer}>
            <ScreenTransition
              screenKey={`${screen.name}-${'userId' in screen ? screen.userId : ''}-${history.length}`}
              disableAnimation={screen.name === 'conversation'}
            >
              <ErrorBoundary onGoHome={handleGoHome}>
                {/* 5 Persistent Tab Roots (Zero Re-instantiation Lag) */}
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { opacity: isDiscoverActive ? 1 : 0, zIndex: isDiscoverActive ? 1 : -1 },
                  ]}
                  pointerEvents={isDiscoverActive ? 'auto' : 'none'}
                >
                  <DiscoverScreen
                    ref={discoverRef}
                    search={discoverSearch}
                    onChangeSearch={setDiscoverSearch}
                    onOpenGroup={handleOpenGroup}
                    onOpenProfile={handleOpenProfile}
                    onOpenOwnProfile={handleOpenOwnProfile}
                    onOpenAI={handleOpenAI}
                    onOpenNotifications={handleOpenNotifications}
                    initialScrollOffset={getScrollOffset('discover')}
                    onScrollOffsetChange={(offset) => saveScrollOffset('discover', offset)}
                  />
                </View>

                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { opacity: isActivityActive ? 1 : 0, zIndex: isActivityActive ? 1 : -1 },
                  ]}
                  pointerEvents={isActivityActive ? 'auto' : 'none'}
                >
                  <ActivityScreen
                    tab={activityTab}
                    onChangeTab={setActivityTab}
                    onOpenGroup={handleOpenGroup}
                    onOpenProfile={handleOpenProfile}
                    onOpenNotifications={handleOpenNotifications}
                    initialScrollOffset={getScrollOffset(`activity:${activityTab}`)}
                    onScrollOffsetChange={(offset) => saveScrollOffset(`activity:${activityTab}`, offset)}
                  />
                </View>

                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { opacity: isCreateActive ? 1 : 0, zIndex: isCreateActive ? 1 : -1 },
                  ]}
                  pointerEvents={isCreateActive ? 'auto' : 'none'}
                >
                  <CreateScreen
                    ref={createRef}
                    onStateChange={setCreateState}
                    onBack={handleBackFromCreate}
                    onCreated={handleGroupCreated}
                  />
                </View>

                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { opacity: isChatListActive ? 1 : 0, zIndex: isChatListActive ? 1 : -1 },
                  ]}
                  pointerEvents={isChatListActive ? 'auto' : 'none'}
                >
                  <ChatListScreen
                    search={chatSearch}
                    onOpenConversation={handleOpenConversation}
                    onOpenNotifications={handleOpenNotifications}
                    initialScrollOffset={getScrollOffset('chatList')}
                    onScrollOffsetChange={(offset) => saveScrollOffset('chatList', offset)}
                  />
                </View>

                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { opacity: isOwnProfileActive ? 1 : 0, zIndex: isOwnProfileActive ? 1 : -1 },
                  ]}
                  pointerEvents={isOwnProfileActive ? 'auto' : 'none'}
                >
                  <ProfileScreen
                    userId="me"
                    isOwnProfile={true}
                    onBack={pop}
                    onOpenGroup={handleOpenGroup}
                    onOpenSettings={handleOpenSettings}
                    onOpenPersonalInfo={handleOpenPersonalInfo}
                    onOpenVerification={handleOpenVerification}
                    scrollY={profileScrollY}
                    contentOffset={activeProfileScrollOffset}
                  />
                </View>

                {/* Pushed Sub-screens (Rendered on top when active) */}
                {!isTabScreen && (
                  <View style={[StyleSheet.absoluteFill, { zIndex: 10 }]} pointerEvents="auto">
                    {screen.name === 'profile' && screen.userId !== 'me' && (
                      <ProfileScreen
                        key={screen.userId}
                        userId={screen.userId}
                        isOwnProfile={false}
                        onBack={pop}
                        onOpenGroup={handleOpenGroup}
                        onOpenSettings={handleOpenSettings}
                        onOpenPersonalInfo={handleOpenPersonalInfo}
                        onOpenVerification={handleOpenVerification}
                        scrollY={profileScrollY}
                        contentOffset={activeProfileScrollOffset}
                      />
                    )}
                    {screen.name === 'group' && (
                      <EkipDetail
                        ref={ekipDetailRef}
                        group={screen.group}
                        onBack={pop}
                        onOpenProfile={handleOpenProfile}
                        onOpenChat={handleOpenConversation}
                        initialScrollOffset={getScrollOffset(`group:${screen.group.id}`)}
                        onScrollOffsetChange={(offset) => saveScrollOffset(`group:${screen.group.id}`, offset)}
                      />
                    )}
                    {screen.name === 'conversation' && (
                      <ConversationScreen conversationId={screen.conversationId} onBack={pop} />
                    )}
                    {screen.name === 'notifications' && (
                      <NotificationsScreen
                        onBack={pop}
                        onOpenConversation={handleOpenConversation}
                        initialScrollOffset={getScrollOffset('notifications')}
                        onScrollOffsetChange={(offset) => saveScrollOffset('notifications', offset)}
                      />
                    )}
                    {screen.name === 'ai' && <AIAssistant ref={aiRef} onBack={pop} />}
                    {screen.name === 'settings' && (
                      <SettingsScreen
                        onBack={pop}
                        onOpenPlans={handleOpenPlans}
                        onOpenPersonalInfo={handleOpenPersonalInfo}
                        onOpenVerification={handleOpenVerification}
                        onOpenPrivacy={handleOpenPrivacy}
                        onOpenSecurity={handleOpenSecurity}
                        onOpenNotifications={handleOpenNotificationsScreen}
                        onOpenLocation={handleOpenLocation}
                        onOpenChatTheme={handleOpenChatTheme}
                        onOpenOnboarding={() => push({ name: 'onboarding' })}
                        onSignOut={handleSignOut}
                      />
                    )}
                    {screen.name === 'plans' && <PlansScreen onBack={pop} />}
                    {screen.name === 'personalInfo' && (
                      <PersonalInfoScreen
                        onBack={pop}
                        onOpenVerification={handleOpenVerification}
                      />
                    )}
                    {screen.name === 'verification' && <VerificationScreen onBack={pop} />}
                    {screen.name === 'privacy' && <PrivacyScreen onBack={pop} />}
                    {screen.name === 'security' && <SecurityScreen onBack={pop} />}
                    {screen.name === 'location' && <LocationScreen onBack={pop} />}
                    {screen.name === 'chatTheme' && <ChatThemeScreen onBack={pop} />}
                  </View>
                )}
              </ErrorBoundary>
            </ScreenTransition>
          </View>
        )}

        <ActiveHeaderTransition screenKey={activeHeaderKey}>
        {isDiscoverActive && (
          <DiscoverHeader
            user={me}
            unreadCount={unreadNotificationsCount}
            search={discoverSearch}
            onChangeSearch={setDiscoverSearch}
            hasActiveFilters={false}
            onOpenFilters={handleOpenFilters}
            onOpenNotifications={handleOpenNotifications}
            onOpenOwnProfile={handleOpenOwnProfile}
          />
        )}
        {isActivityActive && (
          <ActivityHeader
            user={me}
            unreadCount={unreadNotificationsCount}
            tab={activityTab}
            onChangeTab={setActivityTab}
            onOpenNotifications={handleOpenNotifications}
            onOpenOwnProfile={handleOpenOwnProfile}
          />
        )}
        {isCreateActive && (
          <>
            <CreateHeader
              step={createState.step}
              totalSteps={4}
              onBack={handleCreatePrev}
              onOpenAI={handleCreateOpenAI}
            />
            <CreateContinueButton
              step={createState.step}
              totalSteps={4}
              disabled={!createState.canProceed}
              onPress={handleCreateNext}
            />
          </>
        )}
        {isChatListActive && (
          <ChatListHeader
            unreadTotal={unreadConversationsTotal}
            notificationsCount={unreadNotificationsCount}
            search={chatSearch}
            onChangeSearch={setChatSearch}
            onOpenNotifications={handleOpenNotifications}
          />
        )}
        {isOwnProfileActive && (
          <ProfileHeader
            profile={me}
            isOwnProfile={true}
            onBack={pop}
            onOpenSettings={handleOpenSettings}
            scrollY={profileScrollY}
            initialScrollOffset={activeProfileScrollOffset}
            onScrollOffsetChange={saveActiveProfileScrollOffset}
          />
        )}
        {screen.name === 'conversation' && (() => {
          const conv = conversations.find((item) => item.id === screen.conversationId);
          return conv ? (
            <ChatHeader conversation={conv} onBack={pop} />
          ) : null;
        })()}
        {screen.name === 'ai' && (
          <>
            <AIHeader onBack={pop} />
            <ChatInputBar
              onSendMessage={(text) => aiRef.current?.sendMessage(text)}
              placeholder={t('chat.queryCommandAI')}
            />
          </>
        )}
        {screen.name === 'profile' && screen.userId !== 'me' && (() => {
          const profile = profiles.find((item) => item.id === screen.userId) ?? me;
          return (
            <ProfileHeader
              key={screen.userId}
              profile={profile}
              isOwnProfile={false}
              onBack={pop}
              onOpenSettings={handleOpenSettings}
              scrollY={profileScrollY}
              initialScrollOffset={activeProfileScrollOffset}
              onScrollOffsetChange={saveActiveProfileScrollOffset}
            />
          );
        })()}
        {screen.name === 'settings' && <SettingsHeader onBack={pop} title={t('settings.headerSettings')} />}
        {screen.name === 'plans' && <SettingsHeader onBack={pop} title={t('settings.headerPlans')} />}
        {screen.name === 'personalInfo' && <SettingsHeader onBack={pop} title={t('settings.headerPersonalInfo')} />}
        {screen.name === 'verification' && <SettingsHeader onBack={pop} title={t('settings.headerVerification')} />}
        {screen.name === 'privacy' && <SettingsHeader onBack={pop} title={t('settings.headerPrivacy')} />}
        {screen.name === 'security' && <SettingsHeader onBack={pop} title={t('settings.headerSecurity')} />}
        {screen.name === 'location' && <SettingsHeader onBack={pop} title={t('settings.headerLocation')} />}
        {screen.name === 'chatTheme' && <SettingsHeader onBack={pop} title={t('settings.headerChatTheme')} />}
        {screen.name === 'notifications' && <SettingsHeader onBack={pop} title={t('settings.headerNotifications')} />}
        {screen.name === 'group' && (
          <EkipDetailHeader
            group={screen.group}
            onBack={pop}
            onShare={() => ekipDetailRef.current?.openShare()}
          />
        )}
        </ActiveHeaderTransition>

        {authed && onboarded && (
          <ActiveBottomNavTransition show={showBottomNav}>
            <BottomNav active={tab} onChange={switchTab} />
          </ActiveBottomNavTransition>
        )}
        {authed && onboarded && (
          <NotificationsSheetHost
            ref={notificationsSheetRef}
            onOpenConversation={handleOpenConversation}
          />
        )}

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

export default function App() {
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
                      <MainContent />
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
  safeArea: {
    flex: 1,
  },
  phoneContainer: {
    flex: 1,
    position: 'relative',
    maxWidth: Platform.OS === 'web' ? 440 : undefined,
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  screenContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  themeCurtain: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
  headerOverlayWrapper: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
});