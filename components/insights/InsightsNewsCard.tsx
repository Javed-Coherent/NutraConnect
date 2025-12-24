'use client';

import {
  TrendingUp,
  Newspaper,
  Scale,
  Package,
  Globe,
  Building2,
  ArrowUpRight,
  Clock,
  Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { InsightNewsItem } from '@/lib/actions/insights';

const categoryConfig: Record<string, {
  icon: React.ElementType;
  label: string;
  bgColor: string;
  textColor: string;
  iconBg: string;
}> = {
  'market-trends': {
    icon: TrendingUp,
    label: 'Market Trends',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    textColor: 'text-blue-700 dark:text-blue-300',
    iconBg: 'from-blue-500 to-blue-600',
  },
  'regulatory': {
    icon: Scale,
    label: 'Regulatory Updates',
    bgColor: 'bg-purple-50 dark:bg-purple-950/50',
    textColor: 'text-purple-700 dark:text-purple-300',
    iconBg: 'from-purple-500 to-purple-600',
  },
  'company-news': {
    icon: Building2,
    label: 'Company News',
    bgColor: 'bg-green-50 dark:bg-green-950/50',
    textColor: 'text-green-700 dark:text-green-300',
    iconBg: 'from-green-500 to-green-600',
  },
  'product-launches': {
    icon: Package,
    label: 'Product Launches',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50',
    textColor: 'text-orange-700 dark:text-orange-300',
    iconBg: 'from-orange-500 to-orange-600',
  },
  'import-export': {
    icon: Globe,
    label: 'Import/Export',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/50',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    iconBg: 'from-cyan-500 to-cyan-600',
  },
};

const defaultConfig = {
  icon: Newspaper,
  label: 'News',
  bgColor: 'bg-gray-50 dark:bg-gray-800/50',
  textColor: 'text-gray-700 dark:text-gray-300',
  iconBg: 'from-gray-500 to-gray-600',
};

interface InsightsNewsCardProps {
  news: InsightNewsItem;
}

export function InsightsNewsCard({ news }: InsightsNewsCardProps) {
  const config = categoryConfig[news.category] || defaultConfig;
  const CategoryIcon = config.icon;

  const handleReadMore = () => {
    if (news.url && news.url !== '#') {
      window.open(news.url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card
      onClick={handleReadMore}
      className="group relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-xl hover:shadow-teal-100/50 dark:hover:shadow-teal-900/20 transition-all duration-300 cursor-pointer"
    >
      {/* Left accent border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.iconBg} opacity-0 group-hover:opacity-100 transition-opacity`} />

      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Category Icon */}
          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${config.iconBg} flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <CategoryIcon className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Category & Read Time */}
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`${config.bgColor} ${config.textColor} border-0 font-medium px-2.5 py-0.5`}>
                {config.label}
              </Badge>
              {news.readTime && (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {news.readTime}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-base leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
              {news.title}
            </h3>

            {/* Summary */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
              {news.summary}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">{news.source}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(news.publishedAt)}
                </span>
              </div>

              <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 dark:text-teal-400 group-hover:gap-2 transition-all">
                Read More
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
