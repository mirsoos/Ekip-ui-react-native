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
    'discover.activeInSector': 'Active in your sector',
    'discover.askAI': 'Ask Ekip AI',
    'discover.askAISub': 'Tactical squad matchmaking & mission advice',
    'discover.filterTitle': 'Filter Ekips',
    'discover.filterCategory': 'Category',
    'discover.filterLocation': 'Location / Sector',
    'discover.filterAllSectors': 'All Sectors',
    'discover.filterPremiumOnly': 'Tier-1 / Premium only',
    'discover.filterReset': 'Reset',
    'discover.filterApply': 'Apply Filters',
    'discover.emptyTitle': 'No missions found',
    'discover.emptyDesc': 'Try broadening your sector or clearance search parameters.',
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

    // Ekip Detail & Action Bar
    'ekip.manage': 'Manage',
    'ekip.deployed': 'Deployed',
    'ekip.pendingClearance': 'Pending Clearance',
    'ekip.squadFull': 'Squad Full',
    'ekip.deployNow': 'Deploy Now',
    'ekip.clearanceNotMet': 'Clearance Not Met',
    'ekip.cancelRequest': 'Cancel',
    'ekip.typeSolo': 'Solo',
    'ekip.typeCouple': 'Couple',
    'ekip.typeGroup': 'Group',
    'ekip.premium': 'Premium',
    'ekip.priority': 'PRIORITY',
    'ekip.featured': 'Featured Operation',

    // Comms / Chat Screen
    'chat.title': 'Comms Relay',
    'chat.searchPlaceholder': 'Search transmissions...',
    'chat.emptyTitle': 'No Transmissions Yet',
    'chat.emptyDesc': 'Join a squad or start an encrypted transmission',
    'chat.typeMessage': 'Transmit message...',
    'chat.online': 'Online',
    'chat.offline': 'Offline',
    'chat.membersCount': '{count} operators in channel',
    'chat.channel': 'Squad Channel',
    'chat.encryptedLink': 'Encrypted Link · Active',
    'chat.encryptedComms': 'Encrypted Comms',
    'chat.unreadTransmissions': '{count} unread transmissions',
    'chat.searchChannels': 'Search channels & operators...',
    'chat.noCommsLogs': 'No comms logs',
    'chat.noCommsLogsSub': 'Connect with squad operatives or start an encrypted transmission.',
    'chat.transmitDispatch': 'Transmit secure dispatch...',
    'chat.queryCommandAI': 'Query Command AI...',

    // Activity Screen
    'activity.title': 'Mission Activity',
    'activity.feed': 'Live Radar Feed',
    'activity.requests': 'Clearance Requests',
    'activity.approvals': 'Approved Deployments',
    'activity.created': 'Created',
    'activity.requestsTab': 'Requests',
    'activity.joined': 'Joined',
    'activity.noCreated': 'No created Ekips',
    'activity.noCreatedSub': 'Create your first Ekip to start gathering people.',
    'activity.noJoined': 'No joined Ekips',
    'activity.noJoinedSub': 'Discover and join Ekips to see them here.',
    'activity.noRequests': 'No requests sent',
    'activity.noRequestsSub': 'Request to join an Ekip and track its status here.',
    'activity.owner': 'Owner',
    'activity.joinedBadge': 'Joined',
    'activity.pendingBadge': 'Pending',
    'activity.acceptedBadge': 'Accepted',
    'activity.requestedBadge': 'Requested',
    'activity.rejectedBadge': 'Rejected',
    'activity.myEkip': 'My Ekip',
    'activity.views': 'Views',
    'activity.requestsPending': 'Requests ({count})',
    'activity.pendingRequestsTitle': 'Pending Join Requests',
    'activity.allCaughtUp': 'All caught up',
    'activity.noPendingRequests': 'No pending requests for this Ekip.',

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
    'create.step0Title': 'Operation Overview',
    'create.step0Sub': 'Define the title, tactical objective, and format.',
    'create.titlePlaceholder': 'Operation Title (e.g. Dawn Recon Patrol)',
    'create.descPlaceholder': 'Detailed Mission Directives & Objectives...',
    'create.step1Title': 'Muster Point & Squad Size',
    'create.step1Sub': 'Determine squad capacity and rendezvous coordinates.',
    'create.minOperators': 'Min Operators',
    'create.maxOperators': 'Max Operators',
    'create.cityPlaceholder': 'Sector / Base City',
    'create.locationPlaceholder': 'Specific Rendezvous Point (e.g. Checkpoint Alpha)',
    'create.step2Title': 'Clearance & Eligibility',
    'create.step2Sub': 'Optionally set clearance prerequisites for candidates.',
    'create.minLevel': 'Min Level Required',
    'create.minHonor': 'Min Honor Score',
    'create.minAge': 'Min Age',
    'create.maxAge': 'Max Age',
    'create.genderPref': 'Gender Preference',
    'create.genderAny': 'Any',
    'create.genderMale': 'Male',
    'create.genderFemale': 'Female',
    'create.step3Title': 'Schedule & Deployment',
    'create.step3Sub': 'Pick operational muster time and cover imagery.',
    'create.autoAccept': 'Automatic Clearance (Instant Join)',
    'create.recurring': 'Recurring Mission Schedule',
    'create.continue': 'Continue',
    'create.deployOperation': 'Deploy Operation',

    // Profile Screen
    'profile.title': 'Operator Dossier',
    'profile.editProfile': 'Edit Dossier',
    'profile.squads': 'Assigned Squads',
    'profile.badges': 'Tactical Medals',
    'profile.stats': 'Operational Stats',
    'profile.missions': 'Missions',
    'profile.reputation': 'Reputation',
    'profile.clearance': 'Clearance Level',
    'profile.operations': 'Operations',
    'profile.medals': 'Medals',
    'profile.contacts': 'Contacts',
    'profile.readiness': 'Readiness',
    'profile.tabOps': 'Ops',
    'profile.tabMedals': 'Medals',
    'profile.tabDirectives': 'Directives',
    'profile.tabContacts': 'Contacts',
    'profile.noMissions': 'No assigned missions',
    'profile.connect': 'Connect',
    'profile.connected': 'Connected',
    'profile.yearsOld': '{age} yrs',

    // Notifications Sheet
    'notifications.title': 'Notifications',
    'notifications.unreadTab': 'Unread ({count})',
    'notifications.markAllRead': 'Mark all read',
    'notifications.markedAllToast': 'All notifications marked as read',

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

    // Settings Header titles
    'settings.headerSettings': 'Settings',
    'settings.headerPlans': 'Subscription Plans',
    'settings.headerPersonalInfo': 'Personal Information',
    'settings.headerVerification': 'Identity Verification',
    'settings.headerPrivacy': 'Privacy & Visibility',
    'settings.headerSecurity': 'Security & Access',
    'settings.headerLocation': 'Location & Radar',
    'settings.headerChatTheme': 'Chat Theme',
    'settings.headerNotifications': 'Notifications',

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
    'discover.activeInSector': 'فعال در منطقه شما',
    'discover.askAI': 'پرسش از هوش مصنوعی اکیپ',
    'discover.askAISub': 'مچ‌میکینگ هوشمند اکیپ و مشاوره مأموریت',
    'discover.filterTitle': 'فیلتر اکیپ‌ها',
    'discover.filterCategory': 'دسته‌بندی',
    'discover.filterLocation': 'منطقه / موقعیت',
    'discover.filterAllSectors': 'همه مناطق',
    'discover.filterPremiumOnly': 'فقط اشتراک ویژه',
    'discover.filterReset': 'بازنشانی',
    'discover.filterApply': 'اعمال فیلترها',
    'discover.emptyTitle': 'اکیپی پیدا نشد',
    'discover.emptyDesc': 'فیلترهای جستجو یا محدوده مکانی خود را تغییر دهید.',
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

    // Ekip Detail & Action Bar
    'ekip.manage': 'مدیریت',
    'ekip.deployed': 'مستقر شده',
    'ekip.pendingClearance': 'در انتظار بررسی',
    'ekip.squadFull': 'ظرفیت تکمیل',
    'ekip.deployNow': 'عضویت فوری',
    'ekip.clearanceNotMet': 'عدم احراز شرایط',
    'ekip.cancelRequest': 'لغو درخواست',
    'ekip.typeSolo': 'تک‌نفره',
    'ekip.typeCouple': 'دونفره',
    'ekip.typeGroup': 'گروهی',
    'ekip.premium': 'ویژه',
    'ekip.priority': 'اولویت بالا',
    'ekip.featured': 'عملیات برگزیده',

    // Comms / Chat Screen
    'chat.title': 'پیام‌رسان',
    'chat.searchPlaceholder': 'جستجوی گفتگوها...',
    'chat.emptyTitle': 'هنوز گفتگویی وجود ندارد',
    'chat.emptyDesc': 'به یک اکیپ بپیوندید یا گفتگوی جدیدی را آغاز کنید',
    'chat.typeMessage': 'پیام خود را بنویسید...',
    'chat.online': 'آنلاین',
    'chat.offline': 'آفلاین',
    'chat.membersCount': '{count} نفر در این کانال',
    'chat.channel': 'کانال اکیپ',
    'chat.encryptedLink': 'ارتباط امن · فعال',
    'chat.encryptedComms': 'پیام‌رسان امن',
    'chat.unreadTransmissions': '{count} پیام خوانده‌نشده',
    'chat.searchChannels': 'جستجوی کانال‌ها و کاربران...',
    'chat.noCommsLogs': 'هنوز گفتگویی وجود ندارد',
    'chat.noCommsLogsSub': 'با اعضای اکیپ در ارتباط باشید یا پیام امن جدیدی ارسال کنید.',
    'chat.transmitDispatch': 'ارسال پیام امن...',
    'chat.queryCommandAI': 'پرسش از هوش مصنوعی اکیپ...',

    // Activity Screen
    'activity.title': 'فعالیت‌های مأموریت',
    'activity.feed': 'فید زنده اکیپ‌ها',
    'activity.requests': 'درخواست‌های ورود',
    'activity.approvals': 'عضویت‌های تایید شده',
    'activity.created': 'ایجاد شده',
    'activity.requestsTab': 'درخواست‌ها',
    'activity.joined': 'عضو شده',
    'activity.noCreated': 'اکیپ ایجاد شده‌ای ندارید',
    'activity.noCreatedSub': 'اولین اکیپ خود را بسازید و افراد را دور هم جمع کنید.',
    'activity.noJoined': 'عضو هیچ اکیپی نیستید',
    'activity.noJoinedSub': 'اکیپ‌ها را پیدا کنید و به آن‌ها بپیوندید.',
    'activity.noRequests': 'درخواستی ارسال نکرده‌اید',
    'activity.noRequestsSub': 'درخواست‌های عضویت شما در اینجا نمایش داده می‌شوند.',
    'activity.owner': 'مالک',
    'activity.joinedBadge': 'عضو',
    'activity.pendingBadge': 'در انتظار',
    'activity.acceptedBadge': 'پذیرفته شده',
    'activity.requestedBadge': 'درخواست شده',
    'activity.rejectedBadge': 'رد شده',
    'activity.myEkip': 'اکیپ‌های من',
    'activity.views': 'بازدید',
    'activity.requestsPending': 'درخواست‌ها ({count})',
    'activity.pendingRequestsTitle': 'درخواست‌های در انتظار بررسی',
    'activity.allCaughtUp': 'همه درخواست‌ها بررسی شدند',
    'activity.noPendingRequests': 'هیچ درخواستی برای این اکیپ در انتظار نیست.',

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
    'create.step0Title': 'مشخصات و اهداف اکیپ',
    'create.step0Sub': 'عنوان، هدف تاکتیکی و ساختار اکیپ را مشخص کنید.',
    'create.titlePlaceholder': 'عنوان اکیپ (مثلاً گشت کوهستان بخش ۴)',
    'create.descPlaceholder': 'توضیحات کامل و اهداف مأموریت اکیپ...',
    'create.step1Title': 'محل قرار و ظرفیت اکیپ',
    'create.step1Sub': 'ظرفیت اکیپ و مختصات محل تجمع را تعیین کنید.',
    'create.minOperators': 'حداقل نفرات',
    'create.maxOperators': 'حداکثر نفرات',
    'create.cityPlaceholder': 'منطقه / شهر پایگاه',
    'create.locationPlaceholder': 'محل دقیق قرار (مثلاً ایستگاه بازرسی دلتا)',
    'create.step2Title': 'شرایط و صلاحیت ورود',
    'create.step2Sub': 'پیش‌نیازهای ورود به اکیپ را در صورت تمایل تنظیم کنید.',
    'create.minLevel': 'حداقل سطح',
    'create.minHonor': 'حداقل امتیاز اعتبار',
    'create.minAge': 'حداقل سن',
    'create.maxAge': 'حداکثر سن',
    'create.genderPref': 'ترجیح جنسیت',
    'create.genderAny': 'فرقی ندارد',
    'create.genderMale': 'آقا',
    'create.genderFemale': 'خانم',
    'create.step3Title': 'زمان‌بندی و انتشار',
    'create.step3Sub': 'زمان گردهمایی و تصویر پس‌زمینه اکیپ را برگزینید.',
    'create.autoAccept': 'پذیرش خودکار (پیوستن فوری)',
    'create.recurring': 'برنامه تکرارشونده منظم',
    'create.continue': 'ادامه',
    'create.deployOperation': 'ایجاد و ثبت اکیپ',

    // Profile Screen
    'profile.title': 'پرونده کاربری',
    'profile.editProfile': 'ویرایش پروفایل',
    'profile.squads': 'اکیپ‌های من',
    'profile.badges': 'مدال‌ها و افتخارات',
    'profile.stats': 'آمار عملکرد',
    'profile.missions': 'مأموریت‌ها',
    'profile.reputation': 'امتیاز اعتبار',
    'profile.clearance': 'سطح دسترسی',
    'profile.operations': 'عملیات‌ها',
    'profile.medals': 'مدال‌ها',
    'profile.contacts': 'مخاطبین',
    'profile.readiness': 'آمادگی',
    'profile.tabOps': 'اکیپ‌ها',
    'profile.tabMedals': 'مدال‌ها',
    'profile.tabDirectives': 'دستورالعمل‌ها',
    'profile.tabContacts': 'دوستان',
    'profile.noMissions': 'هیچ مأموریتی ثبت نشده است',
    'profile.connect': 'ارتباط',
    'profile.connected': 'متصل شد',
    'profile.yearsOld': '{age} سال',

    // Notifications Sheet
    'notifications.title': 'اعلان‌ها',
    'notifications.unreadTab': 'خوانده نشده ({count})',
    'notifications.markAllRead': 'خواندن همه',
    'notifications.markedAllToast': 'تمامی اعلان‌ها خوانده شدند',

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

    // Settings Header titles
    'settings.headerSettings': 'تنظیمات',
    'settings.headerPlans': 'پلن‌های اشتراک',
    'settings.headerPersonalInfo': 'اطلاعات فردی',
    'settings.headerVerification': 'احراز هویت',
    'settings.headerPrivacy': 'حریم خصوصی و دید',
    'settings.headerSecurity': 'امنیت و دسترسی',
    'settings.headerLocation': 'موقعیت مکانی و رادار',
    'settings.headerChatTheme': 'تم گفتگو',
    'settings.headerNotifications': 'اعلان‌ها',

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
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const isRTL = language === 'fa';
  const dir: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';
  const textAlign: 'left' | 'right' = isRTL ? 'right' : 'left';
  const rowDir: 'row' | 'row-reverse' = isRTL ? 'row-reverse' : 'row';

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = translations[language] ?? translations.en;
    let text = dict[key] ?? translations.en[key] ?? (key as string);
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }
    return text;
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

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
