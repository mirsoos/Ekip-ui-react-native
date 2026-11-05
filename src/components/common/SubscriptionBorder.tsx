// --- START OF FILE SubscriptionBorder.tsx ---

import React from 'react';
import { Platform, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { SubscriptionTier } from '../../types/database';

export const AVATAR_BORDER_SCALE = 1.38;

export const BORDER_PREMIUM_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="greenBlueGradRotated40" x1="0%" y1="0%" x2="50%" y2="100%" gradientTransform="rotate(-40 0.5 0.5)">
      <stop offset="0%" stop-color="#2CD889" />
      <stop offset="55%" stop-color="#19B5A6" />
      <stop offset="100%" stop-color="#056CF2" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="78" fill="none" stroke="url(#greenBlueGradRotated40)" stroke-width="9" />
</svg>`;

export const BORDER_BUSINESS_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="orangePinkGrad" x1="85%" y1="15%" x2="15%" y2="85%">
      <stop offset="0%" stop-color="#FF9432" />
      <stop offset="50%" stop-color="#FF5B37" />
      <stop offset="100%" stop-color="#F71C68" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="78" fill="none" stroke="url(#orangePinkGrad)" stroke-width="9" />
</svg>`;

const BORDER_PREMIUM_WEB = require('../../../assets/borders/Premium.svg');
const BORDER_BUSINESS_WEB = require('../../../assets/borders/bsuiness-premium.svg');

interface SubscriptionBorderProps {
  tier: SubscriptionTier;
  size: number;
}

export const SubscriptionBorder = React.memo(function SubscriptionBorder({
  tier,
  size,
}: SubscriptionBorderProps) {
  if (tier !== 'premium' && tier !== 'business_premium') {
    return null;
  }

  const isBusiness = tier === 'business_premium';

  if (Platform.OS === 'web') {
    return (
      <Image
        source={isBusiness ? BORDER_BUSINESS_WEB : BORDER_PREMIUM_WEB}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }

  return (
    <SvgXml
      xml={isBusiness ? BORDER_BUSINESS_XML : BORDER_PREMIUM_XML}
      width={size}
      height={size}
    />
  );
});
