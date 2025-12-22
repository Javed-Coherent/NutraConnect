import { Metadata } from 'next';
import Link from 'next/link';
import {
  Target,
  Users,
  Shield,
  Zap,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPlatformStats } from '@/lib/actions/stats';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about NutraConnect - India\'s leading B2B platform connecting nutraceutical manufacturers, distributors, and retailers.',
};

const values = [
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description:
      'We verify every business on our platform to ensure you connect with legitimate, reliable partners.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description:
      'We leverage AI and cutting-edge technology to make business discovery faster and smarter.',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'We\'re building a thriving ecosystem where businesses of all sizes can grow together.',
  },
  {
    icon: Heart,
    title: 'Customer Success',
    description:
      'Your success is our success. We\'re committed to helping you find the right business partners.',
  },
];

export default async function AboutPage() {
  // Fetch dynamic stats from the database
  const platformStats = await getPlatformStats();

  const stats = [
    { value: platformStats.companiesFormatted, label: 'Verified Companies' },
    { value: platformStats.citiesFormatted, label: 'Cities Covered' },
    { value: platformStats.usersFormatted, label: 'Active Users' },
  ];
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">About Us</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Connecting India&apos;s{' '}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Nutraceutical Industry
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              NutraConnect is India&apos;s leading B2B intelligence platform for the
              nutraceutical industry, helping manufacturers, distributors, and
              retailers find the right business partners.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 mb-4">
                <Target className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                To democratize access to business intelligence in India&apos;s
                nutraceutical industry, enabling businesses of all sizes to
                discover, connect, and grow with verified partners.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                We believe that finding the right business partner shouldn&apos;t be
                difficult. That&apos;s why we&apos;ve built an AI-powered platform that
                makes it easy to search, compare, and connect with verified
                companies across the supply chain.
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-6">Why We Started</h3>
              <p className="text-teal-50 mb-4">
                The nutraceutical industry in India is booming, but finding
                reliable business partners remains a challenge. Manufacturers
                struggle to find distributors, retailers can&apos;t verify
                suppliers, and valuable partnerships go unrealized.
              </p>
              <p className="text-teal-50">
                We started NutraConnect to solve this problem - to create a
                trusted marketplace where quality businesses can find each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-teal-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              These core values guide everything we do at NutraConnect
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value) => (
              <Card key={value.title} className="text-center dark:bg-gray-900 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 mb-4">
                    <value.icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
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
            Ready to Join India&apos;s Largest Nutraceutical Network?
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Start discovering verified business partners today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-teal-600 hover:bg-teal-50"
              asChild
            >
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
