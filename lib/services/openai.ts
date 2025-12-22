import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

// Helper to get API key - reads directly from .env file if env var is empty
function getOpenAIApiKey(): string | null {
  let apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    try {
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/^OPENAI_API_KEY=(.+)$/m);
        if (match && match[1]) {
          apiKey = match[1].trim();
          process.env.OPENAI_API_KEY = apiKey;
        }
      }
    } catch (error) {
      console.error('[OpenAI] Error reading .env file:', error);
    }
  }

  return apiKey || null;
}

export function isOpenAIConfigured(): boolean {
  const apiKey = getOpenAIApiKey();
  console.log('[OpenAI] API Key check:', apiKey ? `Found (${apiKey.slice(0, 10)}...)` : 'NOT FOUND');
  return !!apiKey;
}

function getOpenAIClient(): OpenAI | null {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

interface ArticleSummary {
  summary: string;
  keyPoints: string[];
  industry: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  readingTime: string;
}

export async function summarizeArticle(
  articleUrl: string,
  articleTitle: string,
  articleContent?: string
): Promise<ArticleSummary> {
  const client = getOpenAIClient();

  if (!client) {
    throw new Error('OpenAI API key is not configured');
  }

  console.log('[OpenAI] Summarizing article:', articleTitle);

  const prompt = `You are a nutraceutical industry analyst. Analyze the following news article and provide a comprehensive summary.

Article Title: ${articleTitle}
Article URL: ${articleUrl}
${articleContent ? `Article Content: ${articleContent}` : ''}

Please provide:
1. A detailed summary (3-4 paragraphs) explaining the key information, implications for the nutraceutical industry, and why this matters to businesses
2. 5-7 key bullet points highlighting the most important takeaways
3. The primary industry segment this relates to (e.g., "Dietary Supplements", "Regulatory", "Manufacturing", "Market Trends", "Raw Materials", "Export/Import")
4. Overall sentiment (positive, negative, or neutral for the industry)
5. Estimated reading time for the original article

Respond in JSON format:
{
  "summary": "detailed summary here...",
  "keyPoints": ["point 1", "point 2", ...],
  "industry": "industry segment",
  "sentiment": "positive|negative|neutral",
  "readingTime": "X min read"
}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert nutraceutical industry analyst. Provide insightful, business-focused summaries of industry news. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || '';

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || 'Unable to generate summary.',
        keyPoints: parsed.keyPoints || [],
        industry: parsed.industry || 'General',
        sentiment: parsed.sentiment || 'neutral',
        readingTime: parsed.readingTime || '3 min read',
      };
    }

    throw new Error('Invalid response format from OpenAI');
  } catch (error) {
    console.error('[OpenAI] Error summarizing article:', error);
    throw error;
  }
}

export async function fetchArticleContent(url: string): Promise<string> {
  // Skip fetching - rely on the summary we already have from Perplexity
  // External article fetching often fails due to CORS, paywalls, or anti-scraping measures
  console.log('[OpenAI] Skipping article fetch, using provided summary instead');
  return '';
}
