import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export function CoverPicker({
  options,
  selectedUrl,
  onSelect,
}: {
  options: string[];
  selectedUrl: string;
  onSelect: (url: string) => void;
}) {
  const { colors } = useTheme();
  const { t, isRTL } = useI18n();
  const Check = getIcon('Check');

  return (
    <View style={{ gap: 8 }}>
      <Text style={[styles.label, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
        {t('create.coverImage')}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 4, flexDirection: isRTL ? 'row-reverse' : 'row' }}
      >
        {options.map((url) => {
          const isSelected = selectedUrl === url;
          return (
            <TouchableOpacity
              key={url}
              activeOpacity={0.8}
              onPress={() => onSelect(url)}
              style={[
                styles.coverBox,
                isSelected && { borderColor: '#f472b6', borderWidth: 2 },
              ]}
            >
              <Image source={{ uri: url }} style={styles.image} />
              {isSelected && (
                <View style={styles.checkOverlay}>
                  <View style={styles.checkCircle}>
                    <Check size={12} color="#ffffff" strokeWidth={3} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 2,
  },
  coverBox: {
    width: 90,
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(244, 114, 182, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#f472b6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
