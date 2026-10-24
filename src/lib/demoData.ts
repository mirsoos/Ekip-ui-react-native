import type {
  Profile, Group, GroupMember, GroupRequest, Conversation, Message,
  Notification, Badge, Mission, Friendship,
} from '../types/database';

// Real lifestyle avatars and covers
const av = (seed: string) => `https://images.pexels.com/photos/${seed}/pexels-photo-${seed}.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop`;
const cover = (seed: string) => `https://images.pexels.com/photos/${seed}/pexels-photo-${seed}.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop`;

export const demoProfiles: Profile[] = [
  {
    id: 'me', username: 'amir.saberi', first_name: 'امیررضا', last_name: 'صابری',
    email: 'amir.saberi@ekip.app', phone: '+98 912 345 6789', gender: 'male', age: 28,
    city: 'تهران - سعادت‌آباد', job: 'طراح محصول و UX', bio: 'عاشق بوردگیم‌های استراتژیک، قهوه دمی و پیاده‌روی عصرگاهی. دنبال بچه‌های باحال و پایه‌کار برای کافه‌گردی، تماشای فیلم و هایکینگ آخر هفته.',
    avatar_url: av('220453'), banner_url: cover('355465'),
    interests: ['بوردگیم', 'کافه‌گردی', 'طراحی محصول', 'سینما', 'کوهنوردی', 'عکاسی'],
    personality_type: 'ENFP-A', social_links: { telegram: 'amirsaberi', instagram: 'amir.ux' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 18, xp: 4850, xp_to_next: 5000, honor_score: 98, reputation_level: 'میزبان برتر',
    mood: 'پایه دورهمی و سفر ☕🎲', created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'u2', username: 'sara.rad', first_name: 'سارا', last_name: 'راد',
    email: null, phone: null, gender: 'female', age: 26, city: 'تهران - انقلاب',
    job: 'عکاس پرتره و دیجیتال مارکتر', bio: 'عاشق عکاسی خیابانی، موزیک ایندی و سر زدن به کافه‌های دنج با معماری قدیمی. پایه‌ ثابت ایونت‌های فرهنگی و نمایشگاه‌های هنری.',
    avatar_url: av('774909'), banner_url: cover('1103970'),
    interests: ['عکاسی', 'کافه', 'موسیقی ایندی', 'هنر', 'تهران‌گردی'],
    personality_type: 'INFP-A', social_links: { instagram: 'sara.rad.art' },
    is_premium: false, is_verified: true, is_identity_verified: true,
    level: 14, xp: 3200, xp_to_next: 4000, honor_score: 96, reputation_level: 'عضو فعال',
    mood: 'دنبال لوکیشن‌های خفن عکاسی 📷', created_at: '2025-02-01T10:00:00Z',
  },
  {
    id: 'u3', username: 'pouria.sh', first_name: 'پوریا', last_name: 'شایان',
    email: null, phone: null, gender: 'male', age: 31, city: 'تهران - تجریش',
    job: 'توسعه‌دهنده فرانت‌اند و عاشق کوه', bio: 'برنامه‌نویس ری‌اکت در روز، کوهنورد و طبیعت‌گرد در تعطیلات! جمعه‌ها توچالم، اگه پایه کوه و چای زغالی هستی حتماً پیام بده.',
    avatar_url: av('1043471'), banner_url: cover('1640777'),
    interests: ['کوهنوردی', 'کمپینگ', 'برنامه‌نویسی', 'طبیعت', 'بوردگیم'],
    personality_type: 'ISTP-A', social_links: { github: 'pouriash', telegram: 'pouria_sh' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 22, xp: 6400, xp_to_next: 7000, honor_score: 99, reputation_level: 'هم‌سفر طلایی',
    mood: 'جمعه بریم کوه؟ ⛰️⛺', created_at: '2024-12-10T10:00:00Z',
  },
  {
    id: 'u4', username: 'negin.m', first_name: 'نگین', last_name: 'میرزایی',
    email: null, phone: null, gender: 'female', age: 25, city: 'تهران - ولیعصر',
    job: 'مترجم و منتقد فیلم', bio: 'سینمادوست، عاشق تحلیل فیلم‌های مستقل و بازی مافیا. کتاب و چای همیشه همراهمه. پنجشنبه‌ها دورهمی فیلم و بحث سینمایی داریم.',
    avatar_url: av('762020'), banner_url: cover('167964'),
    interests: ['سینما و تئاتر', 'کتاب‌خوانی', 'مافیا', 'ترجمه', 'پادکست'],
    personality_type: 'INFJ-A', social_links: { telegram: 'negin_cinema' },
    is_premium: false, is_verified: true, is_identity_verified: false,
    level: 11, xp: 2300, xp_to_next: 3000, honor_score: 94, reputation_level: 'عضو فعال',
    mood: 'پیشنهاد فیلم خوب دارین؟ 🎬🍿', created_at: '2025-03-20T10:00:00Z',
  },
  {
    id: 'u5', username: 'alireza.k', first_name: 'علیرضا', last_name: 'کریمی',
    email: null, phone: null, gender: 'male', age: 29, city: 'تهران - دریاچه چیتگر',
    job: 'مربی تناسب اندام و دونده', bio: 'ورزش یعنی سبک زندگی. آخر هفته‌ها دویدن دور دریاچه چیتگر و دوچرخه‌سواری گروهی. خوشحال می‌شم به گروهمون اضافه بشید.',
    avatar_url: av('1220794'), banner_url: cover('1677256'),
    interests: ['دویدن', 'دوچرخه‌سواری', 'فیتنس', 'تغذیه سالم', 'ورزش'],
    personality_type: 'ESTP-A', social_links: { instagram: 'alireza_fit' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 16, xp: 4100, xp_to_next: 5000, honor_score: 97, reputation_level: 'ورزشکار حرفه‌ای',
    mood: 'انرژی مثبت و تحرک 💪🏃', created_at: '2025-01-28T10:00:00Z',
  },
  {
    id: 'u6', username: 'mahsa.n', first_name: 'مهسا', last_name: 'ناصری',
    email: null, phone: null, gender: 'female', age: 27, city: 'تهران - شهرک غرب',
    job: 'معمار و طراح داخلی', bio: 'عاشق معماری مدرن، گالری‌های هنری و بازی‌های فکری اتاق فرار (Escape Room). همیشه دنبال تجربه‌های جدید و هیجان‌انگیزم.',
    avatar_url: av('1130626'), banner_url: cover('2425567'),
    interests: ['معماری', 'اتاق فرار', 'گالری‌گردی', 'بوردگیم', 'سفر'],
    personality_type: 'ENTJ-A', social_links: { instagram: 'mahsa_arch' },
    is_premium: false, is_verified: true, is_identity_verified: false,
    level: 13, xp: 2900, xp_to_next: 3500, honor_score: 95, reputation_level: 'عضو فعال',
    mood: 'پایه اتاق فرار و هیجان 🗝️✨', created_at: '2025-02-14T10:00:00Z',
  },
];

const profileById = (id: string) => demoProfiles.find((p) => p.id === id)!;

export const demoGroups: Group[] = [
  {
    id: 'g1', owner_id: 'u3', title: 'کوهنوردی و طبیعت‌گردی توچال تا ایستگاه پنج',
    description: 'جمعه صبح ساعت ۶:۳۰ دم ورودی تله‌کابین ولنجک جمع می‌شیم. پیاده‌روی شاداب با ریتم متوسط، صرف صبحانه دسته‌جمعی و چای زغالی در ایستگاه پنج. کفش کتونی مناسب یا ترکینگ و بطری آب همراه داشته باشید.',
    category: 'entertainment', group_type: 'group', min_members: 4, max_members: 14,
    city: 'تهران - تجریش', location_name: 'بام تهران، جلوی ایستگاه اول تله‌کابین توچال',
    latitude: 35.8197, longitude: 51.4057,
    tags: ['کوهنوردی', 'توچال', 'صبح جمعه', 'طبیعت', 'ورزش'],
    age_min: 20, age_max: 45, required_level: 5, required_honor: 80,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('1640777'),
    premium_only: false, visibility: 'public', auto_accept: false, is_repeating: true,
    event_date: '2026-08-02T06:30:00Z', views: 842, member_count: 8, created_at: '2026-07-20T10:00:00Z',
    owner: profileById('u3'),
  },
  {
    id: 'g2', owner_id: 'me', title: 'دورهمی بوردگیم و کافه‌گردی عصر پنجشنبه',
    description: 'قراره توی یک کافه دنج در خیابان انقلاب دور هم جمع بشیم و چند دست بازی‌های باحال مثل آوالون، کاتان، کودتا و سکرت هیتلر بزنیم. فرقی نداره بار اولتونه یا حرفه‌ای هستید، قبل از شروع آموزش می‌دیم!',
    category: 'entertainment', group_type: 'group', min_members: 5, max_members: 12,
    city: 'تهران - انقلاب', location_name: 'کافه بوردگیم فکری، خیابان انقلاب، نزدیک دانشگاه تهران',
    latitude: 35.7012, longitude: 51.3912,
    tags: ['بوردگیم', 'کافه', 'بازی فکری', 'پنجشنبه', 'دورهمی'],
    age_min: 19, age_max: 38, required_level: 3, required_honor: 85,
    gender_preference: 'any', avg_cost: 120000, cover_url: cover('3184292'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-06T17:30:00Z', views: 1250, member_count: 10, created_at: '2026-07-18T10:00:00Z',
    owner: profileById('me'),
  },
  {
    id: 'g3', owner_id: 'u2', title: 'عکاسی خیابانی و پیاده‌روی در بافت تاریخی ۳۰ تیر',
    description: 'عکاسی از حال‌وهوای خیابان سی تیر، سردر باغ ملی و کوچه‌های قدیمی تهران. فرصت عالی برای بچه‌های علاقه‌مند به عکاسی موبایلی و دوربینی برای اشتراک تجربیات و نوشیدن قهوه در کافه گل رضاییه.',
    category: 'entertainment', group_type: 'group', min_members: 3, max_members: 8,
    city: 'تهران - ۳۰ تیر', location_name: 'جلوی موزه ملی ایران، ابتدای خیابان ۳۰ تیر',
    latitude: 35.6892, longitude: 51.4133,
    tags: ['عکاسی', 'تهران‌گردی', 'هنر', 'کافه'],
    age_min: 18, age_max: 40, required_level: 2, required_honor: 70,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('1103970'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: false,
    event_date: '2026-08-04T16:00:00Z', views: 560, member_count: 6, created_at: '2026-07-25T10:00:00Z',
    owner: profileById('u2'),
  },
  {
    id: 'g4', owner_id: 'u5', title: 'دویدن و دوچرخه‌سواری گروهی دور دریاچه چیتگر',
    description: 'تمرین ورزشی با ریتم سبک و دوستانه دور دریاچه شهدای خلیج فارس. ۳ دور پیاده‌روی تند و دویدن سبک و در پایان گپ‌وگفت و آبمیوه طبیعی در کنار دریاچه. همراه با گرم کردن اصولی.',
    category: 'entertainment', group_type: 'group', min_members: 4, max_members: 15,
    city: 'تهران - چیتگر', location_name: 'ورودی غربی دریاچه چیتگر، کنار پیست دوچرخه',
    latitude: 35.7483, longitude: 51.2186,
    tags: ['ورزش', 'دویدن', 'دوچرخه', 'چیتگر', 'سلامتی'],
    age_min: 18, age_max: 50, required_level: 1, required_honor: 75,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('1654748'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-03T07:00:00Z', views: 667, member_count: 9, created_at: '2026-07-22T10:00:00Z',
    owner: profileById('u5'),
  },
  {
    id: 'g5', owner_id: 'u6', title: 'شب هیجان‌انگیز اتاق فرار (Escape Room) و بازی مافیا',
    description: 'می‌خوایم یکی از جذاب‌ترین اتاق فرارهای غرب تهران با ژانر معمایی-هیجانی رو رزرو کنیم و بعدش بریم کافه برای بازی مافیا با نقش‌های جدید. کسانی که عاشق حل معما و آدرنالین هستن خوش اومدن!',
    category: 'entertainment', group_type: 'group', min_members: 5, max_members: 8,
    city: 'تهران - سعادت‌آباد', location_name: 'مجموعه اسکیپ روم سعادت‌آباد، بلوار شهرداری',
    latitude: 35.7831, longitude: 51.3719,
    tags: ['اتاق فرار', 'مافیا', 'هیجان', 'بازی'],
    age_min: 19, age_max: 35, required_level: 4, required_honor: 85,
    gender_preference: 'any', avg_cost: 250000, cover_url: cover('1677256'),
    premium_only: false, visibility: 'public', auto_accept: false, is_repeating: false,
    event_date: '2026-08-07T19:00:00Z', views: 720, member_count: 6, created_at: '2026-07-26T10:00:00Z',
    owner: profileById('u6'),
  },
  {
    id: 'g6', owner_id: 'u4', title: 'ورکشاپ آزاد برنامه‌نویسی و شبکه‌سازی فریلنسرها',
    description: 'کار اشتراکی، تبادل ایده درباره پروژه‌های تک، ری‌اکت، هوش مصنوعی و طراحی محصول. لپ‌تاپ‌هاتون رو بیارید؛ هم فضایی برای تمرکز و کار فردی داریم و هم فرصتی برای گپ زدن و پیدا کردن هم‌تیمی استارتاپ.',
    category: 'work', group_type: 'group', min_members: 4, max_members: 16,
    city: 'تهران - کارخانه نوآوری', location_name: 'فضای کار اشتراکی کارخانه نوآوری آزادی، سوله اول',
    latitude: 35.7005, longitude: 51.3125,
    tags: ['تک', 'برنامه‌نویسی', 'استارتاپ', 'شبکه‌سازی', 'طراحی'],
    age_min: 20, age_max: 42, required_level: 5, required_honor: 80,
    gender_preference: 'any', avg_cost: 80000, cover_url: cover('6952383'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-05T15:00:00Z', views: 889, member_count: 12, created_at: '2026-07-27T10:00:00Z',
    owner: profileById('u4'),
  },
];

export const demoMembers: GroupMember[] = [
  { id: 'm1', group_id: 'g1', user_id: 'u3', role: 'owner', status: 'active', joined_at: '2026-07-20T10:00:00Z', profile: profileById('u3') },
  { id: 'm2', group_id: 'g1', user_id: 'me', role: 'member', status: 'active', joined_at: '2026-07-21T10:00:00Z', profile: profileById('me') },
  { id: 'm3', group_id: 'g1', user_id: 'u5', role: 'member', status: 'active', joined_at: '2026-07-22T10:00:00Z', profile: profileById('u5') },
  { id: 'm4', group_id: 'g2', user_id: 'me', role: 'owner', status: 'active', joined_at: '2026-07-18T10:00:00Z', profile: profileById('me') },
  { id: 'm5', group_id: 'g2', user_id: 'u2', role: 'member', status: 'active', joined_at: '2026-07-19T10:00:00Z', profile: profileById('u2') },
  { id: 'm6', group_id: 'g2', user_id: 'u6', role: 'member', status: 'active', joined_at: '2026-07-23T10:00:00Z', profile: profileById('u6') },
  { id: 'm7', group_id: 'g3', user_id: 'u2', role: 'owner', status: 'active', joined_at: '2026-07-25T10:00:00Z', profile: profileById('u2') },
  { id: 'm8', group_id: 'g3', user_id: 'me', role: 'member', status: 'active', joined_at: '2026-07-26T10:00:00Z', profile: profileById('me') },
  { id: 'm9', group_id: 'g3', user_id: 'u4', role: 'member', status: 'active', joined_at: '2026-07-27T10:00:00Z', profile: profileById('u4') },
];

export const demoRequests: GroupRequest[] = [
  { id: 'r1', group_id: 'g2', user_id: 'u5', status: 'pending', message: 'سلام امیررضا جان! خیلی دوست دارم به دورهمی بوردگیم پنجشنبه بیام.', created_at: '2026-07-28T09:00:00Z', group: demoGroups[1], profile: profileById('u5') },
  { id: 'r2', group_id: 'g2', user_id: 'u3', status: 'pending', message: 'سلام، منم بوردگیم کاتان رو با خودم میارم اگه جا هست.', created_at: '2026-07-28T10:00:00Z', group: demoGroups[1], profile: profileById('u3') },
  { id: 'r3', group_id: 'g2', user_id: 'u4', status: 'pending', message: null, created_at: '2026-07-28T11:00:00Z', group: demoGroups[1], profile: profileById('u4') },
  { id: 'r4', group_id: 'g1', user_id: 'me', status: 'accepted', message: 'سلام پوریا، جمعه حتماً میام کوه.', created_at: '2026-07-28T08:00:00Z', group: demoGroups[0], profile: profileById('me') },
  { id: 'r5', group_id: 'g5', user_id: 'me', status: 'pending', message: 'سلام مهسا، منم برای اتاق فرار پایه هستم!', created_at: '2026-07-27T08:00:00Z', group: demoGroups[4], profile: profileById('me') },
];

export const demoConversations: Conversation[] = [
  { id: 'c1', type: 'direct', title: 'پوریا شایان (کوهنوردی)', avatar_url: av('1043471'), group_id: null, last_message: 'عالیه امیررضا، من فلاسک چای و صبحانه رو هماهنگ می‌کنم.', last_message_at: '2026-07-28T11:30:00Z', unread_count: 2 },
  { id: 'c2', type: 'group', title: 'گپ اکیپ بوردگیم عصر پنجشنبه', avatar_url: cover('3184292'), group_id: 'g2', last_message: 'سارا: بچه‌ها من بازی آوالون و سکرت هیتلر رو آوردم!', last_message_at: '2026-07-28T10:15:00Z', unread_count: 3 },
  { id: 'c3', type: 'direct', title: 'مهسا ناصری', avatar_url: av('1130626'), group_id: null, last_message: 'سانس اتاق فرار برای جمعه ساعت ۷ عصر اوکی شد.', last_message_at: '2026-07-28T09:00:00Z', unread_count: 0 },
  { id: 'c4', type: 'group', title: 'اکیپ عکاسی ۳۰ تیر و بافت تاریخی', avatar_url: cover('1103970'), group_id: 'g3', last_message: 'نگین: ساعت ۴ جلوی سردر باغ ملی می‌بینمتون.', last_message_at: '2026-07-27T18:00:00Z', unread_count: 0 },
  { id: 'c5', type: 'direct', title: 'علیرضا کریمی (ورزش چیتگر)', avatar_url: av('1220794'), group_id: null, last_message: 'فردا صبح ساعت ۷ پیست چیتگر یادت نره!', last_message_at: '2026-07-27T14:00:00Z', unread_count: 0 },
];

export const demoMessages: Record<string, Message[]> = {
  c1: [
    { id: 'msg1', conversation_id: 'c1', sender_id: 'u3', body: 'سلام امیررضا! برنامه جمعه قطعیه، ساعت ۶:۳۰ دم ولنجک منتظرتیم.', media_url: null, read_at: '2026-07-28T11:00:00Z', created_at: '2026-07-28T11:00:00Z', sender: profileById('u3') },
    { id: 'msg2', conversation_id: 'c1', sender_id: 'me', body: 'سلام پوریا، حتماً! کفش مناسب و بادگیر آماده کردم.', media_url: null, read_at: null, created_at: '2026-07-28T11:10:00Z', sender: profileById('me') },
    { id: 'msg3', conversation_id: 'c1', sender_id: 'u3', body: 'دمت گرم، چند نفر از بچه‌های جدید هم میان، قراره خیلی خوش بگذره.', media_url: null, read_at: null, created_at: '2026-07-28T11:20:00Z', sender: profileById('u3') },
    { id: 'msg4', conversation_id: 'c1', sender_id: 'u3', body: 'عالیه امیررضا، من فلاسک چای و صبحانه رو هماهنگ می‌کنم.', media_url: null, read_at: null, created_at: '2026-07-28T11:30:00Z', sender: profileById('u3') },
  ],
  c2: [
    { id: 'msg5', conversation_id: 'c2', sender_id: 'me', body: 'سلام بچه‌ها! میز برای ساعت ۵:۳۰ کافه رزرو شده.', media_url: null, read_at: null, created_at: '2026-07-28T09:00:00Z', sender: profileById('me') },
    { id: 'msg6', conversation_id: 'c2', sender_id: 'u6', body: 'سلام، عالیه! من تا ۵:۴۵ خودمو می‌رسونم.', media_url: null, read_at: null, created_at: '2026-07-28T09:30:00Z', sender: profileById('u6') },
    { id: 'msg7', conversation_id: 'c2', sender_id: 'u2', body: 'سارا: بچه‌ها من بازی آوالون و سکرت هیتلر رو آوردم!', media_url: null, read_at: null, created_at: '2026-07-28T10:15:00Z', sender: profileById('u2') },
  ],
  c3: [
    { id: 'msg9', conversation_id: 'c3', sender_id: 'u6', body: 'سانس اتاق فرار برای جمعه ساعت ۷ عصر اوکی شد.', media_url: null, read_at: null, created_at: '2026-07-28T09:00:00Z', sender: profileById('u6') },
  ],
  c4: [
    { id: 'msg10', conversation_id: 'c4', sender_id: 'u4', body: 'نگین: ساعت ۴ جلوی سردر باغ ملی می‌بینمتون.', media_url: null, read_at: null, created_at: '2026-07-27T18:00:00Z', sender: profileById('u4') },
  ],
  c5: [
    { id: 'msg11', conversation_id: 'c5', sender_id: 'u5', body: 'فردا صبح ساعت ۷ پیست چیتگر یادت نره!', media_url: null, read_at: null, created_at: '2026-07-27T14:00:00Z', sender: profileById('u5') },
  ],
};

export const demoNotifications: Notification[] = [
  { id: 'n1', user_id: 'me', type: 'group_request', title: 'درخواست پیوستن به اکیپ', body: 'علیرضا کریمی درخواست عضویت در دورهمی بوردگیم پنجشنبه را دارد.', icon: 'Users', is_read: false, created_at: '2026-07-28T09:00:00Z' },
  { id: 'n2', user_id: 'me', type: 'chat', title: 'پیام از پوریا شایان', body: 'عالیه امیررضا، من فلاسک چای و صبحانه رو هماهنگ می‌کنم.', icon: 'MessageCircle', is_read: false, created_at: '2026-07-28T11:30:00Z' },
  { id: 'n3', user_id: 'me', type: 'achievement', title: 'دریافت نشان جدید 🎉', body: 'نشان «پایه‌ترین فرد اکیپ» به دلیل حضور در ۵ دورهمی موفق برای شما فعال شد.', icon: 'Award', is_read: false, created_at: '2026-07-28T08:00:00Z' },
  { id: 'n4', user_id: 'me', type: 'friend_request', title: 'درخواست دوستی جدید', body: 'سارا راد به شما درخواست دوستی داد.', icon: 'UserPlus', is_read: true, created_at: '2026-07-27T16:00:00Z' },
  { id: 'n5', user_id: 'me', type: 'group_request', title: 'تایید عضویت در دورهمی', body: 'پوریا شایان عضویت شما در برنامه کوهنوردی توچال را تایید کرد.', icon: 'CheckCircle2', is_read: true, created_at: '2026-07-27T12:00:00Z' },
  { id: 'n6', user_id: 'me', type: 'subscription', title: 'اشتراک پریمیوم اکیپ', body: 'نشان اصالت و تایید حساب کاربری شما با موفقیت فعال است.', icon: 'ShieldCheck', is_read: true, created_at: '2026-07-26T10:00:00Z' },
  { id: 'n7', user_id: 'me', type: 'discount', title: 'تخفیف ویژه کافه‌های منتخب', body: '۲۰٪ تخفیف اختصاصی اعضای اکیپ برای کافه‌های اطراف میدان انقلاب.', icon: 'Coffee', is_read: true, created_at: '2026-07-25T14:00:00Z' },
];

export const demoBadges: Badge[] = [
  { id: 'b1', user_id: 'me', name: 'میزبان برتر', description: 'برگزاری بیش از ۵ دورهمی با امتیاز عالی', icon: 'Award', color: 'amber', earned_at: '2026-07-28T08:00:00Z' },
  { id: 'b2', user_id: 'me', name: 'اولین دورهمی', description: 'پیوستن به نخستین اکیپ در برنامه', icon: 'Sparkles', color: 'green', earned_at: '2026-07-27T10:00:00Z' },
  { id: 'b3', user_id: 'me', name: 'کاربر تاییدشده', description: 'تکمیل احراز هویت و اطلاعات پروفایل', icon: 'ShieldCheck', color: 'blue', earned_at: '2026-07-20T10:00:00Z' },
  { id: 'b4', user_id: 'me', name: 'پایه ثابت کافه', description: 'حضور در ۳ دورهمی کافه‌گردی', icon: 'Coffee', color: 'amber', earned_at: '2026-07-22T10:00:00Z' },
  { id: 'b5', user_id: 'me', name: 'مغز متفکر بوردگیم', description: 'مشارکت در بازی‌های فکری و گروهی', icon: 'Trophy', color: 'purple', earned_at: '2026-07-15T10:00:00Z' },
  { id: 'b6', user_id: 'me', name: 'طبیعت‌گرد', description: 'همراهی در برنامه‌های هایکینگ و کوه', icon: 'Compass', color: 'green', earned_at: '2025-01-15T10:00:00Z' },
  { id: 'b7', user_id: 'me', name: 'خوش‌قول‌ترین', description: 'حفظ نمره خوش‌قولی بالای ۹۵ در دورهمی‌ها', icon: 'Check', color: 'blue', earned_at: null },
  { id: 'b8', user_id: 'me', name: 'سوپر استار اکیپ', description: 'رسیدن به سطح ۲۰ فعالیت و تعامل اجتماعی', icon: 'Star', color: 'amber', earned_at: null },
  { id: 'b9', user_id: 'me', name: 'سفیر ارتباطات', description: 'عضویت در اکیپ‌های ۵ نقطه مختلف شهر', icon: 'Users', color: 'indigo', earned_at: null },
];

export const demoMissions: Mission[] = [
  { id: 'ms1', user_id: 'me', title: 'ساخت اولین دورهمی', description: 'یک اکیپ جدید برای برنامه مورد علاقه‌ات بساز', xp_reward: 100, icon: 'Plus', progress: 1, target: 1, is_complete: true },
  { id: 'ms2', user_id: 'me', title: 'گپ و گفتگو در چت اکیپ', description: 'ارسال ۵ پیام در چت گروهی اکیپ‌ها', xp_reward: 50, icon: 'MessageCircle', progress: 4, target: 5, is_complete: false },
  { id: 'ms3', user_id: 'me', title: 'پیدا کردن اکیپ‌های نزدیک', description: 'بررسی اکیپ‌های فعال در محله خودت', xp_reward: 75, icon: 'Compass', progress: 1, target: 1, is_complete: true },
  { id: 'ms4', user_id: 'me', title: 'تکمیل اطلاعات و علایق', description: 'انتخاب حداقل ۵ مورد از علایق در پروفایل', xp_reward: 80, icon: 'Heart', progress: 6, target: 5, is_complete: true },
  { id: 'ms5', user_id: 'me', title: 'شرکت در ۳ دورهمی آخر هفته', description: 'حضور در اکیپ‌های کافه، کوه یا ورزش', xp_reward: 120, icon: 'Users', progress: 2, target: 3, is_complete: false },
];

export const demoFriends: Friendship[] = [
  { id: 'f1', user_id: 'me', friend_id: 'u3', status: 'accepted', created_at: '2025-02-01T10:00:00Z', profile: profileById('u3') },
  { id: 'f2', user_id: 'me', friend_id: 'u2', status: 'accepted', created_at: '2025-02-10T10:00:00Z', profile: profileById('u2') },
  { id: 'f3', user_id: 'me', friend_id: 'u6', status: 'accepted', created_at: '2025-03-01T10:00:00Z', profile: profileById('u6') },
  { id: 'f4', user_id: 'u5', friend_id: 'me', status: 'pending', created_at: '2026-07-27T16:00:00Z', profile: profileById('u5') },
  { id: 'f5', user_id: 'me', friend_id: 'u4', status: 'accepted', created_at: '2025-04-01T10:00:00Z', profile: profileById('u4') },
];

export const cities = [
  'تهران - انقلاب و مرکز', 'تهران - سعادت‌آباد و شهرک غرب', 'تهران - تجریش و شمال',
  'تهران - ولیعصر', 'تهران - دریاچه چیتگر', 'تهران - اکباتان',
  'اصفهان - چهارباغ', 'شیراز - ارم', 'کرج - مهرشهر', 'مشهد - وکیل‌آباد',
];

export const allInterests = [
  'کافه‌گردی', 'بوردگیم', 'کوهنوردی', 'عکاسی', 'سینما و فیلم',
  'مافیا', 'اتاق فرار', 'ورزش و فیتنس', 'دویدن', 'دوچرخه‌سواری',
  'کمپینگ و سفر', 'موسیقی و کنسرت', 'برنامه‌نویسی و تک', 'کتاب‌خوانی', 'طراحی و هنر',
  'زبان انگلیسی', 'پادکست', 'غذا و رستوران‌گردی', 'پدل و تنیس', 'توسعه فردی',
];

export const personalityTypes = [
  'ENFP-A', 'ENFP-T', 'INFP-A', 'INFP-T', 'ENTP-A', 'ENTP-T',
  'INTJ-A', 'INTJ-T', 'INFJ-A', 'INFJ-T', 'ESTP-A', 'ESTP-T',
  'ESFP-A', 'ESFP-T', 'ISTP-A', 'ISTP-T', 'ENTJ-A', 'ENTJ-T',
];
