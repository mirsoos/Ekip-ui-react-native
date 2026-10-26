import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { GlassSheet, Toast } from '../Overlays';
import { GlassCard } from '../Glass';
import { useI18n, LANGUAGES } from '../../lib/i18n';
import { useTheme } from '../../lib/theme';
import { getIcon } from '../../lib/icons';

export function LanguageSwitcherPillComponent({ style }: { style?: any }) {
  const { language, setLanguage, t, isRTL } = useI18n();
  const { colors } = useTheme();
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const Globe = getIcon('Globe');
  const Check = getIcon('Check');
  const ChevronDown = getIcon('ChevronDown');

  const currentLangObj = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[1];

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setShowLanguageSheet(true)}
        style={[
          styles.pill,
          {
            backgroundColor: colors.glassThickBg,
            borderColor: colors.glassBorderStrong,
          },
          style,
        ]}
      >
        <Globe size={13} color={colors.textSecondary} style={{ marginHorizontal: 3 }} />
        <Text style={styles.flag}>{currentLangObj.flag}</Text>
        <Text style={[styles.text, { color: colors.textPrimary }]}>
          {currentLangObj.nativeName}
        </Text>
        <ChevronDown size={12} color={colors.textTertiary} style={{ marginHorizontal: 2 }} />
      </TouchableOpacity>

      {/* Language Selection Bottom Sheet — Identical to Settings */}
      <GlassSheet
        open={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
        title={t('settings.selectLanguage')}
      >
        <View style={{ gap: 10, paddingVertical: 8 }}>
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.8}
                onPress={() => {
                  setLanguage(lang.code);
                  setShowLanguageSheet(false);
                  setToastMessage(t('settings.langChanged', { lang: lang.nativeName }));
                  setTimeout(() => setToastMessage(''), 2200);
                }}
              >
                <GlassCard
                  variant={isSelected ? 'thick' : 'thin'}
                  style={[
                    styles.langOptionCard,
                    isSelected && {
                      borderColor: '#f472b6',
                      borderWidth: 1.5,
                      backgroundColor: 'rgba(244, 114, 182, 0.12)',
                    },
                  ]}
                >
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 24 }}>{lang.flag}</Text>
                    <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                      <Text style={[styles.langOptionTitle, { color: colors.textPrimary }]}>
                        {lang.nativeName}
                      </Text>
                      <Text style={[styles.langOptionSub, { color: colors.textTertiary }]}>
                        {lang.name}
                      </Text>
                    </View>
                  </View>

                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <Check size={16} color="#ffffff" strokeWidth={3} />
                    </View>
                  )}
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </GlassSheet>

      <Toast
        visible={Boolean(toastMessage)}
        message={toastMessage}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }),
  },
  flag: {
    fontSize: 14,
    marginHorizontal: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    marginHorizontal: 3,
  },
  langOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
  },
  langOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  langOptionSub: {
    fontSize: 12,
    marginTop: 2,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f472b6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const LanguageSwitcherPill = React.memo(LanguageSwitcherPillComponent);
