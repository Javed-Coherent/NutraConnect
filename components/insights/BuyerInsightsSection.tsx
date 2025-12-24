'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Factory,
  FlaskConical,
  Leaf,
  Award,
  Package,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BuyerInsight {
  id: string;
  title: string;
  summary: string;
  category: 'manufacturing' | 'raw-materials' | 'certification' | 'formulation' | 'packaging' | 'quality';
  icon: React.ReactNode;
  actionLabel: string;
  actionHref: string;
  stats?: {
    label: string;
    value: string;
  };
}

interface BuyerInsightsSectionProps {
  limit?: number;
}

// Buyer-focused insights data - about finding suppliers
const buyerInsights: BuyerInsight[] = [
  {
    id: 'mfg-1',
    title: 'GMP-Certified Manufacturers Expanding Capacity',
    summary: 'Leading nutraceutical manufacturers are investing in new production lines. 45+ GMP-certified facilities now available for contract manufacturing partnerships.',
    category: 'manufacturing',
    icon: <Factory className="h-5 w-5" />,
    actionLabel: 'Find Manufacturers',
    actionHref: '/search?q=gmp+certified+manufacturers&type=manufacturer',
    stats: { label: 'GMP Facilities', value: '45+' },
  },
  {
    id: 'raw-1',
    title: 'Ayurvedic Raw Material Suppliers with FSSAI Compliance',
    summary: 'Verified suppliers offering ashwagandha, tulsi, brahmi, and other Ayurvedic extracts with full traceability and quality documentation.',
    category: 'raw-materials',
    icon: <Leaf className="h-5 w-5" />,
    actionLabel: 'Browse Raw Materials',
    actionHref: '/search?q=ayurvedic+raw+material+suppliers&type=raw_material',
    stats: { label: 'Verified Suppliers', value: '120+' },
  },
  {
    id: 'cert-1',
    title: 'ISO 22000 Certified Suppliers for Export Quality',
    summary: 'Find suppliers with international certifications including ISO 22000, HACCP, and organic certifications for export-quality products.',
    category: 'certification',
    icon: <Award className="h-5 w-5" />,
    actionLabel: 'Certified Suppliers',
    actionHref: '/search?q=iso+certified+nutraceutical+suppliers&type=manufacturer',
    stats: { label: 'ISO Certified', value: '85+' },
  },
  {
    id: 'form-1',
    title: 'Contract Formulators for Custom Supplement Development',
    summary: 'Expert formulators offering custom blend development, stability testing, and regulatory support for new product launches.',
    category: 'formulation',
    icon: <FlaskConical className="h-5 w-5" />,
    actionLabel: 'Find Formulators',
    actionHref: '/search?q=contract+formulation+services&type=formulator',
    stats: { label: 'R&D Labs', value: '35+' },
  },
  {
    id: 'pkg-1',
    title: 'Packaging Partners for Supplements & Nutraceuticals',
    summary: 'From bottles to blister packs, find packaging suppliers specializing in pharmaceutical-grade packaging with child-resistant options.',
    category: 'packaging',
    icon: <Package className="h-5 w-5" />,
    actionLabel: 'Packaging Suppliers',
    actionHref: '/search?q=nutraceutical+packaging+suppliers&type=packaging',
    stats: { label: 'Packaging Partners', value: '60+' },
  },
  {
    id: 'qual-1',
    title: 'Third-Party Testing Labs for Quality Assurance',
    summary: 'NABL-accredited labs offering heavy metal testing, microbial analysis, and potency verification for nutraceutical products.',
    category: 'quality',
    icon: <Shield className="h-5 w-5" />,
    actionLabel: 'Testing Labs',
    actionHref: '/search?q=nutraceutical+testing+labs&type=testing_lab',
    stats: { label: 'NABL Labs', value: '25+' },
  },
];

const categoryColors = {
  manufacturing: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    border: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-800 dark:hover:border-emerald-600',
  },
  'raw-materials': {
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    border: 'border-green-200 hover:border-green-400 dark:border-green-800 dark:hover:border-green-600',
  },
  certification: {
    bg: 'bg-amber-100 dark:bg-amber-900/50',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    border: 'border-amber-200 hover:border-amber-400 dark:border-amber-800 dark:hover:border-amber-600',
  },
  formulation: {
    bg: 'bg-purple-100 dark:bg-purple-900/50',
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    border: 'border-purple-200 hover:border-purple-400 dark:border-purple-800 dark:hover:border-purple-600',
  },
  packaging: {
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    border: 'border-blue-200 hover:border-blue-400 dark:border-blue-800 dark:hover:border-blue-600',
  },
  quality: {
    bg: 'bg-rose-100 dark:bg-rose-900/50',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
    border: 'border-rose-200 hover:border-rose-400 dark:border-rose-800 dark:hover:border-rose-600',
  },
};

const categoryLabels = {
  manufacturing: 'Manufacturing',
  'raw-materials': 'Raw Materials',
  certification: 'Certification',
  formulation: 'Formulation',
  packaging: 'Packaging',
  quality: 'Quality',
};

export function BuyerInsightsSection({ limit = 4 }: BuyerInsightsSectionProps) {
  const [insights, setInsights] = useState<BuyerInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and shuffle insights for variety
    const shuffled = [...buyerInsights].sort(() => Math.random() - 0.5);
    setInsights(shuffled.slice(0, limit));
    setLoading(false);
  }, [limit]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="overflow-hidden border-2 border-emerald-100 dark:border-emerald-800">
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
            Supplier Opportunities
          </h2>
          <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 animate-pulse">
            <TrendingUp className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
        <Link
          href="/insights?audience=buyers"
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
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
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
