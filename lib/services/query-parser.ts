import OpenAI from 'openai';

// Parsed query structure
export interface ParsedQuery {
  entityTypes: string[];      // manufacturer, distributor, etc.
  locations: string[];        // cities, states
  certifications: string[];   // GMP, FSSAI, ISO, etc.
  products: string[];         // protein, vitamin, etc.
  keywords: string[];         // other search terms
  employeeSize?: string;      // 100+, 50-100, etc.
  minYearEstablished?: number;
  intent: 'search' | 'compare' | 'verify' | 'contact';
}

// Simple in-memory cache for parsed queries
const queryCache = new Map<string, { result: ParsedQuery; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Valid entity types in our database
const VALID_ENTITY_TYPES = [
  'manufacturer',
  'distributor',
  'retailer',
  'wholesaler',
  'raw_material',
  'formulator',
  'packager',
  'cro'
];

// Valid certifications
const VALID_CERTIFICATIONS = [
  'gmp', 'fssai', 'iso', 'fda', 'halal', 'organic', 'haccp', 'kosher', 'who-gmp'
];

// Indian states and cities for validation
const INDIAN_STATES = [
  'maharashtra', 'gujarat', 'karnataka', 'tamil nadu', 'kerala', 'andhra pradesh',
  'telangana', 'west bengal', 'rajasthan', 'uttar pradesh', 'madhya pradesh', 'bihar',
  'punjab', 'haryana', 'odisha', 'jharkhand', 'chhattisgarh', 'assam', 'goa',
  'uttarakhand', 'himachal pradesh', 'delhi'
];

const INDIAN_CITIES = [
  'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'pune',
  'ahmedabad', 'jaipur', 'lucknow', 'surat', 'chandigarh', 'indore', 'nagpur', 'vadodara',
  'coimbatore', 'kochi', 'bhopal', 'patna', 'gurgaon', 'gurugram', 'noida', 'ghaziabad'
];

/**
 * Parse a natural language search query using OpenAI GPT
 * Falls back to keyword-based parsing if AI fails
 */
export async function parseQueryWithAI(query: string): Promise<ParsedQuery> {
  // Check cache first
  const cached = queryCache.get(query.toLowerCase().trim());
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  // Try AI parsing
  try {
    const result = await parseWithGPT(query);

    // Cache the result
    queryCache.set(query.toLowerCase().trim(), {
      result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error('AI query parsing failed, falling back to keyword parsing:', error);
    return fallbackParse(query);
  }
}

/**
 * Parse query using OpenAI GPT API
 */
async function parseWithGPT(query: string): Promise<ParsedQuery> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const openai = new OpenAI({
    apiKey,
  });

  const systemPrompt = `You are a search query parser for NutraConnect, an Indian B2B nutraceutical and supplement industry platform.

Parse the user's natural language search query and extract structured filters.

ENTITY TYPES (use exactly these values):
- manufacturer: Companies that manufacture products
- distributor: Companies that distribute products
- retailer: Companies that sell to end consumers
- wholesaler: Bulk traders and wholesalers
- raw_material: Raw material and ingredient suppliers
- formulator: Companies that formulate products
- packager: Packaging companies
- cro: Contract research organizations, testing labs

CERTIFICATIONS (use exactly these values):
- gmp: Good Manufacturing Practices
- fssai: FSSAI license
- iso: ISO certification
- fda: FDA approved
- halal: Halal certified
- organic: Organic certification
- haccp: HACCP certified
- who-gmp: WHO-GMP certified

LOCATIONS: Indian states and cities. Common ones include:
- States: Maharashtra, Gujarat, Karnataka, Tamil Nadu, Delhi, etc.
- Cities: Mumbai, Pune, Ahmedabad, Bangalore, Hyderabad, Chennai, etc.

Respond ONLY with valid JSON in this exact format:
{
  "entityTypes": ["manufacturer"],
  "locations": ["mumbai"],
  "certifications": ["gmp"],
  "products": ["protein", "supplements"],
  "keywords": ["other", "terms"],
  "employeeSize": "100+",
  "minYearEstablished": 2010,
  "intent": "search"
}

Rules:
1. Use lowercase for all values
2. Only include fields that are clearly mentioned or implied
3. employeeSize should be like "50+", "100+", "500+", or "50-100"
4. intent is usually "search" unless user wants to compare, verify, or contact
5. products should be specific product types mentioned (protein, vitamins, ayurvedic, etc.)
6. keywords are any remaining meaningful search terms not covered by other fields`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Using GPT-4o-mini for speed and cost efficiency
    max_tokens: 500,
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Parse this search query: "${query}"`
      }
    ],
    temperature: 0.1, // Low temperature for consistent parsing
  });

  // Extract the text response
  const responseText = response.choices[0]?.message?.content || '';

  // Parse JSON from response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in AI response');
  }

  const parsed = JSON.parse(jsonMatch[0]) as ParsedQuery;

  // Validate and sanitize the response
  return sanitizeParsedQuery(parsed);
}

/**
 * Sanitize and validate AI-parsed query
 */
function sanitizeParsedQuery(parsed: Partial<ParsedQuery>): ParsedQuery {
  return {
    entityTypes: (parsed.entityTypes || [])
      .map(e => e.toLowerCase())
      .filter(e => VALID_ENTITY_TYPES.includes(e)),
    locations: (parsed.locations || [])
      .map(l => l.toLowerCase())
      .filter(l =>
        INDIAN_STATES.includes(l) ||
        INDIAN_CITIES.includes(l) ||
        // Allow partial matches for flexibility
        INDIAN_STATES.some(s => s.includes(l) || l.includes(s)) ||
        INDIAN_CITIES.some(c => c.includes(l) || l.includes(c))
      ),
    certifications: (parsed.certifications || [])
      .map(c => c.toLowerCase().replace(/-/g, ''))
      .filter(c => VALID_CERTIFICATIONS.some(vc => vc.replace(/-/g, '') === c)),
    products: (parsed.products || []).map(p => p.toLowerCase()),
    keywords: (parsed.keywords || []).map(k => k.toLowerCase()),
    employeeSize: parsed.employeeSize,
    minYearEstablished: parsed.minYearEstablished,
    intent: parsed.intent || 'search'
  };
}

/**
 * Fallback keyword-based parsing (used when AI fails)
 */
function fallbackParse(query: string): ParsedQuery {
  const words = query.toLowerCase().split(/\s+/);
  const result: ParsedQuery = {
    entityTypes: [],
    locations: [],
    certifications: [],
    products: [],
    keywords: [],
    intent: 'search'
  };

  // Entity type keywords
  const entityKeywords: Record<string, string> = {
    'manufacturer': 'manufacturer', 'manufacturers': 'manufacturer', 'manufacturing': 'manufacturer',
    'distributor': 'distributor', 'distributors': 'distributor', 'distribution': 'distributor',
    'retailer': 'retailer', 'retailers': 'retailer', 'retail': 'retailer',
    'trader': 'wholesaler', 'traders': 'wholesaler', 'wholesaler': 'wholesaler', 'wholesalers': 'wholesaler',
    'supplier': 'raw_material', 'suppliers': 'raw_material',
    'formulator': 'formulator', 'formulators': 'formulator',
    'packager': 'packager', 'packagers': 'packager', 'packaging': 'packager',
    'cro': 'cro', 'lab': 'cro', 'laboratory': 'cro', 'testing': 'cro',
  };

  // Certification keywords
  const certKeywords: Record<string, string> = {
    'gmp': 'gmp', 'fssai': 'fssai', 'iso': 'iso', 'fda': 'fda',
    'halal': 'halal', 'organic': 'organic', 'haccp': 'haccp', 'kosher': 'kosher',
  };

  // Product keywords
  const productKeywords = [
    'protein', 'vitamin', 'vitamins', 'mineral', 'minerals', 'supplement', 'supplements',
    'ayurvedic', 'herbal', 'nutraceutical', 'whey', 'collagen', 'omega', 'probiotic',
    'capsule', 'tablet', 'powder', 'syrup', 'softgel'
  ];

  const stopWords = new Set(['give', 'me', 'find', 'show', 'list', 'get', 'the', 'a', 'an', 'of', 'in', 'for', 'with', 'best', 'top', 'good', 'near', 'around', 'from', 'to', 'and', 'or', 'certified', 'certificate', 'license', 'licensed']);

  // Check for multi-word locations first
  const queryLower = query.toLowerCase();
  for (const state of INDIAN_STATES) {
    if (state.includes(' ') && queryLower.includes(state)) {
      result.locations.push(state);
    }
  }

  for (const word of words) {
    // Entity types
    if (entityKeywords[word] && !result.entityTypes.includes(entityKeywords[word])) {
      result.entityTypes.push(entityKeywords[word]);
      continue;
    }

    // Certifications
    if (certKeywords[word] && !result.certifications.includes(certKeywords[word])) {
      result.certifications.push(certKeywords[word]);
      continue;
    }

    // Locations (single word)
    if (INDIAN_STATES.includes(word) && !result.locations.includes(word)) {
      result.locations.push(word);
      continue;
    }
    if (INDIAN_CITIES.includes(word) && !result.locations.includes(word)) {
      result.locations.push(word);
      continue;
    }

    // Products
    if (productKeywords.includes(word) && !result.products.includes(word)) {
      result.products.push(word);
      continue;
    }

    // Skip stop words
    if (stopWords.has(word)) continue;

    // Skip if part of multi-word location
    if (result.locations.some(loc => loc.includes(' ') && loc.includes(word))) continue;

    // Add as keyword
    if (word.length >= 2 && !result.keywords.includes(word)) {
      result.keywords.push(word);
    }
  }

  return result;
}

/**
 * Convert ParsedQuery to database-compatible filter format
 */
export function convertToDbFilters(parsed: ParsedQuery): {
  keywords: string[];
  entityType: string | null;
  location: string | null;
  certifications: string[];
} {
  return {
    keywords: [...parsed.products, ...parsed.keywords],
    entityType: parsed.entityTypes.length > 0 ? parsed.entityTypes[0] : null,
    location: parsed.locations.length > 0 ? parsed.locations[0] : null,
    certifications: parsed.certifications,
  };
}

/**
 * Clear the query cache (useful for testing)
 */
export function clearQueryCache(): void {
  queryCache.clear();
}
