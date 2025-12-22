import Link from 'next/link';
import { Bot, Search, Sparkles, MessageSquare, Filter, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const searchCapabilities = [
  {
    icon: MessageSquare,
    title: 'Natural Language Queries',
    description: 'Search like you talk - "Find protein powder manufacturers in Mumbai with FSSAI certification"',
  },
  {
    icon: Filter,
    title: 'Smart Filters',
    description: 'AI automatically applies relevant filters based on your search intent',
  },
  {
    icon: Sparkles,
    title: 'Intent Recognition',
    description: 'Understands what you\'re looking for even with vague or incomplete queries',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get relevant matches in milliseconds with our optimized search engine',
  },
];

const exampleQueries = [
  'Show me ayurvedic manufacturers in Gujarat',
  'Find distributors dealing in sports nutrition',
  'Companies with GMP certification in South India',
  'Retailers looking for organic supplements',
  'Contract manufacturers for private labeling',
];

export default function AISearchPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-teal-100 text-teal-700">AI-Powered Feature</Badge>
            <div className="h-20 w-20 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-6">
              <Bot className="h-10 w-10 text-teal-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Search
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Find exactly what you need with simple, natural language queries.
              Our AI understands your intent and delivers precise results.
            </p>
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700" asChild>
              <Link href="/auth/signup">
                Try AI Search Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search Demo Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Search Like You Talk
            </h2>

            {/* Demo Search Box */}
            <div className="mb-8">
              <Link href="/search" className="block">
                <div className="flex items-center border-2 border-teal-200 hover:border-teal-400 rounded-xl p-4 bg-teal-50/50 transition-colors">
                  <Bot className="h-6 w-6 text-teal-600 mr-3" />
                  <span className="flex-1 text-gray-500">Try: Find protein manufacturers in Maharashtra...</span>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
            </div>

            {/* Example Queries */}
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-3">Example queries you can try:</p>
              {exampleQueries.map((query) => (
                <div
                  key={query}
                  className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-600 text-sm"
                >
                  <Sparkles className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                  {query}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 bg-teal-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            What Makes Our AI Search Special
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {searchCapabilities.map((capability) => (
              <Card key={capability.title} className="bg-white">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                    <capability.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {capability.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{capability.description}</p>
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
            Ready to Experience AI-Powered Search?
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Join thousands of businesses finding partners faster with intelligent search
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
