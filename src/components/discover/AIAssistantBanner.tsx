import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export function AIAssistantBanner({
  onPress,
  style,
}: {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const SparklesIcon = getIcon('Sparkles');
  const ChevronRight = getIcon('ChevronRight');

  return (
    <View style={[{ paddingHorizontal: 16, marginTop: 12 }, style]}>
      <GlassCard glow onPress={onPress} style={styles.card}>
        <LinearGradient
          colors={['rgba(244, 114, 182, 0.35)', 'rgba(59, 130, 246, 0.35)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconBox}
        >
          <SparklesIcon size={22} color="#f472b6" strokeWidth={2.4} />
        </LinearGradient>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {t('discover.askAI')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('discover.askAISub')}
          </Text>
        </View>

        <ChevronRight size={18} color={colors.textTertiary} />
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 22,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
});
