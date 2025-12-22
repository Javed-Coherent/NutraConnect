'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getNewsSummaryUrl } from '@/lib/utils/news';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'company' | 'industry' | 'regulatory';
}

interface LatestNewsSectionProps {
  limit?: number;
  colorScheme?: 'teal' | 'blue';
}

export function LatestNewsSection({ limit = 2, colorScheme = 'teal' }: LatestNewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(`/api/news/latest?limit=${limit}`);
        const data = await response.json();
        setNews(data.news || []);
        setIsLive(data.isLive || false);
      } catch (error) {
        console.error('Failed to fetch latest news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [limit]);

  const colors = colorScheme === 'teal'
    ? {
        badge: 'bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-900 dark:text-teal-300',
        liveBadge: 'bg-teal-500 text-white hover:bg-teal-600',
        border: 'border-teal-100 hover:border-teal-300 dark:border-teal-800 dark:hover:border-teal-600',
        gradient: 'from-white to-teal-50/30 dark:from-gray-800 dark:to-gray-800',
        source: 'text-teal-600 dark:text-teal-400',
        button: 'border-2 border-teal-500 bg-teal-100 text-teal-800 font-semibold hover:bg-teal-200 hover:border-teal-600 shadow-sm',
      }
    : {
        badge: 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
        liveBadge: 'bg-blue-500 text-white hover:bg-blue-600',
        border: 'border-blue-100 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-600',
        gradient: 'from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-800',
        source: 'text-blue-600 dark:text-blue-400',
        button: 'border-2 border-blue-500 bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 hover:border-blue-600 shadow-sm',
      };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className={`overflow-hidden border-2 ${colors.border} bg-gradient-to-br ${colors.gradient}`}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No news available at the moment.
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest News & Insights</h2>
          {isLive && (
            <Badge className={`${colors.liveBadge} animate-pulse`}>
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {news.map((item) => (
          <Card
            key={item.id}
            className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-2 ${colors.border} bg-gradient-to-br ${colors.gradient} hover:-translate-y-1`}
          >
            <CardContent className="p-6">
              <Badge className={`mb-3 ${colors.badge}`}>
                {item.category === 'company' ? 'Company News' :
                 item.category === 'industry' ? 'Industry' : 'Regulatory'}
              </Badge>
              <Link
                href={getNewsSummaryUrl(item)}
                className="block"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-teal-700 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  {item.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {item.summary}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${colors.source} font-medium`}>
                  {item.source} · {new Date(item.publishedAt).toLocaleDateString()}
                </span>
                <Button size="sm" className={colors.button} asChild>
                  <Link href={getNewsSummaryUrl(item)}>
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Summary
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
