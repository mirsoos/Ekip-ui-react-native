// --- START OF FILE App.tsx ---

import React, { useState } from 'react';
import { View, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme, ThemeContext, type ThemeContextValue } from './src/lib/theme';
import { AppDataProvider, useAppData } from './src/lib/appData';
import { BottomNav, type TabKey } from './src/components/BottomNav';
import { ChatHeader } from './src/components/chat/ChatHeader';
import { ChatListHeader } from './src/components/chat/ChatListHeader';
import { ChatInputBar } from './src/components/chat/ChatInputBar';
import { DiscoverHeader } from './src/components/discover/DiscoverHeader';
import { ActivityHeader } from './src/components/activity/ActivityHeader';
import { SettingsHeader } from './src/components/settings/SettingsHeader';
import { AIHeader } from './src/components/ai/AIHeader';
import { ProfileHeader } from './src/components/profile/ProfileHeader';
import { EkipActionBar } from './src/components/ekip/EkipActionBar';
import { CreateContinueButton } from './src/components/create/CreateContinueButton';
import { CreateHeader } from './src/components/create/CreateHeader';
import { NotificationsSheet } from './src/components/notifications/NotificationsSheet';
import type { Group } from './src/types/database';

// Screens
import { AuthScreen } from './src/screens/AuthScreen';
import { Onboarding } from './src/screens/Onboarding';
import { DiscoverScreen, type DiscoverScreenHandle } from './src/screens/DiscoverScreen';
import { EkipDetail } from './src/screens/EkipDetail';
import { CreateScreen, type CreateScreenHandle } from './src/screens/CreateScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ActivityScreen } from './src/screens/ActivityScreen';
import { ChatListScreen, ConversationScreen } from './src/screens/ChatScreens';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { AIAssistant, type AIAssistantHandle } from './src/screens/AIAssistant';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PlansScreen } from './src/screens/PlansScreen';
import { PersonalInfoScreen } from './src/screens/PersonalInfoScreen';
import { VerificationScreen } from './src/screens/VerificationScreen';
import { PrivacyScreen } from './src/screens/PrivacyScreen';
import { SecurityScreen } from './src/screens/SecurityScreen';
import { LocationScreen } from './src/screens/LocationScreen';
import { ChatThemeScreen } from './src/screens/ChatThemeScreen';
import { Loading } from './src/screens/Loading';

import { AuroraBackground } from './src/components/AuroraBackground';
import { SwipeNavigationContainer } from './src/components/common/SwipeNavigationContainer';
import { ScreenTransition } from './src/components/common/ScreenTransition';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { I18nProvider, useI18n } from './src/lib/i18n';

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

const FreezeGate = React.memo(
  function FreezeGate({
    children,
  }: {
    active: boolean;
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  },
  (prevProps, nextProps) => {
    // If inactive, NEVER re-render children even when parent MainContent re-renders (e.g. on Theme Toggle!)
    if (!nextProps.active && !prevProps.active) return true;
    return false;
  }
);

function DeferredTabPane({
  active,
  visible,
  zIndexActive = 1,
  theme,
  children,
}: {
  active: boolean;
  visible: boolean;
  zIndexActive?: number;
  theme?: ThemeContextValue;
  children: React.ReactNode;
}) {
  const rootTheme = useTheme();
  const effectiveTheme = theme ?? rootTheme;

  return (
    <ThemeContext.Provider value={effectiveTheme}>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: visible ? 1 : 0,
            zIndex: visible ? zIndexActive : 0,
          },
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <FreezeGate active={active}>{children}</FreezeGate>
      </View>
    </ThemeContext.Provider>
  );
}

function DeferredHeaderPane({
  active,
  visible,
  pointerEvents = 'box-none',
  theme,
  children,
}: {
  active: boolean;
  visible: boolean;
  pointerEvents?: 'box-none' | 'none' | 'auto';
  theme?: ThemeContextValue;
  children: React.ReactNode;
}) {
  const rootTheme = useTheme();
  const effectiveTheme = theme ?? rootTheme;

  const anim = React.useRef(new Animated.Value(visible ? 1 : 0)).current;

  React.useEffect(() => {
    if (visible) {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      anim.setValue(0);
    }
  }, [visible, anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  return (
    <ThemeContext.Provider value={effectiveTheme}>
      <Animated.View
        renderToHardwareTextureAndroid={true}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: Platform.OS === 'web' ? (visible ? 1 : 0) : anim,
            zIndex: visible ? 10 : 0,
            display: Platform.OS === 'web' ? (visible ? 'flex' : 'none') : undefined,
            ...(Platform.OS === 'web' ? {} : { transform: [{ translateY }] }),
          },
        ]}
        pointerEvents={visible ? pointerEvents : 'none'}
      >
        <FreezeGate active={active}>{children}</FreezeGate>
      </Animated.View>
    </ThemeContext.Provider>
  );
}

const AppChrome = React.memo(function AppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const isMountedRef = React.useRef(false);
  const [curtainColor, setCurtainColor] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    // Previous canvas color to dissolve from
    const oldColor = isDark ? '#ebf0fa' : '#04060c';
    setCurtainColor(oldColor);

    if (Platform.OS !== 'web') {
      fadeAnim.setValue(1);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 320,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
        useNativeDriver: true,
      }).start(() => {
        setCurtainColor(null);
      });
    } else {
      setCurtainColor(null);
    }
  }, [isDark, fadeAnim]);

  return (
    <SafeAreaView
      edges={Platform.OS === 'web' ? undefined : ['left', 'right']}
      style={[styles.safeArea, { backgroundColor: isDark ? '#04060c' : '#ebf0fa' }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AuroraBackground />
      {children}
      {Platform.OS !== 'web' && curtainColor && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: curtainColor,
              opacity: fadeAnim,
              zIndex: 99998,
            },
          ]}
        />
      )}
    </SafeAreaView>
  );
});

interface NotificationsSheetController {
  open: () => void;
}

const NotificationsSheetHost = React.memo(
  React.forwardRef<
    NotificationsSheetController,
    {
      bootLoading: boolean;
      onOpenConversation: (conversationId: string) => void;
    }
  >(function NotificationsSheetHost({ bootLoading, onOpenConversation }, ref) {
    const [open, setOpen] = useState(false);
    const openSheet = React.useCallback(() => setOpen(true), []);
    const closeSheet = React.useCallback(() => setOpen(false), []);

    React.useImperativeHandle(ref, () => ({ open: openSheet }), [openSheet]);

    return (
      <FreezeGate active={bootLoading || open}>
        <NotificationsSheet
          open={open}
          onClose={closeSheet}
          onOpenConversation={onOpenConversation}
        />
      </FreezeGate>
    );
  })
);

function MainContent() {
  const { t, language } = useI18n();
  const { me, profiles, conversations, notifications, addMessage } = useAppData();

  const [fontsLoaded] = useFonts({
    IranianSans: require('./assets/fonts/IranianSans.ttf'),
    'Iranian Sans': require('./assets/fonts/IranianSans.ttf'),
    IRANSans: require('./assets/fonts/IRANSans.ttf'),
  });

  const [authed, setAuthed] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState<TabKey>('discover');
  const [screen, setScreen] = useState<Screen>({ name: 'discover' });

  // Single-Tree Boot Preload Sequence (Stages 0 -> 6 behind initial loading overlay)
  const [bootStage, setBootStage] = useState(0);
  const [isBootLoading, setIsBootLoading] = useState(true);
  const bootOverlayOpacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (Platform.OS !== 'web' && !fontsLoaded) return;
    let isCancelled = false;
    let timerId: ReturnType<typeof setTimeout>;

    const advanceStage = (stage: number) => {
      if (isCancelled) return;
      setBootStage(stage);

      if (stage < 6) {
        timerId = setTimeout(() => {
          requestAnimationFrame(() => {
            advanceStage(stage + 1);
          });
        }, 90);
      } else {
        // Stage 6 complete: allow commit, then smoothly fade out initial boot overlay
        timerId = setTimeout(() => {
          if (isCancelled) return;
          Animated.timing(bootOverlayOpacity, {
            toValue: 0,
            duration: 280,
            useNativeDriver: Platform.OS !== 'web',
          }).start(() => {
            if (!isCancelled) {
              setIsBootLoading(false);
            }
          });
        }, 120);
      }
    };

    requestAnimationFrame(() => {
      advanceStage(1);
    });

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
    };
  }, [bootOverlayOpacity, fontsLoaded]);

  const handleAuthSuccess = React.useCallback(() => {
    setAuthed(true);
    setOnboarded(false);
  }, []);

  const [history, setHistory] = useState<Screen[]>([]);
  const [createState, setCreateState] = useState({ step: 0, canProceed: false });
  const [chatSearch, setChatSearch] = useState('');
  const [discoverSearch, setDiscoverSearch] = useState('');
  const [activityTab, setActivityTab] = useState('created');
  const createRef = React.useRef<CreateScreenHandle>(null);
  const discoverRef = React.useRef<DiscoverScreenHandle>(null);
  const aiRef = React.useRef<AIAssistantHandle>(null);
  const profileScrollY = React.useRef(new Animated.Value(0)).current;

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

  const push = React.useCallback((s: Screen) => {
    setHistory((prev) => [...prev, screenRef.current]);
    setScreen(s);
  }, []);

  const pop = React.useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const last = next.pop()!;
      setScreen(last);
      return next;
    });
  }, []);

  const switchTab = React.useCallback((t: TabKey) => {
    setTab(t);
    setHistory([]);
    if (t === 'discover') setScreen({ name: 'discover' });
    else if (t === 'activity') setScreen({ name: 'activity' });
    else if (t === 'create') setScreen({ name: 'create' });
    else if (t === 'chat') setScreen({ name: 'chatList' });
    else if (t === 'profile') {
      profileScrollY.setValue(0);
      setScreen({ name: 'profile', userId: 'me' });
    }
  }, [profileScrollY]);

  const handleOpenGroup = React.useCallback((g: Group) => {
    push({ name: 'group', group: g });
  }, [push]);

  const handleOpenProfile = React.useCallback((uid: string) => {
    if (uid === 'me') {
      setTab('profile');
      setHistory([]);
      setScreen({ name: 'profile', userId: 'me' });
    } else {
      push({ name: 'profile', userId: uid });
    }
  }, [push]);

  const handleOpenOwnProfile = React.useCallback(() => {
    setTab('profile');
    setHistory([]);
    setScreen({ name: 'profile', userId: 'me' });
  }, []);

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
    setHistory([]);
  }, []);

  const handleOpenFilters = React.useCallback(() => {
    discoverRef.current?.openFilters();
  }, []);

  const handleBackToActivity = React.useCallback(() => {
    setTab('activity');
    setHistory([]);
    setScreen({ name: 'activity' });
  }, []);

  const handleBackFromCreate = React.useCallback(() => {
    setHistory((prev) => {
      if (prev.length > 0) {
        const next = [...prev];
        const last = next.pop()!;
        setScreen(last);
        return next;
      } else {
        setTab('discover');
        setScreen({ name: 'discover' });
        return [];
      }
    });
  }, []);

  const handleGroupCreated = React.useCallback((g: Group) => {
    setHistory([]);
    setScreen({ name: 'group', group: g });
    setTab('activity');
  }, []);

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
    setHistory([]);
    setScreen({ name: 'discover' });
  }, []);

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
  }, []);

  const isMainAppVisible = isBootLoading || (authed && onboarded);
  const isDiscoverActive = isMainAppVisible && isMainScreen && screen.name === 'discover';
  const isActivityActive = isMainAppVisible && isMainScreen && screen.name === 'activity';
  const isCreateActive = isMainAppVisible && isMainScreen && screen.name === 'create';
  const isChatListActive = isMainAppVisible && isMainScreen && screen.name === 'chatList';
  const isOwnProfileActive =
    isMainAppVisible &&
    isMainScreen &&
    screen.name === 'profile' &&
    (screen.userId === 'me' || !screen.userId);

  const showBottomNav =
    ['discover', 'activity', 'create', 'chatList'].includes(screen.name) ||
    (screen.name === 'profile' && screen.userId === 'me');

  const rootTheme = useTheme();

  const [tabThemes, setTabThemes] = React.useState<Record<TabKey, ThemeContextValue>>({
    discover: rootTheme,
    activity: rootTheme,
    create: rootTheme,
    chat: rootTheme,
    profile: rootTheme,
  });

  const tabThemesRef = React.useRef(tabThemes);
  tabThemesRef.current = tabThemes;

  React.useEffect(() => {
    // If on a stack screen (Settings, conversation, etc.), pause ALL main tab syncing!
    if (!isMainScreen) return;

    // 1. Immediately update active tab's theme
    setTabThemes((prev) => {
      if (prev[tab] === rootTheme) return prev;
      return { ...prev, [tab]: rootTheme };
    });

    // 2. Sequentially sync inactive tabs during idle time
    let isCancelled = false;
    const inactiveTabs = mainTabs.filter(
      (t) => t !== tab && tabThemesRef.current[t] !== rootTheme
    );
    if (inactiveTabs.length === 0) return;

    let currentIndex = 0;
    const syncNextTab = () => {
      if (isCancelled || currentIndex >= inactiveTabs.length) return;
      const nextTab = inactiveTabs[currentIndex++];

      const runSync = () => {
        if (isCancelled) return;
        setTabThemes((prev) => ({ ...prev, [nextTab]: rootTheme }));
        setTimeout(() => {
          if (!isCancelled) syncNextTab();
        }, 120);
      };

      if (typeof (globalThis as any).requestIdleCallback !== 'undefined') {
        (globalThis as any).requestIdleCallback(runSync);
      } else {
        requestAnimationFrame(() => {
          setTimeout(runSync, 40);
        });
      }
    };

    const initialTimer = setTimeout(() => {
      syncNextTab();
    }, 180);

    return () => {
      isCancelled = true;
      clearTimeout(initialTimer);
    };
  }, [rootTheme, tab, isMainScreen]);

  return (
    <AppChrome>
      <View nativeID="phone-container" style={styles.phoneContainer}>
        {/* Layer 1: Auth Screen (Stage 1 - Frozen when authed!) */}
        {bootStage >= 1 && (
          <DeferredTabPane
            active={isBootLoading || !authed}
            visible={!authed}
            zIndexActive={20}
          >
            <View style={styles.screenContainer}>
              <ScreenTransition screenKey={`auth-${language}`}>
                <AuthScreen onComplete={handleAuthSuccess} />
              </ScreenTransition>
            </View>
          </DeferredTabPane>
        )}

        {/* Layer 2: Onboarding (Stage 1 - Frozen when onboarded!) */}
        {bootStage >= 1 && (
          <DeferredTabPane
            active={isBootLoading || (authed && !onboarded)}
            visible={authed && !onboarded}
            zIndexActive={20}
          >
            <View style={styles.screenContainer}>
              <ScreenTransition screenKey={`onboarding-${language}`}>
                <Onboarding onComplete={handleOnboardingComplete} />
              </ScreenTransition>
            </View>
          </DeferredTabPane>
        )}

        {/* Layer 3: Main Application (Pre-mounted in RAM via Stages 2-6) */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: authed && onboarded ? 1 : 0,
              zIndex: authed && onboarded ? 10 : 0,
            },
          ]}
          pointerEvents={authed && onboarded ? 'auto' : 'none'}
        >
          <View style={styles.screenContainer}>
            <SwipeNavigationContainer
              canGoBack={history.length > 0}
              onGoBack={pop}
              canSwipeLeftTab={isMainScreen && currentMainIndex < mainTabs.length - 1}
              canSwipeRightTab={isMainScreen && currentMainIndex > 0}
              onSwipeNextTab={handleSwipeNextTab}
              onSwipePrevTab={handleSwipePrevTab}
            >
              <ErrorBoundary onGoHome={handleGoHome}>
                <ScreenTransition screenKey={`${isMainScreen ? 'main-tabs' : screen.name}-${history.length}-${language}`}>
                  {/* Stage 2: Main Tab: Discover */}
                  {bootStage >= 2 && (
                    <DeferredTabPane
                      active={isBootLoading || isDiscoverActive}
                      visible={isDiscoverActive}
                      theme={tabThemes.discover}
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
                      />
                    </DeferredTabPane>
                  )}

                  {/* Stage 3: Main Tab: Activity */}
                  {bootStage >= 3 && (
                    <DeferredTabPane
                      active={isBootLoading || isActivityActive}
                      visible={isActivityActive}
                      theme={tabThemes.activity}
                    >
                      <ActivityScreen
                        tab={activityTab}
                        onChangeTab={setActivityTab}
                        onOpenGroup={handleOpenGroup}
                        onOpenProfile={handleOpenProfile}
                        onOpenNotifications={handleOpenNotifications}
                      />
                    </DeferredTabPane>
                  )}

                  {/* Stage 5: Main Tab: Create */}
                  {bootStage >= 5 && (
                    <DeferredTabPane
                      active={isBootLoading || isCreateActive}
                      visible={isCreateActive}
                      theme={tabThemes.create}
                    >
                      <CreateScreen
                        ref={createRef}
                        onStateChange={setCreateState}
                        onBack={handleBackFromCreate}
                        onCreated={handleGroupCreated}
                      />
                    </DeferredTabPane>
                  )}

                  {/* Stage 4: Main Tab: Chat List */}
                  {bootStage >= 4 && (
                    <DeferredTabPane
                      active={isBootLoading || isChatListActive}
                      visible={isChatListActive}
                      theme={tabThemes.chat}
                    >
                      <ChatListScreen
                        search={chatSearch}
                        onOpenConversation={handleOpenConversation}
                        onOpenNotifications={handleOpenNotifications}
                      />
                    </DeferredTabPane>
                  )}

                  {/* Stage 5: Main Tab: Own Profile */}
                  {bootStage >= 5 && (
                    <DeferredTabPane
                      active={isBootLoading || isOwnProfileActive}
                      visible={isOwnProfileActive}
                      theme={tabThemes.profile}
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
                      />
                    </DeferredTabPane>
                  )}

                  {/* Stack Screens (Only mounted when active) */}
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
                    />
                  )}

                  {screen.name === 'group' && (
                    <EkipDetail
                      group={screen.group}
                      onBack={handleBackToActivity}
                      onOpenProfile={handleOpenProfile}
                      onOpenChat={handleOpenConversation}
                    />
                  )}

                  {screen.name === 'conversation' && (
                    <ConversationScreen conversationId={screen.conversationId} onBack={pop} />
                  )}

                  {screen.name === 'notifications' && (
                    <NotificationsScreen
                      onBack={pop}
                      onOpenConversation={handleOpenConversation}
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

                  {screen.name === 'onboarding' && (
                    <Onboarding
                      onComplete={() => {
                        setTab('discover');
                        setHistory([]);
                        setScreen({ name: 'discover' });
                      }}
                    />
                  )}
                </ScreenTransition>
              </ErrorBoundary>
            </SwipeNavigationContainer>
          </View>

          {/* Headers */}
          {/* Stage 2: Discover Header */}
          {bootStage >= 2 && (
            <DeferredHeaderPane
              active={isBootLoading || isDiscoverActive}
              visible={isDiscoverActive}
              theme={tabThemes.discover}
              pointerEvents="box-none"
            >
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
            </DeferredHeaderPane>
          )}

          {/* Stage 3: Activity Header */}
          {bootStage >= 3 && (
            <DeferredHeaderPane
              active={isBootLoading || isActivityActive}
              visible={isActivityActive}
              theme={tabThemes.activity}
              pointerEvents="box-none"
            >
              <ActivityHeader
                unreadCount={unreadNotificationsCount}
                tab={activityTab}
                onChangeTab={setActivityTab}
                onOpenNotifications={handleOpenNotifications}
              />
            </DeferredHeaderPane>
          )}

          {/* Stage 5: Create Header */}
          {bootStage >= 5 && (
            <DeferredHeaderPane
              active={isBootLoading || isCreateActive}
              visible={isCreateActive}
              theme={tabThemes.create}
              pointerEvents="box-none"
            >
              <CreateHeader
                step={createState.step}
                totalSteps={4}
                onBack={handleCreatePrev}
                onOpenAI={handleCreateOpenAI}
              />
            </DeferredHeaderPane>
          )}

          {/* Stage 5: Create Continue Button (Bottom Action) */}
          {bootStage >= 5 && isCreateActive && (
            <CreateContinueButton
              step={createState.step}
              totalSteps={4}
              disabled={!createState.canProceed}
              onPress={handleCreateNext}
            />
          )}

          {/* Stage 4: Chat List Header */}
          {bootStage >= 4 && (
            <DeferredHeaderPane
              active={isBootLoading || isChatListActive}
              visible={isChatListActive}
              theme={tabThemes.chat}
              pointerEvents="box-none"
            >
              <ChatListHeader
                unreadTotal={unreadConversationsTotal}
                notificationsCount={unreadNotificationsCount}
                search={chatSearch}
                onChangeSearch={setChatSearch}
                onOpenNotifications={handleOpenNotifications}
              />
            </DeferredHeaderPane>
          )}

          {/* Stage 5: Own Profile Header */}
          {bootStage >= 5 && (
            <DeferredHeaderPane
              active={isBootLoading || isOwnProfileActive}
              visible={isOwnProfileActive}
              theme={tabThemes.profile}
              pointerEvents="box-none"
            >
              <ProfileHeader
                profile={me}
                isOwnProfile={true}
                onBack={pop}
                onOpenSettings={handleOpenSettings}
                scrollY={profileScrollY}
              />
            </DeferredHeaderPane>
          )}

          {screen.name === 'conversation' && (() => {
            const conv = conversations.find((c) => c.id === screen.conversationId);
            return conv ? (
              <>
                <ChatHeader conversation={conv} onBack={pop} />
                <ChatInputBar
                  onSendMessage={(text) => addMessage(screen.conversationId, text)}
                  placeholder={t('chat.transmitDispatch')}
                />
              </>
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
            const profile = profiles.find((p) => p.id === screen.userId) ?? me;
            return (
              <ProfileHeader
                key={screen.userId}
                profile={profile}
                isOwnProfile={false}
                onBack={pop}
                onOpenSettings={handleOpenSettings}
                scrollY={profileScrollY}
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
            <EkipActionBar
              group={screen.group}
              onOpenProfile={handleOpenProfile}
              onOpenChat={handleOpenConversation}
            />
          )}

          {/* Stage 5: BottomNav */}
          {bootStage >= 5 && showBottomNav && (
            <BottomNav active={tab} onChange={switchTab} />
          )}

          {/* Stage 6: Sheets (Frozen when closed so theme switches don't re-render hidden sheets!) */}
          {bootStage >= 6 && (
            <NotificationsSheetHost
              ref={notificationsSheetRef}
              bootLoading={isBootLoading}
              onOpenConversation={handleOpenConversation}
            />
          )}
        </View>

        {/* Layer 4: Initial Boot Loading Overlay (Stage 0 -> 6) */}
        {isBootLoading && (
          <Animated.View
            pointerEvents="auto"
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: bootOverlayOpacity,
                zIndex: 99999,
              },
            ]}
          >
            <Loading minDuration={999999} />
          </Animated.View>
        )}
      </View>
    </AppChrome>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <ThemeProvider>
          <AppDataProvider>
            <ErrorBoundary>
              <MainContent />
            </ErrorBoundary>
          </AppDataProvider>
        </ThemeProvider>
      </I18nProvider>
    </SafeAreaProvider>
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
  tabContainer: {
    ...StyleSheet.absoluteFill,
  },
  headerOverlayWrapper: {
    ...StyleSheet.absoluteFill,
  },
});