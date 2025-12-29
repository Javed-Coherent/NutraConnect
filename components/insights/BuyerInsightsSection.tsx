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
  Sparkles,
  CheckCircle2,
  ExternalLink,
  X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BuyerInsight {
  id: string;
  title: string;
  summary: string;
  aiSummary: string;
  keyTakeaways: string[];
  sourceTitle: string;
  sourceUrl: string;
  category: 'manufacturing' | 'raw-materials' | 'certification' | 'formulation' | 'packaging' | 'quality';
  icon: React.ReactNode;
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
    aiSummary: 'India\'s nutraceutical manufacturing sector is undergoing rapid expansion with major players investing heavily in WHO-GMP certified facilities. These manufacturers are actively seeking brand partners for contract manufacturing, offering competitive pricing and quick turnaround times.',
    keyTakeaways: [
      '45+ WHO-GMP certified facilities available for partnerships',
      'Average lead time reduced to 4-6 weeks for new products',
      'Manufacturers offering end-to-end services from formulation to packaging',
    ],
    sourceTitle: 'IBEF - Indian Pharmaceutical Industry Report',
    sourceUrl: 'https://www.ibef.org/industry/pharmaceutical-india',
    category: 'manufacturing',
    icon: <Factory className="h-5 w-5" />,
    stats: { label: 'GMP Facilities', value: '45+' },
  },
  {
    id: 'raw-1',
    title: 'Ayurvedic Raw Material Suppliers with FSSAI Compliance',
    summary: 'Verified suppliers offering ashwagandha, tulsi, brahmi, and other Ayurvedic extracts with full traceability and quality documentation.',
    aiSummary: 'The demand for certified Ayurvedic raw materials is at an all-time high. Leading suppliers are now offering standardized extracts with complete COA documentation, heavy metal testing certificates, and FSSAI compliance for hassle-free procurement.',
    keyTakeaways: [
      'Over 120 verified suppliers with FSSAI-compliant documentation',
      'Standardized extracts available with consistent potency levels',
      'Full traceability from farm to factory now standard practice',
    ],
    sourceTitle: 'AYUSH Ministry - Herbal Raw Materials',
    sourceUrl: 'https://ayush.gov.in/',
    category: 'raw-materials',
    icon: <Leaf className="h-5 w-5" />,
    stats: { label: 'Verified Suppliers', value: '120+' },
  },
  {
    id: 'cert-1',
    title: 'ISO 22000 Certified Suppliers for Export Quality',
    summary: 'Find suppliers with international certifications including ISO 22000, HACCP, and organic certifications for export-quality products.',
    aiSummary: 'For brands targeting export markets, finding ISO 22000 and HACCP certified suppliers is critical. India now has over 85 nutraceutical suppliers with these internationally recognized certifications, enabling smoother market entry into EU, US, and Middle Eastern markets.',
    keyTakeaways: [
      '85+ suppliers with ISO 22000/HACCP certifications',
      'Organic certifications (USDA, EU Organic) increasingly common',
      'Export documentation support available from certified suppliers',
    ],
    sourceTitle: 'Quality Council of India',
    sourceUrl: 'https://www.qcin.org/',
    category: 'certification',
    icon: <Award className="h-5 w-5" />,
    stats: { label: 'ISO Certified', value: '85+' },
  },
  {
    id: 'form-1',
    title: 'Contract Formulators for Custom Supplement Development',
    summary: 'Expert formulators offering custom blend development, stability testing, and regulatory support for new product launches.',
    aiSummary: 'The CDMO landscape in India has matured significantly, with expert formulators now offering comprehensive services from concept to commercialization. These include custom formulation development, stability studies, and complete regulatory filing support for FSSAI approvals.',
    keyTakeaways: [
      '35+ R&D labs offering custom formulation services',
      'Stability testing and shelf-life studies included in packages',
      'FSSAI regulatory support and filing assistance available',
    ],
    sourceTitle: 'Pharmexcil - Pharma Export Council',
    sourceUrl: 'https://pharmexcil.com/',
    category: 'formulation',
    icon: <FlaskConical className="h-5 w-5" />,
    stats: { label: 'R&D Labs', value: '35+' },
  },
  {
    id: 'pkg-1',
    title: 'Packaging Partners for Supplements & Nutraceuticals',
    summary: 'From bottles to blister packs, find packaging suppliers specializing in pharmaceutical-grade packaging with child-resistant options.',
    aiSummary: 'Premium packaging is becoming a key differentiator for nutraceutical brands. Specialized packaging suppliers are now offering pharma-grade solutions including HDPE bottles, blister packs, sachets, and innovative delivery formats with child-resistant and tamper-evident features.',
    keyTakeaways: [
      '60+ specialized nutraceutical packaging suppliers',
      'Sustainable packaging options growing rapidly',
      'Small MOQs available for startup brands (as low as 1000 units)',
    ],
    sourceTitle: 'Indian Institute of Packaging',
    sourceUrl: 'https://www.iip-in.com/',
    category: 'packaging',
    icon: <Package className="h-5 w-5" />,
    stats: { label: 'Packaging Partners', value: '60+' },
  },
  {
    id: 'qual-1',
    title: 'Third-Party Testing Labs for Quality Assurance',
    summary: 'NABL-accredited labs offering heavy metal testing, microbial analysis, and potency verification for nutraceutical products.',
    aiSummary: 'Quality assurance through third-party testing is now essential for brand credibility and regulatory compliance. NABL-accredited labs across India offer comprehensive testing panels including heavy metals, pesticide residues, microbial counts, and active ingredient potency verification.',
    keyTakeaways: [
      '25+ NABL-accredited labs specialized in nutraceuticals',
      'Quick turnaround times (3-5 working days) for standard tests',
      'Comprehensive panels covering FSSAI and export requirements',
    ],
    sourceTitle: 'NABL - National Accreditation Board',
    sourceUrl: 'https://nabl-india.org/',
    category: 'quality',
    icon: <Shield className="h-5 w-5" />,
    stats: { label: 'NABL Labs', value: '25+' },
  },
];

// Unified emerald theme colors matching website branding for buyers
const categoryColors = {
  manufacturing: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    border: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-800 dark:hover:border-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  'raw-materials': {
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    border: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-800 dark:hover:border-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  certification: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    border: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-800 dark:hover:border-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  formulation: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    border: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-800 dark:hover:border-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  packaging: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    border: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-800 dark:hover:border-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  quality: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    border: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-800 dark:hover:border-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
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
  const [selectedInsight, setSelectedInsight] = useState<BuyerInsight | null>(null);

  useEffect(() => {
    // Simulate loading and shuffle insights for variety
    const shuffled = [...buyerInsights].sort(() => Math.random() - 0.5);
    setInsights(shuffled.slice(0, limit));
    setLoading(false);
  }, [limit]);

  const openModal = (insight: BuyerInsight) => {
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
