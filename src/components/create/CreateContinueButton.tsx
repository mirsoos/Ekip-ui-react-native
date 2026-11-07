import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FrostedGlass } from '../FrostedGlass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export function CreateContinueButtonComponent({
  step,
  totalSteps,
  disabled,
  onPress,
}: {
  step: number;
  totalSteps: number;
  disabled: boolean;
  onPress: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const isFinal = step === totalSteps - 1;
  const IconComp = getIcon(isFinal ? 'Check' : isRTL ? 'ArrowLeft' : 'ArrowRight');

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      setKeyboardHeight(e?.endCoordinates?.height ?? 0);
    };
    const onHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const defaultBottomOffset = Platform.OS === 'web' ? 88 : 88 + Math.max(0, insets.bottom);
  const bottomOffset =
    Platform.OS === 'ios' && keyboardHeight > 0
      ? keyboardHeight + 12
      : defaultBottomOffset;

  return (
    <View
      style={[
        styles.outerContainer,
        {
          bottom: bottomOffset,
          alignItems: isRTL ? 'flex-start' : 'flex-end',
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.continueButton,
          {
            borderColor: colors.glassBorderStrong,
            opacity: disabled ? 0.45 : 1,
          },
        ]}
      >
        {/* 360° Frosted Glass */}
        <FrostedGlass
          borderRadius={24}
          marginWidth={12}
          scale={28}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        <View style={[styles.buttonContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.continueText, { color: colors.textPrimary }]}>
            {isFinal ? t('create.deployOperation') : t('create.continue')}
          </Text>
          <IconComp
            size={18}
            color={colors.textPrimary}
            strokeWidth={2.4}
            style={{ marginHorizontal: 8 }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export const CreateContinueButton = React.memo(CreateContinueButtonComponent);

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 900,
  },
  continueButton: {
    position: 'relative',
    height: 46,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
    paddingHorizontal: 28,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10,
        }),
    overflow: 'visible',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  continueText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
