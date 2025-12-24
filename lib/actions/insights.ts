'use server';

import {
  searchNutraceuticalNews,
  getMarketTrends,
  getIndustryInsights,
  isPerplexityConfigured,
} from '../services/perplexity';
import {
  setInCache,
  getFromCache,
  NEWS_CACHE_KEYS,
} from '../services/news-cache';

// Insights categories
export type InsightsCategory =
  | 'all'
  | 'market-trends'
  | 'regulatory'
  | 'company-news'
  | 'product-launches'
  | 'import-export';

// Map frontend categories to Perplexity query categories
const categoryQueryMap: Record<InsightsCategory, string> = {
  'all': 'Latest nutraceutical industry news, market updates, regulatory changes, and business developments in India from the past week',
  'market-trends': 'Latest nutraceutical market trends, growth statistics, investment news, and market analysis in India',
  'regulatory': 'Latest FSSAI regulations, government policies, compliance requirements, and regulatory updates for nutraceutical industry in India',
  'company-news': 'Latest news about nutraceutical companies in India including expansions, acquisitions, partnerships, and business developments',
  'product-launches': 'Latest nutraceutical product launches, new supplements, health products, and innovations in India',
  'import-export': 'Latest nutraceutical import export news, trade statistics, international market developments, and export opportunities for India',
};

// Extended news item for insights page
export interface InsightNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: InsightsCategory;
  readTime?: string;
  imageUrl?: string;
  relatedCompanyIds?: string[];
  image?: string;
}

// Market statistics type
export interface MarketStats {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

// Insights data response type
export interface InsightsData {
  news: InsightNewsItem[];
  marketStats: MarketStats[];
  trendingTopics: string[];
  lastUpdated: string;
}

// Cache duration: 30 minutes for insights data
const INSIGHTS_CACHE_DURATION = 30 * 60 * 1000;

// Calculate read time based on summary length
function calculateReadTime(summary: string): string {
  const wordsPerMinute = 200;
  const wordCount = summary.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} min read`;
}

// Map Perplexity category to frontend category
function mapToFrontendCategory(perplexityCategory: string, title: string, summary: string): InsightsCategory {
  const content = `${title} ${summary}`.toLowerCase();

  // Check for specific keywords to determine category
  if (content.includes('fssai') || content.includes('regulation') || content.includes('compliance') || content.includes('policy') || content.includes('guideline')) {
    return 'regulatory';
  }
  if (content.includes('launch') || content.includes('new product') || content.includes('innovation') || content.includes('introduce')) {
    return 'product-launches';
  }
  if (content.includes('export') || content.includes('import') || content.includes('trade') || content.includes('international')) {
    return 'import-export';
  }
  if (content.includes('market') || content.includes('growth') || content.includes('trend') || content.includes('forecast') || content.includes('billion') || content.includes('crore')) {
    return 'market-trends';
  }
  if (content.includes('company') || content.includes('acquisition') || content.includes('partnership') || content.includes('expansion')) {
    return 'company-news';
  }

  // Default mapping based on Perplexity category
  if (perplexityCategory === 'regulatory') return 'regulatory';
  if (perplexityCategory === 'company') return 'company-news';

  return 'market-trends';
}

// Fetch insights news by category
export async function getInsightsNews(
  category: InsightsCategory = 'all',
  limit: number = 10
): Promise<InsightNewsItem[]> {
  const cacheKey = `${NEWS_CACHE_KEYS.INDUSTRY_NEWS}_insights_${category}`;

  // Check cache first
  const cached = getFromCache<InsightNewsItem[]>(cacheKey);
  if (cached) {
    console.log(`[Insights] Cache hit for category: ${category}`);
    return cached;
  }

  // Check if Perplexity is configured
  if (!isPerplexityConfigured()) {
    console.log('[Insights] Perplexity not configured, returning fallback data');
    return getFallbackNews(category, limit);
  }

  try {
    console.log(`[Insights] Fetching news for category: ${category}`);

    // Determine Perplexity category based on frontend category
    let perplexityCategory: 'company' | 'industry' | 'regulatory' | undefined;
    if (category === 'regulatory') {
      perplexityCategory = 'regulatory';
    } else if (category === 'company-news') {
      perplexityCategory = 'company';
    } else {
      perplexityCategory = 'industry';
    }

    const news = await searchNutraceuticalNews(perplexityCategory, limit);

    // Transform to InsightNewsItem
    const insightNews: InsightNewsItem[] = news.map((item) => ({
      ...item,
      category: mapToFrontendCategory(item.category, item.title, item.summary),
      readTime: calculateReadTime(item.summary),
    }));

    // Cache the results
    setInCache(cacheKey, insightNews, INSIGHTS_CACHE_DURATION);

    return insightNews;
  } catch (error) {
    console.error('[Insights] Error fetching news:', error);
    return getFallbackNews(category, limit);
  }
}

// Fetch market statistics
export async function getInsightsMarketStats(): Promise<MarketStats[]> {
  const cacheKey = `${NEWS_CACHE_KEYS.MARKET_TRENDS}_insights`;

  // Check cache first
  const cached = getFromCache<MarketStats[]>(cacheKey);
  if (cached) {
    console.log('[Insights] Cache hit for market stats');
    return cached;
  }

  if (!isPerplexityConfigured()) {
    return getFallbackMarketStats();
  }

  try {
    const trends = await getMarketTrends();
    const stats = trends.stats;

    // Cache the results
    setInCache(cacheKey, stats, INSIGHTS_CACHE_DURATION);

    return stats;
  } catch (error) {
    console.error('[Insights] Error fetching market stats:', error);
    return getFallbackMarketStats();
  }
}

// Fetch trending topics
export async function getInsightsTrendingTopics(): Promise<string[]> {
  const cacheKey = `${NEWS_CACHE_KEYS.INDUSTRY_INSIGHTS}_trending`;

  // Check cache first
  const cached = getFromCache<string[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Default trending topics for nutraceutical industry
  const topics = [
    'Immunity Supplements',
    'Collagen Market Growth',
    'FSSAI New Guidelines',
    'Ayurvedic Products',
    'Protein Supplements',
    'Plant-Based Nutrition',
    'Vitamin D3 Demand',
    'Probiotic Industry',
  ];

  setInCache(cacheKey, topics, INSIGHTS_CACHE_DURATION);

  return topics;
}

// Fetch all insights data in one call
export async function getAllInsightsData(
  category: InsightsCategory = 'all',
  newsLimit: number = 10
): Promise<InsightsData> {
  const [news, marketStats, trendingTopics] = await Promise.all([
    getInsightsNews(category, newsLimit),
    getInsightsMarketStats(),
    getInsightsTrendingTopics(),
  ]);

  return {
    news,
    marketStats,
    trendingTopics,
    lastUpdated: new Date().toISOString(),
  };
}

// Get industry insight text for a specific topic
export async function getTopicInsight(topic: string): Promise<string> {
  const cacheKey = `${NEWS_CACHE_KEYS.INDUSTRY_INSIGHTS}_topic_${topic.toLowerCase().replace(/\s+/g, '_')}`;

  const cached = getFromCache<string>(cacheKey);
  if (cached) {
    return cached;
  }

  if (!isPerplexityConfigured()) {
    return `The ${topic} segment in India's nutraceutical industry is experiencing significant growth driven by increasing health awareness among consumers.`;
  }

  try {
    const insight = await getIndustryInsights(topic);
    setInCache(cacheKey, insight, INSIGHTS_CACHE_DURATION);
    return insight;
  } catch (error) {
    console.error('[Insights] Error fetching topic insight:', error);
    return `The ${topic} segment in India's nutraceutical industry is experiencing significant growth driven by increasing health awareness among consumers.`;
  }
}

// Fallback news data when Perplexity is not available
function getFallbackNews(category: InsightsCategory, limit: number): InsightNewsItem[] {
  const allFallbackNews: InsightNewsItem[] = [
    {
      id: 'fallback-1',
      title: 'Indian Nutraceutical Market Expected to Reach $18 Billion by 2025',
      summary: 'The Indian nutraceutical industry continues its rapid growth trajectory, driven by increasing health consciousness and demand for preventive healthcare solutions. Major players are expanding their product portfolios to capture the growing market.',
      category: 'market-trends',
      source: 'Industry Report',
      url: '#',
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '4 min read',
    },
    {
      id: 'fallback-2',
      title: 'FSSAI Introduces New Labeling Guidelines for Health Supplements',
      summary: 'The Food Safety and Standards Authority of India has announced updated labeling requirements for nutraceutical products. The new guidelines mandate clearer ingredient disclosure and health claim substantiation.',
      category: 'regulatory',
      source: 'FSSAI',
      url: '#',
      publishedAt: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      readTime: '3 min read',
    },
    {
      id: 'fallback-3',
      title: 'Leading Manufacturer Announces ₹500 Crore Expansion Plan',
      summary: 'A major nutraceutical manufacturer has unveiled plans to invest ₹500 crore in a new state-of-the-art manufacturing facility in Gujarat, expected to create 2,000 new jobs and double production capacity.',
      category: 'company-news',
      source: 'Business Standard',
      url: '#',
      publishedAt: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      readTime: '3 min read',
    },
    {
      id: 'fallback-4',
      title: 'New Ayurvedic Immunity Booster Range Launched',
      summary: 'A new range of Ayurvedic immunity boosters featuring ashwagandha, tulsi, and giloy extracts has been launched targeting health-conscious urban consumers. The products are available in various formats including tablets, powders, and gummies.',
      category: 'product-launches',
      source: 'Product Launch',
      url: '#',
      publishedAt: new Date(Date.now() - 259200000).toISOString().split('T')[0],
      readTime: '2 min read',
    },
    {
      id: 'fallback-5',
      title: 'India\'s Nutraceutical Exports Grow 25% in Q3',
      summary: 'Export of nutraceutical products from India shows strong growth in the third quarter, with major demand from US, Europe, and Southeast Asian markets. Herbal extracts and Ayurvedic products lead the export categories.',
      category: 'import-export',
      source: 'Export Council',
      url: '#',
      publishedAt: new Date(Date.now() - 345600000).toISOString().split('T')[0],
      readTime: '4 min read',
    },
    {
      id: 'fallback-6',
      title: 'Collagen Supplements Market Witnesses 40% Growth',
      summary: 'The collagen supplement segment in India is experiencing unprecedented growth as consumers increasingly focus on skin health, anti-aging, and joint support. Marine collagen products are gaining particular traction.',
      category: 'market-trends',
      source: 'Market Analysis',
      url: '#',
      publishedAt: new Date(Date.now() - 432000000).toISOString().split('T')[0],
      readTime: '5 min read',
    },
    {
      id: 'fallback-7',
      title: 'Government Announces PLI Scheme for Nutraceuticals',
      summary: 'The government has announced a Production Linked Incentive scheme for the nutraceutical sector to boost domestic manufacturing and reduce import dependence. The scheme offers incentives up to 15% of incremental sales.',
      category: 'regulatory',
      source: 'Government Release',
      url: '#',
      publishedAt: new Date(Date.now() - 518400000).toISOString().split('T')[0],
      readTime: '3 min read',
    },
    {
      id: 'fallback-8',
      title: 'Plant-Based Protein Products See Rising Demand',
      summary: 'Plant-based protein products including pea protein, soy protein, and hemp protein are seeing increased demand in India as consumers seek sustainable and vegetarian protein alternatives.',
      category: 'market-trends',
      source: 'Industry Trends',
      url: '#',
      publishedAt: new Date(Date.now() - 604800000).toISOString().split('T')[0],
      readTime: '4 min read',
    },
  ];

  // Filter by category if not 'all'
  const filteredNews = category === 'all'
    ? allFallbackNews
    : allFallbackNews.filter(item => item.category === category);

  return filteredNews.slice(0, limit);
}

// Fallback market statistics
function getFallbackMarketStats(): MarketStats[] {
  return [
    { label: 'Market Size (2024)', value: '$10.5B', change: '+15%', positive: true },
    { label: 'YoY Growth', value: '18.5%', change: '+3.2%', positive: true },
    { label: 'Top Segment', value: 'Vitamins', change: undefined, positive: true },
    { label: 'Export Growth', value: '25%', change: '+8%', positive: true },
  ];
}
