import { prisma } from '../db';
import { Company, CompanyType } from '../types';
import type { companies as DbCompany } from '@prisma/client';

// Map database entity values to CompanyType
function mapEntityToType(entity: string | null): CompanyType {
  if (!entity) return 'manufacturer';

  const entityLower = entity.toLowerCase();

  // Map common entity values to CompanyType
  if (entityLower.includes('manufacturer') || entityLower.includes('manufacturing')) return 'manufacturer';
  if (entityLower.includes('distributor') || entityLower.includes('distribution')) return 'distributor';
  if (entityLower.includes('retailer') || entityLower.includes('retail')) return 'retailer';
  if (entityLower.includes('exporter') || entityLower.includes('export')) return 'exporter';
  if (entityLower.includes('wholesaler') || entityLower.includes('wholesale')) return 'wholesaler';
  if (entityLower.includes('raw material') || entityLower.includes('supplier') || entityLower.includes('ingredient')) return 'raw_material';
  if (entityLower.includes('formulator') || entityLower.includes('formulation')) return 'formulator';
  if (entityLower.includes('packager') || entityLower.includes('packaging')) return 'packager';
  if (entityLower.includes('cro') || entityLower.includes('contract research') || entityLower.includes('testing') || entityLower.includes('lab')) return 'cro';
  if (entityLower.includes('importer') || entityLower.includes('import')) return 'importer';
  if (entityLower.includes('ecommerce') || entityLower.includes('e-commerce') || entityLower.includes('online')) return 'ecommerce';
  if (entityLower.includes('pharmacy') || entityLower.includes('pharma chain')) return 'pharmacy_chain';

  return 'manufacturer'; // default
}

// Generate slug from company name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Parse comma-separated string to array
function parseToArray(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

// Extract city from address
function extractCity(address: string | null, hqAddress: string | null): string {
  // Try to extract city from hq_country_city_address first
  if (hqAddress) {
    const parts = hqAddress.split(',').map(p => p.trim());
    if (parts.length >= 1) {
      // Usually format is "City, State, Country" or similar
      return parts[0] || 'India';
    }
  }

  // Try to extract from main address
  if (address) {
    const parts = address.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      return parts[parts.length - 2] || 'India';
    }
  }

  return 'India';
}

// Extract state from address
function extractState(address: string | null, hqAddress: string | null): string {
  if (hqAddress) {
    const parts = hqAddress.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      return parts[1] || 'India';
    }
  }

  if (address) {
    const parts = address.split(',').map(p => p.trim());
    if (parts.length >= 1) {
      return parts[parts.length - 1] || 'India';
    }
  }

  return 'India';
}

// Map database record to Company interface
function mapDbToCompany(dbCompany: DbCompany): Company {
  const name = dbCompany.company_name || 'Unknown Company';
  const slug = generateSlug(name);

  return {
    id: dbCompany.id.toString(),
    name,
    slug,
    type: mapEntityToType(dbCompany.entity),
    category: parseToArray(dbCompany.category_search),
    city: extractCity(dbCompany.address, dbCompany.hq_country_city_address),
    state: extractState(dbCompany.address, dbCompany.hq_country_city_address),
    address: dbCompany.address || undefined,
    phone: undefined, // Not in CSV
    email: dbCompany.email || undefined,
    website: dbCompany.profile_url || undefined,
    gstNumber: dbCompany.gst_number || undefined,
    yearEstablished: dbCompany.year_of_establishment || undefined,
    employeeCount: dbCompany.employee_size || undefined,
    annualTurnover: dbCompany.revenue_range || undefined,
    products: parseToArray(dbCompany.product_portfolio),
    brands: [], // Not in CSV
    rating: undefined, // Not in CSV - could generate based on confidence_rating
    reviewsCount: 0,
    isVerified: !!dbCompany.gst_number, // Verified if has GST
    verifications: dbCompany.certifications ? ['gst'] : [],
    description: dbCompany.short_overview || undefined,
    aiSummary: dbCompany.functionalities || undefined,
    highlights: parseToArray(dbCompany.certifications),
    coverageAreas: parseToArray(dbCompany.markets_served),
    isFeatured: false, // Can be updated based on criteria
    completenessScore: calculateCompletenessScore(dbCompany),
    createdAt: dbCompany.created_at?.toISOString(),
    updatedAt: dbCompany.created_at?.toISOString(),
  };
}

// Calculate completeness score based on filled fields
function calculateCompletenessScore(dbCompany: DbCompany): number {
  let score = 0;
  const fields = [
    dbCompany.company_name,
    dbCompany.gst_number,
    dbCompany.entity,
    dbCompany.category_search,
    dbCompany.address,
    dbCompany.email,
    dbCompany.profile_url,
    dbCompany.year_of_establishment,
    dbCompany.employee_size,
    dbCompany.revenue_range,
    dbCompany.short_overview,
    dbCompany.product_portfolio,
    dbCompany.certifications,
  ];

  fields.forEach(field => {
    if (field) score += 1;
  });

  return Math.round((score / fields.length) * 100);
}

// Get all companies (with optional limit)
export async function getAllCompanies(limit?: number): Promise<Company[]> {
  const dbRecords = await prisma.companies.findMany({
    take: limit,
    orderBy: { company_name: 'asc' },
  });

  return dbRecords.map(mapDbToCompany);
}

// Get company by ID or slug
export async function getCompanyById(idOrSlug: string): Promise<Company | undefined> {
  // Check if it's a numeric ID
  const numericId = parseInt(idOrSlug, 10);

  if (!isNaN(numericId) && numericId.toString() === idOrSlug) {
    // It's a numeric ID - use findUnique
    const dbCompany = await prisma.companies.findUnique({
      where: { id: numericId },
    });

    if (dbCompany) return mapDbToCompany(dbCompany);
  }

  // It's a slug - search by company name pattern
  // Convert slug back to search pattern (replace dashes with spaces)
  const searchPattern = idOrSlug.replace(/-+/g, ' ').trim();

  // Search for companies with matching name
  const dbCompanies = await prisma.companies.findMany({
    where: {
      company_name: {
        contains: searchPattern,
        mode: 'insensitive',
      },
    },
    take: 20,
  });

  // Find exact slug match
  const company = dbCompanies.find(c => {
    const companySlug = generateSlug(c.company_name || '');
    return companySlug === idOrSlug;
  });

  if (company) return mapDbToCompany(company);

  // Fallback: try matching each word of the slug
  if (dbCompanies.length === 0) {
    const words = searchPattern.split(' ').filter(w => w.length > 2);
    if (words.length > 0) {
      const fallbackCompanies = await prisma.companies.findMany({
        where: {
          OR: words.map(word => ({
            company_name: { contains: word, mode: 'insensitive' as const },
          })),
        },
        take: 50,
      });

      const fallbackMatch = fallbackCompanies.find(c => {
        const companySlug = generateSlug(c.company_name || '');
        return companySlug === idOrSlug;
      });

      if (fallbackMatch) return mapDbToCompany(fallbackMatch);
    }
  }

  return undefined;
}

// Get company by slug (alias for getCompanyById with slug)
export async function getCompanyBySlug(slug: string): Promise<Company | undefined> {
  return getCompanyById(slug);
}

// Get featured companies
export async function getFeaturedCompanies(limit: number = 8): Promise<Company[]> {
  // Get companies with high completeness (have most fields filled)
  const dbRecords = await prisma.companies.findMany({
    where: {
      AND: [
        { company_name: { not: null } },
        { short_overview: { not: null } },
        { certifications: { not: null } },
      ],
    },
    take: limit,
    orderBy: { company_name: 'asc' },
  });

  return dbRecords.map(c => ({
    ...mapDbToCompany(c),
    isFeatured: true,
  }));
}

// Get companies by type
export async function getCompaniesByType(type: string, limit?: number): Promise<Company[]> {
  const allCompanies = await getAllCompanies(limit ? limit * 10 : 1000);
  return allCompanies.filter(c => c.type === type).slice(0, limit);
}

// Search companies with filters
export async function searchCompanies(filters: {
  query?: string;
  type?: string[];
  city?: string[];
  state?: string[];
  rating?: number;
  verified?: boolean;
}): Promise<Company[]> {
  // Build Prisma where clause
  const whereClause: Parameters<typeof prisma.companies.findMany>[0]['where'] = {};

  if (filters.query) {
    whereClause.OR = [
      { company_name: { contains: filters.query, mode: 'insensitive' } },
      { category_search: { contains: filters.query, mode: 'insensitive' } },
      { short_overview: { contains: filters.query, mode: 'insensitive' } },
      { functionalities: { contains: filters.query, mode: 'insensitive' } },
      { product_portfolio: { contains: filters.query, mode: 'insensitive' } },
      { address: { contains: filters.query, mode: 'insensitive' } },
      { hq_country_city_address: { contains: filters.query, mode: 'insensitive' } },
    ];
  }

  if (filters.verified) {
    whereClause.gst_number = { not: null };
  }

  const dbRecords = await prisma.companies.findMany({
    where: whereClause,
    take: 100,
    orderBy: { company_name: 'asc' },
  });

  let results = dbRecords.map(mapDbToCompany);

  // Apply additional filters that need post-processing
  if (filters.type && filters.type.length > 0) {
    results = results.filter(c => filters.type!.includes(c.type));
  }

  if (filters.city && filters.city.length > 0) {
    results = results.filter(c =>
      filters.city!.some(city =>
        c.city.toLowerCase().includes(city.toLowerCase())
      )
    );
  }

  if (filters.state && filters.state.length > 0) {
    results = results.filter(c =>
      filters.state!.some(state =>
        c.state.toLowerCase().includes(state.toLowerCase())
      )
    );
  }

  if (filters.rating) {
    results = results.filter(c => (c.rating || 0) >= filters.rating!);
  }

  return results;
}

// Get similar companies
export async function getSimilarCompanies(company: Company, limit: number = 4): Promise<Company[]> {
  // Find companies with similar category or type
  const categoryToSearch = company.category && company.category.length > 0 ? company.category[0] : '';

  const dbRecords = await prisma.companies.findMany({
    where: {
      AND: [
        { id: { not: parseInt(company.id, 10) } },
        {
          OR: [
            ...(categoryToSearch ? [{ category_search: { contains: categoryToSearch, mode: 'insensitive' as const } }] : []),
            { entity: { contains: company.type, mode: 'insensitive' } },
          ],
        },
      ],
    },
    take: limit,
  });

  return dbRecords.map(mapDbToCompany);
}

// Get unique cities
export async function getUniqueCities(): Promise<string[]> {
  const companies = await getAllCompanies(500);
  const cities = new Set(companies.map(c => c.city));
  return Array.from(cities).filter(Boolean).sort();
}

// Get unique states
export async function getUniqueStates(): Promise<string[]> {
  const companies = await getAllCompanies(500);
  const states = new Set(companies.map(c => c.state));
  return Array.from(states).filter(Boolean).sort();
}

// Get company count
export async function getCompanyCount(): Promise<number> {
  return prisma.companies.count();
}

// Get categories with counts
export async function getCategoriesWithCounts(): Promise<{ name: string; count: number }[]> {
  const companies = await getAllCompanies(1000);
  const categoryMap = new Map<string, number>();

  companies.forEach(c => {
    c.category.forEach(cat => {
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// For backwards compatibility - sync version using cached data
// This will be populated on first async call
let cachedCompanies: Company[] = [];

export const companies: Company[] = cachedCompanies;

// Initialize cache
export async function initializeCompanyCache(): Promise<void> {
  cachedCompanies = await getAllCompanies(100);
}
