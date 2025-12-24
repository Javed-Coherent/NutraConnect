'use client';

import {
  TrendingUp,
  Scale,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketStats } from '@/lib/actions/insights';

interface InsightsSidebarProps {
  trendingTopics: string[];
  marketStats: MarketStats[];
}

export function InsightsSidebar({ trendingTopics, marketStats }: InsightsSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Trending Topics */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        <CardHeader className="py-3 px-4 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30">
          <CardTitle className="flex items-center gap-2 text-base dark:text-white">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-1">
            {trendingTopics.slice(0, 8).map((topic, index) => (
              <div
                key={topic}
                className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/30 cursor-pointer transition-colors group"
              >
                <span className={`flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                  index < 3
                    ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}>
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex-1 leading-tight">
                  {topic}
                </span>
                <TrendingUp className="h-3 w-3 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Snapshot */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        <CardHeader className="py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardTitle className="flex items-center gap-2 text-base dark:text-white">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5 text-white" />
            </div>
            Market Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-2">
            {marketStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                  {stat.change && (
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        stat.positive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                      }`}
                    >
                      {stat.positive ? (
                        <ArrowUp className="h-2.5 w-2.5" />
                      ) : (
                        <ArrowDown className="h-2.5 w-2.5" />
                      )}
                      {stat.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Resources */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        <CardHeader className="py-3 px-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardTitle className="flex items-center gap-2 text-base dark:text-white">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Scale className="h-3.5 w-3.5 text-white" />
            </div>
            Regulatory Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-0.5">
            {[
              { label: 'FSSAI Guidelines', href: 'https://fssai.gov.in' },
              { label: 'Import Regulations', href: 'https://fssai.gov.in/cms/import.php' },
              { label: 'Labeling Requirements', href: 'https://fssai.gov.in/cms/labelling-and-display.php' },
              { label: 'Quality Standards', href: 'https://fssai.gov.in/cms/standards.php' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors py-2 px-2 rounded-lg group"
              >
                <span>{link.label}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter CTA */}
      <Card className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjLTIgMC00IDItNCAyczIgNCA0IDRjMiAwIDQtMiA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <CardContent className="p-4 text-white relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bell className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-base">Stay Updated</h3>
          </div>
          <p className="text-xs text-teal-50 mb-3 leading-relaxed">
            Get weekly industry insights, market reports, and regulatory updates delivered to your inbox.
          </p>
          <Button className="w-full bg-white text-teal-600 hover:bg-teal-50 font-semibold shadow-lg h-9 text-sm">
            Subscribe to Newsletter
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
