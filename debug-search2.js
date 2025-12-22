const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Simulate parseSearchQuery
function parseSearchQuery(query) {
  const stopWords = ['in', 'at', 'the', 'a', 'an', 'for', 'to', 'of', 'and', 'or', 'with', 'near', 'from'];

  const entityKeywords = {
    'manufacturer': 'manufacturer', 'manufacturers': 'manufacturer', 'manufacturing': 'manufacturer',
    'distributor': 'distributor', 'distributors': 'distributor', 'distribution': 'distributor',
    'retailer': 'retailer', 'retailers': 'retailer', 'retail': 'retailer',
    'trader': 'wholesaler', 'traders': 'wholesaler', 'wholesaler': 'wholesaler', 'wholesalers': 'wholesaler',
    'supplier': 'raw_material', 'suppliers': 'raw_material', 'raw material': 'raw_material',
    'formulator': 'formulator', 'formulators': 'formulator', 'formulation': 'formulator',
    'packager': 'packager', 'packagers': 'packager', 'packaging': 'packager',
    'cro': 'cro', 'testing': 'cro', 'lab': 'cro', 'laboratory': 'cro',
  };

  const states = [
    'maharashtra', 'gujarat', 'karnataka', 'tamil nadu', 'tamilnadu', 'kerala', 'andhra pradesh',
    'telangana', 'west bengal', 'rajasthan', 'uttar pradesh', 'madhya pradesh', 'bihar',
    'punjab', 'haryana', 'odisha', 'jharkhand', 'chhattisgarh', 'assam', 'goa',
    'uttarakhand', 'himachal pradesh', 'jammu', 'kashmir', 'delhi', 'chandigarh'
  ];

  const words = query.toLowerCase().split(/\s+/);
  let entityType = null;
  let location = null;
  const keywords = [];

  const queryLower = query.toLowerCase();
  for (const state of states) {
    if (state.includes(' ') && queryLower.includes(state)) {
      location = state;
      break;
    }
  }

  for (const word of words) {
    if (entityKeywords[word]) {
      entityType = entityKeywords[word];
      continue;
    }
    if (!location && states.includes(word)) {
      location = word;
      continue;
    }
    if (stopWords.includes(word)) {
      continue;
    }
    if (location && location.includes(' ') && location.includes(word)) {
      continue;
    }
    if (word.length >= 2) {
      keywords.push(word);
    }
  }

  return { keywords, entityType, location };
}

async function simulateSearch(query) {
  console.log('\n=== Simulating search for:', query, '===\n');

  // Step 1: Parse query
  let parsed = parseSearchQuery(query);
  let keywords = parsed.keywords;
  let entityType = parsed.entityType;
  let location = parsed.location;

  console.log('Step 1 - Initial parsing:', JSON.stringify(parsed, null, 2));

  // Step 2: Apply exporter fix
  const queryLower = query.toLowerCase();
  const exporterTerms = ['exporters', 'exporter', 'export'];

  if (exporterTerms.some(t => queryLower.includes(t)) &&
      !keywords.some(k => k.toLowerCase() === 'exporter')) {
    keywords.push('exporter');
    console.log('Step 2 - Added "exporter" to keywords');
  }

  if (exporterTerms.some(t => queryLower.includes(t)) && entityType) {
    const hasOtherEntityWord = ['manufacturer', 'distributor', 'supplier', 'retailer', 'trader', 'wholesaler', 'formulator', 'packager', 'cro'].some(e => queryLower.includes(e));
    if (!hasOtherEntityWord) {
      console.log('Step 2 - Clearing entityType (was:', entityType, ')');
      entityType = null;
    }
  }

  console.log('\nStep 2 - After exporter fix:', JSON.stringify({ keywords, entityType, location }, null, 2));

  // Step 3: Build whereClause
  const whereClause = {};

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
    whereClause.AND = keywordConditions;
  }

  // Apply location filter
  if (location) {
    whereClause.AND = [
      ...(whereClause.AND || []),
      {
        OR: [
          { address: { contains: location, mode: 'insensitive' } },
          { hq_country_city_address: { contains: location, mode: 'insensitive' } },
        ]
      }
    ];
  }

  console.log('\nStep 3 - WHERE clause AND conditions count:', whereClause.AND?.length || 0);

  // Step 4: Execute query
  const count = await prisma.companies.count({ where: whereClause });
  console.log('\nStep 4 - Result count:', count);

  if (count > 0) {
    const results = await prisma.companies.findMany({
      where: whereClause,
      select: { company_name: true, functionalities: true, hq_country_city_address: true },
      take: 5
    });
    console.log('\nTop 5 results:');
    results.forEach(r => console.log('-', r.company_name, '|', r.functionalities, '|', r.hq_country_city_address));
  } else {
    // Debug: test each condition separately
    console.log('\n--- Debugging individual conditions ---');

    for (const kw of keywords) {
      const kwCount = await prisma.companies.count({
        where: {
          OR: [
            { company_name: { contains: kw, mode: 'insensitive' } },
            { category_search: { contains: kw, mode: 'insensitive' } },
            { short_overview: { contains: kw, mode: 'insensitive' } },
            { functionalities: { contains: kw, mode: 'insensitive' } },
            { product_portfolio: { contains: kw, mode: 'insensitive' } },
            { entity: { contains: kw, mode: 'insensitive' } },
          ]
        }
      });
      console.log(`Keyword "${kw}": ${kwCount} matches`);
    }

    if (location) {
      const locCount = await prisma.companies.count({
        where: {
          OR: [
            { address: { contains: location, mode: 'insensitive' } },
            { hq_country_city_address: { contains: location, mode: 'insensitive' } },
          ]
        }
      });
      console.log(`Location "${location}": ${locCount} matches`);
    }
  }
}

simulateSearch('ashwagandha exporters in gujarat')
  .catch(console.error)
  .finally(() => prisma.$disconnect());
