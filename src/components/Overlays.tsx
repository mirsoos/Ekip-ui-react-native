// --- START OF FILE Overlays.tsx ---

import React, { type ReactNode, useEffect, useRef, useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  BackHandler,
  Dimensions,
  Animated,
  Easing,
  Modal,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { IconName } from '../lib/icons';
import { GlassButton, GlassCloseButton } from './Glass';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_SHEET_HEIGHT = Math.round(SCREEN_HEIGHT * 0.9);

// ============================================
// GLASS SHEET (Bottom Sheet Modal powered by @gorhom/bottom-sheet)
// ============================================
export interface GlassSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  fullHeight?: boolean;
  contentClassName?: string;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
}

export const GlassSheet = React.memo(function GlassSheet({
  open,
  onClose,
  children,
  title,
  fullHeight,
  headerContent,
  footerContent,
}: GlassSheetProps) {
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();
  const insets = useSafeAreaInsets();

  const modalRef = useRef<BottomSheetModal>(null);
  const isPresentedRef = useRef(false);

  const fullHeightSnapPoints = useMemo(() => ['90%'], []);

  useEffect(() => {
    let timer: any;
    if (open) {
      if (modalRef.current) {
        modalRef.current.present();
        isPresentedRef.current = true;
      } else {
        timer = setTimeout(() => {
          modalRef.current?.present();
          isPresentedRef.current = true;
        }, 0);
      }
    } else if (isPresentedRef.current) {
      modalRef.current?.dismiss();
      isPresentedRef.current = false;
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    const currentModal = modalRef.current;
    return () => {
      if (isPresentedRef.current) {
        currentModal?.dismiss();
      }
    };
  }, []);

  const handleDismiss = useCallback(() => {
    if (isPresentedRef.current) {
      isPresentedRef.current = false;
      onClose();
    }
  }, [onClose]);

  const handleCloseButton = useCallback(() => {
    if (modalRef.current) {
      modalRef.current.dismiss();
    } else {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        opacity={isDark ? 0.72 : 0.45}
      />
    ),
    [isDark]
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={fullHeight ? fullHeightSnapPoints : undefined}
      enableDynamicSizing={!fullHeight}
      maxDynamicContentSize={MAX_SHEET_HEIGHT}
      topInset={insets.top}
      enablePanDownToClose={true}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      style={styles.sheetModalContainer}
      backgroundStyle={[
        styles.sheetBackground,
        {
          backgroundColor: isDark ? 'rgba(18, 24, 38, 0.96)' : 'rgba(255, 255, 255, 0.96)',
          borderColor: colors.glassBorderStrong,
        },
      ]}
      handleIndicatorStyle={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.25)',
        width: 44,
        height: 5,
        borderRadius: 2.5,
      }}
      handleStyle={styles.sheetHandle}
    >
      {fullHeight ? (
        <View style={styles.fullHeightContainer}>
          {/* Header with Title and Close Button */}
          {title !== undefined && (
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
                numberOfLines={1}
              >
                {title}
              </Text>
              <GlassCloseButton onPress={handleCloseButton} />
            </View>
          )}

          {/* Additional Header Content */}
          {headerContent && (
            <View style={styles.sheetHeaderContent}>
              {headerContent}
            </View>
          )}

          {/* Scrollable Children with Native 60/120fps Reanimated Gestures */}
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.sheetScrollContent,
              {
                paddingBottom: footerContent ? 16 : Math.max(insets.bottom + 16, 28),
              },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </BottomSheetScrollView>

          {/* Sticky Bottom Footer Content (e.g. Action Buttons) */}
          {footerContent && (
            <View
              style={[
                styles.sheetFooter,
                {
                  paddingBottom: Math.max(insets.bottom + 8, 20),
                },
              ]}
            >
              {footerContent}
            </View>
          )}
        </View>
      ) : (
        <BottomSheetView
          style={[
            styles.sheetViewContent,
            {
              paddingBottom: Math.max(insets.bottom + 14, 26),
            },
          ]}
        >
          {/* Header with Title and Close Button */}
          {title !== undefined && (
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
                numberOfLines={1}
              >
                {title}
              </Text>
              <GlassCloseButton onPress={handleCloseButton} />
            </View>
          )}

          {/* Additional Header Content */}
          {headerContent && (
            <View style={styles.sheetHeaderContent}>
              {headerContent}
            </View>
          )}

          {/* Responsive Body Content: Sized accurately to the exact required height */}
          <View style={styles.sheetBody}>
            {children}
          </View>

          {/* Footer Content */}
          {footerContent && (
            <View style={styles.sheetFooter}>
              {footerContent}
            </View>
          )}
        </BottomSheetView>
      )}
    </BottomSheetModal>
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
          duration: 380,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
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
// TOAST NOTIFICATION (Legacy wrapper for backward-compatibility)
// ============================================
export const Toast = React.memo(function Toast({
  message,
  visible,
  open,
  onClose,
}: {
  message?: string;
  icon?: IconName;
  visible?: boolean;
  open?: boolean;
  onClose?: () => void;
}) {
  const isVisible = open !== undefined ? open : visible !== undefined ? visible : Boolean(message);
  useEffect(() => {
    if (isVisible && onClose) {
      onClose();
    }
  }, [isVisible, onClose]);
  return null;
});

const styles = StyleSheet.create({
  sheetModalContainer: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    zIndex: 100000,
  },
  sheetBackground: {
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
  },
  sheetHandle: {
    paddingTop: 12,
    paddingBottom: 6,
  },
  fullHeightContainer: {
    flex: 1,
  },
  sheetViewContent: {
    width: '100%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  sheetHeaderContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  sheetBody: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  sheetScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backdropBase: {
    ...StyleSheet.absoluteFill,
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
      : Platform.OS === 'android' ? { elevation: 0 } : { elevation: 32 }),
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
