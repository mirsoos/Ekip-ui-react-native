// --- START OF FILE App.tsx ---

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  ThemeProvider,
  useTheme,
} from './src/lib/theme';
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

const AppChrome = React.memo(function AppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark } = useTheme();
  const curtainOpacity = useRef(new Animated.Value(0)).current;
  const previousTheme = useRef(isDark);

  useLayoutEffect(() => {
    if (previousTheme.current === isDark) return;
    previousTheme.current = isDark;
    curtainOpacity.stopAnimation();
    curtainOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(curtainOpacity, {
        toValue: 0.16,
        duration: 90,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(curtainOpacity, {
        toValue: 0,
        duration: 260,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [curtainOpacity, isDark]);

  return (
    <SafeAreaView
      edges={Platform.OS === 'web' ? undefined : ['left', 'right']}
      style={[styles.safeArea, { backgroundColor: isDark ? '#04060c' : '#ebf0fa' }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AuroraBackground isDark={isDark} />
      {children}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.themeCurtain,
          {
            backgroundColor: isDark ? '#04060c' : '#ebf0fa',
            opacity: curtainOpacity,
          },
        ]}
      />
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
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 180,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    return () => animation.stopAnimation();
  }, [animation, screenKey]);

  return (
    <Animated.View
      pointerEvents="box-none"
      renderToHardwareTextureAndroid
      style={[
        styles.headerOverlayWrapper,
        {
          opacity: animation,
        },
      ]}
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
  const { me, profiles, conversations, notifications, addMessage } = useAppData();

  const [fontsLoaded] = useFonts({
    IranianSans: require('./assets/fonts/IranianSans.ttf'),
    'Iranian Sans': require('./assets/fonts/IranianSans.ttf'),
    IRANSans: require('./assets/fonts/IRANSans.ttf'),
  });

  const [isLoading, setIsLoading] = useState(true);
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
  const profileScrollY = React.useRef(new Animated.Value(0)).current;
  const profileScrollOffsets = React.useRef(new Map<string, number>());
  const activeProfileId = screen.name === 'profile' ? screen.userId : 'me';
  const activeProfileScrollOffset = profileScrollOffsets.current.get(activeProfileId) ?? 0;
  const saveActiveProfileScrollOffset = React.useCallback((offset: number) => {
    profileScrollOffsets.current.set(activeProfileId, offset);
  }, [activeProfileId]);

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
    if (currentHistory.length === 0) return;
    const nextHistory = currentHistory.slice(0, -1);
    const previousScreen = currentHistory[currentHistory.length - 1];
    if (previousScreen.name === 'profile') {
      profileScrollY.setValue(profileScrollOffsets.current.get(previousScreen.userId) ?? 0);
    }
    historyRef.current = nextHistory;
    setHistory(nextHistory);
    setScreen(previousScreen);
  }, [profileScrollY]);

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

  const handleBackToActivity = React.useCallback(() => {
    setTab('activity');
    clearHistory();
    setScreen({ name: 'activity' });
  }, [clearHistory]);

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

  const showBottomNav =
    ['discover', 'activity', 'create', 'chatList'].includes(screen.name) ||
    (screen.name === 'profile' && screen.userId === 'me');
  const activeHeaderKey = `${screen.name}-${
    'userId' in screen
      ? screen.userId
      : 'conversationId' in screen
      ? screen.conversationId
      : 'group' in screen
      ? screen.group.id
      : ''
  }-${history.length}`;
  if (!fontsLoaded && Platform.OS !== 'web') {
    return (
      <AppChrome>
        <Loading minDuration={2000} onFinish={() => setIsLoading(false)} />
      </AppChrome>
    );
  }

  return (
    <AppChrome>
      <View nativeID="phone-container" style={styles.phoneContainer}>
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
            >
              <SwipeNavigationContainer
                canGoBack={history.length > 0}
                onGoBack={pop}
                canSwipeLeftTab={isMainScreen && currentMainIndex < mainTabs.length - 1}
                canSwipeRightTab={isMainScreen && currentMainIndex > 0}
                onSwipeNextTab={handleSwipeNextTab}
                onSwipePrevTab={handleSwipePrevTab}
              >
                <ErrorBoundary onGoHome={handleGoHome}>
                {isDiscoverActive && (
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
                )}
                {isActivityActive && (
                  <ActivityScreen
                    tab={activityTab}
                    onChangeTab={setActivityTab}
                    onOpenGroup={handleOpenGroup}
                    onOpenProfile={handleOpenProfile}
                    onOpenNotifications={handleOpenNotifications}
                  />
                )}
                {isCreateActive && (
                  <CreateScreen
                    ref={createRef}
                    onStateChange={setCreateState}
                    onBack={handleBackFromCreate}
                    onCreated={handleGroupCreated}
                  />
                )}
                {isChatListActive && (
                  <ChatListScreen
                    search={chatSearch}
                    onOpenConversation={handleOpenConversation}
                    onOpenNotifications={handleOpenNotifications}
                  />
                )}
                {isOwnProfileActive && (
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
                )}
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
                </ErrorBoundary>
              </SwipeNavigationContainer>
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
            unreadCount={unreadNotificationsCount}
            tab={activityTab}
            onChangeTab={setActivityTab}
            onOpenNotifications={handleOpenNotifications}
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
          <EkipActionBar
            group={screen.group}
            onOpenProfile={handleOpenProfile}
            onOpenChat={handleOpenConversation}
          />
        )}
        </ActiveHeaderTransition>

        {authed && onboarded && (
          <View
            pointerEvents={showBottomNav ? 'box-none' : 'none'}
            style={showBottomNav ? undefined : { display: 'none' }}
          >
            <BottomNav active={tab} onChange={switchTab} />
          </View>
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
            onFinish={() => setIsLoading(false)}
          />
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
  themeCurtain: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
  headerOverlayWrapper: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
  },
});