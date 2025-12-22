/**
 * Chat Company Search Service
 *
 * Connects the Industry Expert chatbot to the company database
 * for intelligent company recommendations.
 */

import { prisma } from '../db';
import { Company, CompanyType } from '../types';

// Keywords that indicate user wants company recommendations
const COMPANY_INTENT_KEYWORDS = [
  // Direct requests
  'find', 'suggest', 'recommend', 'show', 'list', 'give me', 'looking for',
  'need', 'want', 'searching for', 'help me find', 'where can i find',

  // Entity types
  'manufacturer', 'manufacturers', 'cdmo', 'supplier', 'suppliers',
  'distributor', 'distributors', 'formulator', 'formulators',
  'packager', 'packagers', 'retailer', 'retailers', 'trader', 'traders',
  'wholesaler', 'wholesalers', 'vendor', 'vendors', 'company', 'companies',
  'lab', 'labs', 'laboratory', 'testing lab', 'cro',

  // Action phrases
  'who can', 'which companies', 'any companies', 'best companies',
  'top manufacturers', 'reliable suppliers', 'certified', 'verified'
];

// Business context keywords - suggest companies even for advisory queries
const BUSINESS_CONTEXT_KEYWORDS = [
  // Business expansion
  'starting production', 'start producing', 'want to produce', 'thinking of making',
  'expand into', 'expanding', 'add to our', 'new product line', 'launch',
  'transition', 'transitioning', 'moving into', 'entering',

  // Sourcing needs
  'source', 'sourcing', 'raw material', 'raw materials', 'ingredients',
  'where to buy', 'where to get', 'procurement', 'procure',

  // Partnership/outsourcing
  'outsource', 'outsourcing', 'contract manufacturing', 'private label',
  'white label', 'partner', 'partnership', 'collaboration',

  // Business roles
  'my company', 'our company', 'we are', 'i am a', 'our business',
  'as a cdmo', 'as a manufacturer', 'we manufacture', 'we produce'
];

// Product categories that should trigger company suggestions
const PRODUCT_CATEGORIES = [
  'protein', 'whey', 'creatine', 'bcaa', 'amino acid', 'pre-workout',
  'vitamin', 'mineral', 'multivitamin', 'omega', 'fish oil',
  'probiotic', 'prebiotic', 'digestive', 'enzyme',
  'collagen', 'biotin', 'keratin', 'beauty',
  'ashwagandha', 'turmeric', 'curcumin', 'herbal', 'ayurvedic',
  'capsule', 'tablet', 'powder', 'gummy', 'softgel', 'liquid',
  'sports nutrition', 'weight loss', 'immunity', 'joint health'
];

// Phrases that indicate pure knowledge questions (no company search)
const KNOWLEDGE_ONLY_PHRASES = [
  'what is the difference', 'explain the concept', 'tell me about the history',
  'regulations in', 'compliance requirements', 'define', 'meaning of'
];

// Entity type keywords that map to database entity values
const ENTITY_TYPE_MAPPINGS: Record<string, string[]> = {
  'raw_material': ['raw material', 'supplier', 'ingredient', 'raw materials supplier'],
  'formulator': ['formulator', 'cdmo', 'contract manufacturer', 'formulation'],
  'manufacturer': ['manufacturer', 'manufacturing'],
  'distributor': ['distributor', 'distribution'],
  'retailer': ['retailer', 'retail'],
  'wholesaler': ['wholesaler', 'trader', 'wholesale'],
  'packager': ['packager', 'packaging', 'bottler', 'bottling'],
  'cro': ['cro', 'lab', 'laboratory', 'testing', 'testing lab'],
};

/**
 * Infer the appropriate entity types based on user's intent
 * "How to make X" -> need raw material suppliers, formulators, CDMOs
 * "Where to buy X" -> need distributors, retailers
 * "Outsource X" -> need CDMOs, contract manufacturers
 * "give me 5 CDMO" -> directly requested entity type
 */
function inferEntityTypeFromIntent(message: string): string[] | null {
  const messageLower = message.toLowerCase();

  // FIRST: Check for explicit entity type mentions in direct requests
  // Patterns like "give me 5 CDMO", "find manufacturers", "list formulators", "show me suppliers"
  const directRequestPatterns = [
    /(?:give\s+me|find|list|show|suggest|recommend|need|want|looking\s+for)\s+(?:\d+\s+)?/i,
  ];

  const hasDirectRequest = directRequestPatterns.some(p => p.test(messageLower));

  // Entity type keywords to check for in direct requests
  const entityTypeKeywords: Record<string, string[]> = {
    'cdmo': ['cdmo', 'formulator'],
    'formulator': ['formulator', 'cdmo'],
    'manufacturer': ['manufacturer'],
    'supplier': ['supplier', 'raw material'],
    'distributor': ['distributor'],
    'retailer': ['retailer'],
    'wholesaler': ['wholesaler', 'trader'],
    'trader': ['trader', 'wholesaler'],
    'packager': ['packager', 'packaging'],
    'lab': ['cro', 'lab', 'laboratory', 'testing'],
    'cro': ['cro', 'lab', 'laboratory', 'testing'],
    'raw material supplier': ['raw material', 'supplier'],
  };

  // Check if any entity type is explicitly mentioned
  for (const [keyword, entityTypes] of Object.entries(entityTypeKeywords)) {
    // Match the keyword as a whole word (not part of another word)
    const keywordPattern = new RegExp(`\\b${keyword}s?\\b`, 'i');
    if (keywordPattern.test(messageLower)) {
      console.log(`[EntityInference] Detected explicit entity type: ${keyword} -> ${entityTypes.join(', ')}`);
      return entityTypes;
    }
  }

  // Making/Manufacturing intent -> need suppliers & formulators (NOT finished product manufacturers)
  const makePatterns = [
    /how\s+(to|do\s+i|can\s+i|do\s+we|can\s+we)\s+(make|manufacture|produce|create|formulate)/i,
    /want(ing)?\s+to\s+(make|manufacture|produce|start\s+making|start\s+producing)/i,
    /start(ing)?\s+(making|manufacturing|producing|production\s+of)/i,
    /(make|manufacture|produce|create)\s+(my\s+own|our\s+own)/i,
    /i\s+want\s+to\s+(make|produce|manufacture)/i,
    /we\s+want\s+to\s+(make|produce|manufacture)/i,
    /planning\s+to\s+(make|manufacture|produce)/i,
    /setup?\s+(for\s+)?(making|manufacturing|producing|production)/i,
    /process\s+(for|of)\s+(making|manufacturing|producing)/i,
  ];

  // Buying/Sourcing finished products -> need distributors & retailers
  const buyPatterns = [
    /where\s+(to|can\s+i|can\s+we)\s+(buy|purchase|get)/i,
    /looking\s+(to|for)\s+(buy|purchase)/i,
    /want(ing)?\s+to\s+(buy|purchase)/i,
    /need\s+to\s+(buy|purchase)/i,
    /purchase\s+(some|the)/i,
  ];

  // Sourcing raw materials -> need raw material suppliers
  const sourcePatterns = [
    /source\s+(raw\s+material|ingredient|material)/i,
    /sourcing\s+(raw\s+material|ingredient|material)/i,
    /where\s+(to|can\s+i)\s+(source|get|find)\s+(raw\s+material|ingredient)/i,
    /raw\s+material\s+(supplier|source|vendor)/i,
    /ingredient\s+(supplier|source|vendor)/i,
  ];

  // Outsourcing/Contract manufacturing -> need CDMOs & formulators
  const outsourcePatterns = [
    /(outsource|contract\s+out|partner\s+for)/i,
    /contract\s+manufactur/i,
    /private\s+label/i,
    /white\s+label/i,
    /third\s+party\s+manufactur/i,
    /toll\s+manufactur/i,
    /oem\s+manufactur/i,
  ];

  // Testing/Quality intent -> need labs/CROs
  const testPatterns = [
    /(test|analyze|certif|verify)\s+(my|our|the)/i,
    /quality\s+(check|testing|analysis)/i,
    /lab\s+(for|to)/i,
    /send\s+(for\s+)?testing/i,
    /get\s+(it\s+)?tested/i,
  ];

  // Packaging intent -> need packagers
  const packagePatterns = [
    /(packag|bottl|fill)\s+(my|our|the)/i,
    /need\s+(packag|bottling)/i,
    /looking\s+for\s+(packag|bottling)/i,
  ];

  // Check patterns in order of specificity
  if (sourcePatterns.some(p => p.test(messageLower))) {
    console.log('[EntityInference] Detected: sourcing raw materials');
    return ['raw material', 'supplier'];
  }

  if (makePatterns.some(p => p.test(messageLower))) {
    console.log('[EntityInference] Detected: making/manufacturing intent');
    return ['raw material', 'formulator', 'cdmo', 'supplier'];
  }

  if (outsourcePatterns.some(p => p.test(messageLower))) {
    console.log('[EntityInference] Detected: outsourcing intent');
    return ['formulator', 'cdmo', 'manufacturer'];
  }

  if (buyPatterns.some(p => p.test(messageLower))) {
    console.log('[EntityInference] Detected: buying intent');
    return ['distributor', 'retailer', 'wholesaler', 'trader'];
  }

  if (testPatterns.some(p => p.test(messageLower))) {
    console.log('[EntityInference] Detected: testing intent');
    return ['cro', 'lab', 'laboratory', 'testing'];
  }

  if (packagePatterns.some(p => p.test(messageLower))) {
    console.log('[EntityInference] Detected: packaging intent');
    return ['packager', 'packaging'];
  }

  console.log('[EntityInference] No specific intent detected');
  return null; // No specific intent detected, search all entity types
}

/**
 * Detect if a user message should trigger company recommendations
 * Now includes business advisory queries where companies would be helpful
 */
export function detectCompanyIntent(message: string): boolean {
  const messageLower = message.toLowerCase();

  // Check if it's a pure knowledge question (no company suggestions needed)
  const isPureKnowledge = KNOWLEDGE_ONLY_PHRASES.some(phrase =>
    messageLower.includes(phrase)
  );
  if (isPureKnowledge) {
    return false;
  }

  // Check for direct company intent keywords
  const hasCompanyIntent = COMPANY_INTENT_KEYWORDS.some(keyword =>
    messageLower.includes(keyword)
  );

  if (hasCompanyIntent) {
    return true;
  }

  // Check for business context (advisory queries where companies would help)
  const hasBusinessContext = BUSINESS_CONTEXT_KEYWORDS.some(keyword =>
    messageLower.includes(keyword)
  );

  // Check for product categories
  const hasProductCategory = PRODUCT_CATEGORIES.some(category =>
    messageLower.includes(category)
  );

  // Business context + product = suggest companies
  // Example: "my company is making protein powder, thinking of starting creatine"
  if (hasBusinessContext && hasProductCategory) {
    return true;
  }

  // Check for entity type + location/product pattern
  const entityTypes = ['manufacturer', 'distributor', 'supplier', 'formulator', 'packager', 'retailer', 'cdmo', 'trader', 'lab'];
  const hasEntityType = entityTypes.some(type => messageLower.includes(type));

  // Location indicators
  const hasLocation = /\b(in|from|near|at|around)\s+\w+/.test(messageLower) ||
    /(mumbai|delhi|bangalore|chennai|hyderabad|pune|ahmedabad|kolkata|gujarat|maharashtra|karnataka|tamil\s*nadu)/i.test(messageLower);

  // Strong intent: entity type + (location OR product)
  if (hasEntityType && (hasLocation || hasProductCategory)) {
    return true;
  }

  // Direct request patterns
  const directPatterns = [
    /find\s+(me\s+)?a?\s*(manufacturer|supplier|distributor|cdmo|formulator)/i,
    /looking\s+for\s+(a\s+)?(manufacturer|supplier|distributor|cdmo|formulator)/i,
    /need\s+(a\s+)?(manufacturer|supplier|distributor|cdmo|formulator)/i,
    /suggest\s+(some\s+)?(manufacturer|supplier|distributor|cdmo|companies)/i,
    /recommend\s+(some\s+)?(manufacturer|supplier|distributor|cdmo|companies)/i,
    /who\s+(can|makes|supplies|manufactures)/i,
    /where\s+can\s+i\s+(find|get|buy)/i,
    /list\s+(of\s+)?(manufacturer|supplier|distributor|companies)/i,
    // Business expansion patterns
    /start(ing)?\s+(production|making|producing)/i,
    /expand(ing)?\s+(into|to)/i,
    /transition(ing)?\s+(to|into|from)/i,
  ];

  return directPatterns.some(pattern => pattern.test(messageLower));
}

/**
 * Extract search keywords from message
 * Prioritizes product categories and entity types for better search results
 */
function extractSearchTerms(message: string): string[] {
  const messageLower = message.toLowerCase();

  // First, extract any matching product categories (high priority)
  const matchedProducts = PRODUCT_CATEGORIES.filter(cat => messageLower.includes(cat));

  // Extract entity types
  const entityTypes = ['manufacturer', 'distributor', 'supplier', 'formulator', 'packager', 'retailer', 'cdmo', 'trader', 'lab', 'raw material'];
  const matchedEntities = entityTypes.filter(type => messageLower.includes(type));

  // Extract locations
  const locationMatches = messageLower.match(/(mumbai|delhi|bangalore|bengaluru|chennai|hyderabad|pune|ahmedabad|kolkata|gujarat|maharashtra|karnataka|tamil\s*nadu|uttar\s*pradesh|rajasthan|madhya\s*pradesh)/gi) || [];

  // Stop words to filter out
  const stopWords = [
    'find', 'me', 'a', 'the', 'for', 'in', 'with', 'need', 'want', 'looking', 'suggest',
    'recommend', 'show', 'list', 'give', 'some', 'any', 'best', 'top', 'good', 'certified',
    'verified', 'my', 'our', 'company', 'is', 'are', 'we', 'i', 'am', 'was', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'of', 'to', 'and', 'or', 'but',
    'what', 'which', 'who', 'how', 'when', 'where', 'why', 'this', 'that', 'these', 'those',
    'it', 'its', 'them', 'their', 'think', 'thinking', 'start', 'starting', 'production',
    'produce', 'producing', 'make', 'making', 'currently', 'now', 'already', 'also'
  ];

  // General words from message (fallback)
  const generalWords = message
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));

  // Combine with priority: products > entities > locations > general
  const searchTerms = [
    ...matchedProducts,
    ...matchedEntities,
    ...locationMatches.map(l => l.toLowerCase()),
    ...generalWords.slice(0, 3)  // Limit general words
  ];

  // Remove duplicates and return
  return [...new Set(searchTerms)].slice(0, 6);
}

/**
 * Map database entity to CompanyType
 */
function mapEntityToType(entity: string | null): CompanyType {
  if (!entity) return 'manufacturer';
  const entityLower = entity.toLowerCase().trim();

  if (entityLower.includes('manufacturer')) return 'manufacturer';
  if (entityLower.includes('distributor')) return 'distributor';
  if (entityLower.includes('retailer')) return 'retailer';
  if (entityLower.includes('trader') || entityLower.includes('wholesaler')) return 'wholesaler';
  if (entityLower.includes('raw material') || entityLower.includes('supplier')) return 'raw_material';
  if (entityLower.includes('formulator')) return 'formulator';
  if (entityLower.includes('packager')) return 'packager';
  if (entityLower.includes('cro') || entityLower.includes('lab')) return 'cro';

  return 'manufacturer';
}

/**
 * Parse comma-separated string to array
 */
function parseToArray(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

/**
 * Extract city from address
 */
function extractCity(address: string | null, hqAddress: string | null): string {
  if (hqAddress) {
    const parts = hqAddress.split(',').map(p => p.trim());
    if (parts.length >= 1) return parts[0] || 'India';
  }
  if (address) {
    const parts = address.split(',').map(p => p.trim());
    if (parts.length >= 2) return parts[parts.length - 2] || 'India';
  }
  return 'India';
}

/**
 * Extract state from address
 */
function extractState(address: string | null): string {
  if (!address) return 'India';
  const parts = address.split(',').map(p => p.trim());
  if (parts.length >= 1) return parts[parts.length - 1] || 'India';
  return 'India';
}

/**
 * Generate slug from company name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Search companies based on chat message (direct Prisma query)
 * Now includes intent-based entity type filtering
 */
export async function searchCompaniesForChat(
  message: string,
  limit: number = 5
): Promise<{ companies: Company[]; total: number; entityTypesUsed?: string[] }> {
  try {
    // Check if prisma is available
    if (!prisma || !prisma.companies) {
      console.warn('[ChatCompanySearch] Prisma not available');
      return { companies: [], total: 0 };
    }

    const searchTerms = extractSearchTerms(message);
    const inferredEntityTypes = inferEntityTypeFromIntent(message);

    console.log('[ChatCompanySearch] Raw message:', message);
    console.log('[ChatCompanySearch] Search terms:', searchTerms);
    console.log('[ChatCompanySearch] Inferred entity types:', inferredEntityTypes);

    if (searchTerms.length === 0 && !inferredEntityTypes) {
      return { companies: [], total: 0 };
    }

    // Build base search conditions for products/categories
    // Filter out entity-type terms (handled separately) AND dosage forms (too generic)
    // "powder" matches Ashwagandha Powder, "capsule" matches any capsule product - not useful for filtering
    const productSearchTerms = searchTerms.filter(term => {
      const entityTerms = ['manufacturer', 'distributor', 'supplier', 'formulator',
        'packager', 'retailer', 'cdmo', 'trader', 'lab', 'raw material'];
      // Dosage forms are too generic - "powder" would match any powder product
      const dosageForms = ['powder', 'capsule', 'tablet', 'gummy', 'softgel', 'liquid', 'sachet', 'syrup'];
      const termLower = term.toLowerCase();
      return !entityTerms.includes(termLower) && !dosageForms.includes(termLower);
    });

    // Expand product terms with related ingredients (for raw material searches)
    // This helps find suppliers of specific ingredients that go into products
    const productExpansions: Record<string, string[]> = {
      'protein': ['whey', 'casein', 'soy protein', 'pea protein', 'protein concentrate', 'protein isolate'],
      'collagen': ['collagen peptides', 'marine collagen', 'bovine collagen'],
      'omega': ['fish oil', 'omega-3', 'dha', 'epa'],
      'probiotic': ['lactobacillus', 'bifidobacterium', 'probiotic culture'],
    };

    // Add related terms for product searches (especially useful when looking for raw materials)
    const expandedProductTerms = [...productSearchTerms];
    productSearchTerms.forEach(term => {
      const expansions = productExpansions[term.toLowerCase()];
      if (expansions) {
        expandedProductTerms.push(...expansions);
      }
    });

    console.log('[ChatCompanySearch] Product search terms (after filtering):', productSearchTerms);
    console.log('[ChatCompanySearch] Expanded product terms:', expandedProductTerms);

    // Build search conditions - match product keywords in PRODUCT-SPECIFIC fields only
    // Don't search in address fields for products - that causes irrelevant matches
    // Flatten all conditions for proper Prisma OR handling (avoid nested ORs)
    // Use expanded terms to find related raw materials (e.g., "protein" -> also searches "whey")
    const productConditions = expandedProductTerms.length > 0
      ? expandedProductTerms.flatMap(term => [
          { category_search: { contains: term, mode: 'insensitive' as const } },
          { product_portfolio: { contains: term, mode: 'insensitive' as const } },
          { functionalities: { contains: term, mode: 'insensitive' as const } },
        ])
      : [];

    // Build entity type filter if we inferred specific types
    const entityConditions = inferredEntityTypes
      ? inferredEntityTypes.map(entityType => ({
          entity: { contains: entityType, mode: 'insensitive' as const }
        }))
      : [];

    // Combine conditions:
    // - If we have both product terms AND entity types: products AND (entity1 OR entity2...)
    // - If we only have entity types: entity1 OR entity2...
    // - If we only have product terms: product conditions
    let whereClause: object;

    if (productConditions.length > 0 && entityConditions.length > 0) {
      // Search for products from specific entity types
      whereClause = {
        AND: [
          { OR: productConditions },
          { OR: entityConditions }
        ]
      };
    } else if (entityConditions.length > 0) {
      // Only entity type filter
      whereClause = { OR: entityConditions };
    } else if (productConditions.length > 0) {
      // Only product search
      whereClause = { OR: productConditions };
    } else {
      // Fallback to original search terms
      const fallbackConditions = searchTerms.map(term => ({
        OR: [
          { company_name: { contains: term, mode: 'insensitive' as const } },
          { category_search: { contains: term, mode: 'insensitive' as const } },
          { product_portfolio: { contains: term, mode: 'insensitive' as const } },
          { entity: { contains: term, mode: 'insensitive' as const } },
        ]
      }));
      whereClause = { OR: fallbackConditions };
    }

    console.log('[ChatCompanySearch] Where clause:', JSON.stringify(whereClause, null, 2));

    // Get total count
    const total = await prisma.companies.count({ where: whereClause });

    // Get companies
    const dbRecords = await prisma.companies.findMany({
      where: whereClause,
      take: limit,
      orderBy: { company_name: 'asc' }
    });

    console.log(`[ChatCompanySearch] Found ${dbRecords.length} companies (total: ${total})`);

    // Map to Company interface
    const companies: Company[] = dbRecords.map(record => ({
      id: record.id.toString(),
      name: record.company_name || 'Unknown Company',
      slug: generateSlug(record.company_name || 'company'),
      type: mapEntityToType(record.entity),
      category: parseToArray(record.category_search),
      city: extractCity(record.address, record.hq_country_city_address),
      state: extractState(record.address),
      address: record.address || undefined,
      email: record.email || undefined,
      gstNumber: record.gst_number || undefined,
      yearEstablished: record.year_of_establishment || undefined,
      employeeCount: record.employee_size || undefined,
      annualTurnover: record.revenue_range || undefined,
      products: parseToArray(record.product_portfolio),
      isVerified: !!record.gst_number,
      description: record.short_overview || undefined,
      highlights: parseToArray(record.certifications),
      coverageAreas: parseToArray(record.markets_served),
      isFeatured: false,
    }));

    return { companies, total, entityTypesUsed: inferredEntityTypes || undefined };
  } catch (error) {
    console.error('[ChatCompanySearch] Error searching companies:', error);
    return { companies: [], total: 0 };
  }
}

/**
 * Format companies for injection into chat context
 * Now includes intent context to help GPT present companies appropriately
 */
export function formatCompaniesForContext(
  companies: Company[],
  entityTypesUsed?: string[]
): string {
  if (companies.length === 0) {
    return `[NO COMPANIES FOUND]
No matching companies found in the database.
IMPORTANT: DO NOT make up any company names. Say "I couldn't find specific companies matching your criteria" and suggest visiting /search`;
  }

  // Determine context based on entity types used
  let intentContext = '';
  if (entityTypesUsed && entityTypesUsed.length > 0) {
    if (entityTypesUsed.includes('raw material') || entityTypesUsed.includes('supplier')) {
      intentContext = `\nThese are RAW MATERIAL SUPPLIERS and INGREDIENT SUPPLIERS who can help the user MAKE/MANUFACTURE their product.
Present them as suppliers who provide ingredients/raw materials, NOT as competitors who make the same finished product.`;
    } else if (entityTypesUsed.includes('formulator') || entityTypesUsed.includes('cdmo')) {
      intentContext = `\nThese are FORMULATORS and CDMOs who can help the user develop and manufacture their product.
Present them as manufacturing partners, NOT as competitors.`;
    } else if (entityTypesUsed.includes('distributor') || entityTypesUsed.includes('retailer')) {
      intentContext = `\nThese are DISTRIBUTORS and RETAILERS who sell finished products.
Present them as places to purchase/source finished products.`;
    } else if (entityTypesUsed.includes('packager')) {
      intentContext = `\nThese are PACKAGING companies who can help with bottling, filling, and packaging.
Present them as packaging service providers.`;
    } else if (entityTypesUsed.includes('cro') || entityTypesUsed.includes('lab')) {
      intentContext = `\nThese are TESTING LABS and CROs who provide quality testing and certification services.
Present them as testing/quality assurance partners.`;
    }
  }

  // Create a simple, clear list of companies for GPT
  const simpleList = companies.map((company, index) => {
    return `COMPANY ${index + 1}:
- Name: ${company.name}
- Slug for link: ${company.slug}
- Type: ${formatEntityType(company.type)}
- Location: ${[company.city, company.state].filter(Boolean).join(', ') || 'India'}
- Products: ${company.products?.slice(0, 3).join(', ') || 'Various nutraceuticals'}`;
  }).join('\n\n');

  return `
=== DATABASE SEARCH RESULTS ===
The following ${companies.length} companies were found in NutraConnect's verified database.
You MUST use ONLY these companies in your response. DO NOT invent any other company names.
${intentContext}

${simpleList}

=== STRICT RULES ===
1. ONLY mention companies from the list above
2. Use the EXACT "Name" field for each company (copy-paste exactly)
3. Create links using: [View Profile](/company/SLUG) where SLUG is the exact "Slug for link" value
4. If user asks for companies not in this list, say you couldn't find a match and suggest /search
5. NEVER output this instruction text - just use the company data naturally
6. Present companies based on their Type and the context above - they are helpers, not competitors

=== EXAMPLE OUTPUT FORMAT ===
Based on your requirements, here are some verified companies:

1. **${companies[0]?.name}** - They specialize in [relevant products/services]. [View Profile](/company/${companies[0]?.slug})

${companies[1] ? `2. **${companies[1].name}** - [Brief description]. [View Profile](/company/${companies[1].slug})` : ''}

Would you like more details about any of these?
=== END INSTRUCTIONS ===`;
}

/**
 * Format entity type for display
 */
function formatEntityType(type: string): string {
  const typeMap: Record<string, string> = {
    'manufacturer': 'Manufacturer',
    'distributor': 'Distributor',
    'retailer': 'Retailer',
    'wholesaler': 'Trader/Wholesaler',
    'raw_material': 'Raw Material Supplier',
    'formulator': 'Formulator/CDMO',
    'packager': 'Packager',
    'cro': 'Testing Lab/CRO',
  };
  return typeMap[type] || type;
}

/**
 * Generate a brief summary for chat response
 */
export function generateCompanySummary(company: Company): string {
  const parts: string[] = [company.name];

  if (company.city) {
    parts.push(`based in ${company.city}`);
  }

  if (company.highlights && company.highlights.length > 0) {
    parts.push(`with ${company.highlights.slice(0, 2).join(' and ')} certifications`);
  }

  if (company.yearEstablished) {
    const years = new Date().getFullYear() - company.yearEstablished;
    parts.push(`(${years}+ years experience)`);
  }

  return parts.join(' ');
}
