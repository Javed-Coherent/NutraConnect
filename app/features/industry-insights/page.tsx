import Link from 'next/link';
import { TrendingUp, BarChart3, PieChart, LineChart, Target, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const insightTypes = [
  {
    icon: BarChart3,
    title: 'Market Size Data',
    description: 'Comprehensive market size and growth projections for nutraceutical segments',
  },
  {
    icon: PieChart,
    title: 'Category Analysis',
    description: 'Deep dive into product categories, trends, and consumer preferences',
  },
  {
    icon: LineChart,
    title: 'Growth Trends',
    description: 'Historical data and future projections for informed decision making',
  },
  {
    icon: Target,
    title: 'Regional Insights',
    description: 'State-wise and city-wise market intelligence across India',
  },
];

const sampleStats = [
  { label: 'Market Size', value: '₹52,000 Cr', change: '+12.5%', positive: true },
  { label: 'YoY Growth', value: '18.2%', change: '+3.1%', positive: true },
  { label: 'New Entrants', value: '2,340', change: '+28%', positive: true },
  { label: 'Export Growth', value: '24.5%', change: '+5.2%', positive: true },
];

export default function IndustryInsightsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-teal-100 text-teal-700">Market Intelligence</Badge>
            <div className="h-20 w-20 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-10 w-10 text-teal-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Industry Insights
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Stay ahead with comprehensive market trends, growth data,
              and analysis of India&apos;s nutraceutical industry.
            </p>
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700" asChild>
              <Link href="/auth/signup">
                Access Full Reports
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sample Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Industry Snapshot
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {sampleStats.map((stat) => (
              <Card key={stat.label} className="bg-teal-50/50 border-teal-100">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className={`flex items-center justify-center text-sm ${stat.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.positive ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" className="border-teal-300 text-teal-700" asChild>
              <Link href="/search">
                View detailed breakdowns and historical data
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sample Chart Area */}
      <section className="py-16 bg-teal-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Market Trends Visualization
          </h2>

          <div className="max-w-3xl mx-auto">
            <Card className="relative overflow-hidden">
              <CardContent className="p-8">
                {/* Placeholder Chart */}
                <div className="h-64 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-end justify-around p-4">
                    {[40, 55, 45, 70, 60, 80, 75, 90, 85, 95].map((height, i) => (
                      <div
                        key={i}
                        className="w-6 bg-teal-500/80 rounded-t transition-all hover:bg-teal-600"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Insight Types */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            What&apos;s Included
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {insightTypes.map((insight) => (
              <Card key={insight.title} className="bg-teal-50/30 border-teal-100">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                    <insight.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Make Data-Driven Decisions
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Get access to comprehensive industry reports and real-time market data
          </p>
          <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50" asChild>
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
