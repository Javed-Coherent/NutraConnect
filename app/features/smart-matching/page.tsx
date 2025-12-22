import Link from 'next/link';
import { Target, Sparkles, Users, Brain, Percent, Bell, ArrowRight, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const matchingFeatures = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Our algorithms analyze your business profile to find the most compatible partners',
  },
  {
    icon: Percent,
    title: 'Match Score',
    description: 'See compatibility percentage based on multiple business factors',
  },
  {
    icon: Users,
    title: 'Mutual Interest',
    description: 'Get notified when companies you match with are also looking for you',
  },
  {
    icon: Bell,
    title: 'New Match Alerts',
    description: 'Receive notifications when new high-potential matches are found',
  },
];

const sampleMatches = [
  { name: 'HealthFirst Distributors', location: 'Delhi NCR', matchScore: 95, type: 'Distributor' },
  { name: 'Wellness Mart Chain', location: 'Mumbai', matchScore: 88, type: 'Retailer' },
  { name: 'NutriPharma Exports', location: 'Bangalore', matchScore: 82, type: 'Exporter' },
];

export default function SmartMatchingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700">AI Recommendations</Badge>
            <div className="h-20 w-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <Target className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Smart Matching
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Let AI find your perfect business partners. Our intelligent matching system
              suggests the most relevant companies based on your profile and needs.
            </p>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/auth/signup">
                Get Matched
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sample Matches */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Your Top Matches
          </h2>

          <div className="max-w-2xl mx-auto space-y-4">
            {sampleMatches.map((match, index) => (
              <Card key={index} className="border-2 border-emerald-100 hover:border-emerald-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                        {match.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{match.name}</h3>
                        <Badge variant="outline" className="text-xs">{match.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{match.location}</p>
                    </div>

                    <div className="text-center">
                      <div className="relative h-14 w-14">
                        <svg className="h-14 w-14 -rotate-90">
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke="#d1fae5"
                            strokeWidth="4"
                          />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="4"
                            strokeDasharray={`${match.matchScore * 1.5} 150`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-emerald-600">{match.matchScore}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Match</p>
                    </div>

                    <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700" asChild>
                      <Link href="/search">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="text-center pt-4">
              <Button variant="outline" className="border-emerald-300 text-emerald-700" asChild>
                <Link href="/search">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Companies
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How Matching Works */}
      <section className="py-16 bg-emerald-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            How Smart Matching Works
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create Profile</h3>
                <p className="text-sm text-gray-600">Tell us about your business and what you&apos;re looking for</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-600">Our AI analyzes thousands of companies for compatibility</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Matches</h3>
                <p className="text-sm text-gray-600">Receive personalized recommendations with match scores</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Connect</h3>
                <p className="text-sm text-gray-600">Reach out to your best matches and start partnerships</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matching Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Matching Features
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {matchingFeatures.map((feature) => (
              <Card key={feature.title} className="bg-emerald-50/30 border-emerald-100">
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

      {/* Match Criteria */}
      <section className="py-16 bg-emerald-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            What We Consider for Matching
          </h2>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {[
              'Business Type', 'Product Categories', 'Geographic Location', 'Certifications',
              'Company Size', 'Years in Business', 'Trade Preferences', 'Budget Range',
              'Specializations', 'Distribution Network', 'Export Capability', 'Quality Standards'
            ].map((criteria) => (
              <Badge key={criteria} variant="outline" className="px-4 py-2 text-sm bg-white">
                <Star className="h-3 w-3 mr-2 text-emerald-500" />
                {criteria}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Let AI Find Your Perfect Business Partners
          </h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            Stop searching manually. Get intelligent recommendations tailored to your business.
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
