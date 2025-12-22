'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  Users,
  Package,
  Star,
  Newspaper,
  BarChart3,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Shield,
  Award,
  Calendar,
  IndianRupee,
  FileText,
  Eye,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Company, NewsItem } from '@/lib/types';
import { IndustryInsightsCard } from './IndustryInsightsCard';
import { getNewsSummaryUrl } from '@/lib/utils/news';

interface CompanyTabsProps {
  company: Company;
  isLoggedIn?: boolean;
}

export function CompanyTabs({ company, isLoggedIn = false }: CompanyTabsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsFetched, setNewsFetched] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch news when user clicks on the News tab
  useEffect(() => {
    if (activeTab === 'news' && !newsFetched && !newsLoading) {
      setNewsLoading(true);
      fetch('/api/news/industry')
        .then((res) => res.json())
        .then((data) => {
          setNews(data.news || []);
          setNewsFetched(true);
        })
        .catch((error) => {
          console.error('Failed to fetch news:', error);
        })
        .finally(() => {
          setNewsLoading(false);
        });
    }
  }, [activeTab, newsFetched, newsLoading]);

  const companyNews = news.filter((n) =>
    n.relatedCompanyIds?.includes(company.id)
  );
  const industryNews = news.filter(
    (n) => n.category === 'industry' || n.category === 'regulatory'
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b dark:border-gray-700 rounded-none h-auto p-0 bg-transparent overflow-x-auto flex-nowrap">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-400 data-[state=active]:font-semibold px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-400 data-[state=active]:font-semibold px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <Package className="h-4 w-4 mr-1.5" />
            Products
          </TabsTrigger>
          <TabsTrigger
            value="news"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-400 data-[state=active]:font-semibold px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <Newspaper className="h-4 w-4 mr-1.5" />
            News
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-400 data-[state=active]:font-semibold px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-teal-500" />
            <span>Industry Insights</span>
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-400 data-[state=active]:font-semibold px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <Star className="h-4 w-4 mr-1.5" />
            Reviews
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <Card className="border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-teal-50/30 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
                  <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white">
                    <Building2 className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                    About {company.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  {company.aiSummary && (
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 border border-teal-200 dark:border-teal-700 rounded-xl p-4 mb-5">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">Business Type</p>
                          <p className="text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
                            {company.aiSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{company.description}</p>

                  {company.highlights && company.highlights.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-amber-500" />
                        Key Highlights
                      </h4>
                      <ul className="space-y-3">
                        {company.highlights.map((highlight, i) => (
                          <li
                            key={i}
                            className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Products & Services */}
              {company.products && company.products.length > 0 && (
                <Card className="border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-emerald-50/30 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
                    <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white">
                      <Package className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                      Products & Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5">
                    <div className="flex flex-wrap gap-2">
                      {company.products.map((product) => (
                        <Badge
                          key={product}
                          variant="secondary"
                          className="bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-3 py-1"
                        >
                          {product}
                        </Badge>
                      ))}
                    </div>
                    {company.brands && company.brands.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <Star className="h-4 w-4 mr-2 text-amber-500" />
                          Brands {company.type === 'distributor' ? 'Distributed' : 'Offered'}
                        </h4>
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

              {/* Coverage Area */}
              {company.coverageAreas && company.coverageAreas.length > 0 && (
                <Card className="border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
                    <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Coverage Area
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5">
                    <div className="bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-700 dark:to-gray-700 rounded-xl h-48 flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-600">
                      <div className="text-center">
                        <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Interactive Map Coming Soon</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {company.coverageAreas.map((area) => (
                        <Badge
                          key={area}
                          variant="secondary"
                          className="bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 px-3 py-1"
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Business Details */}
              <Card className="border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50/30 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
                  <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white">
                    <FileText className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-4">
                  {company.yearEstablished && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Established</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{company.yearEstablished}</p>
                      </div>
                    </div>
                  )}
                  {company.employeeCount && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employees</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{company.employeeCount}</p>
                      </div>
                    </div>
                  )}
                  {company.annualTurnover && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Annual Turnover</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{company.annualTurnover}</p>
                      </div>
                    </div>
                  )}
                  {company.gstNumber && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider font-medium">GST Verified</p>
                        <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                          {company.gstNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-teal-50/30 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
                  <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white">
                    <Phone className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-4">
                  {company.address && (
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Address</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{company.address}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {company.city}, {company.state} {company.pincode}
                        </p>
                      </div>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                        <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">{company.phone}</p>
                      </div>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                        <a href={`mailto:${company.email}`} className="text-sm text-teal-600 dark:text-teal-400 hover:underline">{company.email}</a>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="mt-6">
          <Card className="border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-emerald-50/30 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Package className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Products & Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {company.category?.map((cat) => (
                  <div
                    key={cat}
                    className="p-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50/30 dark:hover:bg-teal-900/30 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900 dark:to-emerald-900 flex items-center justify-center group-hover:from-teal-500 group-hover:to-emerald-500 transition-all duration-200">
                        <Package className="h-5 w-5 text-teal-600 dark:text-teal-400 group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{cat}</h4>
                    </div>
                  </div>
                ))}
              </div>
              {company.products && company.products.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-amber-500" />
                    Specific Products
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {company.products.map((product) => (
                      <Badge
                        key={product}
                        variant="secondary"
                        className="text-sm bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-3 py-1.5"
                      >
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="mt-6">
          {newsLoading ? (
            <div className="grid lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent className="pt-5 space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                        <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Company News */}
            <Card className="border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Newspaper className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Company News
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                {companyNews.length > 0 ? (
                  <div className="space-y-4">
                    {companyNews.slice(0, 2).map((item) => (
                      <Link
                        key={item.id}
                        href={getNewsSummaryUrl(item)}
                        className="block p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-200 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-900/30 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">AI Summary Available</span>
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {item.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">{item.source}</span>
                          <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Newspaper className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No company news available</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full mt-4 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All News
                </Button>
              </CardContent>
            </Card>

            {/* Industry News */}
            <Card className="border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50/30 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                  Related Industry News
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-4">
                  {industryNews.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      href={getNewsSummaryUrl(item)}
                      className="block p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-purple-200 dark:hover:border-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/30 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            item.category === 'regulatory'
                              ? 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
                              : 'bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                          }`}
                        >
                          {item.category === 'regulatory' ? 'Regulatory' : 'Industry'}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                          <Sparkles className="h-3 w-3" />
                          AI Summary
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Full Industry Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
          )}
        </TabsContent>

        {/* Industry Insights Tab */}
        <TabsContent value="insights" className="mt-6">
          <IndustryInsightsCard
            companyType={company.type}
            category={company.category || []}
          />
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-6">
          <Card className="border-2 border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-yellow-50/30 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center text-gray-900 dark:text-white">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Customer Reviews
                </span>
                <div className="flex items-center gap-3 bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-600">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(company.rating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {company.rating?.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({company.reviewsCount} reviews)
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-amber-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Reviews Coming Soon
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Be the first to share your experience working with {company.name}!
                </p>
                <Button variant="outline" className="border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300">
                  <Star className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
