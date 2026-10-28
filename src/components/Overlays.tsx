// --- START OF FILE Overlays.tsx ---

import React, { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  BackHandler,
  Dimensions,
  Easing,
  Modal,
} from 'react-native';
import { getIcon, type IconName } from '../lib/icons';
import { GlassButton, GlassCloseButton } from './Glass';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DISMISS_DISTANCE = Math.max(SCREEN_HEIGHT, 900);

// ============================================
// GLASS SHEET (Bottom Sheet Modal - Pre-cached & 60FPS)
// ============================================
export interface GlassSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  fullHeight?: boolean;
}

export const GlassSheet = React.memo(function GlassSheet({
  open,
  onClose,
  children,
  title,
  fullHeight,
}: GlassSheetProps) {
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();

  const [modalVisible, setModalVisible] = useState(open);

  const backdropAnim = useRef(new Animated.Value(open ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(open ? 0 : DISMISS_DISTANCE)).current;

  useEffect(() => {
    if (!open) return;
    const backAction = () => {
      onClose();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 240,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: DISMISS_DISTANCE,
          duration: 200,
          easing: Easing.bezier(0.32, 0, 0.67, 0),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setModalVisible(false);
      });
    }
  }, [open]);

  if (!open && !modalVisible) return null;

  return (
    <Modal
      transparent={true}
      visible={open || modalVisible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View
        style={[
          styles.fullscreenOverlay,
          {
            zIndex: 999999,
          },
        ]}
        pointerEvents="box-none"
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.backdropBase,
              {
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.22)',
                opacity: backdropAnim,
                ...(Platform.OS === 'web'
                  ? ({
                      backdropFilter: 'blur(2px)',
                      WebkitBackdropFilter: 'blur(2px)',
                    } as any)
                  : {}),
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          renderToHardwareTextureAndroid={true}
          style={[
            styles.sheetContainer,
            {
              backgroundColor: isDark ? 'rgba(18, 24, 38, 0.94)' : 'rgba(255, 255, 255, 0.94)',
              borderColor: colors.glassBorderStrong,
              height: fullHeight ? '88%' : undefined,
              maxHeight: '92%',
              transform: [{ translateY: slideAnim }],
              ...(Platform.OS === 'web'
                ? ({
                    backdropFilter: 'blur(32px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                  } as any)
                : {}),
            },
          ]}
        >
          <View style={styles.sheetHandleBar} />

          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: '12%',
              right: '12%',
              height: 1.5,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.95)',
              borderRadius: 9999,
            }}
          />

          <View
            style={[
              styles.sheetHeader,
              { flexDirection: isRTL ? 'row-reverse' : 'row' },
            ]}
          >
            <Text
              style={[
                styles.sheetTitle,
                {
                  color: colors.textPrimary,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {title ?? ''}
            </Text>
            <GlassCloseButton onPress={onClose} />
          </View>

          {/* Keep children mounted in RAM so opening/closing has ZERO mount/unmount spike! */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 36, paddingTop: 10 }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
});

// ============================================
// GLASS DIALOG (Centered Alert Modal)
// ============================================
export interface GlassDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  body?: string;
  children?: ReactNode;
  actions?: {
    label: string;
    variant?: 'primary' | 'secondary' | 'danger';
    onPress?: () => void;
    onClick?: () => void;
  }[];
}

export const GlassDialog = React.memo(function GlassDialog({
  open,
  onClose,
  title,
  body,
  children,
  actions,
}: GlassDialogProps) {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(open);

  const backdropAnim = useRef(new Animated.Value(open ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(open ? 1 : 0.85)).current;

  useEffect(() => {
    if (!open) return;
    const backAction = () => {
      onClose();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setModalVisible(true);
      scaleAnim.setValue(0.85);
      backdropAnim.setValue(0);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 220,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 160,
          easing: Easing.bezier(0.32, 0, 0.67, 0),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setModalVisible(false);
      });
    }
  }, [open]);

  if (!open && !modalVisible) return null;

  return (
    <Modal
      transparent={true}
      visible={open || modalVisible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View
        style={[
          styles.dialogOverlay,
          {
            zIndex: 999999,
          },
        ]}
        pointerEvents="box-none"
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.backdropBase,
              {
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.72)' : 'rgba(0, 0, 0, 0.45)',
                opacity: backdropAnim,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          renderToHardwareTextureAndroid={true}
          style={[
            styles.dialogContainer,
            {
              backgroundColor: colors.glassThickBg,
              borderColor: colors.glassBorderStrong,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={[styles.dialogTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {body && (
            <Text style={[styles.dialogBody, { color: colors.textSecondary }]}>
              {body}
            </Text>
          )}
          {children}
          {actions && (
            <View style={{ marginTop: 20, gap: 10 }}>
              {actions.map((act, idx) => (
                <GlassButton
                  key={idx}
                  variant={act.variant ?? 'secondary'}
                  fullWidth
                  onPress={act.onPress ?? act.onClick}
                >
                  {act.label}
                </GlassButton>
              ))}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
});

// ============================================
// TOAST NOTIFICATION
// ============================================
export const Toast = React.memo(function Toast({
  message,
  icon = 'CheckCircle2',
  visible,
  open,
  onClose,
}: {
  message: string;
  icon?: IconName;
  visible?: boolean;
  open?: boolean;
  onClose?: () => void;
}) {
  const { colors } = useTheme();
  const IconComp = getIcon(icon);

  const isVisible = open !== undefined ? open : visible !== undefined ? visible : Boolean(message);

  useEffect(() => {
    if (isVisible && onClose) {
      const timer = setTimeout(() => onClose(), 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || !message) return null;

  return (
    <View style={styles.toastContainer} pointerEvents="none">
      <View
        style={[
          styles.toastBox,
          {
            backgroundColor: colors.glassThickBg,
            borderColor: colors.glassBorderStrong,
          },
        ]}
      >
        <IconComp size={18} color="#22c55e" strokeWidth={2.4} style={{ marginRight: 8 }} />
        <Text style={[styles.toastText, { color: colors.textPrimary }]}>
          {message}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  fullscreenOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  backdropBase: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: 'hidden',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -12 },
          shadowOpacity: 0.45,
          shadowRadius: 36,
        }
      : { elevation: 32 }),
    zIndex: 100000,
  },
  sheetHandleBar: {
    width: 42,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  dialogOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.45,
          shadowRadius: 32,
        }
      : { elevation: 32 }),
    zIndex: 100000,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  dialogBody: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10000,
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        }
      : { elevation: 0 }),
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
  },
});