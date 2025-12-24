'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  TrendingUp,
  BarChart3,
  Newspaper,
  Shield,
  Zap,
  RefreshCcw,
  Loader2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/lib/types';
import { fetchIndustryInsightsAction, fetchMarketTrendsAction } from '@/lib/actions/news';

interface CompanyInsightsProps {
  company: Company;
}

export function CompanyInsights({ company }: CompanyInsightsProps) {
  const [insights, setInsights] = useState<string>('');
  const [stats, setStats] = useState<Array<{ label: string; value: string; change: string; positive: boolean }>>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const categories = company.category?.slice(0, 3).join(', ') || 'nutraceuticals';
      const topic = `${company.type} businesses in Indian nutraceutical industry, focusing on ${categories}`;

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

  useEffect(() => {
    if (!hasFetched) {
      fetchInsights();
    }
  }, [hasFetched]);

  const quickLinks = [
    { icon: TrendingUp, label: 'Market Trends', href: '/insights?category=market-trends', color: 'from-blue-500 to-indigo-500' },
    { icon: Shield, label: 'Regulatory Updates', href: '/insights?category=regulatory', color: 'from-red-500 to-orange-500' },
    { icon: Newspaper, label: 'Industry News', href: '/insights', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <section id="insights" className="mt-12 scroll-mt-20">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Insights Card */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
            <CardHeader className="py-4 px-5 bg-gradient-to-r from-teal-50 to-emerald-50/50 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
              <CardTitle className="text-lg flex items-center justify-between text-gray-900 dark:text-white">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mr-3">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  Industry Insights
                </div>
                {isLive && (
                  <Badge className="bg-teal-500 text-white hover:bg-teal-600 text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Live AI
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {/* AI Insights Content */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-teal-600 animate-spin mr-3" />
                  <span className="text-gray-600 dark:text-gray-400">Generating insights...</span>
                </div>
              ) : insights ? (
                <div className="space-y-5">
                  <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-teal-100 dark:border-teal-800">
                    <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2 flex items-center">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      AI-Generated Market Analysis
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                      {insights}
                    </p>
                  </div>

                  {/* Refresh Button */}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchInsights}
                      disabled={loading}
                      className="border-teal-200 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                    >
                      <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
                      Refresh
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No insights available</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchInsights}
                    className="mt-4"
                  >
                    Load Insights
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Market Stats */}
          {stats.length > 0 && (
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
              <CardHeader className="py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
                <CardTitle className="text-base flex items-center text-gray-900 dark:text-white">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mr-2">
                    <BarChart3 className="h-3.5 w-3.5 text-white" />
                  </div>
                  Market Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{stat.value}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        stat.positive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
            <CardHeader className="py-3 px-4 bg-gradient-to-r from-purple-50 to-pink-50/50 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
              <CardTitle className="text-base flex items-center text-gray-900 dark:text-white">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-2">
                  <Newspaper className="h-3.5 w-3.5 text-white" />
                </div>
                Related Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {quickLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center flex-shrink-0`}>
                    <link.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white flex-1">
                    {link.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 border-0 overflow-hidden">
            <CardContent className="p-4 text-white">
              <h3 className="font-bold text-base mb-2">Want More Insights?</h3>
              <p className="text-xs text-teal-50 mb-3 leading-relaxed">
                Get comprehensive industry reports and market analysis on our Insights page.
              </p>
              <Button
                className="w-full bg-white text-teal-600 hover:bg-teal-50 font-semibold h-9 text-sm"
                asChild
              >
                <Link href="/insights">
                  View All Insights
                  <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
