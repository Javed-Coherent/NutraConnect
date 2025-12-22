import Link from 'next/link';
import { Newspaper, Bell, Bookmark, Filter, Clock, Building2, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const alertFeatures = [
  {
    icon: Bell,
    title: 'Real-Time Notifications',
    description: 'Get instant alerts when news breaks about companies you follow',
  },
  {
    icon: Filter,
    title: 'Custom Filters',
    description: 'Set up alerts for specific topics, companies, or market segments',
  },
  {
    icon: Bookmark,
    title: 'Save & Organize',
    description: 'Bookmark important news and organize them into custom collections',
  },
  {
    icon: Building2,
    title: 'Company-Specific News',
    description: 'Track news and updates for specific businesses in your network',
  },
];

const sampleNews = [
  {
    title: 'FSSAI Introduces New Guidelines for Nutraceutical Labeling',
    source: 'Industry Today',
    time: '2 hours ago',
    category: 'Regulatory',
  },
  {
    title: 'Indian Nutraceutical Market to Reach $18 Billion by 2025',
    source: 'Business Standard',
    time: '5 hours ago',
    category: 'Market',
  },
  {
    title: 'Top 10 Emerging Trends in Sports Nutrition Supplements',
    source: 'NutraInsights',
    time: '1 day ago',
    category: 'Trends',
  },
  {
    title: 'Government Announces Export Incentives for Ayurvedic Products',
    source: 'Economic Times',
    time: '2 days ago',
    category: 'Policy',
  },
];

export default function NewsAlertsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700">Stay Informed</Badge>
            <div className="h-20 w-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <Newspaper className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              News Alerts
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Stay updated with real-time news about companies and industry developments.
              Never miss an important update again.
            </p>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/auth/signup">
                Set Up Alerts
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sample News Feed */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Latest Industry News
          </h2>

          <div className="max-w-2xl mx-auto space-y-4">
            {sampleNews.map((news, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {news.category}
                        </Badge>
                        <span className="text-xs text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {news.time}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{news.title}</h3>
                      <p className="text-sm text-gray-500">{news.source}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="text-center pt-4">
              <Button variant="outline" className="border-emerald-300 text-emerald-700" asChild>
                <Link href="/search">
                  <Eye className="h-4 w-4 mr-2" />
                  Browse All News & Updates
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Alert Features */}
      <section className="py-16 bg-emerald-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Alert Features
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {alertFeatures.map((feature) => (
              <Card key={feature.title} className="bg-white">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Alert Setup Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Easy Alert Setup
          </h2>

          <div className="max-w-md mx-auto">
            <Card className="border-2 border-emerald-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Create New Alert</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Keywords</label>
                    <div className="border rounded-lg p-2 bg-gray-50 text-gray-400 text-sm">
                      e.g., protein powder, ayurvedic, FSSAI...
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Categories</label>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">Regulatory</Badge>
                      <Badge variant="outline">Market</Badge>
                      <Badge variant="outline">Companies</Badge>
                      <Badge variant="outline">+ More</Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Frequency</label>
                    <div className="border rounded-lg p-2 bg-gray-50 text-gray-400 text-sm">
                      Real-time / Daily digest / Weekly
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/search">
                    <Bell className="h-4 w-4 mr-2" />
                    Create Alert
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Never Miss Important Industry News
          </h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            Set up personalized alerts and stay ahead of industry developments
          </p>
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50" asChild>
            <Link href="/auth/signup">
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
