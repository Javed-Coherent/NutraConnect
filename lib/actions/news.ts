'use server';

import { NewsItem } from '../types';
import {
  searchNutraceuticalNews,
  getIndustryInsights as getPerplexityInsights,
  getCompanyNews as getPerplexityCompanyNews,
  getMarketTrends as getPerplexityMarketTrends,
  isPerplexityConfigured,
} from '../services/perplexity';
import { getLatestNews, getIndustryNews, getNewsByCategory, news } from '../data/news';
import { getFromCache, setInCache, NEWS_CACHE_KEYS } from '../services/news-cache';

// Fetch latest news with Perplexity fallback to static data
export async function fetchLatestNewsAction(
  category?: 'company' | 'industry' | 'regulatory',
  limit: number = 5
): Promise<{ news: NewsItem[]; isLive: boolean }> {
  // Check cache first
  const cacheKey = category
    ? `${NEWS_CACHE_KEYS.LATEST_NEWS}_${category}`
    : NEWS_CACHE_KEYS.LATEST_NEWS;
  const cached = getFromCache<NewsItem[]>(cacheKey);

  if (cached) {
    console.log('[News] Returning cached news');
    return { news: cached.slice(0, limit), isLive: true };
  }

  // Try Perplexity API if configured
  const isConfigured = isPerplexityConfigured();
  console.log('[News] Perplexity configured:', isConfigured);

  if (isConfigured) {
    try {
      console.log('[News] Calling Perplexity API...');
      const liveNews = await searchNutraceuticalNews(category, limit);
      console.log('[News] Perplexity returned:', liveNews.length, 'items');

      if (liveNews.length > 0) {
        setInCache(cacheKey, liveNews);
        return { news: liveNews, isLive: true };
      }
    } catch (error) {
      console.error('Perplexity API error, falling back to static data:', error);
    }
  }

  // Fallback to static data
  console.log('[News] Using static fallback data');
  const staticNews = category ? getNewsByCategory(category) : getLatestNews(limit);
  return { news: staticNews.slice(0, limit), isLive: false };
}

// Fetch industry insights
export async function fetchIndustryInsightsAction(
  topic: string
): Promise<{ insights: string; isLive: boolean }> {
  const cacheKey = `${NEWS_CACHE_KEYS.INDUSTRY_INSIGHTS}_${topic.toLowerCase().replace(/\s+/g, '_')}`;
  const cached = getFromCache<string>(cacheKey);

  if (cached) {
    return { insights: cached, isLive: true };
  }

  if (isPerplexityConfigured()) {
    try {
      const insights = await getPerplexityInsights(topic);
      setInCache(cacheKey, insights);
      return { insights, isLive: true };
    } catch (error) {
      console.error('Perplexity API error for insights:', error);
    }
  }

  // Fallback to generic insights
  const fallbackInsights = `The ${topic} segment of the Indian nutraceutical industry continues to show strong growth.
Key trends include:
- Increasing consumer awareness about preventive healthcare
- Growing demand for natural and organic supplements
- Rising e-commerce penetration in health products
- Regulatory developments supporting industry growth

For real-time insights, please configure your Perplexity API key.`;

  return { insights: fallbackInsights, isLive: false };
}

// Fetch company-specific news
export async function fetchCompanyNewsAction(
  companyName: string
): Promise<{ news: NewsItem[]; isLive: boolean }> {
  const cacheKey = `${NEWS_CACHE_KEYS.COMPANY_NEWS}_${companyName.toLowerCase().replace(/\s+/g, '_')}`;
  const cached = getFromCache<NewsItem[]>(cacheKey);

  if (cached) {
    return { news: cached, isLive: true };
  }

  if (isPerplexityConfigured()) {
    try {
      const companyNews = await getPerplexityCompanyNews(companyName);
      if (companyNews.length > 0) {
        setInCache(cacheKey, companyNews);
        return { news: companyNews, isLive: true };
      }
    } catch (error) {
      console.error('Perplexity API error for company news:', error);
    }
  }

  // Fallback: Filter static news that might be related
  const relatedNews = news.filter(
    (n) =>
      n.title.toLowerCase().includes(companyName.toLowerCase()) ||
      n.summary.toLowerCase().includes(companyName.toLowerCase())
  );

  return { news: relatedNews.slice(0, 5), isLive: false };
}

// Fetch market trends and statistics
export async function fetchMarketTrendsAction(): Promise<{
  insights: string;
  stats: Array<{ label: string; value: string; change: string; positive: boolean }>;
  isLive: boolean;
}> {
  const cached = getFromCache<{
    insights: string;
    stats: Array<{ label: string; value: string; change: string; positive: boolean }>;
  }>(NEWS_CACHE_KEYS.MARKET_TRENDS);

  if (cached) {
    return { ...cached, isLive: true };
  }

  if (isPerplexityConfigured()) {
    try {
      const trends = await getPerplexityMarketTrends();
      setInCache(NEWS_CACHE_KEYS.MARKET_TRENDS, trends);
      return { ...trends, isLive: true };
    } catch (error) {
      console.error('Perplexity API error for market trends:', error);
    }
  }

  // Fallback static data
  return {
    insights: `The Indian nutraceutical market continues to expand rapidly, driven by increasing health consciousness,
rising disposable incomes, and growing awareness about preventive healthcare. Key segments showing strong growth
include vitamins & dietary supplements, sports nutrition, and herbal/ayurvedic products.`,
    stats: [
      { label: 'Market Size', value: '₹52,000 Cr', change: '+12.5%', positive: true },
      { label: 'YoY Growth', value: '18.2%', change: '+3.1%', positive: true },
      { label: 'Export Growth', value: '24.5%', change: '+5.2%', positive: true },
      { label: 'New Entrants', value: '2,340', change: '+28%', positive: true },
    ],
    isLive: false,
  };
}

// Search news by query
export async function searchNewsAction(query: string): Promise<{ news: NewsItem[]; isLive: boolean }> {
  const cacheKey = `${NEWS_CACHE_KEYS.SEARCH}_${query.toLowerCase().replace(/\s+/g, '_')}`;
  const cached = getFromCache<NewsItem[]>(cacheKey);

  if (cached) {
    return { news: cached, isLive: true };
  }

  if (isPerplexityConfigured()) {
    try {
      const results = await searchNutraceuticalNews(undefined, 10);
      // Filter results based on query
      const filteredResults = results.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.summary.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredResults.length > 0) {
        setInCache(cacheKey, filteredResults);
        return { news: filteredResults, isLive: true };
      }
    } catch (error) {
      console.error('Perplexity API error for search:', error);
    }
  }

  // Fallback: Search in static news
  const searchResults = news.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.summary.toLowerCase().includes(query.toLowerCase())
  );

  return { news: searchResults, isLive: false };
}

// Get industry news (regulatory + industry categories)
export async function fetchIndustryNewsAction(limit: number = 5): Promise<{
  news: NewsItem[];
  isLive: boolean;
}> {
  const cached = getFromCache<NewsItem[]>(NEWS_CACHE_KEYS.INDUSTRY_NEWS);

  if (cached) {
    console.log('[IndustryNews] Returning cached news:', cached.length, 'items');
    return { news: cached.slice(0, limit), isLive: true };
  }

  console.log('[IndustryNews] Perplexity configured:', isPerplexityConfigured());

  if (isPerplexityConfigured()) {
    try {
      console.log('[IndustryNews] Calling Perplexity API for industry + regulatory news...');
      const [industryNews, regulatoryNews] = await Promise.all([
        searchNutraceuticalNews('industry', Math.ceil(limit / 2)),
        searchNutraceuticalNews('regulatory', Math.floor(limit / 2)),
      ]);

      console.log('[IndustryNews] Perplexity returned - industry:', industryNews.length, ', regulatory:', regulatoryNews.length);

      const combinedNews = [...industryNews, ...regulatoryNews];
      if (combinedNews.length > 0) {
        setInCache(NEWS_CACHE_KEYS.INDUSTRY_NEWS, combinedNews);
        console.log('[IndustryNews] Returning live news:', combinedNews.length, 'items');
        return { news: combinedNews.slice(0, limit), isLive: true };
      }
      console.log('[IndustryNews] No news returned from Perplexity, using fallback');
    } catch (error) {
      console.error('[IndustryNews] Perplexity API error:', error);
    }
  }

  // Fallback to static data
  console.log('[IndustryNews] Using static fallback data');
  return { news: getIndustryNews(limit), isLive: false };
}

// Summarize article using OpenAI
export async function summarizeArticleAction(
  articleUrl: string,
  articleTitle: string,
  articleSummary?: string
): Promise<{
  success: boolean;
  summary?: string;
  keyPoints?: string[];
  industry?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  readingTime?: string;
  error?: string;
}> {
  const { summarizeArticle, fetchArticleContent, isOpenAIConfigured } = await import('../services/openai');

  // Check cache first
  const cacheKey = `article_summary_${Buffer.from(articleUrl).toString('base64').slice(0, 50)}`;
  const cached = getFromCache<{
    summary: string;
    keyPoints: string[];
    industry: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    readingTime: string;
  }>(cacheKey);

  if (cached) {
    console.log('[News] Returning cached article summary');
    return { success: true, ...cached };
  }

  if (!isOpenAIConfigured()) {
    return {
      success: false,
      error: 'OpenAI API key is not configured. Please add your OPENAI_API_KEY to the .env file.',
    };
  }

  try {
    // Try to fetch article content for better summarization
    let articleContent = articleSummary || '';
    try {
      const fetchedContent = await fetchArticleContent(articleUrl);
      if (fetchedContent && fetchedContent.length > 100) {
        articleContent = fetchedContent;
      }
    } catch (fetchError) {
      console.log('[News] Could not fetch article content, using title only');
    }

    const result = await summarizeArticle(articleUrl, articleTitle, articleContent);

    // Cache the result
    setInCache(cacheKey, result);

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error('[News] Error summarizing article:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to summarize article',
    };
  }
}
