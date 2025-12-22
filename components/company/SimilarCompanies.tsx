import Link from 'next/link';
import { Star, MapPin, ArrowRight, CheckCircle2, Building2, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Company } from '@/lib/types';
import { COMPANY_TYPES } from '@/lib/constants';

interface SimilarCompaniesProps {
  companies: Company[];
  currentCompanyType?: string;
}

export function SimilarCompanies({ companies, currentCompanyType }: SimilarCompaniesProps) {
  if (companies.length === 0) {
    return null;
  }

  const typeInfo = currentCompanyType ? COMPANY_TYPES[currentCompanyType as keyof typeof COMPANY_TYPES] : null;

  return (
    <section className="bg-gradient-to-br from-gray-50 via-teal-50/20 to-emerald-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 border-t dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Similar Companies
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {typeInfo ? (
                <>Explore other <span className="text-teal-600 dark:text-teal-400 font-medium">{typeInfo.label}s</span> you might be interested in</>
              ) : (
                'Explore other companies you might be interested in'
              )}
            </p>
          </div>
          <Button variant="outline" className="border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300 hidden sm:flex" asChild>
            <Link href="/search">
              View All Companies
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {companies.map((company) => {
            const companyTypeInfo = COMPANY_TYPES[company.type];
            return (
              <Link key={company.id} href={`/company/${company.id}`}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600 bg-white dark:bg-gray-800 hover:-translate-y-1 group overflow-hidden">
                  <CardContent className="p-5">
                    {/* Logo & Name */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                          {company.name.charAt(0)}
                        </div>
                        {company.isVerified && (
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center border-2 border-white dark:border-gray-800">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                          {company.name}
                        </h3>
                        <Badge variant="secondary" className="mt-1 bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 text-xs">
                          {companyTypeInfo?.label || company.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {company.rating?.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({company.reviewsCount})
                      </span>
                    </div>

                    {/* Location & Year */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 text-teal-500 dark:text-teal-400" />
                        {company.city}, {company.state}
                      </div>
                      {company.yearEstablished && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          Est. {company.yearEstablished}
                        </div>
                      )}
                    </div>

                    {/* Categories */}
                    {company.category && company.category.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {company.category.slice(0, 2).map((cat) => (
                          <Badge
                            key={cat}
                            variant="outline"
                            className="text-xs bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                          >
                            {cat}
                          </Badge>
                        ))}
                        {company.category.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                            +{company.category.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* View Profile Button */}
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" className="border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300" asChild>
            <Link href="/search">
              View All Companies
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
