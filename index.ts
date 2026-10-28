import { registerRootComponent } from 'expo';
import React from 'react';
import { I18nManager, Platform, Text, TextInput } from 'react-native';

if (Platform.OS !== 'web') {
  try {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  } catch (e) {}

  // Global Persian/Arabic font family mapping for Android & iOS native targets
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

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
