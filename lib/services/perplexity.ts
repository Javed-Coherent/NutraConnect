import { NewsItem } from '../types';
import * as fs from 'fs';
import * as path from 'path';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const MODEL = 'sonar';

// Helper to get API key - reads directly from .env file if env var is empty
function getPerplexityApiKey(): string | null {
  // First try the environment variable
  let apiKey = process.env.PERPLEXITY_API_KEY;

  console.log('[Perplexity] Initial env check:', apiKey ? `exists (length: ${apiKey.length})` : 'undefined/empty');

  // If empty or undefined, read directly from .env file
  if (!apiKey || apiKey.length === 0) {
    console.log('[Perplexity] Falling back to .env file read');
    try {
      const envPath = path.join(process.cwd(), '.env');
      console.log('[Perplexity] Looking for .env at:', envPath);
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/^PERPLEXITY_API_KEY=(.+?)[\r\n]*$/m);
        console.log('[Perplexity] Regex match result:', match ? 'found' : 'not found');
        if (match && match[1]) {
          apiKey = match[1].trim().replace(/\r/g, '');
          console.log('[Perplexity] Extracted key length:', apiKey.length);
          // Also set it in process.env for future calls
          process.env.PERPLEXITY_API_KEY = apiKey;
        }
      } else {
        console.log('[Perplexity] .env file not found at path');
      }
    } catch (error) {
      console.error('[Perplexity] Error reading .env file:', error);
    }
  }

  return apiKey || null;
}

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  citations?: string[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ParsedNewsItem {
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'company' | 'industry' | 'regulatory';
}

async function callPerplexity(
  systemPrompt: string,
  userQuery: string
): Promise<{ content: string; citations: string[] }> {
  const apiKey = getPerplexityApiKey();

  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY is not configured');
  }

  const messages: PerplexityMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userQuery },
  ];

  // Increase timeout to 30 seconds for lazy-loaded news (no longer blocking page render)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        return_citations: true,
        temperature: 0.2,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data: PerplexityResponse = await response.json();

    return {
      content: data.choices[0]?.message?.content || '',
      citations: data.citations || [],
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort/timeout errors gracefully
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Perplexity API request timed out');
      return { content: '', citations: [] };
    }

    throw error;
  }
}

function parseNewsFromResponse(content: string, citations: string[]): ParsedNewsItem[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((item: ParsedNewsItem, index: number) => ({
        ...item,
        url: item.url || citations[index] || '#',
        publishedAt: item.publishedAt || new Date().toISOString().split('T')[0],
      }));
    }
  } catch {
    // If JSON parsing fails, try to extract news items from text
  }

  // Fallback: Parse text response into news items
  const newsItems: ParsedNewsItem[] = [];
  const lines = content.split('\n').filter((line) => line.trim());

  let currentItem: Partial<ParsedNewsItem> = {};

  for (const line of lines) {
    if (line.match(/^\d+\.|^-|^\*/)) {
      if (currentItem.title) {
        newsItems.push({
          title: currentItem.title || 'Untitled',
          summary: currentItem.summary || currentItem.title || '',
          source: currentItem.source || 'Industry Source',
          url: currentItem.url || citations[newsItems.length] || '#',
          publishedAt: currentItem.publishedAt || new Date().toISOString().split('T')[0],
          category: currentItem.category || 'industry',
        });
      }
      currentItem = { title: line.replace(/^\d+\.|^-|^\*/, '').trim() };
    } else if (currentItem.title && !currentItem.summary) {
      currentItem.summary = line.trim();
    }
  }

  // Add the last item
  if (currentItem.title) {
    newsItems.push({
      title: currentItem.title,
      summary: currentItem.summary || currentItem.title,
      source: currentItem.source || 'Industry Source',
      url: currentItem.url || citations[newsItems.length] || '#',
      publishedAt: currentItem.publishedAt || new Date().toISOString().split('T')[0],
      category: currentItem.category || 'industry',
    });
  }

  return newsItems;
}

export async function searchNutraceuticalNews(
  category?: 'company' | 'industry' | 'regulatory',
  limit: number = 5
): Promise<NewsItem[]> {
  const categoryQueries: Record<string, string> = {
    company:
      'Latest news about nutraceutical companies in India, including expansions, acquisitions, new product launches, and business developments',
    industry:
      'Latest nutraceutical industry news in India, market trends, growth statistics, and business developments',
    regulatory:
      'Latest FSSAI regulations, government policies, and regulatory updates for nutraceutical and supplement industry in India',
  };

  const query = category
    ? categoryQueries[category]
    : 'Latest nutraceutical and health supplement industry news in India from the past week';

  const systemPrompt = `You are a nutraceutical industry news analyst specializing in the Indian market.
Provide the latest news in JSON format as an array of objects with these fields:
- title: string (headline)
- summary: string (2-3 sentence summary)
- source: string (publication name)
- url: string (source URL if available)
- publishedAt: string (date in YYYY-MM-DD format)
- category: "company" | "industry" | "regulatory"

Return only the JSON array, no additional text. Limit to ${limit} most recent and relevant news items.`;

  try {
    const { content, citations } = await callPerplexity(systemPrompt, query);
    const parsedNews = parseNewsFromResponse(content, citations);

    return parsedNews.slice(0, limit).map((item, index) => ({
      id: `perplexity-${Date.now()}-${index}`,
      ...item,
    }));
  } catch (error) {
    console.error('Error fetching news from Perplexity:', error);
    throw error;
  }
}

export async function getIndustryInsights(topic: string): Promise<string> {
  const systemPrompt = `You are a nutraceutical industry analyst specializing in the Indian market.
Provide concise, data-driven insights about the topic. Include:
- Current market statistics and trends
- Key growth drivers
- Recent developments
- Future outlook

Keep the response informative but concise (200-300 words). Use bullet points for clarity.`;

  try {
    const { content } = await callPerplexity(systemPrompt, topic);
    return content;
  } catch (error) {
    console.error('Error fetching industry insights:', error);
    throw error;
  }
}

export async function getCompanyNews(companyName: string): Promise<NewsItem[]> {
  const systemPrompt = `You are a business news analyst. Search for recent news about the specified company in the nutraceutical/supplement industry.
Provide news in JSON format as an array of objects with these fields:
- title: string (headline)
- summary: string (2-3 sentence summary)
- source: string (publication name)
- url: string (source URL if available)
- publishedAt: string (date in YYYY-MM-DD format)
- category: "company"

Return only the JSON array, no additional text. If no specific news found, return an empty array [].`;

  const query = `Recent news about "${companyName}" nutraceutical company in India`;

  try {
    const { content, citations } = await callPerplexity(systemPrompt, query);
    const parsedNews = parseNewsFromResponse(content, citations);

    return parsedNews.map((item, index) => ({
      id: `company-news-${Date.now()}-${index}`,
      ...item,
      category: 'company' as const,
    }));
  } catch (error) {
    console.error('Error fetching company news:', error);
    throw error;
  }
}

export async function getMarketTrends(): Promise<{
  insights: string;
  stats: Array<{ label: string; value: string; change: string; positive: boolean }>;
}> {
  const systemPrompt = `You are a nutraceutical market analyst. Provide current market statistics and trends for the Indian nutraceutical industry.

Return a JSON object with:
{
  "insights": "Brief paragraph about current market trends (100-150 words)",
  "stats": [
    { "label": "Market Size", "value": "₹XX,XXX Cr", "change": "+XX%", "positive": true/false },
    { "label": "YoY Growth", "value": "XX%", "change": "+X%", "positive": true/false },
    { "label": "Export Growth", "value": "XX%", "change": "+X%", "positive": true/false },
    { "label": "New Companies", "value": "X,XXX", "change": "+XX%", "positive": true/false }
  ]
}

Use real, current data from recent reports. Return only the JSON object.`;

  try {
    const { content } = await callPerplexity(
      systemPrompt,
      'Current Indian nutraceutical market size, growth rate, and key statistics for 2024-2025'
    );

    // Try to parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback default stats
    return {
      insights: content,
      stats: [
        { label: 'Market Size', value: '₹52,000 Cr', change: '+12.5%', positive: true },
        { label: 'YoY Growth', value: '18.2%', change: '+3.1%', positive: true },
        { label: 'Export Growth', value: '24.5%', change: '+5.2%', positive: true },
        { label: 'New Entrants', value: '2,340', change: '+28%', positive: true },
      ],
    };
  } catch (error) {
    console.error('Error fetching market trends:', error);
    throw error;
  }
}

export function isPerplexityConfigured(): boolean {
  const apiKey = getPerplexityApiKey();
  console.log('[Perplexity] API Key check:', apiKey ? `Found (${apiKey.slice(0, 10)}...)` : 'NOT FOUND');
  return !!apiKey;
}
