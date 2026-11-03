// --- START OF FILE ToastContext.tsx ---

import React, { createContext, useContext, useState, useRef, useCallback, type ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getIcon, type IconName } from './icons';
import { useTheme } from './theme';
import { useI18n } from './i18n';
import { FrostedGlass } from '../components/FrostedGlass';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  icon?: IconName;
}

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
  icon?: IconName;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions | ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

const DEFAULT_ICONS: Record<ToastType, IconName> = {
  success: 'Check',
  error: 'AlertCircle',
  warning: 'AlertCircle',
  info: 'Info',
};

const TYPE_COLORS: Record<ToastType, string> = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [currentToast, setCurrentToast] = useState<ToastState | null>(null);
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();

  const anim = useRef(new Animated.Value(0)).current;
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef(0);

  const hideToast = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    Animated.timing(anim, {
      toValue: 0,
      duration: 220,
      easing: Easing.bezier(0.36, 0, 0.66, -0.56),
      useNativeDriver: Platform.OS !== 'web',
    }).start(({ finished }) => {
      if (finished) {
        setCurrentToast(null);
      }
    });
  }, [anim]);

  const showToast = useCallback(
    (message: string, options?: ToastOptions | ToastType) => {
      if (!message) return;

      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }

      const opts: ToastOptions =
        typeof options === 'string' ? { type: options } : options || {};
      const type: ToastType = opts.type || 'success';
      const duration = opts.duration ?? 2600;
      const icon = opts.icon;

      toastIdRef.current += 1;
      const newId = toastIdRef.current;

      setCurrentToast({
        id: newId,
        message,
        type,
        icon,
      });

      anim.stopAnimation();
      anim.setValue(0);

      Animated.spring(anim, {
        toValue: 1,
        tension: 90,
        friction: 9,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      dismissTimerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [anim, hideToast]
  );

  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24) + 12;

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const activeIcon = currentToast
    ? currentToast.icon || DEFAULT_ICONS[currentToast.type]
    : 'Check';
  const IconComp = getIcon(activeIcon);
  const accentColor = currentToast ? TYPE_COLORS[currentToast.type] : '#10b981';

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {/* Global Root Floating Toast Host */}
      {currentToast && (
        <View
          pointerEvents="box-none"
          style={styles.rootContainer}
        >
          <Animated.View
            style={[
              styles.toastPillWrap,
              {
                opacity,
                transform: [{ translateY }, { scale }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={hideToast}
              style={[
                styles.toastPill,
                {
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.16)'
                    : 'rgba(0, 0, 0, 0.08)',
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                },
              ]}
            >
              <FrostedGlass
                borderRadius={24}
                marginWidth={12}
                scale={24}
                blurDeviation={2.2}
                overlayOpacity={isDark ? 0.18 : 0.45}
                style={StyleSheet.absoluteFill}
              />

              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                ]}
              >
                <IconComp size={16} color={accentColor} strokeWidth={2.4} />
              </View>

              <Text
                numberOfLines={2}
                style={[
                  styles.messageText,
                  {
                    color: colors.textPrimary,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {currentToast.message}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 999999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    ...(Platform.OS === 'web'
      ? {
          position: 'fixed' as any,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }
      : {}),
  },
  toastPillWrap: {
    maxWidth: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastPill: {
    minHeight: 50,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 26,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 24,
        }
      : Platform.OS === 'android'
      ? { elevation: 16 }
      : {
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
        }),
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
});
