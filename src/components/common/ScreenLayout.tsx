import React, { type ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { MotionView } from './MotionView';
import { ActiveHeaderTransition } from './ActiveHeaderTransition';

export interface ScreenLayoutProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  includeBottomClearance?: boolean;
  style?: StyleProp<ViewStyle>;
  screenKey?: string;
}

export const ScreenLayout = React.memo(function ScreenLayout({
  header,
  children,
  footer,
  includeBottomClearance = false,
  style,
  screenKey,
}: ScreenLayoutProps) {
  return (
    <View style={[styles.container, style]}>
      <MotionView includeBottomClearance={includeBottomClearance} animationKey={screenKey}>
        {children}
      </MotionView>
      {header && (
        <ActiveHeaderTransition screenKey={screenKey}>
          {header}
        </ActiveHeaderTransition>
      )}
      {footer}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
});
