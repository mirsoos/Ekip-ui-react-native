import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { AIChatBubble } from '../components/ai/AIChatBubble';
import { AITypingIndicator } from '../components/ai/AITypingIndicator';
import { useI18n } from '../lib/i18n';

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
  'Help me assemble a squad',
  'Recommend operations in my sector',
  'Suggest secure rendezvous point',
  'What clearance ranks do I need for a recon unit?',
];

const suggestionsFa = [
  'کمک به تشکیل اکیپ جدید',
  'پیشنهاد اکیپ در منطقه من',
  'پیشنهاد محل تجمع مناسب',
  'شرایط ورود به اکیپ‌های شناسایی چیست؟',
];

const aiResponsesEn: Record<string, { body: string; chips?: string[] }> = {
  'help me assemble a squad': {
    body: "Commander Vance, I stand ready to assist your squad assembly:\n\n1. Primary objective? (Combat Ops or Tactical Recon)\n2. Operator roster size? (Recommend 4-8 for agile maneuvering)\n3. Assigned operational sector?\n\nBased on your dossier, a specialized Recon Patrol in Sector 4 would match your high honor score and marksmanship focus.",
    chips: ['Deploy Recon Patrol', 'Review Intel', 'Other Directives'],
  },
  'recommend operations in my sector': {
    body: "Scanning Sector 7 & adjacent forward posts:\n\n• Operation Nightfall — Sector 4 relay recon\n• Cyber Defense Simulation — Command Vault 3\n• Combat Triage Drill — Medical Bay Alpha\n\nWould you like clearance telemetry for any of these operations?",
    chips: ['Operation Nightfall', 'Cyber Defense Drill', 'Scan All Sectors'],
  },
  'suggest secure rendezvous point': {
    body: "Identified high-security muster points with encrypted communications relay:\n\n• Checkpoint Delta (Ridge Road) — High ground advantage\n• Server Vault Sub-Level B — EMP-hardened perimeter\n• Forward Airdrome Pad 4 — Direct exfil runway available\n\nTip: Encrypted radio channel 9 is designated for tactical muster coordination.",
    chips: ['Checkpoint Delta', 'Server Vault', 'Airdrome Pad 4'],
  },
  default: {
    body: "Command AI online. I can assist with:\n\n• Squad formation & tactical briefing parameters\n• Threat scanning & operation discovery\n• Biometric clearance & operator compatibility matching\n• Secure muster coordinate planning\n\nState your directive, Commander.",
    chips: ['Assemble Squad', 'Scan Operations', 'Check Clearance'],
  },
};

const aiResponsesFa: Record<string, { body: string; chips?: string[] }> = {
  'کمک به تشکیل اکیپ جدید': {
    body: "فرمانده ونس، هوش مصنوعی آماده همکاری در تشکیل اکیپ است:\n\n۱. هدف اصلی؟ (عملیات رزمی، گشت کوهستان یا دیده‌بانی)\n۲. ظرفیت نفرات؟ (برای چابکی بالا ۴ تا ۸ نفر پیشنهاد می‌شود)\n۳. منطقه و شهر محل قرار؟\n\nبا توجه به امتیاز اعتبار بالای شما (۹۹)، گشت شناسایی بخش ۴ بهترین تطابق را دارد.",
    chips: ['ثبت گشت شناسایی', 'بررسی اطلاعات میدانی', 'سایر راهنمایی‌ها'],
  },
  'پیشنهاد اکیپ در منطقه من': {
    body: "اسکن بخش ۷ و پایگاه‌های همجوار:\n\n• عملیات نایت‌فال — شناسایی خط‌الراس بخش ۴\n• مانور دفاع سایبری — ستاد فرماندهی\n• تریاژ نبرد و امداد — بیمارستان صحرایی آلفا\n\nآیا مایلید وضعیت ظرفیت یا جزئیات هر یک را بررسی کنیم؟",
    chips: ['عملیات نایت‌فال', 'مانور دفاع سایبری', 'اسکن همه بخش‌ها'],
  },
  'پیشنهاد محل تجمع مناسب': {
    body: "نقاط امن با دسترسی سریع و پوشش رادیویی:\n\n• ایستگاه بازرسی دلتا (جاده خط‌الراس) — برتری ارتفاعی\n• تالار مرکزی ستاد — امنیت حداکثری و سرپوشیده\n• سکوی ۴ باند شمالی — مناسب برای جابجایی سریع\n\nنکته: کانال رادیویی شماره ۹ برای هماهنگی تجمع تاکتیکی اختصاص یافته است.",
    chips: ['ایستگاه بازرسی دلتا', 'تالار مرکزی ستاد', 'سکوی ۴ باند'],
  },
  default: {
    body: "هوش مصنوعی اکیپ فعال است. من می‌توانم در موارد زیر به شما کمک کنم:\n\n• ساخت و هماهنگی اعضای اکیپ جدید\n• پیشنهاد بهترین اکیپ‌ها بر اساس علایق و موقعیت\n• بررسی شرایط ورود و سطح دسترسی اعضا\n• پیشنهاد محل و زمان گردهمایی امن\n\nدستور یا پرسش خود را بفرمایید، فرمانده.",
    chips: ['تشکیل اکیپ', 'پیشنهاد اکیپ در منطقه من', 'پیشنهاد محل تجمع مناسب'],
  },
};

function getAIResponse(input: string, isRTL: boolean): { body: string; chips?: string[] } {
  const lower = input.toLowerCase();
  if (isRTL) {
    if (lower.includes('تشکیل') || lower.includes('ساخت') || lower.includes('اکیپ')) {
      return aiResponsesFa['کمک به تشکیل اکیپ جدید'];
    }
    if (lower.includes('منطقه') || lower.includes('پیشنهاد') || lower.includes('فعال')) {
      return aiResponsesFa['پیشنهاد اکیپ در منطقه من'];
    }
    if (lower.includes('تجمع') || lower.includes('محل') || lower.includes('قرار')) {
      return aiResponsesFa['پیشنهاد محل تجمع مناسب'];
    }
    return aiResponsesFa.default;
  }

  if (lower.includes('squad') || lower.includes('create') || lower.includes('assemble')) {
    return aiResponsesEn['help me assemble a squad'];
  }
  if (lower.includes('recommend') || lower.includes('sector') || lower.includes('operation')) {
    return aiResponsesEn['recommend operations in my sector'];
  }
  if (lower.includes('rendezvous') || lower.includes('location') || lower.includes('point')) {
    return aiResponsesEn['suggest secure rendezvous point'];
  }
  return aiResponsesEn.default;
}

export const AIAssistant = React.forwardRef<
  AIAssistantHandle,
  { onBack: () => void }
>(function AIAssistant({ onBack }, ref) {
  const { isRTL } = useI18n();
  const suggestions = isRTL ? suggestionsFa : suggestionsEn;

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init',
      role: 'ai',
      body: isRTL
        ? "فرمانده ونس، رابط هوشمند عملیاتی فعال است. من می‌توانم در ساخت اکیپ، اسکن رویدادهای منطقه و هماهنگی محل‌های قرار به شما کمک کنم. چگونه می‌توانم شما را راهنمایی کنم؟"
        : "Commander Vance, tactical neural interface active. I can assist in assembling squads, scanning regional operations, and calculating operator clearance compatibility. How may I assist your mission?",
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
    }, 1000);
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
        contentContainerStyle={styles.messagesContent}
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: 84,
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
});
