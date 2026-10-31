import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../lib/appData';
import { EkipCard } from '../components/EkipCard';
import { GlassEmpty, GlassButton, GlassSegmented } from '../components/Glass';
import { AIAssistantBanner } from '../components/discover/AIAssistantBanner';
import { CommunityMembersRow } from '../components/discover/CommunityMembersRow';
import { DiscoverFilterSheet } from '../components/discover/DiscoverFilterSheet';
import { EkipCardSkeleton, CommunityMembersRowSkeleton } from '../components/skeleton';
import { cities } from '../lib/demoData';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { getMultiRowContentPaddingTop } from '../lib/headerLayout';
import type { Group } from '../types/database';

export interface DiscoverScreenHandle {
  openFilters: () => void;
}

export const DiscoverScreen = React.memo(
  React.forwardRef<
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
      onOpenAI,
      isLoading = false,
    },
    ref
  ) {
  const { groups, profiles } = useAppData();
  const insets = useSafeAreaInsets();
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
  const remaining = useMemo(() => filtered.slice(1), [filtered]);
  const otherProfiles = useMemo(
    () => profiles.filter((p) => p.id !== 'me').slice(0, 6),
    [profiles]
  );

  const hasActiveFilters = categoryFilter !== 'all' || cityFilter !== 'all' || premiumOnly;

  const handleResetFilters = React.useCallback(() => {
    setCategoryFilter('all');
    setCityFilter('all');
    setPremiumOnly(false);
    onChangeSearch?.('');
    setShowFilters(false);
  }, [onChangeSearch]);

  const handleCategoryChange = React.useCallback((value: string) => {
    if (value === 'all' || value === 'work' || value === 'entertainment') {
      setCategoryFilter(value);
    }
  }, []);

  const renderGroup = React.useCallback(
    ({ item }: { item: Group }) => (
      <EkipCard group={item} onPress={() => onOpenGroup(item)} />
    ),
    [onOpenGroup]
  );

  const listHeader = useMemo(
    () => (
      <View>
        <AIAssistantBanner onPress={onOpenAI} />

        {isLoading ? (
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  {t('ekip.featured')}
                </Text>
              </View>
              <EkipCardSkeleton variant="featured" />
            </View>
          ) : featured ? (
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  {t('ekip.featured')}
                </Text>
                <Text style={[styles.sectionBadge, { color: '#f472b6' }]}>
                  {t('ekip.priority')}
                </Text>
              </View>
              <EkipCard
                group={featured}
                variant="featured"
                onPress={() => onOpenGroup(featured)}
              />
            </View>
          ) : null}

        {isLoading ? (
            <CommunityMembersRowSkeleton />
          ) : (
            <CommunityMembersRow
              profiles={otherProfiles}
              onOpenProfile={onOpenProfile}
            />
          )}

        <View style={styles.categoryWrap}>
          <GlassSegmented
            options={[
              { label: t('discover.cat.all'), value: 'all' },
              { label: t('discover.cat.entertainment'), value: 'entertainment', icon: 'PartyPopper' },
              { label: t('discover.cat.work'), value: 'work', icon: 'Briefcase' },
            ]}
            value={categoryFilter}
            onChange={handleCategoryChange}
          />
        </View>

        <View style={styles.sectionWrap}>
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
        </View>
      </View>
    ),
    [
      categoryFilter,
      colors.textPrimary,
      featured,
      filtered.length,
      handleCategoryChange,
      isLoading,
      isRTL,
      onOpenAI,
      onOpenGroup,
      onOpenProfile,
      otherProfiles,
      t,
    ]
  );

  const listEmptyComponent = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.sectionWrap}>
          <EkipCardSkeleton />
          <EkipCardSkeleton />
        </View>
      );
    }

    if (filtered.length === 0) {
      return (
        <View style={styles.sectionWrap}>
          <GlassEmpty
            icon="Search"
            title={t('discover.emptyTitle')}
            subtitle={t('discover.emptyDesc')}
            action={
              hasActiveFilters ? (
                <GlassButton variant="secondary" onPress={handleResetFilters}>
                  {t('discover.filterReset')}
                </GlassButton>
              ) : undefined
            }
          />
        </View>
      );
    }

    return undefined;
  }, [filtered.length, handleResetFilters, hasActiveFilters, isLoading, t]);

  return (
    <View style={styles.container}>
      <FlatList<Group>
        data={isLoading ? [] : remaining}
        renderItem={renderGroup}
        keyExtractor={(group) => group.id}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        updateCellsBatchingPeriod={50}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: getMultiRowContentPaddingTop(insets.top, 115),
            paddingBottom: 90 + insets.bottom,
          },
        ]}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmptyComponent}
      />

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
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 156,
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
