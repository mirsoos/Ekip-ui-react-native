import type {
  Profile, Group, GroupMember, GroupRequest, Conversation, Message,
  Notification, Badge, Mission, Friendship,
} from '../types/database';

// Avatar + banner stock photos (Pexels - tactical/military/operator aesthetic)
const av = (seed: string) => `https://images.pexels.com/photos/${seed}/pexels-photo-${seed}.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop`;
const cover = (seed: string) => `https://images.pexels.com/photos/${seed}/pexels-photo-${seed}.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop`;

export const demoProfiles: Profile[] = [
  {
    id: 'me', username: 'cmd.vance', first_name: 'مارکوس', last_name: 'ونس',
    email: 'vance@ekip-command.mil', phone: '+98 912 000 0199', gender: 'male', age: 34,
    city: 'بخش ۷ - ستاد فرماندهی', job: 'فرمانده عملیات تاکتیکی', bio: 'فرماندهی عملیات ویژه. یگان دوازدهم شناسایی تاکتیکی. سطح دسترسی امنیتی: امگا.',
    avatar_url: av('220453'), banner_url: cover('355465'),
    interests: ['عملیات تاکتیکی', 'شناسایی و دیده‌بانی', 'رمزنگاری', 'هدایت پهپاد', 'بقا در شرایط سخت', 'بالستیک'],
    personality_type: 'ESTJ-A', social_links: { secure_comms: 'vance.secure', radio: 'CH-9-ALPHA' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 48, xp: 9420, xp_to_next: 10000, honor_score: 99, reputation_level: 'فرمانده ارشد',
    mood: 'آماده‌باش کامل', created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'u2', username: 'elena.rostov', first_name: 'النا', last_name: 'روستوا',
    email: null, phone: null, gender: 'female', age: 29, city: 'بخش ۴ - پایگاه آلفا',
    job: 'سرپرست رمزنگاری و شنود اطلاعات', bio: 'تحلیل شنود، رمزنگاری کوانتومی و مسیریابی امن شبکه‌های تاکتیکی.',
    avatar_url: av('774909'), banner_url: cover('1103970'),
    interests: ['دفاع سایبری', 'سیگنال و شنود', 'پایتون', 'رمزنگاری', 'جنگ الکترونیک'],
    personality_type: 'INTJ-A', social_links: { radio: 'CH-4-SIGINT' },
    is_premium: false, is_verified: true, is_identity_verified: true,
    level: 42, xp: 8100, xp_to_next: 9000, honor_score: 97, reputation_level: 'نیروی ویژه',
    mood: 'دیده‌بانی شبکه', created_at: '2025-02-01T10:00:00Z',
  },
  {
    id: 'u3', username: 'jax.reyes', first_name: 'جکسون', last_name: 'ریس',
    email: null, phone: null, gender: 'male', age: 31, city: 'بخش ۲ - قرارگاه مقدم',
    job: 'تک‌تیرانداز ارشد و متخصص شناسایی', bio: 'شناسایی دقیق دوربرد و عملیات نظارت پدافندی بر خط‌الراس.',
    avatar_url: av('1043471'), banner_url: cover('1640777'),
    interests: ['تیراندازی دقیق', 'استتار', 'تحلیل عوارض زمین', 'هدایت پهپاد', 'نبرد کوهستان'],
    personality_type: 'ISTP-A', social_links: { radio: 'CH-2-RECON' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 45, xp: 8900, xp_to_next: 9500, honor_score: 98, reputation_level: 'نیروی ویژه',
    mood: 'هوشیار در کمین', created_at: '2024-12-10T10:00:00Z',
  },
  {
    id: 'u4', username: 'mei.chen', first_name: 'می', last_name: 'چن',
    email: null, phone: null, gender: 'female', age: 27, city: 'بخش ۶ - آماد و پشتیبانی',
    job: 'پزشک عملیاتی و امداد اضطراری', bio: 'تریاژ اضطراری خط مقدم، جراحی صحرایی و مهار خطرات بیولوژیکی.',
    avatar_url: av('762020'), banner_url: cover('167964'),
    interests: ['تریاژ و امداد', 'پزشکی اورژانس', 'سم‌شناسی', 'جراحی صحرایی', 'بیوتکنولوژی'],
    personality_type: 'ISFJ-A', social_links: { radio: 'CH-6-MED' },
    is_premium: false, is_verified: true, is_identity_verified: false,
    level: 39, xp: 7400, xp_to_next: 8000, honor_score: 96, reputation_level: 'نیروی مورد اعتماد',
    mood: 'آماده امدادرسانی', created_at: '2025-03-20T10:00:00Z',
  },
  {
    id: 'u5', username: 'viktor.vance', first_name: 'ویکتور', last_name: 'کووالف',
    email: null, phone: null, gender: 'male', age: 36, city: 'بخش ۱ - یگان زرهی',
    job: 'سرپرست زرهی و تخریب سنگین', bio: 'عملیات رخنه و نفوذ، خنثی‌سازی مهمات انفجاری و هدایت خودروهای زرهی سنگین.',
    avatar_url: av('1220794'), banner_url: cover('1677256'),
    interests: ['تخریب', 'زره سنگین', 'مکانیک سنگین', 'تحلیل سازه', 'رانندگی تاکتیکی'],
    personality_type: 'ESTP-T', social_links: { radio: 'CH-1-HEAVY' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 44, xp: 8750, xp_to_next: 9200, honor_score: 94, reputation_level: 'نیروی ویژه',
    mood: 'تهاجمی و با صلابت', created_at: '2025-01-28T10:00:00Z',
  },
  {
    id: 'u6', username: 'sarah.connor', first_name: 'سارا', last_name: 'کانر',
    email: null, phone: null, gender: 'female', age: 30, city: 'بخش ۵ - پایگاه پهپادی',
    job: 'خلبان اسکادران پهپادی خودکار', bio: 'شناسایی هوایی تاکتیکی با پهپاد و هدایت سیستم‌های پدافند پیرامونی هوشمند.',
    avatar_url: av('1130626'), banner_url: cover('2425567'),
    interests: ['اسکادران پهپاد', 'هدف‌گیری هوش مصنوعی', 'سیستم‌های رادار', 'جنگ الکترونیک', 'رباتیک'],
    personality_type: 'ENTJ-A', social_links: { radio: 'CH-5-UAV' },
    is_premium: false, is_verified: true, is_identity_verified: false,
    level: 41, xp: 7900, xp_to_next: 8500, honor_score: 95, reputation_level: 'نیروی مورد اعتماد',
    mood: 'محاسبه‌گر و آماده', created_at: '2025-02-14T10:00:00Z',
  },
];

const profileById = (id: string) => demoProfiles.find((p) => p.id === id)!;

export const demoGroups: Group[] = [
  {
    id: 'g1', owner_id: 'u3', title: 'عملیات نایت‌فال - گشت شناسایی بخش ۴',
    description: 'اجرای نفوذ مخفیانه و دیده‌بانی ارتفاعات ایستگاه تقویت سیگنال بخش ۴. تجهیزات دید در شب کامل و چک رادیویی رمزگذاری‌شده ۱۵ دقیقه قبل از حرکت الزامی است.',
    category: 'work', group_type: 'group', min_members: 4, max_members: 12,
    city: 'بخش ۴ - پایگاه آلفا', location_name: 'ایستگاه بازرسی دلتا، جاده خط‌الراس',
    latitude: 37.7955, longitude: -122.3937,
    tags: ['شناسایی', 'عملیات شبانه', 'استتار', 'سطح یک'],
    age_min: 21, age_max: 50, required_level: 10, required_honor: 80,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('167964'),
    premium_only: false, visibility: 'public', auto_accept: false, is_repeating: true,
    event_date: '2026-08-02T22:30:00Z', views: 842, member_count: 7, created_at: '2026-07-20T10:00:00Z',
    owner: profileById('u3'),
  },
  {
    id: 'g2', owner_id: 'u2', title: 'مانور دفاع سایبری و رمزنگاری کوانتومی',
    description: 'شبیه‌سازی زنده نفوذ مخرب شبکه به سرورهای فرماندهی. آزمایش پروتکل‌های پدافند نفوذ، فایروال و بازیابی نامتمرکز داده‌ها.',
    category: 'work', group_type: 'group', min_members: 5, max_members: 15,
    city: 'ستاد فرماندهی - بخش سایبری', location_name: 'صندوق سرور ۳، طبقه زیرزمین B',
    latitude: 37.7822, longitude: -122.4051,
    tags: ['سایبری', 'پدافند', 'رمزنگاری', 'شنود'],
    age_min: 20, age_max: 55, required_level: 15, required_honor: 85,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('3184292'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-05T14:00:00Z', views: 1250, member_count: 11, created_at: '2026-07-18T10:00:00Z',
    owner: profileById('u2'),
  },
  {
    id: 'g3', owner_id: 'u4', title: 'شبیه‌سازی تریاژ نبرد و امداد تلفات جمعی',
    description: 'تمرین پیشرفته اقدامات پزشکی در میدان نبرد زیر آتش فرضی دشمن. بستن تورنیکه، مدیریت راه هوایی و تخلیه امن مجروحین.',
    category: 'work', group_type: 'group', min_members: 3, max_members: 8,
    city: 'قرارگاه مقدم - بخش پزشکی', location_name: 'بیمارستان صحرایی آلفا، بخش ۲',
    latitude: 37.7599, longitude: -122.4148,
    tags: ['پزشکی', 'تریاژ', 'بقا', 'آمادگی'],
    age_min: 18, age_max: 50, required_level: 5, required_honor: 70,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('884600'),
    premium_only: true, visibility: 'public', auto_accept: false, is_repeating: false,
    event_date: '2026-08-08T09:00:00Z', views: 498, member_count: 6, created_at: '2026-07-25T10:00:00Z',
    owner: profileById('u4'),
  },
  {
    id: 'g4', owner_id: 'u6', title: 'مانور پدافند پیرامونی اسکادران پهپادی',
    description: 'استقرار پهپادهای خودکار جهت تامین امنیت مختصات پیرامونی در برابر نفوذهای احتمالی. بررسی داده‌های تله‌متری، ردگیری حرارتی و مسیرهای رهگیری.',
    category: 'work', group_type: 'group', min_members: 3, max_members: 10,
    city: 'بخش ۵ - پایگاه پهپادی', location_name: 'سکوی ۴، باند شمالی',
    latitude: 37.6152, longitude: -122.4925,
    tags: ['پهپاد', 'پدافند', 'دیده‌بانی', 'فناوری'],
    age_min: 21, age_max: 45, required_level: 12, required_honor: 80,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('1654748'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-03T05:30:00Z', views: 667, member_count: 8, created_at: '2026-07-22T10:00:00Z',
    owner: profileById('u6'),
  },
  {
    id: 'g5', owner_id: 'u5', title: 'کارگاه تخریب سنگین و رخنه تاکتیکی',
    description: 'انفجار کنترل‌شده موانع بتنی مستحکم، کار با مواد منفجره تاکتیکی و سنجش یکپارچگی سازه در محیط‌های شهری.',
    category: 'work', group_type: 'group', min_members: 2, max_members: 6,
    city: 'بخش ۱ - یگان زرهی', location_name: 'میدان تیر ۹، مجتمع بتنی',
    latitude: 37.7096, longitude: -122.3933,
    tags: ['تخریب', 'رخنه', 'تاکتیکی', 'شهری'],
    age_min: 25, age_max: 50, required_level: 20, required_honor: 90,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('1677256'),
    premium_only: false, visibility: 'public', auto_accept: false, is_repeating: true,
    event_date: '2026-08-06T10:00:00Z', views: 343, member_count: 5, created_at: '2026-07-26T10:00:00Z',
    owner: profileById('u5'),
  },
  {
    id: 'g6', owner_id: 'me', title: 'جلسه توجیهی عملیات ستاد فرماندهی',
    description: 'نشست هفتگی سرگروه‌ها و فرماندهان. بررسی داده‌های تله‌متری، برنامه استقرار یگان‌ها و تخصیص منابع در تمامی بخش‌ها.',
    category: 'work', group_type: 'group', min_members: 4, max_members: 15,
    city: 'ستاد فرماندهی - تالار اصلی', location_name: 'تالار اصلی ستاد، اتاق امگا',
    latitude: 37.7563, longitude: -122.4185,
    tags: ['فرماندهی', 'توجیهی', 'استراتژی', 'رهبری'],
    age_min: 25, age_max: 60, required_level: 25, required_honor: 95,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('6952383'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-04T08:30:00Z', views: 889, member_count: 12, created_at: '2026-07-27T10:00:00Z',
    owner: profileById('me'),
  },
];

export const demoMembers: GroupMember[] = [
  { id: 'm1', group_id: 'g1', user_id: 'u3', role: 'owner', status: 'active', joined_at: '2026-07-20T10:00:00Z', profile: profileById('u3') },
  { id: 'm2', group_id: 'g1', user_id: 'me', role: 'member', status: 'active', joined_at: '2026-07-21T10:00:00Z', profile: profileById('me') },
  { id: 'm3', group_id: 'g1', user_id: 'u5', role: 'member', status: 'active', joined_at: '2026-07-22T10:00:00Z', profile: profileById('u5') },
  { id: 'm4', group_id: 'g2', user_id: 'u2', role: 'owner', status: 'active', joined_at: '2026-07-18T10:00:00Z', profile: profileById('u2') },
  { id: 'm5', group_id: 'g2', user_id: 'me', role: 'member', status: 'active', joined_at: '2026-07-19T10:00:00Z', profile: profileById('me') },
  { id: 'm6', group_id: 'g2', user_id: 'u6', role: 'member', status: 'active', joined_at: '2026-07-23T10:00:00Z', profile: profileById('u6') },
  { id: 'm7', group_id: 'g6', user_id: 'me', role: 'owner', status: 'active', joined_at: '2026-07-27T10:00:00Z', profile: profileById('me') },
  { id: 'm8', group_id: 'g6', user_id: 'u3', role: 'member', status: 'active', joined_at: '2026-07-28T10:00:00Z', profile: profileById('u3') },
  { id: 'm9', group_id: 'g6', user_id: 'u4', role: 'member', status: 'active', joined_at: '2026-07-28T10:00:00Z', profile: profileById('u4') },
];

export const demoRequests: GroupRequest[] = [
  { id: 'r1', group_id: 'g6', user_id: 'u5', status: 'pending', message: 'درخواست مجوز حضور در جلسه توجیهی ستاد فرماندهی.', created_at: '2026-07-28T09:00:00Z', group: demoGroups[5], profile: profileById('u5') },
  { id: 'r2', group_id: 'g6', user_id: 'u2', status: 'pending', message: 'ارائه گزارش‌های تله‌متری سیگنال جهت بررسی نهایی.', created_at: '2026-07-28T10:00:00Z', group: demoGroups[5], profile: profileById('u2') },
  { id: 'r3', group_id: 'g6', user_id: 'u6', status: 'pending', message: null, created_at: '2026-07-28T11:00:00Z', group: demoGroups[5], profile: profileById('u6') },
  { id: 'r4', group_id: 'g1', user_id: 'me', status: 'pending', message: 'درخواست نظارت فرماندهی برای عملیات نایت‌فال.', created_at: '2026-07-28T08:00:00Z', group: demoGroups[0], profile: profileById('me') },
  { id: 'r5', group_id: 'g3', user_id: 'me', status: 'accepted', message: null, created_at: '2026-07-27T08:00:00Z', group: demoGroups[2], profile: profileById('me') },
];

export const demoConversations: Conversation[] = [
  { id: 'c1', type: 'direct', title: 'جکسون ریس (سرپرست تک‌تیراندازها)', avatar_url: av('1043471'), group_id: null, last_message: 'موقعیت دیده‌بانی تثبیت شد. بخش ۴ پاکسازی شد.', last_message_at: '2026-07-28T11:30:00Z', unread_count: 2 },
  { id: 'c2', type: 'group', title: 'عملیات نایت‌فال - کانال اکیپ', avatar_url: cover('167964'), group_id: 'g1', last_message: 'النا: کلیدهای رمزنگاری کوانتومی برای نفوذ به‌روزرسانی شد.', last_message_at: '2026-07-28T10:15:00Z', unread_count: 5 },
  { id: 'c3', type: 'direct', title: 'سارا کانر (فرمانده پهپادی)', avatar_url: av('1130626'), group_id: null, last_message: 'تله‌متری پهپادها در تمامی ایستگاه‌ها پایدار و نرمال است.', last_message_at: '2026-07-28T09:00:00Z', unread_count: 0 },
  { id: 'c4', type: 'group', title: 'عملیات ستاد فرماندهی', avatar_url: cover('3184292'), group_id: 'g2', last_message: 'ویکتور: بسته‌های انفجاری در طبقه زیرزمین B آماده‌سازی شدند.', last_message_at: '2026-07-27T18:00:00Z', unread_count: 0 },
  { id: 'c5', type: 'direct', title: 'می چن (تیم پزشکی)', avatar_url: av('762020'), group_id: null, last_message: 'فهرست تجهیزات ارسالی به بیمارستان صحرایی تایید شد.', last_message_at: '2026-07-27T14:00:00Z', unread_count: 0 },
];

export const demoMessages: Record<string, Message[]> = {
  c1: [
    { id: 'msg1', conversation_id: 'c1', sender_id: 'u3', body: 'فرمانده ونس، تیم شناسایی در خط‌الراس بخش ۴ مستقر شد.', media_url: null, read_at: '2026-07-28T11:00:00Z', created_at: '2026-07-28T11:00:00Z', sender: profileById('u3') },
    { id: 'msg2', conversation_id: 'c1', sender_id: 'me', body: 'دریافت شد جکسون. سکوت رادیویی را تا ساعت صفر حفظ کنید.', media_url: null, read_at: null, created_at: '2026-07-28T11:10:00Z', sender: profileById('me') },
    { id: 'msg3', conversation_id: 'c1', sender_id: 'u3', body: 'کپی شد. تست دید حرارتی با موفقیت انجام شد.', media_url: null, read_at: null, created_at: '2026-07-28T11:20:00Z', sender: profileById('u3') },
    { id: 'msg4', conversation_id: 'c1', sender_id: 'u3', body: 'موقعیت دیده‌بانی تثبیت شد. بخش ۴ پاکسازی شد.', media_url: null, read_at: null, created_at: '2026-07-28T11:30:00Z', sender: profileById('u3') },
  ],
  c2: [
    { id: 'msg5', conversation_id: 'c2', sender_id: 'u3', body: 'همه اعضا جهت جلسه توجیهی عملیات نایت‌فال آنلاین شوند.', media_url: null, read_at: null, created_at: '2026-07-28T09:00:00Z', sender: profileById('u3') },
    { id: 'msg6', conversation_id: 'c2', sender_id: 'me', body: 'فرماندهی آنلاین است. چک‌لیست تجهیزات را آغاز کنید.', media_url: null, read_at: null, created_at: '2026-07-28T09:30:00Z', sender: profileById('me') },
    { id: 'msg7', conversation_id: 'c2', sender_id: 'u3', body: 'ساعت صفر رأس ساعت ۲۲:۳۰ خواهد بود.', media_url: null, read_at: null, created_at: '2026-07-28T09:45:00Z', sender: profileById('u3') },
    { id: 'msg8', conversation_id: 'c2', sender_id: 'u2', body: 'النا: کلیدهای رمزنگاری کوانتومی برای نفوذ به‌روزرسانی شد.', media_url: null, read_at: null, created_at: '2026-07-28T10:15:00Z', sender: profileById('u2') },
  ],
  c3: [
    { id: 'msg9', conversation_id: 'c3', sender_id: 'u6', body: 'تله‌متری پهپادها در تمامی ایستگاه‌ها پایدار و نرمال است.', media_url: null, read_at: null, created_at: '2026-07-28T09:00:00Z', sender: profileById('u6') },
  ],
  c4: [
    { id: 'msg10', conversation_id: 'c4', sender_id: 'u5', body: 'ویکتور: بسته‌های انفجاری در طبقه زیرزمین B آماده‌سازی شدند.', media_url: null, read_at: null, created_at: '2026-07-27T18:00:00Z', sender: profileById('u5') },
  ],
  c5: [
    { id: 'msg11', conversation_id: 'c5', sender_id: 'u4', body: 'فهرست تجهیزات ارسالی به بیمارستان صحرایی تایید شد.', media_url: null, read_at: null, created_at: '2026-07-27T14:00:00Z', sender: profileById('u4') },
  ],
};

export const demoNotifications: Notification[] = [
  { id: 'n1', user_id: 'me', type: 'group_request', title: 'درخواست مجوز دسترسی تاکتیکی', body: 'ویکتور کووالف درخواست حضور در جلسه ستاد فرماندهی را ثبت کرد', icon: 'Shield', is_read: false, created_at: '2026-07-28T09:00:00Z' },
  { id: 'n2', user_id: 'me', type: 'chat', title: 'پیام امن: جکسون ریس', body: 'موقعیت دیده‌بانی تثبیت شد. بخش ۴ پاکسازی شد.', icon: 'Lock', is_read: false, created_at: '2026-07-28T11:30:00Z' },
  { id: 'n3', user_id: 'me', type: 'achievement', title: 'دریافت مدال مأموریت', body: 'مدال «استراتژیست ارشد» به دلیل رهبری ۱۰ عملیات موفق آنلاک شد.', icon: 'Award', is_read: false, created_at: '2026-07-28T08:00:00Z' },
  { id: 'n4', user_id: 'me', type: 'friend_request', title: 'ارتباط تاکتیکی جدید', body: 'النا روستوا یک درخواست لینک امن ارسال کرد.', icon: 'Radio', is_read: true, created_at: '2026-07-27T16:00:00Z' },
  { id: 'n5', user_id: 'me', type: 'group_request', title: 'تایید عضویت در مأموریت', body: 'می چن استقرار شما در عملیات تریاژ نبرد را تایید کرد.', icon: 'CheckCircle2', is_read: true, created_at: '2026-07-27T12:00:00Z' },
  { id: 'n6', user_id: 'me', type: 'subscription', title: 'سطح دسترسی امگا فعال است', body: 'وضعیت احراز هویت بیومتریک و امنیتی با موفقیت تایید شد.', icon: 'ShieldCheck', is_read: true, created_at: '2026-07-26T10:00:00Z' },
  { id: 'n7', user_id: 'me', type: 'discount', title: 'ارتقای زره در دسترس است', body: 'بخش آماد و پشتیبانی جلیقه‌های زرهی ارتقایافته ۲۰٪ را توزیع کرد.', icon: 'Zap', is_read: true, created_at: '2026-07-25T14:00:00Z' },
];

export const demoBadges: Badge[] = [
  { id: 'b1', user_id: 'me', name: 'تاکتیک‌دان ارشد', description: 'هدایت ۱۰ عملیات تاکتیکی موفق', icon: 'Shield', color: 'blue', earned_at: '2026-07-28T08:00:00Z' },
  { id: 'b2', user_id: 'me', name: 'اولین استقرار', description: 'آغاز نخستین مأموریت میدانی', icon: 'Rocket', color: 'green', earned_at: '2026-07-27T10:00:00Z' },
  { id: 'b3', user_id: 'me', name: 'مجوز امنیتی امگا', description: 'تکمیل احراز هویت بیومتریک', icon: 'ShieldCheck', color: 'amber', earned_at: '2026-07-20T10:00:00Z' },
  { id: 'b4', user_id: 'me', name: 'ارتباطات امن', description: 'ارسال ۵۰ پیام رمزگذاری‌شده', icon: 'Lock', color: 'indigo', earned_at: '2026-07-22T10:00:00Z' },
  { id: 'b5', user_id: 'me', name: 'فرمانده سطح یک', description: 'دستیابی به درجه فرماندهی ارشد', icon: 'Award', color: 'purple', earned_at: '2026-07-15T10:00:00Z' },
  { id: 'b6', user_id: 'me', name: 'کهنه‌سرباز اولیه', description: 'استقرار در فاز آزمایشی اولیه', icon: 'Sparkles', color: 'slate', earned_at: '2025-01-15T10:00:00Z' },
  { id: 'b7', user_id: 'me', name: 'گارد افتخار', description: 'حفظ نمره آمادگی بالای ۹۵ به مدت ۳۰ روز', icon: 'Check', color: 'blue', earned_at: null },
  { id: 'b8', user_id: 'me', name: 'درجه ژنرال', description: 'رسیدن به سطح ۵۰ فرماندهی', icon: 'Trophy', color: 'amber', earned_at: null },
  { id: 'b9', user_id: 'me', name: 'شناسایی سراسری', description: 'استقرار اکیپ در ۵ بخش عملیاتی مختلف', icon: 'Compass', color: 'green', earned_at: null },
];

export const demoMissions: Mission[] = [
  { id: 'ms1', user_id: 'me', title: 'استقرار ۲ اکیپ تاکتیکی', description: 'ایجاد اکیپ‌های جدید در مناطق تعیین‌شده', xp_reward: 100, icon: 'Plus', progress: 1, target: 2, is_complete: false },
  { id: 'ms2', user_id: 'me', title: 'ارسال ۱۰ پیام امن', description: 'حفظ ارتباط مداوم با سرگروه‌ها', xp_reward: 50, icon: 'Lock', progress: 7, target: 10, is_complete: false },
  { id: 'ms3', user_id: 'me', title: 'بررسی تله‌متری رادار', description: 'مشاهده مختصات زنده نقشه تاکتیکی', xp_reward: 75, icon: 'Compass', progress: 1, target: 1, is_complete: true },
  { id: 'ms4', user_id: 'me', title: 'تایید مدارک شناسایی اعضا', description: 'تایید سطوح دسترسی بیومتریک', xp_reward: 80, icon: 'ShieldCheck', progress: 3, target: 3, is_complete: true },
  { id: 'ms5', user_id: 'me', title: 'چک امنیتی مجوز امگا', description: 'دریافت کلیدهای مجوز رمزنگاری', xp_reward: 120, icon: 'Shield', progress: 1, target: 1, is_complete: true },
];

export const demoFriends: Friendship[] = [
  { id: 'f1', user_id: 'me', friend_id: 'u3', status: 'accepted', created_at: '2025-02-01T10:00:00Z', profile: profileById('u3') },
  { id: 'f2', user_id: 'me', friend_id: 'u5', status: 'accepted', created_at: '2025-02-10T10:00:00Z', profile: profileById('u5') },
  { id: 'f3', user_id: 'me', friend_id: 'u4', status: 'accepted', created_at: '2025-03-01T10:00:00Z', profile: profileById('u4') },
  { id: 'f4', user_id: 'u2', friend_id: 'me', status: 'pending', created_at: '2026-07-27T16:00:00Z', profile: profileById('u2') },
  { id: 'f5', user_id: 'me', friend_id: 'u6', status: 'accepted', created_at: '2025-04-01T10:00:00Z', profile: profileById('u6') },
];

export const cities = [
  'بخش ۷ - ستاد فرماندهی', 'بخش ۴ - پایگاه آلفا', 'بخش ۲ - قرارگاه مقدم',
  'بخش ۶ - آماد و پشتیبانی', 'بخش ۱ - یگان زرهی', 'بخش ۵ - پایگاه پهپادی',
  'بخش ۳ - محدوده شناسایی عمیق', 'بخش ۸ - ایستگاه مداری', 'پایگاه امگا', 'دژ مرکزی',
];

export const allInterests = [
  'عملیات تاکتیکی', 'شناسایی و دیده‌بانی', 'رمزنگاری', 'هدایت پهپاد', 'بقا در شرایط سخت',
  'بالستیک', 'دفاع سایبری', 'سیگنال و شنود', 'تیراندازی دقیق', 'استتار',
  'تحلیل عوارض زمین', 'تخریب', 'زره سنگین', 'تریاژ و امداد', 'پزشکی اورژانس',
  'اسکادران پهپاد', 'هدف‌گیری هوش مصنوعی', 'سیستم‌های رادار', 'جنگ الکترونیک', 'استراتژی و رهبری',
];

export const personalityTypes = [
  'ESTJ-A', 'ESTJ-T', 'ENTJ-A', 'ENTJ-T', 'INTJ-A', 'INTJ-T',
  'ISTJ-A', 'ISTJ-T', 'ISTP-A', 'ISTP-T', 'ESTP-A', 'ESTP-T',
  'ENTP-A', 'ENTP-T', 'ENFJ-A', 'ENFJ-T', 'INFJ-A', 'INFJ-T',
];
