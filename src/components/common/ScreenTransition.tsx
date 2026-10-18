import React, { type ReactNode } from 'react';
import { View, Platform, type StyleProp, type ViewStyle } from 'react-native';

interface ScreenTransitionProps {
  children: ReactNode;
  screenKey: string;
  style?: StyleProp<ViewStyle>;
}

export function ScreenTransition({ children, screenKey, style }: ScreenTransitionProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ flex: 1, width: '100%', height: '100%' }, style]}>
        <div
          key={screenKey}
          className="screen-enter-items"
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          {children}
        </div>
      </View>
    );
  }

  return (
    <View style={[{ flex: 1, width: '100%', height: '100%' }, style]}>
      {children}
    </View>
  );
}
