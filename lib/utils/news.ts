import { NewsItem } from '../types';

export function getNewsSummaryUrl(news: NewsItem): string {
  const params = new URLSearchParams({
    url: news.url,
    title: news.title,
    source: news.source,
    category: news.category,
    summary: news.summary,
  });

  return `/news/summary?${params.toString()}`;
}
