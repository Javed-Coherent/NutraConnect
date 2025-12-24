import { Metadata } from 'next';
import { Newspaper } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  InsightsCategoryFilter,
  InsightsNewsCard,
  InsightsSidebar,
} from '@/components/insights';
import {
  getAllInsightsData,
  InsightsCategory,
} from '@/lib/actions/insights';

export const metadata: Metadata = {
  title: 'Industry Insights | NutraConnect',
  description:
    "Stay updated with the latest news, market trends, regulatory updates, and insights from India's nutraceutical industry.",
};

// Stats for the hero section
const insightStats = [
  { label: 'Articles This Week', value: '50+' },
  { label: 'Market Reports', value: '12' },
  { label: 'Regulatory Updates', value: '8' },
];

interface InsightsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const params = await searchParams;
  const category = (params.category || 'all') as InsightsCategory;

  // Fetch insights data from server actions
  const { news, marketStats, trendingTopics, lastUpdated } = await getAllInsightsData(
    category,
    5
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-2 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
              Industry Insights
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              Stay Ahead with{' '}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Industry Intelligence
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Your source for the latest news, market trends, regulatory updates,
              and insights from India&apos;s nutraceutical industry.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-4">
            {insightStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter Section */}
      <InsightsCategoryFilter currentCategory={category} lastUpdated={lastUpdated} />

      {/* Main Content Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main News Column */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-teal-600" />
                Latest News & Updates
              </h2>

              {news.length > 0 ? (
                news.map((item) => <InsightsNewsCard key={item.id} news={item} />)
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No news articles found for this category.
                  </p>
                </div>
              )}

              {/* Load More Button */}
              {news.length > 0 && (
                <div className="text-center pt-4">
                  <Button variant="outline" className="w-full md:w-auto">
                    Load More Articles
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <InsightsSidebar
              trendingTopics={trendingTopics}
              marketStats={marketStats}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
