// --- START OF FILE DiscoverFilterSheet.tsx ---

import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassSheet } from '../Overlays';
import { GlassChip, GlassToggle, GlassButton } from '../Glass';
import { TactileSegmented } from '../common/TactileSegmented';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export interface DiscoverFilterSheetProps {
  open: boolean;
  onClose: () => void;
  categoryFilter: 'all' | 'work' | 'entertainment';
  onChangeCategory: (cat: 'all' | 'work' | 'entertainment') => void;
  cityFilter: string;
  onChangeCity: (city: string) => void;
  premiumOnly: boolean;
  onChangePremiumOnly: (val: boolean) => void;
  cities: string[];
  onReset: () => void;
}

export function DiscoverFilterSheetComponent({
  open,
  onClose,
  categoryFilter,
  onChangeCategory,
  cityFilter,
  onChangeCity,
  premiumOnly,
  onChangePremiumOnly,
  cities,
  onReset,
}: DiscoverFilterSheetProps) {
  const { colors } = useTheme();
  const { t, isRTL } = useI18n();

  const categoryOptions = useMemo(
    () =>
      isRTL
        ? [
            { label: t('discover.cat.work'), value: 'work', icon: 'Briefcase' as const },
            { label: t('discover.cat.entertainment'), value: 'entertainment', icon: 'PartyPopper' as const },
            { label: t('discover.cat.all'), value: 'all' },
          ]
        : [
            { label: t('discover.cat.all'), value: 'all' },
            { label: t('discover.cat.entertainment'), value: 'entertainment', icon: 'PartyPopper' as const },
            { label: t('discover.cat.work'), value: 'work', icon: 'Briefcase' as const },
          ],
    [isRTL, t]
  );

  const handleSegmentChange = useCallback(
    (v: string) => {
      onChangeCategory(v as 'all' | 'work' | 'entertainment');
    },
    [onChangeCategory]
  );

  const handleSelectAllCities = useCallback(() => {
    onChangeCity('all');
  }, [onChangeCity]);

  return (
    <GlassSheet open={open} onClose={onClose} title={t('discover.filterTitle')}>
      <View style={{ gap: 18 }}>
        {/* Category selection */}
        <View>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('discover.filterCategory')}
          </Text>
          <TactileSegmented
            options={categoryOptions}
            value={categoryFilter}
            onChange={handleSegmentChange}
          />
        </View>

        {/* City selection */}
        <View>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('discover.filterLocation')}
          </Text>
          <View style={[styles.chipsWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <GlassChip
              active={cityFilter === 'all'}
              onPress={handleSelectAllCities}
            >
              {t('discover.filterAllSectors')}
            </GlassChip>
            {cities.map((c) => (
              <GlassChip
                key={c}
                active={cityFilter === c}
                onPress={() => onChangeCity(c)}
              >
                {c}
              </GlassChip>
            ))}
          </View>
        </View>

        {/* Premium Only Toggle */}
        <View style={styles.toggleRow}>
          <GlassToggle
            checked={premiumOnly}
            onChange={onChangePremiumOnly}
            label={t('discover.filterPremiumOnly')}
          />
        </View>

        {/* Action Buttons */}
        <View style={[styles.actionsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ flex: 1 }}>
            <GlassButton variant="secondary" fullWidth onPress={onReset}>
              {t('discover.filterReset')}
            </GlassButton>
          </View>
          <View style={{ flex: 1 }}>
            <GlassButton variant="primary" fullWidth onPress={onClose}>
              {t('discover.filterApply')}
            </GlassButton>
          </View>
        </View>
      </View>
    </GlassSheet>
  );
}

export const DiscoverFilterSheet = React.memo(DiscoverFilterSheetComponent);

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleRow: {
    paddingVertical: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
});