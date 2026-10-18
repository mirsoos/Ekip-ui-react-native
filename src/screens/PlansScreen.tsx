import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GlassCard, GlassButton, GlassBackButton } from '../components/Glass';
import { Toast } from '../components/Overlays';
import { getIcon } from '../lib/icons';

interface PlansScreenProps {
  onBack: () => void;
}

export function PlansScreen({ onBack }: PlansScreenProps) {
  const Crown = getIcon('Crown');
  const Check = getIcon('Check');
  const Sparkles = getIcon('Sparkles');
  const Zap = getIcon('Zap');
  const Shield = getIcon('Shield');

  const [toastMessage, setToastMessage] = useState('');

  const plans = [
    {
      id: 'free',
      name: 'Operative',
      price: '$0',
      period: 'forever',
      description: 'Standard access to community squads and radar discovery',
      current: true,
      perks: [
        'Join up to 5 concurrent squads',
        'Direct messaging with verified members',
        'Standard radar discovery range (15km)',
        'Basic profile customization',
      ],
      color: '#3b82f6',
    },
    {
      id: 'pro',
      name: 'Squad Leader',
      price: '$9.99',
      period: 'month',
      description: 'Advanced capabilities for squad creators and community organizers',
      current: false,
      recommended: true,
      perks: [
        'Unlimited active squad hosting',
        'Priority feed ranking on tactical radar',
        'High-precision live GPS coordinate sharing',
        'Custom glass themes and squad badges',
        'AI Assistant co-pilot with deep scheduling',
      ],
      color: '#ec4899',
    },
    {
      id: 'elite',
      name: 'Tactical Commander',
      price: '$24.99',
      period: 'month',
      description: 'Maximum tier for enterprise leaders, VIPs & large networks',
      current: false,
      perks: [
        'All Squad Leader features',
        'Unlimited global radar sector hopping',
        'Encrypted zero-knowledge squad storage',
        'Exclusive Obsidian Dark UI palette',
        'Dedicated 24/7 concierge support',
      ],
      color: '#f59e0b',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <GlassBackButton onClick={onBack} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.headerTitle}>Subscription Plans</Text>
            <Text style={styles.headerSubtitle}>Upgrade your Ekip tactical privileges</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Hero Badge */}
        <View style={styles.heroBadge}>
          <View style={styles.crownIcon}>
            <Crown size={28} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Level Up Your Privileges</Text>
          <Text style={styles.heroDesc}>
            Join thousands of squad leaders organizing tactical missions worldwide
          </Text>
        </View>

        {/* Plan Cards */}
        {plans.map((p) => (
          <GlassCard
            key={p.id}
            variant={p.recommended ? 'thick' : 'default'}
            style={[
              styles.planCard,
              p.recommended && styles.recommendedCard,
            ]}
          >
            {p.recommended && (
              <View style={styles.recommendedBadge}>
                <Sparkles size={12} color="#fff" />
                <Text style={styles.recommendedText}>MOST POPULAR</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <View>
                <Text style={[styles.planName, { color: p.color }]}>{p.name}</Text>
                <Text style={styles.planDesc}>{p.description}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.planPrice}>{p.price}</Text>
                <Text style={styles.planPeriod}>/{p.period}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.perksList}>
              {p.perks.map((perk, i) => (
                <View key={i} style={styles.perkItem}>
                  <Check size={16} color={p.color} />
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 16 }}>
              {p.current ? (
                <GlassButton variant="secondary" disabled>
                  Current Active Plan
                </GlassButton>
              ) : (
                <GlassButton
                  variant={p.recommended ? 'primary' : 'secondary'}
                  onClick={() => {
                    setToastMessage(`Selected ${p.name} plan checkout`);
                  }}
                >
                  Upgrade to {p.name}
                </GlassButton>
              )}
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      <Toast message={toastMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroBadge: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  crownIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#f59e0b',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  heroDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24,
  },
  planCard: {
    padding: 18,
    borderRadius: 22,
    marginBottom: 16,
  },
  recommendedCard: {
    borderColor: '#ec4899',
    borderWidth: 1.5,
    backgroundColor: 'rgba(236,72,153,0.08)',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ec4899',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 12,
    gap: 4,
  },
  recommendedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.8,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planName: {
    fontSize: 17,
    fontWeight: '700',
  },
  planDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    maxWidth: 200,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  planPeriod: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 14,
  },
  perksList: {
    gap: 10,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  perkText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
  },
});
