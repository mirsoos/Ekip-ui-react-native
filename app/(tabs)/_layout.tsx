import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform, Keyboard } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { BottomNav, type TabKey } from '../../src/components/BottomNav';
import { ActiveBottomNavTransition } from '../../src/components/common/ActiveBottomNavTransition';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
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

  const activeTab: TabKey = pathname.includes('/activity')
    ? 'activity'
    : pathname.includes('/create')
    ? 'create'
    : pathname.includes('/chat')
    ? 'chat'
    : pathname.includes('/profile')
    ? 'profile'
    : 'discover';

  const handleTabChange = useCallback(
    (tab: TabKey) => {
      if (activeTab === tab) return;
      router.navigate(`/(tabs)/${tab}`);
    },
    [activeTab, router]
  );

  return (
    <View style={styles.container}>
      <Tabs
        tabBar={() => null}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="discover" />
        <Tabs.Screen name="activity" />
        <Tabs.Screen name="create" />
        <Tabs.Screen name="chat" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <ActiveBottomNavTransition show={!isKeyboardVisible}>
        <BottomNav active={activeTab} onChange={handleTabChange} />
      </ActiveBottomNavTransition>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
