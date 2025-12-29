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
  Sparkles,
  CheckCircle2,
  ExternalLink,
  X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SupplierInsight {
  id: string;
  title: string;
  summary: string;
  aiSummary: string;
  keyTakeaways: string[];
  sourceTitle: string;
  sourceUrl: string;
  category: 'distribution' | 'retail' | 'ecommerce' | 'export' | 'market';
  icon: React.ReactNode;
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
    aiSummary: 'India\'s tier-2 and tier-3 cities are experiencing a nutraceutical boom, driven by rising health awareness and increasing disposable incomes. Distributors in cities like Lucknow, Jaipur, and Indore are actively seeking reliable supplement suppliers to meet growing demand.',
    keyTakeaways: [
      'Tier-2 cities showing 35% YoY growth in supplement distribution',
      'Key markets: Lucknow, Jaipur, Indore, Bhopal, Chandigarh',
      'Distributors prefer suppliers with consistent quality and timely delivery',
    ],
    sourceTitle: 'IBEF - Indian Pharmaceutical Industry Report',
    sourceUrl: 'https://www.ibef.org/industry/pharmaceutical-india',
    category: 'distribution',
    icon: <Truck className="h-5 w-5" />,
    stats: { label: 'Growth Rate', value: '+35%' },
  },
  {
    id: 'retail-1',
    title: 'Pharmacy Chains Expanding Wellness Sections',
    summary: 'Major pharmacy chains like Apollo and MedPlus are dedicating 40% more shelf space to nutraceuticals. Retailers seeking new product partnerships.',
    aiSummary: 'The organized pharmacy retail sector is pivoting towards wellness, with major chains significantly expanding their nutraceutical offerings. Apollo Pharmacy, MedPlus, and Wellness Forever are actively onboarding new supplement brands to cater to health-conscious consumers.',
    keyTakeaways: [
      'Apollo Pharmacy adding 500+ new wellness SKUs across stores',
      'MedPlus dedicating 40% more shelf space to supplements',
      'Priority given to FSSAI-compliant, GMP-certified products',
    ],
    sourceTitle: 'Economic Times - Pharmacy Retail Trends',
    sourceUrl: 'https://economictimes.indiatimes.com/industry/healthcare/biotech/pharmaceuticals',
    category: 'retail',
    icon: <Store className="h-5 w-5" />,
    stats: { label: 'Shelf Space', value: '+40%' },
  },
  {
    id: 'ecom-1',
    title: 'D2C Health Brands Looking for White-Label Partners',
    summary: 'E-commerce health brands on Amazon and Flipkart are seeking manufacturing partners for private label supplements. Contract manufacturing demand up 50%.',
    aiSummary: 'The D2C health and wellness sector is booming, with new brands launching on Amazon, Flipkart, and their own platforms. These brands need reliable contract manufacturers who can deliver quality products with quick turnaround times and flexible MOQs.',
    keyTakeaways: [
      'Contract manufacturing demand up 50% from D2C brands',
      'Brands prefer manufacturers offering formulation support',
      'Quick turnaround (4-6 weeks) and low MOQs (500-1000 units) preferred',
    ],
    sourceTitle: 'Statista - Health & Wellness E-commerce India',
    sourceUrl: 'https://www.statista.com/outlook/cmo/health-beauty-household/health-wellness/india',
    category: 'ecommerce',
    icon: <ShoppingCart className="h-5 w-5" />,
    stats: { label: 'Demand Increase', value: '+50%' },
  },
  {
    id: 'export-1',
    title: 'Export Opportunities to Southeast Asia',
    summary: 'Demand for Indian Ayurvedic and herbal supplements growing in Malaysia, Singapore, and Thailand. Export-ready suppliers can tap into $2B regional market.',
    aiSummary: 'Southeast Asian markets are showing strong appetite for Indian herbal and Ayurvedic products. Countries like Malaysia, Singapore, Thailand, and Vietnam are importing significant volumes of turmeric, ashwagandha, and tulsi-based supplements.',
    keyTakeaways: [
      'Southeast Asian herbal supplement market valued at $2B',
      'High demand for Ashwagandha, Turmeric, and Tulsi products',
      'Export certifications (WHO-GMP, ISO) essential for market entry',
    ],
    sourceTitle: 'APEDA - Agricultural & Processed Food Export',
    sourceUrl: 'https://apeda.gov.in/apedawebsite/organic/organic_products.htm',
    category: 'export',
    icon: <Globe className="h-5 w-5" />,
    stats: { label: 'Market Size', value: '$2B' },
  },
  {
    id: 'market-1',
    title: 'Wholesalers Seeking Protein Supplement Suppliers',
    summary: 'Sports nutrition and protein supplement demand surging. Wholesalers actively sourcing from manufacturers with competitive pricing and quality certifications.',
    aiSummary: 'The sports nutrition segment is witnessing unprecedented growth, driven by fitness awareness among youth. Wholesalers across India are actively seeking protein powder, BCAA, and pre-workout supplement suppliers who offer competitive pricing without compromising quality.',
    keyTakeaways: [
      'Sports nutrition market growing at 28% CAGR',
      'Whey protein and plant-based proteins in highest demand',
      'Wholesalers prioritize suppliers with quality certifications',
    ],
    sourceTitle: 'NutraIngredients Asia - Sports Nutrition',
    sourceUrl: 'https://www.nutraingredients-asia.com/Article/2024/01/15/sports-nutrition-market-trends-asia',
    category: 'market',
    icon: <Users className="h-5 w-5" />,
    stats: { label: 'Market Growth', value: '+28%' },
  },
  {
    id: 'retail-2',
    title: 'Modern Trade Expanding Immunity Product Range',
    summary: 'Big Bazaar, Reliance Fresh, and DMart increasing immunity supplement inventory. Looking for suppliers with FSSAI compliance and competitive MOQs.',
    aiSummary: 'Post-pandemic health awareness has permanently shifted consumer behavior. Modern trade retailers are capitalizing on this trend by expanding their immunity and wellness product ranges. They are actively seeking suppliers who can provide consistent quality at competitive prices.',
    keyTakeaways: [
      'Modern trade increasing immunity product inventory by 45%',
      'Focus on Vitamin C, D3, Zinc, and Immunity boosters',
      'Suppliers with competitive MOQs and FSSAI compliance preferred',
    ],
    sourceTitle: 'Business Standard - FMCG & Retail',
    sourceUrl: 'https://www.business-standard.com/industry/news/immunity-boosting-products-demand',
    category: 'retail',
    icon: <BarChart3 className="h-5 w-5" />,
    stats: { label: 'Inventory Increase', value: '+45%' },
  },
];

// Unified teal theme colors matching website branding
const categoryColors = {
  distribution: {
    bg: 'bg-teal-100 dark:bg-teal-900/50',
    text: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    border: 'border-teal-200 hover:border-teal-400 dark:border-teal-800 dark:hover:border-teal-600',
    gradient: 'from-teal-500 to-teal-600',
  },
  retail: {
    bg: 'bg-teal-100 dark:bg-teal-900/50',
    text: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    border: 'border-teal-200 hover:border-teal-400 dark:border-teal-800 dark:hover:border-teal-600',
    gradient: 'from-teal-500 to-teal-600',
  },
  ecommerce: {
    bg: 'bg-teal-100 dark:bg-teal-900/50',
    text: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    border: 'border-teal-200 hover:border-teal-400 dark:border-teal-800 dark:hover:border-teal-600',
    gradient: 'from-teal-500 to-teal-600',
  },
  export: {
    bg: 'bg-teal-100 dark:bg-teal-900/50',
    text: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    border: 'border-teal-200 hover:border-teal-400 dark:border-teal-800 dark:hover:border-teal-600',
    gradient: 'from-teal-500 to-teal-600',
  },
  market: {
    bg: 'bg-teal-100 dark:bg-teal-900/50',
    text: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    border: 'border-teal-200 hover:border-teal-400 dark:border-teal-800 dark:hover:border-teal-600',
    gradient: 'from-teal-500 to-teal-600',
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
  const [selectedInsight, setSelectedInsight] = useState<SupplierInsight | null>(null);

  useEffect(() => {
    // Simulate loading and shuffle insights for variety
    const shuffled = [...supplierInsights].sort(() => Math.random() - 0.5);
    setInsights(shuffled.slice(0, limit));
    setLoading(false);
  }, [limit]);

  const openModal = (insight: SupplierInsight) => {
    setSelectedInsight(insight);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedInsight(null);
    document.body.style.overflow = 'unset';
  };

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
                      className={`bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90`}
                      onClick={() => openModal(insight)}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      AI Summary
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Page Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-3xl max-h-[90vh] mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${categoryColors[selectedInsight.category].gradient} p-6 text-white`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    {selectedInsight.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white/20 text-white border-0">
                        {categoryLabels[selectedInsight.category]}
                      </Badge>
                      {selectedInsight.stats && (
                        <span className="text-sm font-semibold bg-white/20 px-2 py-0.5 rounded">
                          {selectedInsight.stats.value}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold">
                      {selectedInsight.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Original Summary */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedInsight.summary}
                </p>
              </div>

              {/* AI Summary */}
              <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${categoryColors[selectedInsight.category].bg}`}>
                    <Sparkles className={`h-5 w-5 ${categoryColors[selectedInsight.category].text}`} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">AI Summary</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {selectedInsight.aiSummary}
                </p>
              </div>

              {/* Key Takeaways */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-2 rounded-lg ${categoryColors[selectedInsight.category].bg}`}>
                    <CheckCircle2 className={`h-5 w-5 ${categoryColors[selectedInsight.category].text}`} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Key Takeaways</span>
                </div>
                <ul className="space-y-3">
                  {selectedInsight.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full ${categoryColors[selectedInsight.category].bg} ${categoryColors[selectedInsight.category].text} flex items-center justify-center text-sm font-semibold`}>
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 pt-0.5">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Source Link */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <ExternalLink className={`h-4 w-4 ${categoryColors[selectedInsight.category].text}`} />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Source</span>
                </div>
                <Link
                  href={selectedInsight.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${categoryColors[selectedInsight.category].bg} ${categoryColors[selectedInsight.category].text} hover:opacity-80 transition-opacity`}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="font-medium">{selectedInsight.sourceTitle}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
