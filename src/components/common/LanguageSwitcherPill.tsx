import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useI18n, LANGUAGES } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';
import { getIcon } from '../../lib/icons';

export function LanguageSwitcherPill({ style }: { style?: any }) {
  const { language, setLanguage } = useI18n();
  const { colors } = useTheme();
  const Globe = getIcon('Globe');

  const nextLang = language === 'fa' ? 'en' : 'fa';
  const currentLangObj = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[1];
  const nextLangObj = LANGUAGES.find((l) => l.code === nextLang) ?? LANGUAGES[0];

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => setLanguage(nextLang)}
      style={[
        styles.pill,
        {
          backgroundColor: colors.glassThickBg,
          borderColor: colors.glassBorderStrong,
        },
        style,
      ]}
    >
      <Globe size={13} color={colors.textSecondary} style={{ marginRight: 5 }} />
      <Text style={styles.flag}>{currentLangObj.flag}</Text>
      <Text style={[styles.text, { color: colors.textPrimary }]}>
        {currentLangObj.nativeName}
      </Text>
      <Text style={[styles.hint, { color: colors.textTertiary }]}>
        ({nextLangObj.nativeName})
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  flag: {
    fontSize: 14,
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  hint: {
    fontSize: 11,
    fontWeight: '500',
  },
});
