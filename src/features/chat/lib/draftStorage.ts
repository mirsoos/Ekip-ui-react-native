/**
 * High-Performance Draft Storage Engine
 * MMKV-compatible synchronous storage with memory cache & persistent backing
 */

class DraftStorage {
  private cache = new Map<string, string>();
  private storageKeyPrefix = 'chat_draft_';

  constructor() {
    this.hydrate();
  }

  private hydrate() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(this.storageKeyPrefix)) {
            const convId = key.substring(this.storageKeyPrefix.length);
            const val = window.localStorage.getItem(key);
            if (val) {
              this.cache.set(convId, val);
            }
          }
        }
      }
    } catch {
      // Graceful fallback for non-browser or sandbox environments
    }
  }

  getDraft(conversationId: string): string {
    return this.cache.get(conversationId) || '';
  }

  saveDraft(conversationId: string, text: string): void {
    const trimmed = text.trim();
    if (!trimmed) {
      this.clearDraft(conversationId);
      return;
    }

    this.cache.set(conversationId, text);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`${this.storageKeyPrefix}${conversationId}`, text);
      }
    } catch {
      // Ignore storage quota or environment issues
    }
  }

  clearDraft(conversationId: string): void {
    this.cache.delete(conversationId);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(`${this.storageKeyPrefix}${conversationId}`);
      }
    } catch {
      // Ignore
    }
  }

  getAllDrafts(): Record<string, string> {
    const result: Record<string, string> = {};
    this.cache.forEach((val, key) => {
      result[key] = val;
    });
    return result;
  }

  // Standard MMKV synchronous key-value interface
  getString(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: string): void {
    this.cache.set(key, value);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  }

  delete(key: string): void {
    this.cache.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  }
}

export const draftStorage = new DraftStorage();
