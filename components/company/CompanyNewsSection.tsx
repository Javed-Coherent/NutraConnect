import Link from 'next/link';
import { Newspaper, ExternalLink, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchIndustryNewsAction } from '@/lib/actions/news';
import { getNewsSummaryUrl } from '@/lib/utils/news';
import { NewsItem } from '@/lib/types';

interface CompanyNewsSectionProps {
  companyId: string;
}

function NewsCard({ item }: { item: NewsItem }) {
  const summaryUrl = getNewsSummaryUrl(item);

  return (
    <Link
      href={summaryUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all">
        <div className="flex items-start gap-3">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900 dark:to-emerald-900 flex items-center justify-center flex-shrink-0">
              <Newspaper className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 line-clamp-2 transition-colors">
              {item.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
              {item.summary}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-500">
              <Badge variant="outline" className="text-xs capitalize">
                {item.category}
              </Badge>
              <span>{item.source}</span>
              <span>•</span>
              <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-teal-500 flex-shrink-0 transition-colors" />
        </div>
      </div>
    </Link>
  );
}

export async function CompanyNewsSection({ companyId }: CompanyNewsSectionProps) {
  // Fetch live industry news - this is the async call that streams in
  const { news } = await fetchIndustryNewsAction(5);

  if (!news || news.length === 0) {
    return (
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700">
        <CardContent className="py-8 text-center">
          <Newspaper className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No industry news available at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  // Note: fetchIndustryNewsAction already fetches only industry + regulatory news,
  // so no additional filtering needed here
  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white">
            <TrendingUp className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
            Industry News & Updates
          </CardTitle>
          <Badge variant="secondary" className="bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {news.slice(0, 5).map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
        {news.length > 5 && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm">
              View All News
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
