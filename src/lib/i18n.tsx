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
    'nav.chat': 'Chats',
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
    'common.goToDiscover': 'Explore Ekips',
    'common.loading': 'Loading...',
    'common.done': 'Done',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.share': 'Share',
    'common.join': 'Join Ekip',
    'common.leave': 'Leave Ekip',
    'common.requestJoin': 'Request to Join',
    'common.members': 'Members',
    'common.active': 'Active',
    'common.verified': 'Verified',

    // Discover Screen
    'discover.title': 'Explore Ekips',
    'discover.subtitle': 'Find friendly groups, weekend hangouts & activities',
    'discover.searchPlaceholder': 'Search ekips, cafes, hobbies, city...',
    'discover.activeMembers': 'Active Members',
    'discover.activeInSector': 'Active in your city',
    'discover.askAI': 'Ask Ekip AI',
    'discover.askAISub': 'Get ideas for hangouts, cool cafes & finding friends',
    'discover.filterTitle': 'Filter Ekips',
    'discover.filterCategory': 'Category',
    'discover.filterLocation': 'City / Neighborhood',
    'discover.filterAllSectors': 'All Areas',
    'discover.filterPremiumOnly': 'Verified Ekips only',
    'discover.filterReset': 'Reset',
    'discover.filterApply': 'Apply Filters',
    'discover.emptyTitle': 'No Ekips found',
    'discover.emptyDesc': 'Try changing your search terms or expanding your area.',
    'discover.featuredSquads': 'Featured Ekips',
    'discover.allSquads': 'All Ekips',
    'discover.membersCount': '{count} members',
    'discover.capacity': '{current}/{max} Capacity',
    'discover.cat.all': 'All',
    'discover.cat.work': 'Work & Tech',
    'discover.cat.entertainment': 'Hangouts & Fun',
    'discover.cat.tech': 'Tech & Code',
    'discover.cat.sports': 'Sports & Fitness',
    'discover.cat.art': 'Art & Culture',

    // Ekip Detail & Action Bar
    'ekip.manage': 'Manage Ekip',
    'ekip.deployed': 'Joined',
    'ekip.pendingClearance': 'Request Pending',
    'ekip.squadFull': 'Capacity Full',
    'ekip.deployNow': 'Join Now',
    'ekip.clearanceNotMet': 'Prerequisites Not Met',
    'ekip.cancelRequest': 'Cancel Request',
    'ekip.typeSolo': 'Solo',
    'ekip.typeCouple': 'Couple',
    'ekip.typeGroup': 'Group',
    'ekip.premium': 'Verified',
    'ekip.priority': 'Featured',
    'ekip.featured': 'Featured Ekip',

    // Comms / Chat Screen
    'chat.title': 'Messages',
    'chat.searchPlaceholder': 'Search chats...',
    'chat.emptyTitle': 'No Messages Yet',
    'chat.emptyDesc': 'Join an Ekip or start chatting with friends',
    'chat.typeMessage': 'Type a message...',
    'chat.online': 'Online',
    'chat.offline': 'Offline',
    'chat.membersCount': '{count} members in chat',
    'chat.channel': 'Ekip Chat',
    'chat.encryptedLink': 'Active Chat',
    'chat.encryptedComms': 'Chats & Messages',
    'chat.unreadTransmissions': '{count} unread messages',
    'chat.searchChannels': 'Search chats & friends...',
    'chat.noCommsLogs': 'No chats yet',
    'chat.noCommsLogsSub': 'Chat with friends or connect with your Ekip members.',
    'chat.transmitDispatch': 'Type a message...',
    'chat.queryCommandAI': 'Ask Ekip AI...',

    // Activity Screen
    'activity.title': 'My Activities',
    'activity.feed': 'Recent Feed',
    'activity.requests': 'Join Requests',
    'activity.approvals': 'Confirmed Memberships',
    'activity.created': 'Created',
    'activity.requestsTab': 'Requests',
    'activity.joined': 'Joined',
    'activity.noCreated': 'No created Ekips',
    'activity.noCreatedSub': 'Create your first Ekip to bring friends together.',
    'activity.noJoined': 'No joined Ekips',
    'activity.noJoinedSub': 'Discover and join exciting Ekips in your city.',
    'activity.noRequests': 'No requests sent',
    'activity.noRequestsSub': 'Request to join an Ekip and track the status here.',
    'activity.owner': 'Host',
    'activity.joinedBadge': 'Member',
    'activity.pendingBadge': 'Pending',
    'activity.acceptedBadge': 'Accepted',
    'activity.requestedBadge': 'Requested',
    'activity.rejectedBadge': 'Declined',
    'activity.myEkip': 'My Ekips',
    'activity.views': 'Views',
    'activity.requestsPending': 'Requests ({count})',
    'activity.pendingRequestsTitle': 'Pending Join Requests',
    'activity.allCaughtUp': 'All caught up',
    'activity.noPendingRequests': 'No pending requests for this Ekip.',

    // Create Screen
    'create.title': 'Create New Ekip',
    'create.squadName': 'Ekip Name / Event Title',
    'create.description': 'Description & Hangout Plan',
    'create.category': 'Category',
    'create.city': 'City / Neighborhood',
    'create.capacity': 'Max Capacity',
    'create.privacy': 'Joining Mode',
    'create.public': 'Public (Instant Join)',
    'create.private': 'Approval Required',
    'create.submit': 'Create Ekip',
    'create.step0Title': 'Title & Theme',
    'create.step0Sub': 'Set the name, category, and what you will do.',
    'create.titlePlaceholder': 'e.g. Boardgame Night & Coffee',
    'create.descPlaceholder': 'Describe your plan, games or activities, and vibes...',
    'create.step1Title': 'Meeting Spot & Capacity',
    'create.step1Sub': 'Pick the cafe or hangout spot and group size.',
    'create.minOperators': 'Min Members',
    'create.maxOperators': 'Max Members',
    'create.cityPlaceholder': 'City or Neighborhood (e.g. Tehran - Enghelab)',
    'create.locationPlaceholder': 'Cafe or address (e.g. Fekri Boardgame Cafe)',
    'create.step2Title': 'Preferences & Age Range',
    'create.step2Sub': 'Optionally set age range or participant preferences.',
    'create.minLevel': 'Min Activity Level',
    'create.minHonor': 'Min Reliability Score',
    'create.minAge': 'Min Age',
    'create.maxAge': 'Max Age',
    'create.genderPref': 'Gender Preference',
    'create.genderAny': 'Everyone',
    'create.genderMale': 'Men',
    'create.genderFemale': 'Women',
    'create.step3Title': 'Schedule & Cover',
    'create.step3Sub': 'Set the date, time, and choose a nice cover photo.',
    'create.autoAccept': 'Instant Join (Auto-Accept)',
    'create.recurring': 'Recurring Weekly Hangout',
    'create.continue': 'Continue',
    'create.deployOperation': 'Create Ekip',

    // Profile Screen
    'profile.title': 'User Profile',
    'profile.editProfile': 'Edit Profile',
    'profile.squads': 'My Ekips',
    'profile.badges': 'Badges & Achievements',
    'profile.stats': 'Activity Stats',
    'profile.missions': 'Social Challenges',
    'profile.reputation': 'Reliability',
    'profile.clearance': 'Rank',
    'profile.operations': 'Ekips',
    'profile.medals': 'Badges',
    'profile.contacts': 'Friends',
    'profile.readiness': 'Activity Score',
    'profile.tabOps': 'Ekips',
    'profile.tabMedals': 'Badges',
    'profile.tabDirectives': 'Challenges',
    'profile.tabContacts': 'Friends',
    'profile.noMissions': 'No active challenges',
    'profile.connect': 'Follow',
    'profile.connected': 'Following',
    'profile.yearsOld': '{age} yrs',

    // Notifications Sheet
    'notifications.title': 'Notifications',
    'notifications.unreadTab': 'Unread ({count})',
    'notifications.markAllRead': 'Mark all read',
    'notifications.markedAllToast': 'All notifications marked as read',

    // Settings Screen
    'settings.title': 'Settings',
    'settings.account': 'Account & Identity',
    'settings.personalInfo': 'Personal Information',
    'settings.personalInfoSub': 'Name, bio, city, and interests',
    'settings.verification': 'Identity Verification',
    'settings.verificationSub': 'Blue checkmark & verified phone',
    'settings.privacy': 'Privacy',
    'settings.privacySub': 'Online status, profile visibility, read receipts',
    'settings.notifications': 'Notifications',
    'settings.notificationsSub': 'Message alerts, hangout invites, sounds',
    'settings.location': 'Location & Search Distance',
    'settings.locationSub': 'Discovery radius & nearby hangouts',
    'settings.preferences': 'Interface & Preferences',
    'settings.language': 'Language / زبان',
    'settings.commsTheme': 'Chat Glass Theme',
    'settings.commsThemeSub': 'Liquid Crystal, Neon Aurora, Obsidian...',
    'settings.darkMode': 'Dark Mode',
    'settings.darkModeSub': 'Obsidian glass theme',
    'settings.plusTitle': 'Ekip Plus Membership',
    'settings.plusSub': 'Unlimited discovery radius, special badges & perks',
    'settings.testError': 'Test Error Screen',
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
    'settings.headerLocation': 'Location & Radius',
    'settings.headerChatTheme': 'Chat Theme',
    'settings.headerNotifications': 'Notifications',

    // Error Boundary
    'error.boundaryTitle': 'Application Error',
    'error.boundaryMessage': 'Something went wrong. Please try refreshing or restarting.',
    'error.tryAgain': 'Try Again',
    'error.goHome': 'Go to Discover',
    'error.technicalDetails': 'Technical Diagnostics',
  },
  fa: {
    // Navigation
    'nav.discover': 'کاوش',
    'nav.activity': 'فعالیت‌ها',
    'nav.create': 'ایجاد اکیپ',
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
    'common.goToDiscover': 'کاوش اکیپ‌ها',
    'common.loading': 'در حال بارگذاری...',
    'common.done': 'انجام شد',
    'common.edit': 'ویرایش',
    'common.delete': 'حذف',
    'common.share': 'اشتراک‌گذاری',
    'common.join': 'عضویت در اکیپ',
    'common.leave': 'خروج از اکیپ',
    'common.requestJoin': 'درخواست عضویت',
    'common.members': 'عضو',
    'common.active': 'فعال',
    'common.verified': 'تایید شده',

    // Discover Screen
    'discover.title': 'کاوش اکیپ‌ها',
    'discover.subtitle': 'اکیپ‌های باحال، دورهمی‌ها و برنامه‌های اطرافت را پیدا کن',
    'discover.searchPlaceholder': 'جستجوی اکیپ، کافه، علایق، شهر...',
    'discover.activeMembers': 'اعضای آنلاین',
    'discover.activeInSector': 'اعضای فعال در شهر شما',
    'discover.askAI': 'دستیار هوشمند اکیپ',
    'discover.askAISub': 'پیشنهاد ایده برای دورهمی، پیدا کردن کافه و دوستان هم‌سلیقه',
    'discover.filterTitle': 'فیلتر اکیپ‌ها',
    'discover.filterCategory': 'دسته‌بندی',
    'discover.filterLocation': 'شهر / محله',
    'discover.filterAllSectors': 'همه مناطق',
    'discover.filterPremiumOnly': 'فقط اکیپ‌های تاییدشده',
    'discover.filterReset': 'بازنشانی',
    'discover.filterApply': 'اعمال فیلترها',
    'discover.emptyTitle': 'اکیپی پیدا نشد',
    'discover.emptyDesc': 'فیلترهای جستجو یا محدوده محله خود را تغییر دهید.',
    'discover.featuredSquads': 'اکیپ‌های پیشنهادی',
    'discover.allSquads': 'تمامی اکیپ‌ها',
    'discover.membersCount': '{count} عضو',
    'discover.capacity': '{current} از {max} ظرفیت',
    'discover.cat.all': 'همه',
    'discover.cat.work': 'کاری و استارتاپ',
    'discover.cat.entertainment': 'دورهمی و کافه‌گردی',
    'discover.cat.tech': 'فناوری و برنامه‌نویسی',
    'discover.cat.sports': 'ورزش و طبیعت',
    'discover.cat.art': 'هنر و فرهنگ',

    // Ekip Detail & Action Bar
    'ekip.manage': 'مدیریت اکیپ',
    'ekip.deployed': 'عضو هستید',
    'ekip.pendingClearance': 'در انتظار تایید میزبان',
    'ekip.squadFull': 'ظرفیت تکمیل است',
    'ekip.deployNow': 'پیوستن به اکیپ',
    'ekip.clearanceNotMet': 'عدم تطابق با شرایط',
    'ekip.cancelRequest': 'لغو درخواست',
    'ekip.typeSolo': 'تک‌نفره',
    'ekip.typeCouple': 'دونفره',
    'ekip.typeGroup': 'گروهی',
    'ekip.premium': 'تایید شده',
    'ekip.priority': 'ویژه',
    'ekip.featured': 'اکیپ برگزیده هفته',

    // Comms / Chat Screen
    'chat.title': 'پیام‌ها',
    'chat.searchPlaceholder': 'جستجوی گفتگوها...',
    'chat.emptyTitle': 'هنوز پیامی ندارید',
    'chat.emptyDesc': 'به یک اکیپ بپیوندید یا با دوستانتان گفتگوی جدیدی شروع کنید',
    'chat.typeMessage': 'پیام خود را بنویسید...',
    'chat.online': 'آنلاین',
    'chat.offline': 'آفلاین',
    'chat.membersCount': '{count} عضو در این گپ',
    'chat.channel': 'گپ اکیپ',
    'chat.encryptedLink': 'گفتگوی فعال',
    'chat.encryptedComms': 'پیام‌ها و گفتگوها',
    'chat.unreadTransmissions': '{count} پیام جدید',
    'chat.searchChannels': 'جستجوی چت‌ها و دوستان...',
    'chat.noCommsLogs': 'هنوز پیامی وجود ندارد',
    'chat.noCommsLogsSub': 'با اعضای اکیپ در ارتباط باشید یا پیام جدیدی ارسال کنید.',
    'chat.transmitDispatch': 'پیام خود را بنویسید...',
    'chat.queryCommandAI': 'پرسش از هوش مصنوعی اکیپ...',

    // Activity Screen
    'activity.title': 'فعالیت‌های من',
    'activity.feed': 'فید اکیپ‌ها',
    'activity.requests': 'درخواست‌های عضویت',
    'activity.approvals': 'عضویت‌های تایید شده',
    'activity.created': 'ساخته‌شده',
    'activity.requestsTab': 'درخواست‌ها',
    'activity.joined': 'عضو شده',
    'activity.noCreated': 'هنوز اکیپی نساخته‌اید',
    'activity.noCreatedSub': 'اولین اکیپ خود را بسازید و دوستان را دور هم جمع کنید.',
    'activity.noJoined': 'عضو هیچ اکیپی نیستید',
    'activity.noJoinedSub': 'اکیپ‌های جذاب را پیدا کنید و در برنامه‌ها شرکت کنید.',
    'activity.noRequests': 'درخواستی ارسال نکرده‌اید',
    'activity.noRequestsSub': 'درخواست‌های عضویت شما در اینجا نمایش داده می‌شوند.',
    'activity.owner': 'میزبان',
    'activity.joinedBadge': 'عضو',
    'activity.pendingBadge': 'در انتظار تایید',
    'activity.acceptedBadge': 'تایید شده',
    'activity.requestedBadge': 'درخواست شده',
    'activity.rejectedBadge': 'رد شده',
    'activity.myEkip': 'اکیپ‌های من',
    'activity.views': 'بازدید',
    'activity.requestsPending': 'درخواست‌ها ({count})',
    'activity.pendingRequestsTitle': 'درخواست‌های در انتظار بررسی',
    'activity.allCaughtUp': 'همه درخواست‌ها بررسی شدند',
    'activity.noPendingRequests': 'هیچ درخواستی برای این اکیپ در انتظار نیست.',

    // Create Screen
    'create.title': 'ساخت اکیپ جدید',
    'create.squadName': 'نام اکیپ / عنوان دورهمی',
    'create.description': 'درباره برنامه و حال‌وهوای دورهمی',
    'create.category': 'دسته‌بندی',
    'create.city': 'شهر / محله',
    'create.capacity': 'حداکثر ظرفیت',
    'create.privacy': 'نحوه عضویت',
    'create.public': 'عمومی (پیوستن فوری)',
    'create.private': 'خصوصی (نیاز به تایید میزبان)',
    'create.submit': 'ایجاد و انتشار اکیپ',
    'create.step0Title': 'موضوع و عنوان برنامه',
    'create.step0Sub': 'عنوان، دسته‌بندی و ایده دورهمی را مشخص کنید.',
    'create.titlePlaceholder': 'مثلاً دورهمی بوردگیم و کافه‌گردی آخر هفته',
    'create.descPlaceholder': 'توضیحات کامل درباره برنامه، وسایل مورد نیاز و بازی‌ها...',
    'create.step1Title': 'محل قرار و ظرفیت',
    'create.step1Sub': 'کافه یا مکان قرار و تعداد افراد دلخواه را تعیین کنید.',
    'create.minOperators': 'حداقل نفرات',
    'create.maxOperators': 'حداکثر نفرات',
    'create.cityPlaceholder': 'شهر یا محله (مثلاً تهران - انقلاب)',
    'create.locationPlaceholder': 'کافه یا آدرس دقیق (مثلاً کافه بوردگیم فکری)',
    'create.step2Title': 'شرایط و ترجیحات',
    'create.step2Sub': 'در صورت تمایل رده سنی یا شرایط خاص شرکت در برنامه را تعیین کنید.',
    'create.minLevel': 'حداقل سطح فعالیت',
    'create.minHonor': 'حداقل امتیاز خوش‌قولی',
    'create.minAge': 'حداقل سن',
    'create.maxAge': 'حداکثر سن',
    'create.genderPref': 'ترجیح جنسیت',
    'create.genderAny': 'فرقی ندارد',
    'create.genderMale': 'آقایان',
    'create.genderFemale': 'بانوان',
    'create.step3Title': 'زمان‌بندی و انتشار',
    'create.step3Sub': 'زمان دورهمی و تصویر کاور اکیپ را انتخاب کنید.',
    'create.autoAccept': 'پذیرش خودکار (پیوستن بدون معطلی)',
    'create.recurring': 'برنامه تکرارشونده و منظم (هفتگی)',
    'create.continue': 'ادامه',
    'create.deployOperation': 'ایجاد و ثبت اکیپ',

    // Profile Screen
    'profile.title': 'پروفایل کاربری',
    'profile.editProfile': 'ویرایش پروفایل',
    'profile.squads': 'اکیپ‌های من',
    'profile.badges': 'مدال‌ها و نشان‌ها',
    'profile.stats': 'آمار فعالیت',
    'profile.missions': 'چالش‌های اجتماعی',
    'profile.reputation': 'امتیاز خوش‌قولی',
    'profile.clearance': 'سطح کاربری',
    'profile.operations': 'اکیپ‌ها',
    'profile.medals': 'نشان‌ها',
    'profile.contacts': 'دوستان',
    'profile.readiness': 'امتیاز فعالیت',
    'profile.tabOps': 'اکیپ‌ها',
    'profile.tabMedals': 'نشان‌ها',
    'profile.tabDirectives': 'چالش‌ها',
    'profile.tabContacts': 'دوستان',
    'profile.noMissions': 'چالش فعالی وجود ندارد',
    'profile.connect': 'دنبال کردن',
    'profile.connected': 'دنبال شده',
    'profile.yearsOld': '{age} سال',

    // Notifications Sheet
    'notifications.title': 'اعلان‌ها',
    'notifications.unreadTab': 'خوانده نشده ({count})',
    'notifications.markAllRead': 'خواندن همه',
    'notifications.markedAllToast': 'تمامی اعلان‌ها خوانده شدند',

    // Settings Screen
    'settings.title': 'تنظیمات',
    'settings.account': 'حساب کاربری',
    'settings.personalInfo': 'اطلاعات فردی',
    'settings.personalInfoSub': 'نام، بیوگرافی، شهر و علایق',
    'settings.verification': 'احراز هویت و تایید حساب',
    'settings.verificationSub': 'تایید شماره تماس و دریافت تیک آبی',
    'settings.privacy': 'حریم خصوصی',
    'settings.privacySub': 'نمایش آنلاین بودن و تیک خوانده‌شدن پیام‌ها',
    'settings.notifications': 'اعلان‌ها',
    'settings.notificationsSub': 'پیام‌های چت، دعوت به اکیپ و صداها',
    'settings.location': 'موقعیت مکانی و محدوده',
    'settings.locationSub': 'تعیین شهر و فاصله جستجوی دورهمی‌ها',
    'settings.preferences': 'شخصی‌سازی و ظاهر برنامه',
    'settings.language': 'Language / زبان',
    'settings.commsTheme': 'پوسته شیشه‌ای چت',
    'settings.commsThemeSub': 'کریستال مایع، شفق نئونی، ابسیدین...',
    'settings.darkMode': 'حالت تاریک (Dark Mode)',
    'settings.darkModeSub': 'شیشه مشکی هولوگرافیک',
    'settings.plusTitle': 'اشتراک ویژه Ekip Plus',
    'settings.plusSub': 'محدوده جستجوی نامحدود، نشان اختصاصی و مزایای ویژه',
    'settings.testError': 'تست صفحه خطا (شبیه‌سازی کرش)',
    'settings.signOut': 'خروج از حساب کاربری',
    'settings.selectLanguage': 'انتخاب زبان برنامه',
    'settings.langChanged': 'زبان برنامه به {lang} تغییر یافت',

    // Settings Header titles
    'settings.headerSettings': 'تنظیمات',
    'settings.headerPlans': 'پلن‌های اشتراک',
    'settings.headerPersonalInfo': 'اطلاعات فردی',
    'settings.headerVerification': 'احراز هویت',
    'settings.headerPrivacy': 'حریم خصوصی',
    'settings.headerSecurity': 'امنیت حساب',
    'settings.headerLocation': 'موقعیت مکانی',
    'settings.headerChatTheme': 'پوسته گفتگو',
    'settings.headerNotifications': 'اعلان‌ها',

    // Error Boundary
    'error.boundaryTitle': 'خطای برنامه‌ای',
    'error.boundaryMessage': 'برنامه با یک مشکل موقتی روبه‌رو شد. لطفاً دوباره تلاش کنید.',
    'error.tryAgain': 'تلاش مجدد',
    'error.goHome': 'صفحه اصلی',
    'error.technicalDetails': 'جزئیات فنی خطا',
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
  const [language, setLanguageState] = useState<Language>('fa');

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
