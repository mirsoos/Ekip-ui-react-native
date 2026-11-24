import 'react-native-gesture-handler';
import { I18nManager, Platform } from 'react-native';

if (Platform.OS !== 'web') {
  try {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  } catch {}
}

import 'expo-router/entry';
