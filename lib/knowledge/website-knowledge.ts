/**
 * NutraConnect Website Knowledge Base
 *
 * This file contains comprehensive information about the NutraConnect platform
 * for use by the AI chatbot assistant. Keep this file updated when features change.
 */

export const WEBSITE_KNOWLEDGE = {
  // Platform Overview
  platform: {
    name: 'NutraConnect',
    tagline: "India's Leading B2B Nutraceutical Marketplace",
    description: 'AI-Powered Supplier & Customer Intelligence Platform for the Nutraceutical Industry',
    targetAudience: 'Suppliers (manufacturers, formulators, packagers) and Buyers (distributors, retailers, wholesalers) in the Indian nutraceutical industry',
    stats: {
      companies: '80,000+',
      cities: '500+',
      supplyChainStages: 9,
      users: '10,000+',
    },
    website: 'https://nutraconnect.in',
  },

  // Core Features
  features: {
    aiSearch: {
      name: 'AI-Powered Search',
      description: 'Search using natural language queries like "protein manufacturers in Gujarat with GMP certification"',
      capabilities: [
        'Natural language understanding',
        'Smart filter auto-application',
        'Intent recognition for vague queries',
        'Instant results in milliseconds',
      ],
      page: '/features/ai-search',
    },
    verifiedContacts: {
      name: 'Verified Contacts',
      description: 'Access GST-verified business contacts with validated phone numbers and emails',
      capabilities: [
        'GST verification against government database',
        'Phone and email validation',
        'Complete business profiles',
        'Regular data updates and monitoring',
      ],
      page: '/features/verified-contacts',
    },
    industryInsights: {
      name: 'Industry Insights',
      description: 'Market trends, growth data, and comprehensive analysis of the nutraceutical industry',
      page: '/features/industry-insights',
    },
    newsAlerts: {
      name: 'News Alerts',
      description: 'Real-time news about companies and industry developments delivered to your inbox',
      page: '/features/news-alerts',
    },
    companyCompare: {
      name: 'Company Compare',
      description: 'Side-by-side comparison of up to 5 companies with key metrics and export functionality',
      capabilities: [
        'Compare up to 5 companies',
        'Key metrics comparison',
        'Certification comparison',
        'Export comparison reports',
      ],
      page: '/features/company-compare',
    },
    smartMatching: {
      name: 'Smart Matching',
      description: 'AI-powered business partner recommendations based on your profile and requirements',
      matchingFactors: [
        'Business type',
        'Product categories',
        'Location',
        'Certifications',
        'Company size',
        'Years in business',
        'Trade preferences',
        'Distribution network',
      ],
      page: '/features/smart-matching',
    },
  },

  // Pricing Plans
  pricing: {
    free: {
      name: 'Free',
      price: 'Rs 0',
      period: 'forever',
      limits: {
        searchesPerDay: 10,
        profileViewsPerDay: 20,
        contactRevealsPerMonth: 2,
        savedCompanies: 5,
      },
      features: [
        'Basic search functionality',
        'Basic filters',
        'View company profiles',
        'Save up to 5 companies',
      ],
      notIncluded: [
        'Export to CSV/Excel',
        'News & industry insights',
        'Company comparison tool',
        'Email alerts',
        'Priority support',
      ],
    },
    pro: {
      name: 'Pro',
      price: 'Rs 999',
      period: 'per month',
      annualPrice: 'Rs 9,590/year (20% discount)',
      trial: '7-day free trial, no credit card required',
      limits: {
        searchesPerMonth: 50,
        profileViewsPerMonth: 100,
        contactRevealsPerMonth: 15,
        savedCompanies: 50,
      },
      features: [
        'Everything in Free',
        'Unlimited searches',
        'Unlimited company profiles',
        'Advanced filters',
        'Export to CSV/Excel',
        'News & industry insights',
        'Company comparison tool',
        'Email alerts',
        'Priority support',
      ],
      mostPopular: true,
    },
    enterprise: {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      limits: {
        searchesPerMonth: 200,
        profileViewsPerMonth: 500,
        contactRevealsPerMonth: 100,
        savedCompanies: 'Unlimited',
      },
      features: [
        'Everything in Pro',
        'API access',
        'Bulk data export',
        'Custom integrations',
        'Team accounts',
        'Dedicated account manager',
        'Priority data updates',
        'Custom reports',
        'SLA guarantee',
        'On-premise deployment option',
      ],
    },
    paymentMethods: ['Credit cards', 'Debit cards', 'UPI', 'Net banking (via Razorpay)'],
    policies: {
      cancellation: 'Cancel anytime',
      planChanges: 'Upgrade or downgrade anytime, prorated billing',
      refunds: 'Changes take effect immediately',
    },
  },

  // Company Types
  companyTypes: {
    manufacturer: {
      label: 'Manufacturer',
      description: 'Companies that produce nutraceutical products including vitamins, supplements, ayurvedic products, and health foods',
    },
    distributor: {
      label: 'Distributor',
      description: 'Wholesale distributors who purchase from manufacturers and supply to retailers across regions',
    },
    retailer: {
      label: 'Retailer',
      description: 'Retail stores, pharmacies, and health stores selling nutraceuticals directly to consumers',
    },
    wholesaler: {
      label: 'Trader/Wholesaler',
      description: 'Bulk traders and wholesalers dealing in large quantities of health products',
    },
    rawMaterial: {
      label: 'Raw Material Supplier',
      description: 'Suppliers of raw ingredients like herbs, vitamins, minerals, and other materials used in manufacturing',
    },
    formulator: {
      label: 'Formulator',
      description: 'Companies providing product formulation, R&D services, and custom supplement development',
    },
    packager: {
      label: 'Packager',
      description: 'Packaging and labeling service providers for nutraceutical products',
    },
    cro: {
      label: 'Testing Lab (CRO)',
      description: 'Contract Research Organizations providing quality testing, certification, and lab services',
    },
  },

  // Certifications
  certifications: {
    gst: {
      label: 'GST Verified',
      description: 'Business verified against Government of India GST records, confirming legal registration',
      importance: 'Essential for legitimate B2B transactions in India',
    },
    fssai: {
      label: 'FSSAI',
      description: 'Food Safety and Standards Authority of India certification for food and supplement safety',
      importance: 'Mandatory for all food and supplement businesses in India',
    },
    gmp: {
      label: 'GMP Certified',
      description: 'Good Manufacturing Practice certification ensuring quality manufacturing processes',
      importance: 'Ensures products are consistently produced and controlled according to quality standards',
    },
    iso: {
      label: 'ISO 9001',
      description: 'International quality management system certification',
      importance: 'Demonstrates commitment to quality management and continuous improvement',
    },
    fda: {
      label: 'FDA Approved',
      description: 'US Food and Drug Administration approval for export-ready products',
      importance: 'Required for exporting nutraceuticals to the United States',
    },
    halal: {
      label: 'Halal Certified',
      description: 'Certification confirming products comply with Islamic dietary laws',
      importance: 'Required for Muslim consumers and Middle East exports',
    },
    organic: {
      label: 'Organic Certified',
      description: 'Certification confirming organic farming and processing practices',
      importance: 'Premium positioning for health-conscious consumers',
    },
  },

  // Search Functionality
  search: {
    howToSearch: 'Type natural language queries in the search bar. Our AI understands what you\'re looking for.',
    exampleQueries: [
      'Protein powder manufacturers in Gujarat',
      'Distributors for ayurvedic products in Maharashtra',
      'GMP certified supplement manufacturers',
      'Raw material suppliers for vitamin supplements',
      'Retailers looking for organic supplements near Bangalore',
      'Contract manufacturers for private labeling',
    ],
    filters: {
      companyType: '8 types: Manufacturer, Distributor, Retailer, Wholesaler, Raw Material, Formulator, Packager, Testing Lab',
      location: 'Filter by state (28 states + Delhi) and city (500+ cities)',
      rating: 'Minimum star rating (1-5)',
      certifications: 'GST, FSSAI, GMP, ISO, FDA, Halal, Organic',
      companySize: '1-10, 11-50, 51-100, 101-200, 201-500, 500+ employees',
      annualTurnover: 'Less than 1 Cr, 1-5 Cr, 5-10 Cr, 10-50 Cr, 50-100 Cr, 100+ Cr',
    },
    sorting: [
      'Relevance (featured first, then by rating)',
      'Rating (highest to lowest)',
      'Name (A-Z)',
      'Recently Updated',
    ],
  },

  // Dashboard Features
  dashboard: {
    overview: 'Your personal dashboard shows saved companies, recent activity, and usage statistics',
    sections: {
      stats: 'View counts for saved companies, searches, profile views, and contact reveals',
      savedCompanies: 'Access all companies you\'ve bookmarked for quick reference',
      history: 'See your search history, viewed profiles, and revealed contacts',
      subscription: 'Manage your plan, view usage meters, and upgrade options',
    },
    usageTracking: 'Real-time tracking of your plan limits with visual progress bars',
    quickActions: [
      'Find Manufacturers',
      'Find Distributors',
      'Explore Categories',
      'Compare Plans',
    ],
  },

  // Website Pages
  pages: {
    home: {
      path: '/',
      description: 'Main landing page with platform overview and signup',
    },
    forSuppliers: {
      path: '/for-suppliers',
      description: 'Page for manufacturers and suppliers to find customers (distributors, retailers)',
    },
    forBuyers: {
      path: '/for-buyers',
      description: 'Page for buyers to find suppliers (manufacturers, raw material suppliers)',
    },
    search: {
      path: '/search',
      description: 'Advanced search page with filters and company results',
    },
    pricing: {
      path: '/pricing',
      description: 'Detailed pricing plans comparison',
    },
    about: {
      path: '/about',
      description: 'About NutraConnect, our mission and values',
    },
    contact: {
      path: '/contact',
      description: 'Contact form and support information',
    },
    dashboard: {
      path: '/dashboard',
      description: 'User dashboard (requires login)',
    },
    companyProfile: {
      path: '/company/[id]',
      description: 'Individual company profile page',
    },
  },

  // How-To Guides
  howTo: {
    findSuppliers: {
      title: 'How to Find Suppliers/Manufacturers',
      steps: [
        'Go to the search page or use the search bar',
        'Type what you\'re looking for (e.g., "protein manufacturers in Gujarat")',
        'Use filters to narrow down by certifications, location, size',
        'Browse results and click on companies to view profiles',
        'Save interesting companies or reveal contact details',
      ],
    },
    saveCompany: {
      title: 'How to Save a Company',
      steps: [
        'Find a company you\'re interested in',
        'Click the bookmark/save icon on the company card or profile',
        'Access saved companies from your dashboard',
        'Remove saved companies anytime by clicking the icon again',
      ],
    },
    revealContacts: {
      title: 'How to Reveal Contact Details',
      steps: [
        'Open a company profile',
        'Click the phone or email button to reveal contact',
        'Contact reveals are limited by your plan',
        'Revealed contacts are saved in your history',
      ],
    },
    compareCompanies: {
      title: 'How to Compare Companies',
      steps: [
        'Find companies you want to compare',
        'Click the "Compare" button on each company',
        'Compare up to 5 companies side-by-side',
        'Export comparison report (Pro plan)',
      ],
    },
    upgradePlan: {
      title: 'How to Upgrade Your Plan',
      steps: [
        'Go to Dashboard > Subscription',
        'Click "Upgrade Plan" button',
        'Choose Pro or Enterprise plan',
        'Complete payment through Razorpay',
        'New features are available immediately',
      ],
    },
  },

  // FAQs
  faqs: {
    account: [
      {
        q: 'How do I create an account?',
        a: 'Click "Sign Up" in the top navigation, enter your email and create a password. You can also sign up with Google or LinkedIn.',
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'Click "Login", then "Forgot Password". Enter your email and we\'ll send you a reset link.',
      },
      {
        q: 'Can I change my email address?',
        a: 'Yes, go to Dashboard > Settings to update your email address.',
      },
    ],
    billing: [
      {
        q: 'Is there a free trial?',
        a: 'Yes! Pro plan comes with a 7-day free trial. No credit card required to start.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept credit cards, debit cards, UPI, and net banking through Razorpay.',
      },
      {
        q: 'Can I cancel my subscription?',
        a: 'Yes, you can cancel anytime from Dashboard > Subscription. You\'ll keep access until the end of your billing period.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'We offer prorated refunds for annual plans. Monthly plans can be cancelled but aren\'t refunded for partial months.',
      },
      {
        q: 'Can I switch between plans?',
        a: 'Yes, upgrade or downgrade anytime. Changes are prorated and take effect immediately.',
      },
    ],
    features: [
      {
        q: 'What happens when I reach my contact reveal limit?',
        a: 'You\'ll need to wait until your limits reset (monthly) or upgrade to a higher plan for more reveals.',
      },
      {
        q: 'Can I export company data?',
        a: 'Yes, Pro and Enterprise plans include export to CSV/Excel functionality.',
      },
      {
        q: 'How do I access the API?',
        a: 'API access is available on Enterprise plans. Contact our sales team to discuss your needs.',
      },
      {
        q: 'Are the contact details verified?',
        a: 'Yes, we verify businesses through GST records and validate phone numbers and emails regularly.',
      },
    ],
    data: [
      {
        q: 'How often is company data updated?',
        a: 'We continuously monitor and update company information. Major updates happen weekly.',
      },
      {
        q: 'How do you verify companies?',
        a: 'We verify through GST government database, validate contact information, and monitor for accuracy.',
      },
      {
        q: 'Can I list my company on NutraConnect?',
        a: 'Yes! Go to Contact Us page and fill out the listing request form.',
      },
    ],
  },

  // Geographic Coverage
  geography: {
    states: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
      'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
      'Uttarakhand', 'West Bengal',
    ],
    majorCities: [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
      'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Surat', 'Chandigarh',
      'Indore', 'Nagpur', 'Vadodara', 'Coimbatore', 'Kochi', 'Visakhapatnam',
      'Bhopal', 'Patna',
    ],
    coverage: '500+ cities across India',
  },

  // Product Categories
  productCategories: [
    'Vitamins & Minerals',
    'Proteins & Amino Acids',
    'Ayurvedic & Herbal',
    'Sports Nutrition',
    'Weight Management',
    'Immunity Boosters',
    'Omega & Fish Oils',
    'Probiotics',
    'Antioxidants',
    'Joint Health',
    'Heart Health',
    'Digestive Health',
    'Beauty & Skin',
    'Energy & Stamina',
    "Women's Health",
    "Men's Health",
    "Children's Health",
    'Senior Nutrition',
  ],

  // Contact & Support
  support: {
    email: 'support@nutraconnect.in',
    contactPage: '/contact',
    response: 'We typically respond within 24 hours',
  },
};

/**
 * Generates the system prompt for the chatbot using the knowledge base
 */
export function generateSystemPrompt(): string {
  const k = WEBSITE_KNOWLEDGE;

  return `You are NutraBot, the official help assistant for ${k.platform.name} - ${k.platform.tagline}.

## ABOUT NUTRACONNECT
${k.platform.description}
- ${k.platform.stats.companies} verified companies
- ${k.platform.stats.cities} cities covered
- ${k.platform.stats.supplyChainStages} supply chain stages
- ${k.platform.stats.users} active users

## CORE FEATURES

### 1. ${k.features.aiSearch.name}
${k.features.aiSearch.description}
${k.features.aiSearch.capabilities.map(c => `- ${c}`).join('\n')}

### 2. ${k.features.verifiedContacts.name}
${k.features.verifiedContacts.description}
${k.features.verifiedContacts.capabilities.map(c => `- ${c}`).join('\n')}

### 3. ${k.features.industryInsights.name}
${k.features.industryInsights.description}

### 4. ${k.features.newsAlerts.name}
${k.features.newsAlerts.description}

### 5. ${k.features.companyCompare.name}
${k.features.companyCompare.description}

### 6. ${k.features.smartMatching.name}
${k.features.smartMatching.description}

## PRICING PLANS

### Free Plan (${k.pricing.free.price})
- ${k.pricing.free.limits.searchesPerDay} searches/day
- ${k.pricing.free.limits.contactRevealsPerMonth} contact reveals/month
- Save up to ${k.pricing.free.limits.savedCompanies} companies
- Basic filters

### Pro Plan (${k.pricing.pro.price}/month)
- ${k.pricing.pro.trial}
- ${k.pricing.pro.limits.searchesPerMonth} searches/month
- ${k.pricing.pro.limits.contactRevealsPerMonth} contact reveals/month
- Save up to ${k.pricing.pro.limits.savedCompanies} companies
- Export to CSV/Excel
- News & insights
- Company comparison
- Email alerts
- Priority support

### Enterprise Plan (Custom pricing)
- ${k.pricing.enterprise.limits.contactRevealsPerMonth} contact reveals/month
- Unlimited saved companies
- API access
- Team accounts
- Dedicated account manager
- Custom integrations

Payment methods: ${k.pricing.paymentMethods.join(', ')}

## COMPANY TYPES WE COVER
${Object.values(k.companyTypes).map(t => `- **${t.label}**: ${t.description}`).join('\n')}

## CERTIFICATIONS EXPLAINED
${Object.values(k.certifications).map(c => `- **${c.label}**: ${c.description}`).join('\n')}

## HOW TO SEARCH
${k.search.howToSearch}

Example searches:
${k.search.exampleQueries.map(q => `- "${q}"`).join('\n')}

Available filters:
- Company type: ${k.search.filters.companyType}
- Location: ${k.search.filters.location}
- Certifications: ${k.search.filters.certifications}
- Company size: ${k.search.filters.companySize}
- Annual turnover: ${k.search.filters.annualTurnover}

## KEY PAGES
- **For Suppliers** (${k.pages.forSuppliers.path}): Find distributors, retailers, wholesalers
- **For Buyers** (${k.pages.forBuyers.path}): Find manufacturers, raw material suppliers
- **Search** (${k.pages.search.path}): Advanced search with filters
- **Pricing** (${k.pages.pricing.path}): Compare all plans
- **Dashboard** (${k.pages.dashboard.path}): Manage saved companies, view history

## COMMON QUESTIONS

**Account:**
${k.faqs.account.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}

**Billing:**
${k.faqs.billing.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}

**Features:**
${k.faqs.features.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}

## GEOGRAPHIC COVERAGE
- 28 Indian states + Delhi
- Major cities: ${k.geography.majorCities.slice(0, 10).join(', ')}, and more
- ${k.geography.coverage}

## PRODUCT CATEGORIES
${k.productCategories.join(', ')}

## RESPONSE GUIDELINES

### Context Awareness
- Users are ALREADY ON the NutraConnect website when chatting with you
- NEVER say "Visit the NutraConnect website" - they're already here!
- Give direct URL paths like "Go to /search" or reference actual UI elements that exist

### Navigation Questions - ALWAYS provide BOTH directions AND clickable links:
- For page navigation: Give clear directions AND a clickable markdown link
- For actions: Only reference buttons/links that ACTUALLY EXIST in the UI
- Use markdown link format: [Link Text](/path) - these will be clickable!
- WRONG: "Visit the website, find the menu, click Search"
- WRONG: "Click Search in the header" (there is NO Search link in the header!)
- WRONG: "Go to /search in the URL" (no link provided!)
- RIGHT: "You can search for companies by going to the search page. [Click here to go to Search](/search)"

### Response Style
- Keep responses concise but ALWAYS include a clickable link when mentioning a page
- Be helpful, friendly, and professional
- Don't make up specific company names or contact details
- For complex issues, suggest contacting support at ${k.support.email}
- When discussing pricing, use the exact figures provided
- If you don't know something, say so and suggest where they might find the answer

### ACTUAL Header Navigation Links (these are the ONLY links in the header):
- "For Suppliers" → [For Suppliers](/for-suppliers)
- "For Buyers" → [For Buyers](/for-buyers)
- "Pricing" → [Pricing](/pricing)
- "About Us" → [About Us](/about)
- "Contact Us" → [Contact Us](/contact)
- "Login" button → [Login](/auth/login)
- "Sign Up Free" button → [Sign Up](/auth/signup)

### How to Access Key Pages (ALWAYS include clickable links in your response):
- Search page: There is no Search link in the header. You can access it directly here: [Search Companies](/search)
- Dashboard: After logging in, access your dashboard here: [Dashboard](/dashboard)
- Home page: Click the NutraConnect logo or go to [Home](/)
- Pricing: Click "Pricing" in the header or go to [Pricing](/pricing)
- For Suppliers: Click "For Suppliers" in the header or go to [For Suppliers](/for-suppliers)
- For Buyers: Click "For Buyers" in the header or go to [For Buyers](/for-buyers)

### Example Responses for Navigation:
- Q: "How do I search for companies?"
  A: "You can search for companies on our search page. [Click here to go to Search](/search). There you can filter by company type, location, and more."

- Q: "Take me to pricing"
  A: "Here's the pricing page: [View Pricing](/pricing). You can also click 'Pricing' in the header navigation."

- Q: "Where can I sign up?"
  A: "You can create an account here: [Sign Up](/auth/signup). Or click the 'Sign Up Free' button in the top right corner."`;
}
