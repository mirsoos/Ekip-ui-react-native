import React from 'react';
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Icon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { GLASS_THEME_STYLES } from './theme';

export interface GlassInputProps {
  value?: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  icon?: IconName;
  secure?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  style?: StyleProp<ViewStyle>;
}

export function GlassInputComponent({
  value,
  onChangeText,
  placeholder,
  icon,
  secure,
  multiline,
  numberOfLines = 3,
  keyboardType = 'default',
  autoCapitalize,
  onFocus,
  onBlur,
  onSubmitEditing,
  returnKeyType,
  style,
}: GlassInputProps) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const { isRTL } = useI18n();
  const internalInputRef = React.useRef<any>(null);

  const inputStyle = React.useMemo(
    () => [
      styles.inputWrapper,
      themeStyles.input,
      {
        flexDirection: isRTL ? ('row-reverse' as const) : ('row' as const),
        minHeight: multiline ? numberOfLines * 24 + 20 : 48,
      },
      style,
    ],
    [isRTL, multiline, numberOfLines, style, themeStyles.input]
  );
  const inputTextStyle = React.useMemo(
    () => [
      styles.inputText,
      {
        color: colors.textPrimary,
        textAlign: isRTL ? ('right' as const) : ('left' as const),
        writingDirection: isRTL ? ('rtl' as const) : ('ltr' as const),
        textAlignVertical: multiline ? ('top' as const) : ('center' as const),
      },
    ],
    [colors.textPrimary, isRTL, multiline]
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => internalInputRef.current?.focus()}
      style={inputStyle}
    >
      {icon && (
        <Icon
          name={icon}
          size={18}
          color={colors.textTertiary}
          style={{
            marginRight: isRTL ? 0 : 10,
            marginLeft: isRTL ? 10 : 0,
            alignSelf: multiline ? 'flex-start' : 'center',
            marginTop: multiline ? 8 : 0,
          }}
        />
      )}
      <TextInput
        ref={internalInputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        secureTextEntry={secure}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        style={inputTextStyle}
      />
    </TouchableOpacity>
  );
}

export const GlassInput = React.memo(GlassInputComponent);

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
  },
});
