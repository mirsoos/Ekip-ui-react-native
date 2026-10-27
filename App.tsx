import React, { useState } from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme, ThemeContext } from './src/lib/theme';
import { AppDataProvider } from './src/lib/appData';
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
import { useAppData } from './src/lib/appData';
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

function DeferredTabPane({
  active,
  visible,
  children,
}: {
  active: boolean;
  visible: boolean;
  children: React.ReactNode;
}) {
  const themeContext = useTheme();
  const cachedThemeRef = React.useRef(themeContext);

  if (active) {
    cachedThemeRef.current = themeContext;
  }

  const themeValue = active ? themeContext : cachedThemeRef.current;
  const renderedChildrenRef = React.useRef<React.ReactNode>(null);
  if (active || !renderedChildrenRef.current) {
    renderedChildrenRef.current = children;
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: visible ? 1 : 0,
            zIndex: visible ? 1 : 0,
          },
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        {renderedChildrenRef.current}
      </View>
    </ThemeContext.Provider>
  );
}

function DeferredHeaderPane({
  active,
  visible,
  pointerEvents = 'box-none',
  children,
}: {
  active: boolean;
  visible: boolean;
  pointerEvents?: 'box-none' | 'none' | 'auto';
  children: React.ReactNode;
}) {
  const themeContext = useTheme();
  const cachedThemeRef = React.useRef(themeContext);

  if (active) {
    cachedThemeRef.current = themeContext;
  }

  const themeValue = active ? themeContext : cachedThemeRef.current;
  const renderedChildrenRef = React.useRef<React.ReactNode>(null);
  if (active || !renderedChildrenRef.current) {
    renderedChildrenRef.current = children;
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: visible ? 1 : 0,
            zIndex: visible ? 10 : 0,
          },
        ]}
        pointerEvents={visible ? pointerEvents : 'none'}
      >
        {renderedChildrenRef.current}
      </View>
    </ThemeContext.Provider>
  );
}

function MainContent() {
  const { isDark } = useTheme();
  const { t, language } = useI18n();
  const { me, profiles, conversations, notifications, addMessage } = useAppData();

  const [authed, setAuthed] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState<TabKey>('discover');
  const [screen, setScreen] = useState<Screen>({ name: 'discover' });

  // Single-Tree Boot Preload Sequence (Stages 0 -> 6 behind initial loading overlay)
  const [bootStage, setBootStage] = useState(0);
  const [isBootLoading, setIsBootLoading] = useState(true);
  const bootOverlayOpacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
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
  }, [bootOverlayOpacity]);

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

  const [isNotificationSheetOpen, setIsNotificationSheetOpen] = useState(false);

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
    setIsNotificationSheetOpen(true);
  }, []);

  const handleCloseNotifications = React.useCallback(() => {
    setIsNotificationSheetOpen(false);
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
  const isMainScreen =
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

  const isDiscoverActive = isMainScreen && screen.name === 'discover';
  const isActivityActive = isMainScreen && screen.name === 'activity';
  const isCreateActive = isMainScreen && screen.name === 'create';
  const isChatListActive = isMainScreen && screen.name === 'chatList';
  const isOwnProfileActive = isMainScreen && screen.name === 'profile' && (screen.userId === 'me' || !screen.userId);

  const showBottomNav =
    ['discover', 'activity', 'create', 'chatList'].includes(screen.name) ||
    (screen.name === 'profile' && screen.userId === 'me');

  return (
    <SafeAreaView
      edges={Platform.OS === 'web' ? undefined : ['left', 'right']}
      style={[styles.safeArea, { backgroundColor: isDark ? '#04060c' : '#ebf0fa' }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Dynamic Aurora Ambient Lighting */}
      <AuroraBackground />

      <View nativeID="phone-container" style={styles.phoneContainer}>
        {/* Layer 1: Auth Screen (Stage 1) */}
        {bootStage >= 1 && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: !authed ? 1 : 0,
                zIndex: !authed ? 20 : 0,
              },
            ]}
            pointerEvents={!authed ? 'auto' : 'none'}
          >
            <View style={styles.screenContainer}>
              <ScreenTransition screenKey={`auth-${language}`}>
                <AuthScreen onComplete={handleAuthSuccess} />
              </ScreenTransition>
            </View>
          </View>
        )}

        {/* Layer 2: Onboarding (Stage 1) */}
        {bootStage >= 1 && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: authed && !onboarded ? 1 : 0,
                zIndex: authed && !onboarded ? 20 : 0,
              },
            ]}
            pointerEvents={authed && !onboarded ? 'auto' : 'none'}
          >
            <View style={styles.screenContainer}>
              <ScreenTransition screenKey={`onboarding-${language}`}>
                <Onboarding onComplete={handleOnboardingComplete} />
              </ScreenTransition>
            </View>
          </View>
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
                <ScreenTransition screenKey={`${screen.name}-${tab}-${history.length}-${language}`}>
                  {/* Stage 2: Main Tab: Discover */}
                  {bootStage >= 2 && (
                    <DeferredTabPane active={isDiscoverActive} visible={isDiscoverActive}>
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
                    <DeferredTabPane active={isActivityActive} visible={isActivityActive}>
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
                    <DeferredTabPane active={isCreateActive} visible={isCreateActive}>
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
                    <DeferredTabPane active={isChatListActive} visible={isChatListActive}>
                      <ChatListScreen
                        search={chatSearch}
                        onOpenConversation={handleOpenConversation}
                        onOpenNotifications={handleOpenNotifications}
                      />
                    </DeferredTabPane>
                  )}

                  {/* Stage 5: Main Tab: Own Profile */}
                  {bootStage >= 5 && (
                    <DeferredTabPane active={isOwnProfileActive} visible={isOwnProfileActive}>
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
            <DeferredHeaderPane active={isDiscoverActive} visible={isDiscoverActive} pointerEvents="box-none">
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
            <DeferredHeaderPane active={isActivityActive} visible={isActivityActive} pointerEvents="box-none">
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
            <DeferredHeaderPane active={isCreateActive} visible={isCreateActive} pointerEvents="box-none">
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
            </DeferredHeaderPane>
          )}

          {/* Stage 4: Chat List Header */}
          {bootStage >= 4 && (
            <DeferredHeaderPane active={isChatListActive} visible={isChatListActive} pointerEvents="box-none">
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
            <DeferredHeaderPane active={isOwnProfileActive} visible={isOwnProfileActive} pointerEvents="box-none">
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
          {bootStage >= 5 && showBottomNav && <BottomNav active={tab} onChange={switchTab} />}

          {/* Stage 6: Sheets */}
          {bootStage >= 6 && (
            <NotificationsSheet
              open={isNotificationSheetOpen}
              onClose={handleCloseNotifications}
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
    </SafeAreaView>
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
