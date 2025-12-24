import { NextRequest, NextResponse } from 'next/server';
import {
  getAllInsightsData,
  getInsightsNews,
  getTopicInsight,
  InsightsCategory,
} from '@/lib/actions/insights';

// GET /api/insights - Fetch insights data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') || 'all') as InsightsCategory;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const topic = searchParams.get('topic');

    // If topic is specified, return topic-specific insight
    if (topic) {
      const insight = await getTopicInsight(topic);
      return NextResponse.json({ insight });
    }

    // Check if only news is requested
    const newsOnly = searchParams.get('newsOnly') === 'true';

    if (newsOnly) {
      const news = await getInsightsNews(category, limit);
      return NextResponse.json({ news });
    }

    // Return all insights data
    const data = await getAllInsightsData(category, limit);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API] Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights data' },
      { status: 500 }
    );
  }
}
