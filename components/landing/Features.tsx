import {
  Bot,
  BadgeCheck,
  TrendingUp,
  Newspaper,
  GitCompare,
  Target,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Search',
    description:
      'Natural language search - find exactly what you need with simple queries like "protein manufacturers in Gujarat"',
    color: 'blue',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Contacts',
    description:
      'GST verified businesses with direct phone numbers and email contacts you can trust',
    color: 'green',
  },
  {
    icon: TrendingUp,
    title: 'Industry Insights',
    description:
      'Market trends, growth data, and comprehensive analysis to make informed decisions',
    color: 'purple',
  },
  {
    icon: Newspaper,
    title: 'News Alerts',
    description:
      'Real-time news about companies and industry developments delivered to your inbox',
    color: 'orange',
  },
  {
    icon: GitCompare,
    title: 'Company Compare',
    description:
      'Side-by-side comparison of multiple companies to find your perfect partner',
    color: 'pink',
  },
  {
    icon: Target,
    title: 'Smart Matching',
    description:
      'AI suggests the most relevant business partners based on your requirements',
    color: 'cyan',
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
  green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
  purple: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' },
};

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Find the Right Partner
          </h2>
          <p className="text-lg text-gray-600">
            Powerful tools and insights to connect you with verified businesses across the nutraceutical supply chain
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const colors = colorClasses[feature.color];
            return (
              <Card
                key={feature.title}
                className={`border-2 ${colors.border} hover:shadow-lg transition-shadow duration-300`}
              >
                <CardContent className="p-6">
                  <div
                    className={`h-12 w-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
