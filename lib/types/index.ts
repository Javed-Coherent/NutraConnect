// Company Types (8 entity types in our database)
export type CompanyType =
  | 'manufacturer'
  | 'distributor'
  | 'retailer'
  | 'wholesaler'    // Includes Traders
  | 'raw_material'
  | 'formulator'
  | 'packager'
  | 'cro';

export type VerificationType = 'gst' | 'fssai' | 'iso' | 'gmp' | 'fda' | 'halal' | 'organic';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;

  // Classification
  type: CompanyType;
  category: string[];

  // Location
  city: string;
  state: string;
  address?: string;
  pincode?: string;
  coverageAreas?: string[];

  // Contact
  phone?: string;
  email?: string;
  website?: string;

  // Business Details
  gstNumber?: string;
  fssaiNumber?: string;
  yearEstablished?: number;
  employeeCount?: string;
  annualTurnover?: string;

  // Products
  products?: string[];
  brands?: string[];

  // Ratings
  rating?: number;
  reviewsCount?: number;

  // Verification
  isVerified: boolean;
  verifications?: VerificationType[];

  // Content
  description?: string;
  aiSummary?: string;
  highlights?: string[];

  // Metadata
  completenessScore?: number;
  isFeatured: boolean;
  matchScore?: number;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  relatedCompanyIds?: string[];
  category: 'company' | 'industry' | 'regulatory';
  image?: string;
}

export interface IndustryInsight {
  id: string;
  title: string;
  content: string;
  category: string;
  metrics?: {
    marketSize?: string;
    growthRate?: string;
    trends?: string[];
  };
  publishedAt: string;
}

export interface SearchFilters {
  query?: string;
  type?: CompanyType[];
  city?: string[];
  state?: string[];
  rating?: number;
  verified?: boolean;
  verifications?: VerificationType[];
  employeeCount?: string[];
  annualTurnover?: string[];
  sortBy?: 'relevance' | 'rating' | 'recent' | 'name';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  icon?: string;
  description?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
}

// User types (for Phase 2)
export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: 'supplier' | 'buyer';
  plan: 'free' | 'pro' | 'enterprise';

  // Usage limits
  searchesUsed: number;
  profilesViewed: number;
  contactsRevealed: number;

  // Collections
  savedCompanies: string[];
}

// Stats for landing page
export interface PlatformStats {
  companies: number;
  cities: number;
  supplyChainStages: number;
  users?: number;
}
