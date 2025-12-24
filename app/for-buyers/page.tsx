import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Star,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEARCH_SUGGESTIONS } from '@/lib/constants';
import { getTrendingCompaniesAction } from '@/lib/actions/companies';
import { BuyerInsightsSection } from '@/components/insights/BuyerInsightsSection';

export const metadata: Metadata = {
  title: 'Find Suppliers - For Buyers',
  description:
    'Find manufacturers, raw material suppliers, and contract manufacturers for your nutraceutical business.',
};

const howItWorks = [
  {
    step: 1,
    title: 'Search',
    description: 'Find suppliers using natural language queries',
  },
  {
    step: 2,
    title: 'Compare',
    description: 'Evaluate multiple suppliers side by side',
  },
  {
    step: 3,
    title: 'Verify',
    description: 'Check certifications and credentials',
  },
  {
    step: 4,
    title: 'Connect',
    description: 'Reach out with verified contacts',
  },
];

export default async function ForBuyersPage() {
  // Get trending supplier-type companies based on engagement (last 7 days)
  const featuredCompanies = await getTrendingCompaniesAction(
    ['manufacturer', 'raw_material', 'formulator'],
    2
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300">
              For Distributors & Buyers
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Find Reliable Suppliers for Your{' '}
              <span className="text-emerald-600 dark:text-emerald-400">Nutraceutical Business</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover verified manufacturers, raw material suppliers, and contract manufacturers
              with quality certifications
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <SearchBar
              variant="hero"
              colorTheme="emerald"
              placeholder="e.g., protein powder manufacturers in Gujarat with GMP certification..."
              suggestions={SEARCH_SUGGESTIONS.buyers}
            />
          </div>

        </div>
      </section>

      {/* Buyer Insights Section */}
      <section className="py-12 bg-emerald-50/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <BuyerInsightsSection limit={4} />
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-12 bg-emerald-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Top Verified Suppliers This Week
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Certified manufacturers ready for partnership</p>
            </div>
            <Button className="border-2 border-emerald-500 bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200 hover:border-emerald-600 shadow-sm" asChild>
              <Link href="/search?type=manufacturer">
                <Eye className="h-4 w-4 mr-2" />
                See All
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredCompanies.map((company) => (
              <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800 dark:to-gray-800 dark:border-emerald-800 dark:hover:border-emerald-600 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
                      {company.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                          {company.name}
                        </h3>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-700">
                          Featured
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {company.type.charAt(0).toUpperCase() + company.type.slice(1).replace('_', ' ')} | {company.city}, {company.state}
                      </p>
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(company.rating || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-200 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({company.reviewsCount} reviews)
                        </span>
                      </div>
                      {company.verifications && (
                        <div className="flex flex-wrap gap-1">
                          {company.verifications.slice(0, 3).map((v) => (
                            <Badge
                              key={v}
                              variant="outline"
                              className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {v.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-100 dark:border-emerald-800 flex justify-between items-center">
                    <Button size="sm" className="border-2 border-emerald-500 bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200 hover:border-emerald-600 shadow-sm dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-700" asChild>
                      <Link href={`/company/${company.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View Profile
                      </Link>
                    </Button>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Featured supplier</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button className="border-2 border-emerald-500 bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200 hover:border-emerald-600 shadow-sm" asChild>
              <Link href="/search">
                <Eye className="h-4 w-4 mr-2" />
                Browse All Suppliers
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-emerald-50/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-emerald-200 dark:bg-emerald-700" />
                )}
                <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm dark:shadow-gray-900/50">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Supplier?
          </h2>
          <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
            Join thousands of buyers sourcing quality products on NutraConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50" asChild>
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
