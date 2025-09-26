// src/services/cache.ts
const TTL = 10 * 60 * 1000; // 10 minutes

interface CacheItem<T> {
  timestamp: number;
  data: T;
}

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.local.get(key);
    if (!result[key]) {
      return null;
    }

    const item: CacheItem<T> = result[key];
    if (Date.now() - item.timestamp > TTL) {
      // Cache expired
      await chrome.storage.local.remove(key);
      return null;
    }
    
    return item.data;
  },

  async set<T>(key: string, data: T): Promise<void> {
    const item: CacheItem<T> = {
      timestamp: Date.now(),
      data,
    };
    await chrome.storage.local.set({ [key]: item });
  },
};