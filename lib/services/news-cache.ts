// Simple in-memory cache for news data
// In production, consider using Redis or similar for distributed caching

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

// Cache duration in milliseconds (1 hour default)
const DEFAULT_CACHE_DURATION = 60 * 60 * 1000;

// Cache keys
export const NEWS_CACHE_KEYS = {
  LATEST_NEWS: 'latest_news',
  INDUSTRY_NEWS: 'industry_news',
  INDUSTRY_INSIGHTS: 'industry_insights',
  COMPANY_NEWS: 'company_news',
  MARKET_TRENDS: 'market_trends',
  SEARCH: 'search',
} as const;

export function setInCache<T>(
  key: string,
  data: T,
  durationMs: number = DEFAULT_CACHE_DURATION
): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + durationMs,
  });
}

export function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  // Check if expired
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function invalidateCache(key: string): void {
  cache.delete(key);
}

export function invalidateCacheByPrefix(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

export function clearAllCache(): void {
  cache.clear();
}

// Get cache stats for debugging
export function getCacheStats(): {
  size: number;
  keys: string[];
  memoryUsage: string;
} {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
    memoryUsage: `${Math.round(JSON.stringify(Array.from(cache.entries())).length / 1024)} KB`,
  };
}

// Periodic cleanup of expired entries (runs every 5 minutes if module is imported)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (now > entry.expiresAt) {
        cache.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
