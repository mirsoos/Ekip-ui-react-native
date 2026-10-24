import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppData } from '../lib/appData';
import { EkipCard } from '../components/EkipCard';
import { GlassEmpty, GlassButton, GlassSegmented } from '../components/Glass';
import { DiscoverHeader } from '../components/discover/DiscoverHeader';
import { AIAssistantBanner } from '../components/discover/AIAssistantBanner';
import { CommunityMembersRow } from '../components/discover/CommunityMembersRow';
import { DiscoverFilterSheet } from '../components/discover/DiscoverFilterSheet';
import { EkipCardSkeleton, CommunityMembersRowSkeleton } from '../components/skeleton';
import { cities } from '../lib/demoData';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import type { Group } from '../types/database';

export interface DiscoverScreenHandle {
  openFilters: () => void;
}

export const DiscoverScreen = React.forwardRef<
  DiscoverScreenHandle,
  {
    search?: string;
    onChangeSearch?: (val: string) => void;
    onOpenGroup: (group: Group) => void;
    onOpenProfile: (userId: string) => void;
    onOpenOwnProfile: () => void;
    onOpenAI: () => void;
    onOpenNotifications: () => void;
    isLoading?: boolean;
  }
>(function DiscoverScreen(
  {
    search = '',
    onChangeSearch,
    onOpenGroup,
    onOpenProfile,
    onOpenOwnProfile,
    onOpenAI,
    onOpenNotifications,
    isLoading = false,
  },
  ref
) {
  const { groups, me, profiles, notifications } = useAppData();
  const { colors } = useTheme();
  const { t, isRTL } = useI18n();

  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'work' | 'entertainment'>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [premiumOnly, setPremiumOnly] = useState(false);

  React.useImperativeHandle(ref, () => ({
    openFilters: () => setShowFilters(true),
  }));

  const filtered = useMemo(() => {
    let result = [...groups];
    if (categoryFilter !== 'all') result = result.filter((g) => g.category === categoryFilter);
    if (cityFilter !== 'all') result = result.filter((g) => g.city === cityFilter);
    if (premiumOnly) result = result.filter((g) => g.premium_only);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.tags?.some((t) => t.toLowerCase().includes(q)) ||
          g.city.toLowerCase().includes(q)
      );
    }
    return result;
  }, [groups, search, categoryFilter, cityFilter, premiumOnly]);

  const featured = filtered[0];
  const remaining = filtered.slice(1);
  const otherProfiles = profiles.filter((p) => p.id !== 'me').slice(0, 6);

  const hasActiveFilters = categoryFilter !== 'all' || cityFilter !== 'all' || premiumOnly;

  const handleResetFilters = () => {
    setCategoryFilter('all');
    setCityFilter('all');
    setPremiumOnly(false);
    onChangeSearch?.('');
    setShowFilters(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AI Assistant Banner */}
        <AIAssistantBanner onPress={onOpenAI} />

        {/* Featured Squad */}
        {isLoading ? (
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Featured Operation
              </Text>
            </View>
            <EkipCardSkeleton variant="featured" />
          </View>
        ) : featured ? (
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Featured Operation
              </Text>
              <Text style={[styles.sectionBadge, { color: '#f472b6' }]}>
                PRIORITY
              </Text>
            </View>
            <EkipCard
              group={featured}
              variant="featured"
              onPress={() => onOpenGroup(featured)}
            />
          </View>
        ) : null}

        {/* Active Operatives Row */}
        {isLoading ? (
          <CommunityMembersRowSkeleton />
        ) : (
          <CommunityMembersRow
            profiles={otherProfiles}
            onOpenProfile={onOpenProfile}
          />
        )}

        {/* Category Filter Pills */}
        <View style={styles.categoryWrap}>
          <GlassSegmented
            options={[
              { label: t('discover.cat.all'), value: 'all' },
              { label: t('discover.cat.entertainment'), value: 'entertainment', icon: 'PartyPopper' },
              { label: t('discover.cat.work'), value: 'work', icon: 'Briefcase' },
            ]}
            value={categoryFilter}
            onChange={(v) => setCategoryFilter(v as any)}
          />
        </View>

        {/* Operational Feed */}
        <View key={categoryFilter} className="animate-raise" style={styles.sectionWrap}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
                marginBottom: 12,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
          >
            {t('discover.allSquads')} {isLoading ? '' : `(${filtered.length})`}
          </Text>

          {isLoading ? (
            <>
              <EkipCardSkeleton />
              <EkipCardSkeleton />
            </>
          ) : filtered.length === 0 ? (
            <GlassEmpty
              icon="Search"
              title="No missions found"
              subtitle="Try broadening your sector or clearance search parameters."
              action={
                hasActiveFilters ? (
                  <GlassButton variant="secondary" onPress={handleResetFilters}>
                    Reset Filters
                  </GlassButton>
                ) : undefined
              }
            />
          ) : (
            remaining.map((g) => (
              <EkipCard
                key={g.id}
                group={g}
                onPress={() => onOpenGroup(g)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <DiscoverFilterSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        categoryFilter={categoryFilter}
        onChangeCategory={setCategoryFilter}
        cityFilter={cityFilter}
        onChangeCity={setCityFilter}
        premiumOnly={premiumOnly}
        onChangePremiumOnly={setPremiumOnly}
        cities={cities}
        onReset={handleResetFilters}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 145,
    paddingBottom: 110,
  },
  sectionWrap: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  categoryWrap: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
});
