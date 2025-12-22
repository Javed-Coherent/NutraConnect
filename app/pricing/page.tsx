import { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Choose the right NutraConnect plan for your business. Free, Pro, and Enterprise options available.',
};

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Get started with basic access',
    features: [
      { text: '10 searches per day', included: true },
      { text: '2 company profiles per day', included: true },
      { text: '2 contact reveals per day', included: true },
      { text: 'Basic filters', included: true },
      { text: 'Save up to 5 companies', included: true },
      { text: 'Unlimited searches', included: false },
      { text: 'Export results', included: false },
      { text: 'News & insights', included: false },
      { text: 'Company comparison', included: false },
      { text: 'Email alerts', included: false },
    ],
    cta: 'Get Started',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: '999',
    description: 'For growing businesses',
    features: [
      { text: 'Unlimited searches', included: true },
      { text: 'Unlimited company profiles', included: true },
      { text: 'Unlimited contact reveals', included: true },
      { text: 'Advanced filters', included: true },
      { text: 'Unlimited saved companies', included: true },
      { text: 'Export to CSV/Excel', included: true },
      { text: 'News & industry insights', included: true },
      { text: 'Company comparison tool', included: true },
      { text: 'Email alerts', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'API access', included: true },
      { text: 'Bulk data export', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Team accounts', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Priority data updates', included: true },
      { text: 'Custom reports', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'On-premise deployment', included: true },
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer:
      'Yes, we offer a 7-day free trial for the Pro plan. No credit card required to start.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, debit cards, UPI, and net banking through Razorpay.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      'Yes, you can change your plan at any time. Changes take effect immediately, and we\'ll prorate your billing.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer:
      'Yes, annual billing saves you 20%. Pay Rs 9,590/year instead of Rs 11,988.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">Pricing</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start for free and upgrade as your business grows. All plans include access
            to our verified company database.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative dark:bg-gray-800 ${
                  plan.popular
                    ? 'border-2 border-teal-600 shadow-lg scale-105'
                    : 'border dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-teal-600 text-white px-4 py-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl dark:text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    {plan.price === 'Custom' ? (
                      <span className="text-3xl font-bold dark:text-white">Custom</span>
                    ) : (
                      <>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Rs</span>
                        <span className="text-4xl font-bold dark:text-white">{plan.price}</span>
                        <span className="text-gray-500 dark:text-gray-400">/month</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mr-2 flex-shrink-0" />
                        )}
                        <span
                          className={
                            feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600'
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={plan.href}>
                      {plan.cta}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="dark:bg-gray-900 dark:border-gray-700">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-teal-100 mb-6">
            Our team is here to help you choose the right plan
          </p>
          <Button
            size="lg"
            className="bg-white text-teal-600 hover:bg-teal-50"
          >
            Contact Sales
          </Button>
        </div>
      </section>
    </div>
  );
}
