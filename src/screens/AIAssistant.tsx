import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AIChatBubble } from '../components/ai/AIChatBubble';
import { AITypingIndicator } from '../components/ai/AITypingIndicator';
import { useI18n } from '../lib/i18n';
import { getSinglePillContentPaddingTop } from '../lib/headerLayout';

interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  body: string;
  chips?: string[];
}

export interface AIAssistantHandle {
  sendMessage: (text: string) => void;
}

const suggestionsEn = [
  'Ideas for weekend hangouts',
  'Recommend active Ekips in my city',
  'Best cafes and meeting spots',
  'How to create an attractive Ekip?',
];

const suggestionsFa = [
  'ایده برای دورهمی آخر هفته',
  'پیشنهاد اکیپ در شهر من',
  'بهترین کافه‌ها برای دورهمی',
  'چطور یک اکیپ پرطرفدار بسازم؟',
];

const aiResponsesEn: Record<string, { body: string; chips?: string[] }> = {
  'ideas for weekend hangouts': {
    body: "Here are some awesome hangout ideas for your weekend:\n\n1. **Boardgame & Coffee**: Book a cozy boardgame cafe in the afternoon for games like Catan or Avalon (5-8 friends).\n2. **Morning Hiking**: Gentle walk from Velenjak to Tochal Station 5 with group breakfast and hot tea.\n3. **Street Photography Walk**: Casual afternoon stroll exploring historical spots with fellow photography enthusiasts.\n\nWould you like me to draft an invite description for any of these?",
    chips: ['Boardgame Night', 'Tochal Hike', 'Photography Walk'],
  },
  'recommend active ekips in my city': {
    body: "Checking active community hangouts:\n\n• Boardgame Night — Thursday at Fekri Cafe\n• Morning Tochal Hiking — Friday 6:30 AM\n• Street Photography & 30 Tir Walk — Saturday 4:00 PM\n• Running & Cycling around Chitgar Lake\n\nWould you like more details on any of these groups?",
    chips: ['Boardgame Night', 'Tochal Hike', 'Chitgar Lake'],
  },
  'best cafes and meeting spots': {
    body: "Top recommended spots for group hangouts:\n\n• **Enghelab / Vesal**: Cozy cafes with spacious tables perfect for boardgames and team chats.\n• **BAM Tehran (Velenjak)**: The classic meeting point for fresh mountain air and weekend walks.\n• **Chitgar Lake**: Ideal for outdoor cycling, jogging, and scenic tea breaks.\n• **Saadat Abad**: Great Escape Room venues and mafia game spaces.",
    chips: ['Enghelab Cafes', 'BAM Tehran', 'Chitgar Lake'],
  },
  'how to create an attractive ekip?': {
    body: "Here are 4 tips to make your Ekip fill up fast:\n\n1. **Friendly & Specific Title**: e.g. 'Thursday Evening Boardgames' rather than just 'Games'.\n2. **Clear Vibes**: Mention what you will do (e.g., 'Beginners welcome, we teach the rules first!').\n3. **Exact Spot & Time**: A specific cafe and start time builds instant trust.\n4. **Add 3-5 Tags**: Like #Boardgames #Coffee #Weekend to help people find you.",
    chips: ['Create Ekip Now', 'More Tips'],
  },
  default: {
    body: "Hello! I am your Ekip AI Assistant. I can help you:\n\n• Brainstorm fun ideas for hangouts and weekend plans\n• Find active groups and cool cafes in your area\n• Write an inviting description for your new Ekip\n• Connect with people sharing your hobbies\n\nHow can I help you today?",
    chips: ['Ideas for weekend hangouts', 'Recommend active Ekips', 'Best cafes and meeting spots'],
  },
};

const aiResponsesFa: Record<string, { body: string; chips?: string[] }> = {
  'ایده برای دورهمی آخر هفته': {
    body: "با توجه به علایق و سبک زندگی، این چند ایده فوق‌العاده‌ست:\n\n۱. **دورهمی بوردگیم عصرگاهی**: رزرو میز در یک کافه بوردگیم دنج برای بازی‌های آوالون، کاتان یا کودتا (۵ تا ۸ نفر).\n۲. **کوهنوردی صبح جمعه**: پیاده‌روی سبک از ولنجک به سمت ایستگاه پنج توچال همراه با صبحانه و چای زغالی دسته‌جمعی.\n۳. **عکاسی خیابانی و کافه‌گردی**: گشت عصرگاهی در خیابان ۳۰ تیر و بافت تاریخی شهر.\n۴. **ورزش گروهی**: دویدن یا دوچرخه‌سواری دور دریاچه چیتگر.\n\nدوست داری برات متن دعوت یا جزئیات کدوم برنامه رو آماده کنم؟",
    chips: ['دورهمی بوردگیم', 'کوهنوردی توچال', 'عکاسی ۳۰ تیر'],
  },
  'پیشنهاد اکیپ در شهر من': {
    body: "بررسی اکیپ‌های فعال و پرطرفدار نزدیک شما:\n\n• **بوردگیم و کافه‌گردی** — عصر پنجشنبه در خیابان انقلاب\n• **کوهنوردی توچال** — جمعه صبح ساعت ۶:۳۰ دم بام تهران\n• **عکاسی خیابانی ۳۰ تیر** — عصر شنبه\n• **دوچرخه‌سواری و دویدن** — دور دریاچه چیتگر\n\nمایلید جزئیات یا شرایط عضویت کدوم اکیپ رو ببینید؟",
    chips: ['بوردگیم پنجشنبه', 'کوه توچال', 'دوچرخه چیتگر'],
  },
  'بهترین کافه‌ها برای دورهمی': {
    body: "چند لوکیشن عالی و محبوب برای دورهمی‌های اکیپ:\n\n• **خیابان انقلاب و وصال**: کافه‌های بوردگیم بزرگ با میزهای مناسب بازی گروهی\n• **بام تهران (ولنجک)**: بهترین محل برای قرارهای هایکینگ و کوه صبحگاهی\n• **دریاچه چیتگر**: عالی برای دورهمی‌های ورزشی، دویدن و هوای آزاد\n• **سعادت‌آباد و شهرک غرب**: بهترین مجموعه‌های اتاق فرار (Escape Room) و بازی مافیا",
    chips: ['کافه‌های انقلاب', 'بام تهران', 'دریاچه چیتگر'],
  },
  'چطور یک اکیپ پرطرفدار بسازم؟': {
    body: "برای اینکه اکیپت سریع پر بشه و اعضای باحال پیدا کنی:\n\n۱. **عنوان دوستانه و مشخص**: مثل «بوردگیم و کافه عصر پنجشنبه»\n۲. **شرح دقیق برنامه**: بنویس چه بازی‌هایی قراره انجام بشه (مثلاً «قبل از بازی آموزش می‌دیم!»)\n۳. **محل قرار و ساعت دقیق**: انتخاب یک کافه مشخص و ساعت دقیق به بچه‌ها اطمینان میده\n۴. **انتخاب تگ‌های مرتبط**: ۳ تا ۵ تگ مثل #کافه #بوردگیم #دورهمی اضافه کن.",
    chips: ['ساخت اکیپ جدید', 'ایده‌های بیشتر'],
  },
  default: {
    body: "سلام! من دستیار هوشمند اکیپ هستم. می‌تونم کمکت کنم:\n\n• ایده برای دورهمی و برنامه‌های آخر هفته بگیری\n• بهترین اکیپ‌ها و کافه‌های شهرت رو پیدا کنی\n• یک متن جذاب و خودمانی برای دعوت دوستان به اکیپت بنویسی\n• دوستان هم‌سلیقه پیدا کنی\n\nامروز چه برنامه‌ای تو ذهنته؟",
    chips: ['ایده برای دورهمی آخر هفته', 'پیشنهاد اکیپ در شهر من', 'بهترین کافه‌ها برای دورهمی'],
  },
};

function getAIResponse(input: string, isRTL: boolean): { body: string; chips?: string[] } {
  const lower = input.toLowerCase();
  if (isRTL) {
    if (lower.includes('ایده') || lower.includes('آخر هفته') || lower.includes('برنامه')) {
      return aiResponsesFa['ایده برای دورهمی آخر هفته'];
    }
    if (lower.includes('پیشنهاد') || lower.includes('شهر') || lower.includes('منطقه') || lower.includes('اکیپ')) {
      return aiResponsesFa['پیشنهاد اکیپ در شهر من'];
    }
    if (lower.includes('کافه') || lower.includes('محل') || lower.includes('مکان') || lower.includes('قرار')) {
      return aiResponsesFa['بهترین کافه‌ها برای دورهمی'];
    }
    if (lower.includes('جذاب') || lower.includes('پرطرفدار') || lower.includes('ساخت') || lower.includes('نکته')) {
      return aiResponsesFa['چطور یک اکیپ پرطرفدار بسازم؟'];
    }
    return aiResponsesFa.default;
  }

  if (lower.includes('idea') || lower.includes('weekend') || lower.includes('hangout')) {
    return aiResponsesEn['ideas for weekend hangouts'];
  }
  if (lower.includes('recommend') || lower.includes('city') || lower.includes('squad') || lower.includes('ekip')) {
    return aiResponsesEn['recommend active ekips in my city'];
  }
  if (lower.includes('cafe') || lower.includes('spot') || lower.includes('location')) {
    return aiResponsesEn['best cafes and meeting spots'];
  }
  if (lower.includes('attractive') || lower.includes('create') || lower.includes('tip')) {
    return aiResponsesEn['how to create an attractive ekip?'];
  }
  return aiResponsesEn.default;
}

export const AIAssistant = React.memo(
  React.forwardRef<
    AIAssistantHandle,
    { onBack: () => void }
  >(function AIAssistant({ onBack }, ref) {
  const insets = useSafeAreaInsets();
  const { isRTL } = useI18n();
  const suggestions = isRTL ? suggestionsFa : suggestionsEn;

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init',
      role: 'ai',
      body: isRTL
        ? "سلام! من دستیار هوشمند اکیپ هستم. می‌تونم در پیدا کردن دورهمی‌های باحال، انتخاب کافه یا برنامه‌ریزی یک اکیپ جدید کمکت کنم. چه کمکی از دستم برمی‌آید؟"
        : "Hi! I'm your Ekip AI Assistant. I can help you discover exciting hangouts, pick the best cafes, or plan a new get-together with friends. How can I help you today?",
      chips: suggestions.slice(0, 2),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages.length, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: AIMessage = { id: `u-${Date.now()}`, role: 'user', body: text };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const res = getAIResponse(text, isRTL);
      const aiMsg: AIMessage = { id: `a-${Date.now()}`, role: 'ai', body: res.body, chips: res.chips };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 800);
  };

  React.useImperativeHandle(ref, () => ({
    sendMessage: (text: string) => send(text),
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.messagesContent,
          {
            paddingTop: getSinglePillContentPaddingTop(insets.top),
            paddingBottom: 70 + insets.bottom,
          },
        ]}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((m) => (
          <AIChatBubble
            key={m.id}
            role={m.role}
            body={m.body}
            chips={m.chips}
            onSelectChip={(chip) => send(chip)}
          />
        ))}

        {typing && <AITypingIndicator />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
});
