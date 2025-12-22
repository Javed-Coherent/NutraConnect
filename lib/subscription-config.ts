// Plan limits configuration
export const PLAN_LIMITS = {
  free: {
    contacts: 2,
    profiles: 20,
    searches: 10,
    savedCompanies: 5,
  },
  pro: {
    contacts: 15,
    profiles: 100,
    searches: 50,
    savedCompanies: 50,
  },
  enterprise: {
    contacts: 100,
    profiles: 500,
    searches: 200,
    savedCompanies: -1, // unlimited
  },
};

export const PLAN_PRICES = {
  free: 0,
  pro: 2999,
  enterprise: 9999,
};

export interface SubscriptionData {
  user: {
    id: string;
    name: string | null;
    email: string;
    plan: string;
    createdAt: Date;
  } | null;
  usage: {
    contactReveals: { used: number; limit: number };
    profileViews: { used: number; limit: number };
    searches: { used: number; limit: number };
    savedCompanies: { used: number; limit: number };
  };
  plans: {
    name: string;
    price: number;
    description: string;
    features: string[];
    limitations: string[];
    isCurrent: boolean;
    isPopular: boolean;
  }[];
}

export function getPlans(currentPlan: string) {
  return [
    {
      name: 'Free',
      price: PLAN_PRICES.free,
      description: 'Get started with basic features',
      features: [
        `${PLAN_LIMITS.free.profiles} Profile Views/month`,
        `${PLAN_LIMITS.free.contacts} Contact Reveals/month`,
        'Basic Search',
        `Save up to ${PLAN_LIMITS.free.savedCompanies} companies`,
      ],
      limitations: ['No AI insights', 'No export features'],
      isCurrent: currentPlan === 'free',
      isPopular: false,
    },
    {
      name: 'Pro',
      price: PLAN_PRICES.pro,
      description: 'Perfect for growing businesses',
      features: [
        `${PLAN_LIMITS.pro.profiles} Profile Views/month`,
        `${PLAN_LIMITS.pro.contacts} Contact Reveals/month`,
        'Advanced Search Filters',
        `Save up to ${PLAN_LIMITS.pro.savedCompanies} companies`,
        'AI-Powered Insights',
        'Export to CSV/Excel',
        'Email Support',
      ],
      limitations: [],
      isCurrent: currentPlan === 'pro',
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: PLAN_PRICES.enterprise,
      description: 'For teams and large organizations',
      features: [
        `${PLAN_LIMITS.enterprise.profiles} Profile Views/month`,
        `${PLAN_LIMITS.enterprise.contacts} Contact Reveals/month`,
        'Priority Search Results',
        'Unlimited Saved Companies',
        'Advanced AI Analytics',
        'API Access',
        'Dedicated Account Manager',
        'Custom Integrations',
        'Priority Support',
      ],
      limitations: [],
      isCurrent: currentPlan === 'enterprise',
      isPopular: false,
    },
  ];
}

// Helper to get plan label
export function getPlanLabel(plan: string): string {
  switch (plan) {
    case 'free':
      return 'Free Plan';
    case 'pro':
      return 'Pro Plan';
    case 'enterprise':
      return 'Enterprise Plan';
    default:
      return 'Free Plan';
  }
}
