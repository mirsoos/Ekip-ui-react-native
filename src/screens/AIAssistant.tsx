import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { AIChatBubble } from '../components/ai/AIChatBubble';
import { AITypingIndicator } from '../components/ai/AITypingIndicator';

interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  body: string;
  chips?: string[];
}

export interface AIAssistantHandle {
  sendMessage: (text: string) => void;
}

const suggestions = [
  'Help me assemble a squad',
  'Recommend operations in my sector',
  'Suggest secure rendezvous point',
  'What clearance ranks do I need for a recon unit?',
];

const aiResponses: Record<string, { body: string; chips?: string[] }> = {
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

function getAIResponse(input: string): { body: string; chips?: string[] } {
  const lower = input.toLowerCase();
  if (lower.includes('squad') || lower.includes('create') || lower.includes('assemble')) {
    return aiResponses['help me assemble a squad'];
  }
  if (lower.includes('recommend') || lower.includes('sector') || lower.includes('operation')) {
    return aiResponses['recommend operations in my sector'];
  }
  if (lower.includes('rendezvous') || lower.includes('location') || lower.includes('point')) {
    return aiResponses['suggest secure rendezvous point'];
  }
  return aiResponses.default;
}

export const AIAssistant = React.forwardRef<
  AIAssistantHandle,
  { onBack: () => void }
>(function AIAssistant({ onBack }, ref) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init',
      role: 'ai',
      body: "Commander Vance, tactical neural interface active. I can assist in assembling squads, scanning regional operations, and calculating operator clearance compatibility. How may I assist your mission?",
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
      const res = getAIResponse(text);
      const aiMsg: AIMessage = { id: `a-${Date.now()}`, role: 'ai', body: res.body, chips: res.chips };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1100);
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
