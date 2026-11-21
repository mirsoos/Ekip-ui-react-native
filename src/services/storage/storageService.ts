/**
 * Storage Service: High-performance key-value persistence interface.
 * Defaults to memory storage with async storage / MMKV readiness for instant boot.
 */

class StorageService {
  private memoryCache = new Map<string, string>();

  getItem(key: string): string | null {
    return this.memoryCache.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.memoryCache.set(key, value);
  }

  removeItem(key: string): void {
    this.memoryCache.delete(key);
  }

  getJSON<T>(key: string): T | null {
    const raw = this.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  setJSON<T>(key: string, value: T): void {
    this.setItem(key, JSON.stringify(value));
  }
}

export const storageService = new StorageService();
