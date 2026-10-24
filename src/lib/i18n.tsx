import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { I18nManager, Platform } from 'react-native';

export type Language = 'en' | 'fa';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English (US)', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
];

export const translations = {
  en: {
    // Navigation
    'nav.discover': 'Discover',
    'nav.activity': 'Activity',
    'nav.create': 'Create',
    'nav.chat': 'Comms',
    'nav.profile': 'Profile',

    // Common
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.seeAll': 'See All',
    'common.apply': 'Apply',
    'common.tryAgain': 'Try Again',
    'common.goToDiscover': 'Go to Discover',
    'common.loading': 'Loading...',
    'common.done': 'Done',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.share': 'Share',
    'common.join': 'Join Squad',
    'common.leave': 'Leave Squad',
    'common.requestJoin': 'Request Clearance',
    'common.members': 'Members',
    'common.active': 'Active',
    'common.verified': 'Verified',

    // Discover Screen
    'discover.title': 'Sector Radar',
    'discover.subtitle': 'Discover tactical squads in your sector',
    'discover.searchPlaceholder': 'Search squads, tags, cities...',
    'discover.activeMembers': 'Active Operators',
    'discover.featuredSquads': 'Featured Squads',
    'discover.allSquads': 'All Squads',
    'discover.membersCount': '{count} members',
    'discover.capacity': '{current}/{max} Capacity',
    'discover.cat.all': 'All',
    'discover.cat.work': 'Tactical & Work',
    'discover.cat.entertainment': 'Entertainment',
    'discover.cat.tech': 'Tech & Code',
    'discover.cat.sports': 'Sports & Fitness',
    'discover.cat.art': 'Art & Creative',

    // Comms / Chat Screen
    'chat.title': 'Comms Relay',
    'chat.searchPlaceholder': 'Search transmissions...',
    'chat.emptyTitle': 'No Transmissions Yet',
    'chat.emptyDesc': 'Join a squad or start an encrypted transmission',
    'chat.typeMessage': 'Transmit message...',
    'chat.online': 'Online',
    'chat.offline': 'Offline',
    'chat.membersCount': '{count} operators in channel',

    // Activity Screen
    'activity.title': 'Mission Activity',
    'activity.feed': 'Live Radar Feed',
    'activity.requests': 'Clearance Requests',
    'activity.approvals': 'Approved Deployments',

    // Create Screen
    'create.title': 'Deploy New Ekip',
    'create.squadName': 'Squad Name',
    'create.description': 'Mission Brief / Description',
    'create.category': 'Category',
    'create.city': 'City / Sector',
    'create.capacity': 'Max Capacity',
    'create.privacy': 'Access Level',
    'create.public': 'Public (Open Access)',
    'create.private': 'Private (Clearance Required)',
    'create.submit': 'Launch Ekip',

    // Profile Screen
    'profile.title': 'Operator Dossier',
    'profile.editProfile': 'Edit Dossier',
    'profile.squads': 'Assigned Squads',
    'profile.badges': 'Tactical Medals',
    'profile.stats': 'Operational Stats',
    'profile.missions': 'Missions',
    'profile.reputation': 'Reputation',
    'profile.clearance': 'Clearance Level',

    // Settings Screen
    'settings.title': 'System Settings',
    'settings.account': 'Clearance & Identity',
    'settings.personalInfo': 'Personal Information',
    'settings.personalInfoSub': 'Callsign, bio, sector dossier',
    'settings.verification': 'Clearance Verification',
    'settings.verificationSub': 'Biometric & identity status',
    'settings.privacy': 'Privacy & Stealth',
    'settings.privacySub': 'Stealth mode, ghost radar, read receipts',
    'settings.notifications': 'Notification Signals',
    'settings.notificationsSub': 'Mission alerts, comms mentions, sound',
    'settings.location': 'Sector Radar & Location',
    'settings.locationSub': 'Muster radius & GPS precision',
    'settings.preferences': 'System Interface & Preferences',
    'settings.language': 'Language / زبان',
    'settings.commsTheme': 'Comms Glass Theme',
    'settings.commsThemeSub': 'Liquid Crystal, Neon Aurora, Obsidian...',
    'settings.darkMode': 'Dark Appearance',
    'settings.darkModeSub': 'Holographic obsidian glass',
    'settings.plusTitle': 'Ekip Operator Plus',
    'settings.plusSub': 'Unrestricted sector radar, priority deployment & medals',
    'settings.testError': 'Test Error Boundary (Simulate Crash)',
    'settings.signOut': 'Sign Out',
    'settings.selectLanguage': 'Select Interface Language',
    'settings.langChanged': 'Language changed to {lang}',

    // Error Boundary
    'error.boundaryTitle': 'Tactical Interface Error',
    'error.boundaryMessage': 'The interface encountered an unexpected glitch. Our engineers have been alerted.',
    'error.tryAgain': 'Try Again',
    'error.goHome': 'Go to Discover',
    'error.technicalDetails': 'Technical Breakdown & Diagnostics',
  },
  fa: {
    // Navigation
    'nav.discover': 'اکتشاف',
    'nav.activity': 'فعالیت',
    'nav.create': 'ایجاد',
    'nav.chat': 'پیام‌ها',
    'nav.profile': 'پروفایل',

    // Common
    'common.back': 'بازگشت',
    'common.save': 'ذخیره',
    'common.cancel': 'انصراف',
    'common.close': 'بستن',
    'common.search': 'جستجو',
    'common.filter': 'فیلتر',
    'common.all': 'همه',
    'common.seeAll': 'مشاهده همه',
    'common.apply': 'اعمال',
    'common.tryAgain': 'تلاش مجدد',
    'common.goToDiscover': 'رفتن به اکتشاف',
    'common.loading': 'در حال بارگذاری...',
    'common.done': 'انجام شد',
    'common.edit': 'ویرایش',
    'common.delete': 'حذف',
    'common.share': 'اشتراک‌گذاری',
    'common.join': 'پیوستن به اکیپ',
    'common.leave': 'ترک اکیپ',
    'common.requestJoin': 'درخواست عضویت',
    'common.members': 'عضو',
    'common.active': 'فعال',
    'common.verified': 'تایید شده',

    // Discover Screen
    'discover.title': 'رادار اکیپ‌ها',
    'discover.subtitle': 'اکیپ‌های فعال و رویدادهای منطقه خود را پیدا کنید',
    'discover.searchPlaceholder': 'جستجوی اکیپ، تگ، شهر...',
    'discover.activeMembers': 'اعضای فعال',
    'discover.featuredSquads': 'اکیپ‌های برگزیده',
    'discover.allSquads': 'تمامی اکیپ‌ها',
    'discover.membersCount': '{count} عضو',
    'discover.capacity': '{current} از {max} ظرفیت',
    'discover.cat.all': 'همه',
    'discover.cat.work': 'کاری و حرفه‌ای',
    'discover.cat.entertainment': 'تفریح و سرگرمی',
    'discover.cat.tech': 'فناوری و کد',
    'discover.cat.sports': 'ورزش و سلامت',
    'discover.cat.art': 'هنر و خلاقیت',

    // Comms / Chat Screen
    'chat.title': 'پیام‌رسان',
    'chat.searchPlaceholder': 'جستجوی گفتگوها...',
    'chat.emptyTitle': 'هنوز گفتگویی وجود ندارد',
    'chat.emptyDesc': 'به یک اکیپ بپیوندید یا گفتگوی جدیدی را آغاز کنید',
    'chat.typeMessage': 'پیام خود را بنویسید...',
    'chat.online': 'آنلاین',
    'chat.offline': 'آفلاین',
    'chat.membersCount': '{count} نفر در این کانال',

    // Activity Screen
    'activity.title': 'فعالیت‌های مأموریت',
    'activity.feed': 'فید زنده اکیپ‌ها',
    'activity.requests': 'درخواست‌های ورود',
    'activity.approvals': 'عضویت‌های تایید شده',

    // Create Screen
    'create.title': 'راه‌اندازی اکیپ جدید',
    'create.squadName': 'نام اکیپ',
    'create.description': 'شرح مأموریت و اهداف اکیپ',
    'create.category': 'دسته‌بندی',
    'create.city': 'شهر / منطقه',
    'create.capacity': 'حداکثر ظرفیت',
    'create.privacy': 'سطح دسترسی',
    'create.public': 'عمومی (پیوستن آزاد)',
    'create.private': 'خصوصی (نیاز به تایید)',
    'create.submit': 'ایجاد و ثبت اکیپ',

    // Profile Screen
    'profile.title': 'پرونده کاربری',
    'profile.editProfile': 'ویرایش پروفایل',
    'profile.squads': 'اکیپ‌های من',
    'profile.badges': 'مدال‌ها و افتخارات',
    'profile.stats': 'آمار عملکرد',
    'profile.missions': 'مأموریت‌ها',
    'profile.reputation': 'امتیاز اعتبار',
    'profile.clearance': 'سطح دسترسی',

    // Settings Screen
    'settings.title': 'تنظیمات سیستم',
    'settings.account': 'اطلاعات کاربری و هویت',
    'settings.personalInfo': 'اطلاعات فردی',
    'settings.personalInfoSub': 'نام مستعار، بیوگرافی و رزومه',
    'settings.verification': 'احراز هویت و امنیت',
    'settings.verificationSub': 'وضعیت بیومتریک و نشان تایید',
    'settings.privacy': 'حریم خصوصی و پنهان‌کاری',
    'settings.privacySub': 'حالت رادار مخفی، تیک خوانده‌شدن',
    'settings.notifications': 'اعلان‌ها و هشدارها',
    'settings.notificationsSub': 'پیام‌های کانال، منشن‌ها و صدا',
    'settings.location': 'رادار موقعیت و محدوده',
    'settings.locationSub': 'شعاع جستجو و دقت مکانی',
    'settings.preferences': 'شخصی‌سازی و رابط کاربری',
    'settings.language': 'Language / زبان',
    'settings.commsTheme': 'تم شیشه‌ای گفتگوها',
    'settings.commsThemeSub': 'کریستال مایع، شفق نئونی، ابسیدین...',
    'settings.darkMode': 'حالت تاریک (Dark Mode)',
    'settings.darkModeSub': 'شیشه مشکی هولوگرافیک',
    'settings.plusTitle': 'اشتراک ویژه Ekip Plus',
    'settings.plusSub': 'رادار نامحدود، اولویت در عضویت و مدال‌های خاص',
    'settings.testError': 'تست صفحه خطا (شبیه‌سازی کرش)',
    'settings.signOut': 'خروج از حساب کاربری',
    'settings.selectLanguage': 'انتخاب زبان برنامه',
    'settings.langChanged': 'زبان برنامه به {lang} تغییر یافت',

    // Error Boundary
    'error.boundaryTitle': 'خطای فنی در سیستم',
    'error.boundaryMessage': 'رابط کاربری با یک خطای غیرمنتظره روبه‌رو شد. تیم فنی مطلع گردید.',
    'error.tryAgain': 'تلاش دوباره',
    'error.goHome': 'رفتن به صفحه اصلی',
    'error.technicalDetails': 'جزئیات فنی و لاگ خطا',
  },
};

export type TranslationKey = keyof typeof translations.en;

interface I18nContextValue {
  language: Language;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  textAlign: 'left' | 'right';
  rowDir: 'row' | 'row-reverse';
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fa'); // Default to Persian as requested

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const isRTL = language === 'fa';
  const dir: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';
  const textAlign: 'left' | 'right' = isRTL ? 'right' : 'left';
  const rowDir: 'row' | 'row-reverse' = isRTL ? 'row-reverse' : 'row';

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.en;
    let str: string = (langDict as Record<string, string>)[key] || translations.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return str;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        isRTL,
        dir,
        textAlign,
        rowDir,
        setLanguage,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
