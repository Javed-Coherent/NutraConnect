import Link from 'next/link';
import {
  ArrowRight,
  Factory,
  Search,
  Bot,
  BadgeCheck,
  TrendingUp,
  Newspaper,
  Building2,
  MapPin,
  Users,
  Quote,
  Star,
  Sparkles,
  Play,
} from 'lucide-react';
import { getPlatformStats } from '@/lib/actions/stats';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Hero Section
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/50 px-4 py-1.5 text-sm text-teal-700 dark:text-teal-300 mb-6">
            <span className="mr-2">AI-Powered</span>
            <span className="h-1 w-1 rounded-full bg-teal-400" />
            <span className="ml-2">50,000+ Verified Companies</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Find Your Next Business Partner in{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Nutraceuticals
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            AI-powered intelligence platform connecting manufacturers, distributors, and retailers
            across India&apos;s health supplement industry.
          </p>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* For Suppliers */}
            <Link href="/for-suppliers" className="group">
              <div className="h-full border-2 border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/30 hover:border-teal-500 hover:bg-teal-100/80 dark:hover:bg-teal-800/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-200/50 dark:hover:shadow-teal-900/50 hover:-translate-y-2 hover:scale-[1.02] rounded-xl p-6 cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-teal-300 dark:group-hover:shadow-teal-900 transition-all duration-300">
                    <Factory className="h-7 w-7 text-teal-600 dark:text-teal-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    I&apos;m Looking for CUSTOMERS
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    (I&apos;m a Manufacturer / Supplier)
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4 text-left">
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mr-2 group-hover:scale-150 transition-transform" />
                      Find distributors & retailers
                    </li>
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-75">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mr-2 group-hover:scale-150 transition-transform" />
                      Expand your dealer network
                    </li>
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mr-2 group-hover:scale-150 transition-transform" />
                      Get leads for your products
                    </li>
                  </ul>
                  <div className="flex items-center text-teal-600 dark:text-teal-400 font-semibold group-hover:text-teal-700 bg-transparent group-hover:bg-teal-500 group-hover:text-white px-4 py-2 rounded-full transition-all duration-300">
                    Explore Now
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>

            {/* For Buyers */}
            <Link href="/for-buyers" className="group">
              <div className="h-full border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 hover:border-emerald-500 hover:bg-emerald-100/80 dark:hover:bg-emerald-800/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/50 hover:-translate-y-2 hover:scale-[1.02] rounded-xl p-6 cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-300 dark:group-hover:shadow-emerald-900 transition-all duration-300">
                    <Search className="h-7 w-7 text-emerald-600 dark:text-emerald-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    I&apos;m Looking for SUPPLIERS
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    (I&apos;m a Buyer / Distributor)
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4 text-left">
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 group-hover:scale-150 transition-transform" />
                      Find manufacturers & vendors
                    </li>
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-75">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 group-hover:scale-150 transition-transform" />
                      Get verified supplier leads
                    </li>
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 group-hover:scale-150 transition-transform" />
                      Expand your supplier network
                    </li>
                  </ul>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold group-hover:text-emerald-700 bg-transparent group-hover:bg-emerald-500 group-hover:text-white px-4 py-2 rounded-full transition-all duration-300">
                    Explore Now
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Demo Videos Section
function DemoVideos() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            See How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Watch our quick demo videos to learn how to find your perfect business partner
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Video 1: For Suppliers */}
          <div className="group">
            <div className="relative aspect-video bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 rounded-xl overflow-hidden shadow-lg mb-4">
              {/* Video placeholder - replace src with actual video */}
              <video
                className="w-full h-full object-cover"
                controls
                poster="/videos/supplier-demo-poster.jpg"
              >
                <source src="/videos/supplier-demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Play button overlay (shows when video not playing) */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="h-16 w-16 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
                  <Play className="h-8 w-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <Factory className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  For Suppliers & Manufacturers
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Learn how to find distributors, retailers, and expand your dealer network
              </p>
            </div>
          </div>

          {/* Video 2: For Buyers */}
          <div className="group">
            <div className="relative aspect-video bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl overflow-hidden shadow-lg mb-4">
              {/* Video placeholder - replace src with actual video */}
              <video
                className="w-full h-full object-cover"
                controls
                poster="/videos/buyer-demo-poster.jpg"
              >
                <source src="/videos/buyer-demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Play button overlay (shows when video not playing) */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                  <Play className="h-8 w-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <Search className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  For Buyers & Distributors
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Discover how to find verified suppliers and check business credentials
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
const features = [
  {
    icon: Bot,
    title: 'AI-Powered Search',
    description: 'Natural language search - find exactly what you need with simple queries',
    href: '/features/ai-search',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverBorder: 'hover:border-teal-400',
    hoverShadow: 'hover:shadow-teal-200/50',
    iconBg: 'bg-teal-100',
    iconHoverBg: 'group-hover:bg-teal-500',
    iconColor: 'text-teal-600',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Contacts',
    description: 'GST verified businesses with direct phone numbers and email contacts',
    href: '/features/verified-contacts',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-400',
    hoverShadow: 'hover:shadow-emerald-200/50',
    iconBg: 'bg-emerald-100',
    iconHoverBg: 'group-hover:bg-emerald-500',
    iconColor: 'text-emerald-600',
  },
  {
    icon: TrendingUp,
    title: 'Industry Insights',
    description: 'Market trends, growth data, and comprehensive analysis',
    href: '/features/industry-insights',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    hoverBorder: 'hover:border-teal-400',
    hoverShadow: 'hover:shadow-teal-200/50',
    iconBg: 'bg-teal-100',
    iconHoverBg: 'group-hover:bg-teal-500',
    iconColor: 'text-teal-600',
  },
  {
    icon: Newspaper,
    title: 'News Alerts',
    description: 'Real-time news about companies and industry developments',
    href: '/features/news-alerts',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-400',
    hoverShadow: 'hover:shadow-emerald-200/50',
    iconBg: 'bg-emerald-100',
    iconHoverBg: 'group-hover:bg-emerald-500',
    iconColor: 'text-emerald-600',
  },
];

function Features() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Find the Right Partner
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Powerful tools and insights to connect you with verified businesses
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group ${feature.bgColor} dark:bg-gray-800 ${feature.borderColor} dark:border-gray-700 border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${feature.hoverBorder} ${feature.hoverShadow}`}
            >
              <div className={`h-12 w-12 rounded-lg ${feature.iconBg} dark:bg-gray-700 flex items-center justify-center mb-4 transition-colors ${feature.iconHoverBg}`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor} dark:text-teal-400 group-hover:text-white transition-colors`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stats Section - Dynamic from database
async function Stats() {
  const platformStats = await getPlatformStats();

  const stats = [
    { icon: Building2, value: platformStats.companiesFormatted, label: 'Verified Companies' },
    { icon: MapPin, value: platformStats.citiesFormatted, label: 'Cities Covered' },
    { icon: Users, value: platformStats.usersFormatted, label: 'Active Users' },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/10 mb-4">
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-teal-100">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
const testimonials = [
  {
    id: '1',
    name: 'Rajesh Sharma',
    company: 'VitaHealth Distributors',
    role: 'Founder & CEO',
    content: 'NutraConnect helped us find 15 new retail partners in just 2 months. The AI-powered search is incredibly accurate.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Priya Patel',
    company: 'Organic Wellness Stores',
    role: 'Procurement Head',
    content: 'Finding verified suppliers was always challenging. With NutraConnect, I can quickly find GST-verified manufacturers.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Amit Kumar',
    company: 'FitLife Nutrition',
    role: 'Business Development',
    content: 'The industry insights and news features keep us ahead of market trends. Discovered great supplier opportunities.',
    rating: 4,
  },
];

function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            See what our customers say about finding business partners on NutraConnect
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-teal-100 dark:text-teal-900 mb-4" />
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200 dark:text-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                      {testimonial.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTA({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 to-emerald-600 p-8 md:p-16">
          <div className="relative text-center">
            <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm text-white mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Start for Free - No Credit Card Required
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Find Your Next Business Partner?
            </h2>

            <p className="text-lg md:text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Join 10,000+ nutraceutical businesses already using NutraConnect
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-teal-50 text-lg px-8"
                asChild
              >
                <Link href={isLoggedIn ? '/' : '/auth/signup'}>
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <>
      <Hero />
      <DemoVideos />
      <Features />
      <Stats />
      <Testimonials />
      <CTA isLoggedIn={isLoggedIn} />
    </>
  );
}
