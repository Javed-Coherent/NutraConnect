'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  Sparkles,
  Zap,
  RefreshCcw,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchIndustryInsightsAction, fetchMarketTrendsAction } from '@/lib/actions/news';

interface IndustryInsightsCardProps {
  companyType: string;
  category: string[];
}

export function IndustryInsightsCard({ companyType, category }: IndustryInsightsCardProps) {
  const [insights, setInsights] = useState<string>('');
  const [stats, setStats] = useState<Array<{ label: string; value: string; change: string; positive: boolean }>>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const topic = `${companyType} businesses in Indian nutraceutical industry, focusing on ${category.slice(0, 3).join(', ')}`;

      const [insightsResult, trendsResult] = await Promise.all([
        fetchIndustryInsightsAction(topic),
        fetchMarketTrendsAction(),
      ]);

      setInsights(insightsResult.insights);
      setStats(trendsResult.stats);
      setIsLive(insightsResult.isLive || trendsResult.isLive);
      setHasFetched(true);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights('Unable to load insights at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when component becomes visible
  useEffect(() => {
    if (!hasFetched) {
      fetchInsights();
    }
  }, [hasFetched]);

  return (
    <Card className="border-2 border-teal-200 dark:border-teal-700 overflow-hidden">
      <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        <CardContent className="py-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Industry Insights
              </h3>
              {isLive && (
                <Badge className="bg-teal-500 text-white hover:bg-teal-600">
                  <Zap className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-sm">
              AI-powered market intelligence for {companyType} businesses
            </p>
          </div>

          {/* Market Stats */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6">
              {stats.map((stat, i) => (
                <div key={i} className="p-3 bg-white dark:bg-gray-700 rounded-xl border border-teal-100 dark:border-teal-700 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className={`text-xs font-medium ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Insights Content */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-teal-600 animate-spin mr-3" />
              <span className="text-gray-600 dark:text-gray-400">Loading insights...</span>
            </div>
          ) : insights ? (
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 max-w-3xl mx-auto border border-teal-100 dark:border-teal-700 mb-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {insights}
                </p>
              </div>
            </div>
          ) : null}

          {/* Quick Access Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { icon: TrendingUp, label: 'Market Trends', desc: 'Growth patterns' },
              { icon: Users, label: 'Competition', desc: 'Key players' },
              { icon: Shield, label: 'Regulatory', desc: 'Compliance' },
              { icon: BarChart3, label: 'Analytics', desc: 'Data insights' },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-white dark:bg-gray-700 rounded-xl border border-teal-200 dark:border-teal-700 hover:shadow-md transition-shadow text-center">
                <item.icon className="h-5 w-5 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Refresh Button */}
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={fetchInsights}
              disabled={loading}
              className="border-teal-300 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Refreshing...' : 'Refresh Insights'}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
