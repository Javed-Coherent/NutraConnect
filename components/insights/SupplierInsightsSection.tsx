'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Store,
  ShoppingCart,
  Truck,
  Globe,
  Users,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SupplierInsight {
  id: string;
  title: string;
  summary: string;
  category: 'distribution' | 'retail' | 'ecommerce' | 'export' | 'market';
  icon: React.ReactNode;
  actionLabel: string;
  actionHref: string;
  stats?: {
    label: string;
    value: string;
  };
}

interface SupplierInsightsSectionProps {
  limit?: number;
}

// Supplier-focused insights data
const supplierInsights: SupplierInsight[] = [
  {
    id: 'dist-1',
    title: 'Distribution Channel Growth in Tier-2 Cities',
    summary: 'Nutraceutical distribution networks are expanding rapidly in tier-2 and tier-3 cities with 35% YoY growth. Distributors are actively seeking quality supplement suppliers.',
    category: 'distribution',
    icon: <Truck className="h-5 w-5" />,
    actionLabel: 'Find Distributors',
    actionHref: '/search?q=distributors+health+supplements&type=distributor',
    stats: { label: 'Growth Rate', value: '+35%' },
  },
  {
    id: 'retail-1',
    title: 'Pharmacy Chains Expanding Wellness Sections',
    summary: 'Major pharmacy chains like Apollo and MedPlus are dedicating 40% more shelf space to nutraceuticals. Retailers seeking new product partnerships.',
    category: 'retail',
    icon: <Store className="h-5 w-5" />,
    actionLabel: 'Connect with Retailers',
    actionHref: '/search?q=pharmacy+retailers+nutraceuticals&type=retailer',
    stats: { label: 'Shelf Space', value: '+40%' },
  },
  {
    id: 'ecom-1',
    title: 'D2C Health Brands Looking for White-Label Partners',
    summary: 'E-commerce health brands on Amazon and Flipkart are seeking manufacturing partners for private label supplements. Contract manufacturing demand up 50%.',
    category: 'ecommerce',
    icon: <ShoppingCart className="h-5 w-5" />,
    actionLabel: 'Explore E-commerce',
    actionHref: '/search?q=ecommerce+health+products&type=ecommerce',
    stats: { label: 'Demand Increase', value: '+50%' },
  },
  {
    id: 'export-1',
    title: 'Export Opportunities to Southeast Asia',
    summary: 'Demand for Indian Ayurvedic and herbal supplements growing in Malaysia, Singapore, and Thailand. Export-ready suppliers can tap into $2B regional market.',
    category: 'export',
    icon: <Globe className="h-5 w-5" />,
    actionLabel: 'Find Export Partners',
    actionHref: '/search?q=export+importers+herbal&type=importer_exporter',
    stats: { label: 'Market Size', value: '$2B' },
  },
  {
    id: 'market-1',
    title: 'Wholesalers Seeking Protein Supplement Suppliers',
    summary: 'Sports nutrition and protein supplement demand surging. Wholesalers actively sourcing from manufacturers with competitive pricing and quality certifications.',
    category: 'market',
    icon: <Users className="h-5 w-5" />,
    actionLabel: 'Browse Wholesalers',
    actionHref: '/search?q=wholesalers+protein+supplements&type=wholesaler',
    stats: { label: 'Market Growth', value: '+28%' },
  },
  {
    id: 'retail-2',
    title: 'Modern Trade Expanding Immunity Product Range',
    summary: 'Big Bazaar, Reliance Fresh, and DMart increasing immunity supplement inventory. Looking for suppliers with FSSAI compliance and competitive MOQs.',
    category: 'retail',
    icon: <BarChart3 className="h-5 w-5" />,
    actionLabel: 'View Opportunities',
    actionHref: '/search?q=modern+trade+immunity+supplements&type=retailer',
    stats: { label: 'Inventory Increase', value: '+45%' },
  },
];

const categoryColors = {
  distribution: {
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    border: 'border-blue-200 hover:border-blue-400 dark:border-blue-800 dark:hover:border-blue-600',
  },
  retail: {
    bg: 'bg-purple-100 dark:bg-purple-900/50',
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    border: 'border-purple-200 hover:border-purple-400 dark:border-purple-800 dark:hover:border-purple-600',
  },
  ecommerce: {
    bg: 'bg-orange-100 dark:bg-orange-900/50',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    border: 'border-orange-200 hover:border-orange-400 dark:border-orange-800 dark:hover:border-orange-600',
  },
  export: {
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    border: 'border-green-200 hover:border-green-400 dark:border-green-800 dark:hover:border-green-600',
  },
  market: {
    bg: 'bg-teal-100 dark:bg-teal-900/50',
    text: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    border: 'border-teal-200 hover:border-teal-400 dark:border-teal-800 dark:hover:border-teal-600',
  },
};

const categoryLabels = {
  distribution: 'Distribution',
  retail: 'Retail',
  ecommerce: 'E-commerce',
  export: 'Export',
  market: 'Market',
};

export function SupplierInsightsSection({ limit = 4 }: SupplierInsightsSectionProps) {
  const [insights, setInsights] = useState<SupplierInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and shuffle insights for variety
    const shuffled = [...supplierInsights].sort(() => Math.random() - 0.5);
    setInsights(shuffled.slice(0, limit));
    setLoading(false);
  }, [limit]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="overflow-hidden border-2 border-teal-100 dark:border-teal-800">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Opportunities
          </h2>
          <Badge className="bg-teal-500 text-white hover:bg-teal-600 animate-pulse">
            <TrendingUp className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
        <Link
          href="/insights?audience=suppliers"
          className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
        >
          View All Insights
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {insights.map((insight) => {
          const colors = categoryColors[insight.category];
          return (
            <Card
              key={insight.id}
              className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-2 ${colors.border} bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-800 hover:-translate-y-1`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text} flex-shrink-0`}>
                    {insight.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={colors.badge}>
                        {categoryLabels[insight.category]}
                      </Badge>
                      {insight.stats && (
                        <span className={`text-sm font-semibold ${colors.text}`}>
                          {insight.stats.value}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {insight.summary}
                    </p>
                    <Button
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      asChild
                    >
                      <Link href={insight.actionHref}>
                        {insight.actionLabel}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
