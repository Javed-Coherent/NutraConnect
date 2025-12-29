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
import { SupplierInsightsSection } from '@/components/insights/SupplierInsightsSection';

export const metadata: Metadata = {
  title: 'Find Customers - For Suppliers',
  description:
    'Find distributors, retailers, and buyers for your nutraceutical products. Expand your dealer network across India.',
};

const howItWorks = [
  {
    step: 1,
    title: 'Search',
    description: 'Use AI-powered search to find potential customers',
  },
  {
    step: 2,
    title: 'Filter',
    description: 'Narrow down by location, size, and requirements',
  },
  {
    step: 3,
    title: 'Connect',
    description: 'Reach out with verified contact details',
  },
  {
    step: 4,
    title: 'Close Deals',
    description: 'Build lasting business relationships',
  },
];

export default async function ForSuppliersPage() {
  // Get trending buyer-type companies based on engagement (last 7 days)
  const featuredCompanies = await getTrendingCompaniesAction(
    ['distributor', 'retailer', 'wholesaler', 'ecommerce'],
    2
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-900 dark:text-teal-300">
              For Manufacturers & Suppliers
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Find Customers for Your{' '}
              <span className="text-teal-600 dark:text-teal-400">Nutraceutical Products</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover distributors, retailers, and e-commerce platforms looking for quality
              health supplements to add to their portfolio
            </p>
          </div>

          {/* Search Bar with Region Filter */}
          <div className="max-w-3xl mx-auto">
            <SearchBar
              variant="hero"
              placeholder="e.g., buyers for protein supplements..."
              suggestions={SEARCH_SUGGESTIONS.suppliers}
              showRegionFilter={true}
            />
          </div>

        </div>
      </section>

      {/* Customer Insights Section */}
      <SupplierInsightsSection limit={4} />

      {/* Featured Companies Section */}
      <section className="py-12 bg-teal-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Top Potential Customers This Week
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Featured companies looking for suppliers</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredCompanies.map((company) => (
              <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-teal-100 hover:border-teal-300 bg-gradient-to-br from-white to-teal-50/30 dark:from-gray-800 dark:to-gray-800 dark:border-teal-800 dark:hover:border-teal-600 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
                      {company.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                          {company.name}
                        </h3>
                        <Badge variant="secondary" className="bg-teal-100 text-teal-700 border border-teal-200 dark:bg-teal-900 dark:text-teal-300 dark:border-teal-700">
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
                      {company.isVerified && (
                        <div className="flex items-center text-teal-600 dark:text-teal-400 text-sm font-medium">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          GST Verified
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-teal-100 dark:border-teal-800 flex justify-between items-center">
                    <Button size="sm" className="border-2 border-teal-500 bg-teal-100 text-teal-800 font-semibold hover:bg-teal-200 hover:border-teal-600 shadow-sm dark:bg-teal-900 dark:text-teal-300 dark:border-teal-700" asChild>
                      <Link href={`/company/${company.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View Profile
                      </Link>
                    </Button>
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">Featured company</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-teal-50/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-teal-200 dark:bg-teal-700" />
                )}
                <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm dark:shadow-gray-900/50">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
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
      <section className="py-12 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Expand Your Customer Base?
          </h2>
          <p className="text-teal-100 mb-6 max-w-xl mx-auto">
            Join thousands of suppliers already finding new customers on NutraConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50" asChild>
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
