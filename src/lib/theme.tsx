import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export type Theme = 'light' | 'dark';

export type ChatThemeId = 'default' | 'aurora' | 'emerald' | 'obsidian' | 'nebula' | 'sakura';

export interface ChatThemeConfig {
  id: ChatThemeId;
  name: string;
  description: string;
  myBubbleGradient: [string, string];
  myBubbleText: string;
  theirBubbleBg: string;
  theirBubbleBorder: string;
  theirBubbleText: string;
  previewColors: [string, string, string];
  accentHex: string;
}

export const CHAT_THEMES: Record<ChatThemeId, ChatThemeConfig> = {
  default: {
    id: 'default',
    name: 'Liquid Crystal',
    description: 'Classic iOS liquid glass with signature pink-blue gradient',
    myBubbleGradient: ['#f472b6', '#3b82f6'],
    myBubbleText: '#ffffff',
    theirBubbleBg: 'rgba(255, 255, 255, 0.08)',
    theirBubbleBorder: 'rgba(255, 255, 255, 0.15)',
    theirBubbleText: '#f1f5f9',
    previewColors: ['#f472b6', '#3b82f6', '#10b981'],
    accentHex: '#f472b6',
  },
  aurora: {
    id: 'aurora',
    name: 'Neon Aurora',
    description: 'Vibrant sky blue and glowing neon cyan liquid lights',
    myBubbleGradient: ['#38bdf8', '#a855f7'],
    myBubbleText: '#ffffff',
    theirBubbleBg: 'rgba(56, 189, 248, 0.10)',
    theirBubbleBorder: 'rgba(56, 189, 248, 0.25)',
    theirBubbleText: '#f1f5f9',
    previewColors: ['#38bdf8', '#a855f7', '#06b6d4'],
    accentHex: '#38bdf8',
  },
  emerald: {
    id: 'emerald',
    name: 'Tactical Cyber',
    description: 'Deep emerald, electric mint, and covert matrix glass',
    myBubbleGradient: ['#10b981', '#06b6d4'],
    myBubbleText: '#ffffff',
    theirBubbleBg: 'rgba(16, 185, 129, 0.10)',
    theirBubbleBorder: 'rgba(16, 185, 129, 0.25)',
    theirBubbleText: '#f1f5f9',
    previewColors: ['#10b981', '#06b6d4', '#14b8a6'],
    accentHex: '#10b981',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Stealth Onyx',
    description: 'Ultra dark midnight obsidian with royal sapphire highlights',
    myBubbleGradient: ['#6366f1', '#4f46e5'],
    myBubbleText: '#ffffff',
    theirBubbleBg: 'rgba(15, 23, 42, 0.85)',
    theirBubbleBorder: 'rgba(99, 102, 241, 0.3)',
    theirBubbleText: '#f1f5f9',
    previewColors: ['#6366f1', '#4f46e5', '#3b82f6'],
    accentHex: '#6366f1',
  },
  nebula: {
    id: 'nebula',
    name: 'Cosmic Violet',
    description: 'Galactic deep purple, electric violet, and magenta haze',
    myBubbleGradient: ['#a855f7', '#ec4899'],
    myBubbleText: '#ffffff',
    theirBubbleBg: 'rgba(168, 85, 247, 0.10)',
    theirBubbleBorder: 'rgba(168, 85, 247, 0.25)',
    theirBubbleText: '#f1f5f9',
    previewColors: ['#a855f7', '#ec4899', '#8b5cf6'],
    accentHex: '#a855f7',
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura Glow',
    description: 'Rose quartz, soft coral warmth, and golden hour liquid shimmer',
    myBubbleGradient: ['#fb7185', '#f59e0b'],
    myBubbleText: '#ffffff',
    theirBubbleBg: 'rgba(251, 113, 133, 0.10)',
    theirBubbleBorder: 'rgba(251, 113, 133, 0.25)',
    theirBubbleText: '#f1f5f9',
    previewColors: ['#fb7185', '#f59e0b', '#f43f5e'],
    accentHex: '#fb7185',
  },
};

export interface ThemeColors {
  isDark: boolean;
  bgCanvas: string;
  bgCanvasGrad: [string, string, string];
  glassBg: string;
  glassThickBg: string;
  glassThinBg: string;
  glassBorder: string;
  glassBorderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentPink: string;
  accentBlue: string;
  accentGreen: string;
  danger: string;
  warning: string;
  divider: string;
  cardShadow: string;
}

export const darkColors: ThemeColors = {
  isDark: true,
  bgCanvas: '#04060c',
  bgCanvasGrad: ['#04060c', '#080a14', '#080e1a', '#060a12'],
  glassBg: 'rgba(14, 17, 27, 0.85)',
  glassThickBg: 'rgba(11, 14, 23, 0.94)',
  glassThinBg: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.20)',
  textPrimary: '#ffffff',
  textSecondary: '#a0aec0',
  textTertiary: '#737d8e',
  accent: '#f472b6',
  accentPink: '#f472b6',
  accentBlue: '#60a5fa',
  accentGreen: '#34d399',
  danger: '#f87171',
  warning: '#fbbf24',
  divider: 'rgba(255, 255, 255, 0.10)',
  cardShadow: '#000000',
};

export const lightColors: ThemeColors = {
  isDark: false,
  bgCanvas: '#ebf0fa',
  bgCanvasGrad: ['#ebf0fa', '#dbeafe', '#e0e7ff', '#dbeafe'],
  glassBg: 'rgba(255, 255, 255, 0.65)',
  glassThickBg: 'rgba(255, 255, 255, 0.88)',
  glassThinBg: 'rgba(255, 255, 255, 0.45)',
  glassBorder: 'rgba(255, 255, 255, 0.60)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.90)',
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textTertiary: '#64748b',
  accent: '#f472b6',
  accentPink: '#f472b6',
  accentBlue: '#3b82f6',
  accentGreen: '#10b981',
  danger: '#ef4444',
  warning: '#eab308',
  divider: 'rgba(15, 23, 42, 0.08)',
  cardShadow: 'rgba(15, 23, 42, 0.12)',
};

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  colors: ThemeColors;
  toggle: () => void;
  setTheme: (t: Theme) => void;
  chatTheme: ChatThemeId;
  setChatTheme: (ct: ChatThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme === 'light' ? 'light' : 'dark');
  const [chatTheme, setChatTheme] = useState<ChatThemeId>('default');

  const toggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, toggle, setTheme, chatTheme, setChatTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
