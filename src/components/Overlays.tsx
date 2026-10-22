import React, { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Modal,
} from 'react-native';
import { getIcon, type IconName } from '../lib/icons';
import { GlassButton, GlassCloseButton } from './Glass';
import { useTheme } from '../lib/theme';

// ============================================
// GLASS SHEET (Bottom Sheet Modal)
// ============================================
export interface GlassSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  fullHeight?: boolean;
}

export function GlassSheet({
  open,
  onClose,
  children,
  title,
  fullHeight,
}: GlassSheetProps) {
  const { colors, isDark } = useTheme();
  const CloseIcon = getIcon('X');

  const [visible, setVisible] = useState(open);

  // Animated values
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (open) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 340,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 260,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(() => {
        setVisible(false);
      });
    }
  }, [open]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.fullscreenOverlay} pointerEvents="box-none">
        {/* Subtle backdrop with gentle blur and darkness */}
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

        {/* Sheet sliding up from bottom with liquid glass container */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: isDark ? 'rgba(18, 24, 38, 0.78)' : 'rgba(255, 255, 255, 0.78)',
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
          {/* Top drag handle indicator */}
          <View style={styles.sheetHandleBar} />

          {/* Top Specular Arc Highlight */}
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

          {/* Sheet header */}
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
              {title ?? ''}
            </Text>
            <GlassCloseButton onPress={onClose} />
          </View>

          {/* Scrollable content */}
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
}

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

export function GlassDialog({
  open,
  onClose,
  title,
  body,
  children,
  actions,
}: GlassDialogProps) {
  const { colors, isDark } = useTheme();
  const [visible, setVisible] = useState(open);

  const backdropAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (open) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 70,
          friction: 10,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 220,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(() => setVisible(false));
    }
  }, [open]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.dialogOverlay}>
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
}

// ============================================
// TOAST NOTIFICATION
// ============================================
export function Toast({
  message,
  icon = 'CheckCircle2',
  visible,
}: {
  message: string;
  icon?: IconName;
  visible?: boolean;
}) {
  const { colors } = useTheme();
  const IconComp = getIcon(icon);

  const isVisible = visible !== undefined ? visible : Boolean(message);
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
}

const styles = StyleSheet.create({
  fullscreenOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 99999,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.45,
    shadowRadius: 36,
    elevation: 24,
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
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    ...(Platform.OS === 'web'
      ? ({
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        } as any)
      : {}),
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 32,
    elevation: 24,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(32px) saturate(190%)',
          WebkitBackdropFilter: 'blur(32px) saturate(190%)',
        }
      : {}),
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
