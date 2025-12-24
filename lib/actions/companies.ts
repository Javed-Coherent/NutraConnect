'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { Company, CompanyType } from '../types';
import { parseQueryWithAI, convertToDbFilters, ParsedQuery } from '../services/query-parser';

// Map CompanyType to database entity values (for filtering)
function mapTypeToEntityValues(type: string): string[] {
  switch (type) {
    case 'manufacturer': return ['Manufacturer'];
    case 'distributor': return ['Distributor'];
    case 'retailer': return ['Retailer'];
    case 'wholesaler': return ['Trader', 'Wholesaler']; // Trader maps to wholesaler
    case 'raw_material': return ['Raw material', 'Raw Material'];
    case 'formulator': return ['Formulator'];
    case 'packager': return ['Packager'];
    case 'cro': return ['CRO'];
    case 'exporter': return ['Exporter', 'Manufacturer | Exporter'];
    default: return [type];
  }
}

// Map entity types to functionality search terms (for hybrid search)
// This allows searching in both entity field AND functionalities field
function getFunctionalitySearchTerms(entityType: string): string[] {
  switch (entityType) {
    case 'manufacturer': return ['Manufacturer'];
    case 'distributor': return ['Distributor'];
    case 'retailer': return ['Retailer'];
    case 'wholesaler': return ['Trader', 'Wholesaler'];
    case 'raw_material': return ['Raw Material', 'Supplier'];
    case 'formulator': return ['Formulator'];
    case 'packager': return ['Packager'];
    case 'cro': return ['CRO', 'Testing', 'Laboratory'];
    case 'exporter': return ['Exporter'];
    default: return [entityType];
  }
}

// Map database entity values to CompanyType
function mapEntityToType(entity: string | null): CompanyType {
  if (!entity) return 'manufacturer';

  const entityLower = entity.toLowerCase().trim();

  // Direct matches for our 8 entity types
  if (entityLower === 'manufacturer') return 'manufacturer';
  if (entityLower === 'distributor') return 'distributor';
  if (entityLower === 'retailer') return 'retailer';
  if (entityLower === 'raw material') return 'raw_material';
  if (entityLower === 'formulator') return 'formulator';
  if (entityLower === 'packager') return 'packager';
  if (entityLower === 'cro') return 'cro';
  if (entityLower === 'trader') return 'wholesaler'; // Map Trader to wholesaler

  // Fuzzy matches for variations
  if (entityLower.includes('manufacturer') || entityLower.includes('manufacturing')) return 'manufacturer';
  if (entityLower.includes('distributor') || entityLower.includes('distribution')) return 'distributor';
  if (entityLower.includes('retailer') || entityLower.includes('retail')) return 'retailer';
  if (entityLower.includes('wholesaler') || entityLower.includes('wholesale') || entityLower.includes('trader')) return 'wholesaler';
  if (entityLower.includes('raw material') || entityLower.includes('supplier') || entityLower.includes('ingredient')) return 'raw_material';
  if (entityLower.includes('formulator') || entityLower.includes('formulation')) return 'formulator';
  if (entityLower.includes('packager') || entityLower.includes('packaging')) return 'packager';
  if (entityLower.includes('cro') || entityLower.includes('contract research') || entityLower.includes('testing') || entityLower.includes('lab')) return 'cro';

  return 'manufacturer';
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
  if (hqAddress) {
    const parts = hqAddress.split(',').map(p => p.trim());
    if (parts.length >= 1) {
      return parts[0] || 'India';
    }
  }

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

// Calculate completeness score
function calculateCompletenessScore(dbCompany: {
  company_name: string | null;
  gst_number: string | null;
  entity: string | null;
  category_search: string | null;
  address: string | null;
  email: string | null;
  profile_url: string | null;
  year_of_establishment: number | null;
  employee_size: string | null;
  revenue_range: string | null;
  short_overview: string | null;
  product_portfolio: string | null;
  certifications: string | null;
}): number {
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

// Map database record to Company interface
function mapDbToCompany(dbCompany: {
  id: number;
  company_name: string | null;
  entity: string | null;
  category_search: string | null;
  address: string | null;
  hq_country_city_address: string | null;
  email: string | null;
  profile_url: string | null;
  gst_number: string | null;
  year_of_establishment: number | null;
  employee_size: string | null;
  revenue_range: string | null;
  product_portfolio: string | null;
  certifications: string | null;
  short_overview: string | null;
  functionalities: string | null;
  markets_served: string | null;
  created_at: Date | null;
}): Company {
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
    phone: undefined,
    email: dbCompany.email || undefined,
    website: dbCompany.profile_url || undefined,
    gstNumber: dbCompany.gst_number || undefined,
    yearEstablished: dbCompany.year_of_establishment || undefined,
    employeeCount: dbCompany.employee_size || undefined,
    annualTurnover: dbCompany.revenue_range || undefined,
    products: parseToArray(dbCompany.product_portfolio),
    brands: [],
    rating: undefined,
    reviewsCount: 0,
    isVerified: !!dbCompany.gst_number,
    verifications: dbCompany.certifications ? ['gst'] : [],
    description: dbCompany.short_overview || undefined,
    aiSummary: dbCompany.functionalities || undefined,
    highlights: parseToArray(dbCompany.certifications),
    coverageAreas: parseToArray(dbCompany.markets_served),
    isFeatured: false,
    completenessScore: calculateCompletenessScore(dbCompany),
    createdAt: dbCompany.created_at?.toISOString(),
    updatedAt: dbCompany.created_at?.toISOString(),
  };
}

// Server action to search companies
export async function searchCompaniesAction(filters: {
  query?: string;
  type?: string[];
  city?: string[];
  state?: string[];
  rating?: number;
  verified?: boolean;
}): Promise<Company[]> {
  const whereClause: Prisma.companiesWhereInput = {};

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

  // Apply additional filters
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

// Extract keywords from natural language query
function parseSearchQuery(query: string): { keywords: string[]; entityType: string | null; location: string | null } {
  const stopWords = ['give', 'me', 'find', 'show', 'list', 'get', 'the', 'a', 'an', 'of', 'in', 'for', 'with', 'best', 'top', 'good', 'near', 'around', 'from', 'to', 'and', 'or', '10', '5', '20', '100'];

  // Entity type keywords mapping
  const entityKeywords: Record<string, string> = {
    'manufacturer': 'manufacturer', 'manufacturers': 'manufacturer', 'manufacturing': 'manufacturer',
    'distributor': 'distributor', 'distributors': 'distributor', 'distribution': 'distributor',
    'retailer': 'retailer', 'retailers': 'retailer', 'retail': 'retailer',
    'trader': 'wholesaler', 'traders': 'wholesaler', 'wholesaler': 'wholesaler', 'wholesalers': 'wholesaler',
    'supplier': 'raw_material', 'suppliers': 'raw_material', 'raw material': 'raw_material',
    'formulator': 'formulator', 'formulators': 'formulator', 'formulation': 'formulator',
    'packager': 'packager', 'packagers': 'packager', 'packaging': 'packager',
    'cro': 'cro', 'testing': 'cro', 'lab': 'cro', 'laboratory': 'cro',
    // Note: 'exporter' is NOT mapped here - it's stored in functionalities field, not entity
    // So it should be searched as a keyword across all fields including functionalities
  };

  // Indian states (lowercase for matching)
  const states = [
    'maharashtra', 'gujarat', 'karnataka', 'tamil nadu', 'tamilnadu', 'kerala', 'andhra pradesh',
    'telangana', 'west bengal', 'rajasthan', 'uttar pradesh', 'madhya pradesh', 'bihar',
    'punjab', 'haryana', 'odisha', 'jharkhand', 'chhattisgarh', 'assam', 'goa',
    'uttarakhand', 'himachal pradesh', 'jammu', 'kashmir', 'delhi', 'chandigarh'
  ];

  // Common Indian cities
  const cities = [
    'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'pune',
    'ahmedabad', 'jaipur', 'lucknow', 'surat', 'chandigarh', 'indore', 'nagpur', 'vadodara',
    'coimbatore', 'kochi', 'bhopal', 'patna', 'gurgaon', 'gurugram', 'noida', 'ghaziabad',
    'faridabad', 'thane', 'navi mumbai', 'nashik', 'aurangabad', 'solapur', 'kolhapur',
    'sangli', 'satara', 'ratnagiri', 'visakhapatnam', 'vijayawada', 'guntur', 'mysore',
    'mangalore', 'hubli', 'belgaum', 'trichy', 'madurai', 'salem', 'erode', 'tiruppur',
    'ludhiana', 'amritsar', 'jalandhar', 'agra', 'varanasi', 'kanpur', 'allahabad',
    'meerut', 'rajkot', 'bhavnagar', 'jamnagar', 'raipur', 'ranchi', 'dhanbad'
  ];

  const words = query.toLowerCase().split(/\s+/);
  let entityType: string | null = null;
  let location: string | null = null;
  const keywords: string[] = [];

  // Check for multi-word states first (e.g., "tamil nadu", "uttar pradesh")
  const queryLower = query.toLowerCase();
  for (const state of states) {
    if (state.includes(' ') && queryLower.includes(state)) {
      location = state;
      break;
    }
  }

  for (const word of words) {
    // Check if it's an entity type
    if (entityKeywords[word]) {
      entityType = entityKeywords[word];
      continue;
    }

    // Check if it's a state (single word)
    if (!location && states.includes(word)) {
      location = word;
      continue;
    }

    // Check if it's a city
    if (!location && cities.includes(word)) {
      location = word;
      continue;
    }

    // Skip stop words
    if (stopWords.includes(word)) {
      continue;
    }

    // Skip if word is part of already detected multi-word location
    if (location && location.includes(' ') && location.includes(word)) {
      continue;
    }

    // Add as keyword if meaningful (at least 2 chars)
    if (word.length >= 2) {
      keywords.push(word);
    }
  }

  return { keywords, entityType, location };
}

// Server action to search companies with pagination
export async function searchCompaniesPaginatedAction(filters: {
  query?: string;
  type?: string[];
  city?: string[];
  state?: string[];
  rating?: number;
  verified?: boolean;
  skip?: number;
  take?: number;
  useAI?: boolean; // Enable AI-powered query parsing
}): Promise<{ companies: Company[]; total: number; hasMore: boolean; parsedQuery?: ParsedQuery }> {
  const skip = filters.skip || 0;
  const take = filters.take || 20;

  const whereClause: Prisma.companiesWhereInput = {};
  let parsedQuery: ParsedQuery | undefined;

  // Track keywords for relevance scoring (outside query block scope)
  let searchKeywords: string[] = [];
  // Track entity type for weighted relevance scoring in hybrid search
  let searchEntityType: string | null = null;

  if (filters.query) {
    let keywords: string[] = [];
    let entityType: string | null = null;
    let location: string | null = null;
    let certifications: string[] = [];

    // Use AI-powered parsing if enabled and API key is configured
    if (filters.useAI !== false && process.env.OPENAI_API_KEY) {
      try {
        parsedQuery = await parseQueryWithAI(filters.query);
        const dbFilters = convertToDbFilters(parsedQuery);
        keywords = dbFilters.keywords;
        entityType = dbFilters.entityType;
        location = dbFilters.location;
        certifications = dbFilters.certifications;
      } catch (error) {
        console.error('AI parsing failed, using fallback:', error);
        // Fall back to simple parsing
        const fallback = parseSearchQuery(filters.query);
        keywords = fallback.keywords;
        entityType = fallback.entityType;
        location = fallback.location;
      }
    } else {
      // Use simple keyword parsing
      const parsed = parseSearchQuery(filters.query);
      keywords = parsed.keywords;
      entityType = parsed.entityType;
      location = parsed.location;
    }

    // Debug logging
    console.log('[Search] Query:', filters.query);
    console.log('[Search] Parsed:', { keywords, entityType, location });

    // Store keywords and entity type for relevance scoring
    searchKeywords = keywords;
    searchEntityType = entityType;

    // Build AND conditions - each keyword must match at least one field
    // This ensures ALL keywords are present (stricter matching)
    if (keywords.length > 0) {
      const keywordConditions = keywords.map(keyword => ({
        OR: [
          { company_name: { contains: keyword, mode: 'insensitive' } },
          { category_search: { contains: keyword, mode: 'insensitive' } },
          { short_overview: { contains: keyword, mode: 'insensitive' } },
          { functionalities: { contains: keyword, mode: 'insensitive' } },
          { product_portfolio: { contains: keyword, mode: 'insensitive' } },
          { entity: { contains: keyword, mode: 'insensitive' } },
        ]
      }));

      // Initialize AND array if not exists
      if (!whereClause.AND) {
        whereClause.AND = [];
      }
      // Add keyword conditions - ALL keywords must match
      (whereClause.AND as Record<string, unknown>[]).push(...keywordConditions);
    }

    // Apply detected entity type - HYBRID SEARCH (entity OR functionalities)
    // This finds companies where the role matches EITHER their primary type OR their capabilities
    // Example: "trader" search finds entity="Trader" OR functionalities contains "Trader"
    if (entityType && (!filters.type || filters.type.length === 0)) {
      const entityValues = mapTypeToEntityValues(entityType);
      const functionalitySearchTerms = getFunctionalitySearchTerms(entityType);

      // Build hybrid condition: match in entity field OR functionalities field
      const entityTypeCondition = {
        OR: [
          { entity: { in: entityValues } },
          ...functionalitySearchTerms.map(term => ({
            functionalities: { contains: term, mode: 'insensitive' as const }
          }))
        ]
      };

      // Add to AND conditions (company must match entity type AND other filters)
      if (!whereClause.AND) {
        whereClause.AND = [];
      }
      (whereClause.AND as Record<string, unknown>[]).push(entityTypeCondition);
    }

    // Apply location as AND filter (MUST match location in address)
    if (location) {
      whereClause.AND = [
        ...(whereClause.AND as Record<string, unknown>[] || []),
        {
          OR: [
            { address: { contains: location, mode: 'insensitive' } },
            { hq_country_city_address: { contains: location, mode: 'insensitive' } },
          ]
        }
      ];
    }

    // Apply certifications filter if AI detected any
    if (certifications.length > 0) {
      const certConditions = certifications.map(cert => ({
        certifications: { contains: cert, mode: 'insensitive' as const }
      }));
      whereClause.AND = [
        ...(whereClause.AND as Record<string, unknown>[] || []),
        { OR: certConditions }
      ];
    }
  }

  if (filters.verified) {
    whereClause.gst_number = { not: null };
  }

  // Filter by entity type at database level
  if (filters.type && filters.type.length > 0) {
    const entityValues = filters.type.flatMap(mapTypeToEntityValues);
    whereClause.entity = { in: entityValues };
  }

  // Get total count for pagination
  const total = await prisma.companies.count({ where: whereClause });

  // Get paginated results
  const dbRecords = await prisma.companies.findMany({
    where: whereClause,
    skip,
    take,
    orderBy: { company_name: 'asc' },
  });

  let results = dbRecords.map(mapDbToCompany);

  // Apply relevance scoring if we have search keywords
  if (searchKeywords.length > 0) {
    type CompanyWithScore = Company & { _relevanceScore?: number };

    results = (results as CompanyWithScore[]).map(company => {
      let score = 0;

      for (const keyword of searchKeywords) {
        const kw = keyword.toLowerCase();

        // Match in company name (5 points)
        if (company.name.toLowerCase().includes(kw)) {
          score += 5;
        }

        // Match in category (5 points)
        if (company.category?.some(c => c.toLowerCase().includes(kw))) {
          score += 5;
        }

        // Match in products (5 points)
        if (company.products?.some(p => p.toLowerCase().includes(kw))) {
          score += 5;
        }

        // Match in description (5 points)
        if (company.description?.toLowerCase().includes(kw)) {
          score += 5;
        }

        // Match in AI summary (5 points)
        if (company.aiSummary?.toLowerCase().includes(kw)) {
          score += 5;
        }
      }

      // HYBRID SEARCH: Weighted entity type scoring
      // Prioritize companies whose primary type matches over those with role in functionalities
      if (searchEntityType) {
        const entityValues = mapTypeToEntityValues(searchEntityType);
        const functionalityTerms = getFunctionalitySearchTerms(searchEntityType);

        // HIGH PRIORITY: Match in entity field (10 points) - primary business type
        const companyTypeMatch = entityValues.some(ev =>
          company.type?.toLowerCase() === ev.toLowerCase()
        );
        if (companyTypeMatch) {
          score += 10;
        }
        // MEDIUM PRIORITY: Match in functionalities (5 points) - secondary capability
        else if (functionalityTerms.some(term =>
          company.aiSummary?.toLowerCase().includes(term.toLowerCase())
        )) {
          score += 5;
        }
      }

      return { ...company, _relevanceScore: score };
    });

    // Sort by relevance score (descending), then by name (ascending)
    (results as CompanyWithScore[]).sort((a: CompanyWithScore, b: CompanyWithScore) => {
      const scoreA = a._relevanceScore || 0;
      const scoreB = b._relevanceScore || 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA; // Higher score first
      }
      return a.name.localeCompare(b.name); // Alphabetical for same score
    });

    // Remove the temporary score field before returning
    results = (results as CompanyWithScore[]).map(({ _relevanceScore, ...company }: CompanyWithScore) => company as Company);

    console.log('[Search] Results sorted by relevance, top 3:',
      results.slice(0, 3).map((c: Company) => c.name));
  }

  if (filters.city && filters.city.length > 0) {
    results = results.filter((c: Company) =>
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

  return {
    companies: results,
    total,
    hasMore: skip + take < total,
    parsedQuery,
  };
}

// Server action to get company by ID
export async function getCompanyByIdAction(id: string): Promise<Company | null> {
  const dbCompany = await prisma.companies.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!dbCompany) return null;
  return mapDbToCompany(dbCompany);
}

// Server action to get company by slug
export async function getCompanyBySlugAction(slug: string): Promise<Company | null> {
  const dbCompanies = await prisma.companies.findMany({
    take: 500,
  });

  const company = dbCompanies.find(c => {
    const companySlug = generateSlug(c.company_name || '');
    return companySlug === slug;
  });

  if (!company) return null;
  return mapDbToCompany(company);
}

// Server action to get featured companies
export async function getFeaturedCompaniesAction(limit: number = 8): Promise<Company[]> {
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

// Server action to get trending companies based on engagement (last 7 days)
// For now, returns newest companies. Engagement scoring can be added after Prisma regeneration.
export async function getTrendingCompaniesAction(
  companyTypes: string[],
  limit: number = 4
): Promise<Company[]> {
  try {
    // Map company types to database entity values
    const entityValues = companyTypes.flatMap(mapTypeToEntityValues);

    // Get newest companies matching the entity types
    const companies = await prisma.companies.findMany({
      where: {
        company_name: { not: null },
        entity: { in: entityValues }
      },
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    return companies.map((company: typeof companies[number]) => ({
      ...mapDbToCompany(company),
      isFeatured: true
    }));
  } catch (error) {
    console.error('Error in getTrendingCompaniesAction:', error);
    return [];
  }
}

// Server action to get company count
export async function getCompanyCountAction(): Promise<number> {
  return prisma.companies.count();
}

// Server action to get unique cities
export async function getUniqueCitiesAction(): Promise<string[]> {
  const records = await prisma.companies.findMany({
    select: {
      address: true,
      hq_country_city_address: true,
    },
    take: 500,
  });

  const cities = new Set<string>();
  records.forEach(r => {
    const city = extractCity(r.address, r.hq_country_city_address);
    if (city && city !== 'India') {
      cities.add(city);
    }
  });

  return Array.from(cities).sort();
}

// Server action to get similar companies
export async function getSimilarCompaniesAction(companyId: string, limit: number = 4): Promise<Company[]> {
  const company = await getCompanyByIdAction(companyId);
  if (!company) return [];

  const categoryToSearch = company.category && company.category.length > 0 ? company.category[0] : '';

  const dbRecords = await prisma.companies.findMany({
    where: {
      AND: [
        { id: { not: parseInt(companyId, 10) } },
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

// ============================================
// Saved Companies Functions
// ============================================

import { auth } from "../auth"
import { revalidatePath } from "next/cache"

// Define SavedCompanyWithDetails type
export interface SavedCompanyWithDetails {
  savedId: string;
  savedAt: Date;
  companyId: number;
  company: Company;
}

// Get user's saved companies with full company details
export async function getSavedCompaniesAction(): Promise<SavedCompanyWithDetails[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  const savedCompanies = await prisma.savedCompany.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch company details for each saved company
  const companiesWithDetails = await Promise.all(
    savedCompanies.map(async (sc) => {
      const dbCompany = await prisma.companies.findUnique({
        where: { id: sc.companyId },
      })
      if (!dbCompany) return null
      return {
        savedId: sc.id,
        savedAt: sc.createdAt,
        companyId: sc.companyId,
        company: mapDbToCompany(dbCompany),
      }
    })
  )

  return companiesWithDetails.filter((c): c is SavedCompanyWithDetails => c !== null)
}

// Save a company to user's list
export async function saveCompanyAction(companyId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if already saved
    const existing = await prisma.savedCompany.findUnique({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId,
        }
      }
    })

    if (existing) {
      return { success: false, error: "Company already saved" }
    }

    await prisma.savedCompany.create({
      data: {
        userId: session.user.id,
        companyId,
      }
    })

    revalidatePath('/dashboard/saved')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error("Save company error:", error)
    return { success: false, error: "Failed to save company" }
  }
}

// Remove a company from user's saved list
export async function removeSavedCompanyAction(savedId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    // Verify ownership
    const savedCompany = await prisma.savedCompany.findUnique({
      where: { id: savedId }
    })

    if (!savedCompany || savedCompany.userId !== session.user.id) {
      return { success: false, error: "Not authorized" }
    }

    await prisma.savedCompany.delete({
      where: { id: savedId }
    })

    revalidatePath('/dashboard/saved')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error("Remove saved company error:", error)
    return { success: false, error: "Failed to remove company" }
  }
}

// Get count of user's saved companies
export async function getSavedCompaniesCountAction(): Promise<number> {
  const session = await auth()

  if (!session?.user?.id) {
    return 0
  }

  const count = await prisma.savedCompany.count({
    where: { userId: session.user.id },
  })

  return count
}

// Check if a company is saved by the current user
export async function isCompanySavedAction(companyId: number): Promise<boolean> {
  const session = await auth()

  if (!session?.user?.id) {
    return false
  }

  const saved = await prisma.savedCompany.findUnique({
    where: {
      userId_companyId: {
        userId: session.user.id,
        companyId,
      }
    }
  })

  return !!saved
}

// Toggle save status
export async function toggleSaveCompanyAction(companyId: number): Promise<{ success: boolean; saved: boolean; error?: string }> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, saved: false, error: "Not authenticated" }
    }

    const existing = await prisma.savedCompany.findUnique({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId,
        }
      }
    })

    if (existing) {
      await prisma.savedCompany.delete({
        where: { id: existing.id }
      })
      revalidatePath('/dashboard/saved')
      revalidatePath('/dashboard')
      return { success: true, saved: false }
    } else {
      await prisma.savedCompany.create({
        data: {
          userId: session.user.id,
          companyId,
        }
      })
      revalidatePath('/dashboard/saved')
      revalidatePath('/dashboard')
      return { success: true, saved: true }
    }
  } catch (error) {
    console.error("Toggle save company error:", error)
    return { success: false, saved: false, error: "Failed to toggle save" }
  }
}
