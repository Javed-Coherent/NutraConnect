'use client';

import {
  Building2,
  Package,
  Star,
  CheckCircle2,
  Award,
  Calendar,
  Users,
  IndianRupee,
  Shield,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/lib/types';

interface CompanyOverviewProps {
  company: Company;
}

export function CompanyOverview({ company }: CompanyOverviewProps) {
  return (
    <section id="overview" className="scroll-mt-20">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Card */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
            <CardHeader className="py-4 px-5 bg-gradient-to-r from-teal-50 to-emerald-50/50 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
              <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mr-3">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                About {company.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {/* Business Type Badge */}
              {company.aiSummary && (
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 border border-teal-200 dark:border-teal-700 rounded-xl p-4 mb-5">
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
                    Business Type
                  </p>
                  <p className="text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
                    {company.aiSummary}
                  </p>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {company.description}
              </p>

              {/* Key Highlights */}
              {company.highlights && company.highlights.length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center text-sm">
                    <Award className="h-4 w-4 mr-2 text-amber-500" />
                    Key Highlights & Certifications
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {company.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products & Services Card */}
          {company.products && company.products.length > 0 && (
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
              <CardHeader className="py-4 px-5 bg-gradient-to-r from-emerald-50 to-green-50/50 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
                <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mr-3">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  Products & Services
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {/* Product Categories */}
                {company.category && company.category.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {company.category.map((cat) => (
                        <Badge
                          key={cat}
                          className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-3 py-1.5 text-sm font-medium"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specific Products */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Products
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {company.products.map((product) => (
                      <Badge
                        key={product}
                        variant="secondary"
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 px-3 py-1"
                      >
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                {company.brands && company.brands.length > 0 && (
                  <div className="pt-5 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                      <Star className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                      Brands {company.type === 'distributor' ? 'Distributed' : 'Offered'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {company.brands.map((brand) => (
                        <Badge
                          key={brand}
                          variant="outline"
                          className="bg-amber-50/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700 px-3 py-1"
                        >
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Business Details */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
            <CardHeader className="py-3 px-4 bg-gradient-to-r from-purple-50 to-indigo-50/50 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
              <CardTitle className="text-base flex items-center text-gray-900 dark:text-white">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mr-2">
                  <FileText className="h-3.5 w-3.5 text-white" />
                </div>
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {company.yearEstablished && (
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Established
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {company.yearEstablished}
                    </p>
                  </div>
                </div>
              )}

              {company.employeeCount && (
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Employees
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {company.employeeCount}
                    </p>
                  </div>
                </div>
              )}

              {company.annualTurnover && (
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <IndianRupee className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Annual Turnover
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {company.annualTurnover}
                    </p>
                  </div>
                </div>
              )}

              {company.gstNumber && (
                <div className="flex items-center gap-3 p-2.5 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-[10px] text-green-600 dark:text-green-400 uppercase tracking-wider font-medium">
                      GST Verified
                    </p>
                    <p className="font-mono text-xs text-gray-700 dark:text-gray-300">
                      {company.gstNumber}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
