'use client';

import { useState } from 'react';
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
  Sparkles,
  X,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const [showModal, setShowModal] = useState(false);
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

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <Card
        className="group relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-xl hover:shadow-teal-100/50 dark:hover:shadow-teal-900/20 transition-all duration-300"
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

              {/* Footer with AI Summary Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{news.source}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(news.publishedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={openModal}
                    size="sm"
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    AI Summary
                  </Button>
                  <Button
                    onClick={handleReadMore}
                    variant="ghost"
                    size="sm"
                    className="text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                  >
                    Read More
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Page Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`sticky top-0 z-10 bg-gradient-to-r ${config.iconBg} p-6 rounded-t-2xl`}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                  <CategoryIcon className="h-7 w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge className="mb-2 bg-white/20 text-white border-0">
                    {config.label}
                  </Badge>
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {news.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-white/80 text-sm">
                    <span>{news.source}</span>
                    <span>•</span>
                    <span>{formatDate(news.publishedAt)}</span>
                    {news.readTime && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {news.readTime}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* AI Summary Section */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-teal-200 dark:border-teal-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">AI Summary</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {news.aiSummary}
                </p>
              </div>

              {/* Key Takeaways Section - Teal theme */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Key Takeaways</h3>
                </div>
                <ul className="space-y-4">
                  {news.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                        {takeaway}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Source Link Section - Teal theme */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-teal-200 dark:border-teal-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Source Article</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Read the full article from the original source for more details.
                </p>
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-colors shadow-md"
                >
                  <span>Visit {news.source}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 rounded-b-2xl">
              <div className="flex justify-end gap-3">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600"
                >
                  Close
                </Button>
                <Button
                  onClick={handleReadMore}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read Full Article
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
