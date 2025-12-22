'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Check,
  Crown,
  Building2,
  ArrowRight,
  AlertCircle,
  Star,
  Inbox,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { type SubscriptionData } from '@/lib/subscription-config';

interface SubscriptionContentProps {
  data: SubscriptionData;
}

export function SubscriptionContent({ data }: SubscriptionContentProps) {
  const [showPlans, setShowPlans] = useState(false);

  const { user, usage, plans } = data;
  const currentPlan = user?.plan || 'free';
  const planLabel = currentPlan === 'free' ? 'Free' : currentPlan === 'pro' ? 'Pro' : 'Enterprise';

  const formatLimit = (limit: number) => {
    if (limit === -1) return 'Unlimited';
    return limit.toString();
  };

  const getProgressValue = (used: number, limit: number) => {
    if (limit === -1) return 100; // unlimited shows as full
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getRemainingText = (used: number, limit: number, label: string) => {
    if (limit === -1) return `${used} ${label} this month (unlimited)`;
    return `${Math.max(limit - used, 0)} ${label} remaining`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-teal-500" />
            Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your subscription and billing
          </p>
        </div>
      </div>

      {/* Current Plan */}
      <Card className="border-2 border-teal-200 dark:border-teal-700 bg-gradient-to-br from-teal-50/50 to-emerald-50/50 dark:from-teal-900/20 dark:to-emerald-900/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                <Crown className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {planLabel} Plan
                  </h2>
                  <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-0">
                    Active
                  </Badge>
                </div>
                {currentPlan === 'free' ? (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">Free</span>
                    <span className="text-gray-500 dark:text-gray-400"> forever</span>
                  </p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{currentPlan === 'pro' ? '2,999' : '9,999'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">/month</span>
                  </p>
                )}
                {user && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="border-teal-300 dark:border-teal-600 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                onClick={() => setShowPlans(!showPlans)}
              >
                {showPlans ? 'Hide Plans' : currentPlan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      {showPlans && (
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 ${
                plan.isCurrent
                  ? 'border-2 border-teal-500 dark:border-teal-400 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600'
              } bg-white dark:bg-gray-800`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500 dark:text-gray-400">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.isCurrent
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white'
                  }`}
                  disabled={plan.isCurrent}
                >
                  {plan.isCurrent ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Usage Stats */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Monthly Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Reveals */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Reveals
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {usage.contactReveals.used} / {formatLimit(usage.contactReveals.limit)}
              </span>
            </div>
            <Progress
              value={getProgressValue(usage.contactReveals.used, usage.contactReveals.limit)}
              className="h-2"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {getRemainingText(usage.contactReveals.used, usage.contactReveals.limit, 'reveals')}
            </p>
          </div>

          {/* Profile Views */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Views
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {usage.profileViews.used} / {formatLimit(usage.profileViews.limit)}
              </span>
            </div>
            <Progress
              value={getProgressValue(usage.profileViews.used, usage.profileViews.limit)}
              className="h-2"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {getRemainingText(usage.profileViews.used, usage.profileViews.limit, 'views')}
            </p>
          </div>

          {/* Searches */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Searches
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {usage.searches.used} / {formatLimit(usage.searches.limit)}
              </span>
            </div>
            <Progress
              value={getProgressValue(usage.searches.used, usage.searches.limit)}
              className="h-2"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {getRemainingText(usage.searches.used, usage.searches.limit, 'searches')}
            </p>
          </div>

          {/* Saved Companies */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Saved Companies
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {usage.savedCompanies.used} / {formatLimit(usage.savedCompanies.limit)}
              </span>
            </div>
            <Progress
              value={getProgressValue(usage.savedCompanies.used, usage.savedCompanies.limit)}
              className="h-2"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {getRemainingText(usage.savedCompanies.used, usage.savedCompanies.limit, 'slots')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA for Free Users */}
      {currentPlan === 'free' && (
        <Card className="border-teal-200 dark:border-teal-700 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                  <Star className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Upgrade to Pro
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get more contact reveals, profile views, and unlock AI-powered insights.
                  </p>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
                onClick={() => setShowPlans(true)}
              >
                View Plans
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enterprise CTA */}
      <Card className="border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Need a custom solution?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Contact our sales team for enterprise pricing, custom integrations, and dedicated support.
                </p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
              Contact Sales
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
