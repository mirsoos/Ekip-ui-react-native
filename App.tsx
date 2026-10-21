import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/lib/theme';
import { AppDataProvider } from './src/lib/appData';
import { BottomNav, type TabKey } from './src/components/BottomNav';
import { ChatHeader } from './src/components/chat/ChatHeader';
import { ChatListHeader } from './src/components/chat/ChatListHeader';
import { ChatInputBar } from './src/components/chat/ChatInputBar';
import { DiscoverHeader } from './src/components/discover/DiscoverHeader';
import { ActivityHeader } from './src/components/activity/ActivityHeader';
import { SettingsHeader } from './src/components/settings/SettingsHeader';
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
import { AIAssistant } from './src/screens/AIAssistant';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PlansScreen } from './src/screens/PlansScreen';
import { PersonalInfoScreen } from './src/screens/PersonalInfoScreen';
import { VerificationScreen } from './src/screens/VerificationScreen';
import { PrivacyScreen } from './src/screens/PrivacyScreen';
import { SecurityScreen } from './src/screens/SecurityScreen';
import { LocationScreen } from './src/screens/LocationScreen';
import { ChatThemeScreen } from './src/screens/ChatThemeScreen';

import { AuroraBackground } from './src/components/AuroraBackground';
import { SwipeNavigationContainer } from './src/components/common/SwipeNavigationContainer';
import { ScreenTransition } from './src/components/common/ScreenTransition';

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

function MainContent() {
  const { isDark } = useTheme();
  const { me, conversations, notifications, addMessage } = useAppData();

  const [authed, setAuthed] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState<TabKey>('discover');
  const [screen, setScreen] = useState<Screen>({ name: 'discover' });
  const [history, setHistory] = useState<Screen[]>([]);
  const [createState, setCreateState] = useState({ step: 0, canProceed: false });
  const [chatSearch, setChatSearch] = useState('');
  const [discoverSearch, setDiscoverSearch] = useState('');
  const [activityTab, setActivityTab] = useState('created');
  const [chatInputText, setChatInputText] = useState('');
  const createRef = React.useRef<CreateScreenHandle>(null);
  const discoverRef = React.useRef<DiscoverScreenHandle>(null);

  const [isNotificationSheetOpen, setIsNotificationSheetOpen] = useState(false);

  const push = (s: Screen) => {
    setHistory((prev) => [...prev, screen]);
    setScreen(s);
  };

  const pop = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const last = next.pop()!;
      setScreen(last);
      return next;
    });
  };

  const switchTab = (t: TabKey) => {
    if (t === 'create' && (tab === 'create' || screen.name === 'create')) {
      setTab('discover');
      setHistory([]);
      setScreen({ name: 'discover' });
      return;
    }
    setTab(t);
    setHistory([]);
    if (t === 'discover') setScreen({ name: 'discover' });
    else if (t === 'activity') setScreen({ name: 'activity' });
    else if (t === 'create') setScreen({ name: 'create' });
    else if (t === 'chat') setScreen({ name: 'chatList' });
    else if (t === 'profile') setScreen({ name: 'profile', userId: 'me' });
  };

  if (!authed) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#04060c' : '#ebf0fa' }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <AuroraBackground />
        <View style={styles.phoneContainer}>
          <View style={styles.screenContainer}>
            <ScreenTransition screenKey="auth">
              <AuthScreen onComplete={() => setAuthed(true)} />
            </ScreenTransition>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!onboarded) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#04060c' : '#ebf0fa' }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <AuroraBackground />
        <View style={styles.phoneContainer}>
          <View style={styles.screenContainer}>
            <ScreenTransition screenKey="onboarding">
              <Onboarding onComplete={() => setOnboarded(true)} />
            </ScreenTransition>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const showBottomNav =
    ['discover', 'activity', 'create', 'chatList'].includes(screen.name) ||
    (screen.name === 'profile' && screen.userId === 'me');

  const mainTabs: TabKey[] = ['discover', 'activity', 'chat', 'profile'];
  const currentMainIndex = mainTabs.indexOf(tab);
  const isMainScreen =
    history.length === 0 &&
    (screen.name === 'discover' ||
      screen.name === 'activity' ||
      screen.name === 'chatList' ||
      (screen.name === 'profile' && screen.userId === 'me'));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#04060c' : '#ebf0fa' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Dynamic Aurora Ambient Lighting */}
      <AuroraBackground />

      <View nativeID="phone-container" style={styles.phoneContainer}>
        <View style={styles.screenContainer}>
          <SwipeNavigationContainer
          canGoBack={history.length > 0}
          onGoBack={pop}
          canSwipeLeftTab={isMainScreen && currentMainIndex < mainTabs.length - 1}
          canSwipeRightTab={isMainScreen && currentMainIndex > 0}
          onSwipeNextTab={() => {
            if (currentMainIndex < mainTabs.length - 1) {
              switchTab(mainTabs[currentMainIndex + 1]);
            }
          }}
          onSwipePrevTab={() => {
            if (currentMainIndex > 0) {
              switchTab(mainTabs[currentMainIndex - 1]);
            }
          }}
        >
          <ScreenTransition screenKey={`${screen.name}-${tab}-${history.length}`}>
            {screen.name === 'discover' && (
              <DiscoverScreen
                ref={discoverRef}
                search={discoverSearch}
                onChangeSearch={setDiscoverSearch}
                onOpenGroup={(g) => push({ name: 'group', group: g })}
                onOpenProfile={(uid) => push({ name: 'profile', userId: uid })}
                onOpenOwnProfile={() => {
                  setTab('profile');
                  setHistory([]);
                  setScreen({ name: 'profile', userId: 'me' });
                }}
                onOpenAI={() => push({ name: 'ai' })}
                onOpenNotifications={() => setIsNotificationSheetOpen(true)}
              />
            )}

            {screen.name === 'group' && (
              <EkipDetail
                group={screen.group}
                onBack={() => {
                  setTab('activity');
                  setHistory([]);
                  setScreen({ name: 'activity' });
                }}
                onOpenProfile={(uid) => {
                  if (uid === 'me') setTab('profile');
                  push({ name: 'profile', userId: uid });
                }}
                onOpenChat={(cid) => {
                  setTab('chat');
                  push({ name: 'conversation', conversationId: cid });
                }}
              />
            )}

            {screen.name === 'create' && (
              <CreateScreen
                ref={createRef}
                onStateChange={setCreateState}
                onBack={() => {
                  if (history.length > 0) pop();
                  else {
                    setTab('discover');
                    setHistory([]);
                    setScreen({ name: 'discover' });
                  }
                }}
                onCreated={(g) => {
                  setHistory([]);
                  setScreen({ name: 'group', group: g });
                  setTab('activity');
                }}
              />
            )}

            {screen.name === 'profile' && (
              <ProfileScreen
                userId={screen.userId}
                isOwnProfile={screen.userId === 'me'}
                onBack={pop}
                onOpenGroup={(g) => push({ name: 'group', group: g })}
                onOpenSettings={() => push({ name: 'settings' })}
                onOpenPersonalInfo={() => push({ name: 'personalInfo' })}
                onOpenVerification={() => push({ name: 'verification' })}
              />
            )}

            {screen.name === 'activity' && (
              <ActivityScreen
                tab={activityTab}
                onChangeTab={setActivityTab}
                onOpenGroup={(g) => push({ name: 'group', group: g })}
                onOpenProfile={(uid) => push({ name: 'profile', userId: uid })}
                onOpenNotifications={() => setIsNotificationSheetOpen(true)}
              />
            )}

            {screen.name === 'chatList' && (
              <ChatListScreen
                search={chatSearch}
                onOpenConversation={(id) => push({ name: 'conversation', conversationId: id })}
                onOpenNotifications={() => setIsNotificationSheetOpen(true)}
              />
            )}

            {screen.name === 'conversation' && (
              <ConversationScreen conversationId={screen.conversationId} onBack={pop} />
            )}

            {screen.name === 'notifications' && (
              <NotificationsScreen
                onBack={pop}
                onOpenConversation={(id) => push({ name: 'conversation', conversationId: id })}
              />
            )}

            {screen.name === 'ai' && <AIAssistant onBack={pop} />}

            {screen.name === 'settings' && (
              <SettingsScreen
                onBack={pop}
                onOpenPlans={() => push({ name: 'plans' })}
                onOpenPersonalInfo={() => push({ name: 'personalInfo' })}
                onOpenVerification={() => push({ name: 'verification' })}
                onOpenPrivacy={() => push({ name: 'privacy' })}
                onOpenSecurity={() => push({ name: 'security' })}
                onOpenNotifications={() => push({ name: 'notifications' })}
                onOpenLocation={() => push({ name: 'location' })}
                onOpenChatTheme={() => push({ name: 'chatTheme' })}
                onSignOut={() => {
                  setAuthed(false);
                  setOnboarded(false);
                  setTab('discover');
                  setScreen({ name: 'discover' });
                }}
              />
            )}

            {screen.name === 'plans' && <PlansScreen onBack={pop} />}

            {screen.name === 'personalInfo' && (
              <PersonalInfoScreen
                onBack={pop}
                onOpenVerification={() => push({ name: 'verification' })}
              />
            )}

            {screen.name === 'verification' && <VerificationScreen onBack={pop} />}

            {screen.name === 'privacy' && <PrivacyScreen onBack={pop} />}

            {screen.name === 'security' && <SecurityScreen onBack={pop} />}

            {screen.name === 'location' && <LocationScreen onBack={pop} />}

            {screen.name === 'chatTheme' && <ChatThemeScreen onBack={pop} />}
          </ScreenTransition>
        </SwipeNavigationContainer>
        </View>

        {screen.name === 'discover' && (
          <DiscoverHeader
            user={me}
            unreadCount={notifications.filter((n) => !n.is_read).length}
            search={discoverSearch}
            onChangeSearch={setDiscoverSearch}
            hasActiveFilters={false}
            onOpenFilters={() => discoverRef.current?.openFilters()}
            onOpenNotifications={() => setIsNotificationSheetOpen(true)}
            onOpenOwnProfile={() => {
              setTab('profile');
              setHistory([]);
              setScreen({ name: 'profile', userId: 'me' });
            }}
          />
        )}

        {screen.name === 'activity' && (
          <ActivityHeader
            unreadCount={notifications.filter((n) => !n.is_read).length}
            tab={activityTab}
            onChangeTab={setActivityTab}
            onOpenNotifications={() => setIsNotificationSheetOpen(true)}
          />
        )}

        {screen.name === 'conversation' && (() => {
          const conv = conversations.find((c) => c.id === screen.conversationId);
          return conv ? (
            <>
              <ChatHeader conversation={conv} onBack={pop} />
              <ChatInputBar
                value={chatInputText}
                onChange={setChatInputText}
                onSend={() => {
                  if (!chatInputText.trim()) return;
                  addMessage(screen.conversationId, chatInputText.trim());
                  setChatInputText('');
                }}
                placeholder="Transmit secure dispatch..."
              />
            </>
          ) : null;
        })()}

        {screen.name === 'settings' && <SettingsHeader onBack={pop} title="Settings" />}
        {screen.name === 'plans' && <SettingsHeader onBack={pop} title="Subscription Plans" />}
        {screen.name === 'personalInfo' && <SettingsHeader onBack={pop} title="Personal Information" />}
        {screen.name === 'verification' && <SettingsHeader onBack={pop} title="Identity Verification" />}
        {screen.name === 'privacy' && <SettingsHeader onBack={pop} title="Privacy & Visibility" />}
        {screen.name === 'security' && <SettingsHeader onBack={pop} title="Security & Access" />}
        {screen.name === 'location' && <SettingsHeader onBack={pop} title="Location & Radar" />}
        {screen.name === 'chatTheme' && <SettingsHeader onBack={pop} title="Chat Theme" />}
        {screen.name === 'notifications' && <SettingsHeader onBack={pop} title="Notifications" />}

        {screen.name === 'group' && (
          <EkipActionBar
            group={screen.group}
            onOpenProfile={(uid) => {
              if (uid === 'me') setTab('profile');
              push({ name: 'profile', userId: uid });
            }}
            onOpenChat={(cid) => {
              setTab('chat');
              push({ name: 'conversation', conversationId: cid });
            }}
          />
        )}

        {screen.name === 'create' && (
          <CreateHeader
            step={createState.step}
            totalSteps={4}
            onBack={() => createRef.current?.handlePrev()}
            onOpenAI={() => createRef.current?.openAI()}
          />
        )}

        {screen.name === 'create' && (
          <CreateContinueButton
            step={createState.step}
            totalSteps={4}
            disabled={!createState.canProceed}
            onPress={() => createRef.current?.handleNext()}
          />
        )}

        {screen.name === 'chatList' && (
          <ChatListHeader
            unreadTotal={conversations.reduce((s, c) => s + c.unread_count, 0)}
            notificationsCount={notifications.filter((n) => !n.is_read).length}
            search={chatSearch}
            onChangeSearch={setChatSearch}
            onOpenNotifications={() => setIsNotificationSheetOpen(true)}
          />
        )}

        {showBottomNav && <BottomNav active={tab} onChange={switchTab} />}

        <NotificationsSheet
          open={isNotificationSheetOpen}
          onClose={() => setIsNotificationSheetOpen(false)}
          onOpenConversation={(id) => push({ name: 'conversation', conversationId: id })}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppDataProvider>
          <MainContent />
        </AppDataProvider>
      </ThemeProvider>
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
});
