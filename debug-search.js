const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check companies with 'Exporter' in functionalities
  const exporters = await prisma.companies.findMany({
    where: { functionalities: { contains: 'Exporter', mode: 'insensitive' } },
    select: { id: true, company_name: true, functionalities: true, hq_country_city_address: true },
    take: 5
  });
  console.log('Companies with Exporter:', exporters.length);
  exporters.forEach(c => console.log('-', c.company_name, '|', c.functionalities, '|', c.hq_country_city_address));

  // Check companies with 'ashwagandha'
  const ashwagandha = await prisma.companies.findMany({
    where: {
      OR: [
        { category_search: { contains: 'ashwagandha', mode: 'insensitive' } },
        { product_portfolio: { contains: 'ashwagandha', mode: 'insensitive' } },
      ]
    },
    select: { id: true, company_name: true, hq_country_city_address: true },
    take: 5
  });
  console.log('\nCompanies with ashwagandha:', ashwagandha.length);
  ashwagandha.forEach(c => console.log('-', c.company_name, '|', c.hq_country_city_address));

  // Check companies in Gujarat
  const gujarat = await prisma.companies.findMany({
    where: { hq_country_city_address: { contains: 'Gujarat', mode: 'insensitive' } },
    select: { id: true, company_name: true, functionalities: true },
    take: 5
  });
  console.log('\nCompanies in Gujarat:', gujarat.length);
  gujarat.forEach(c => console.log('-', c.company_name, '|', c.functionalities));

  // Check if there are any companies matching ALL criteria
  const all = await prisma.companies.findMany({
    where: {
      AND: [
        { OR: [
          { category_search: { contains: 'ashwagandha', mode: 'insensitive' } },
          { product_portfolio: { contains: 'ashwagandha', mode: 'insensitive' } },
        ]},
        { functionalities: { contains: 'Exporter', mode: 'insensitive' } },
        { hq_country_city_address: { contains: 'Gujarat', mode: 'insensitive' } },
      ]
    },
    select: { company_name: true, functionalities: true, hq_country_city_address: true },
    take: 10
  });
  console.log('\nCompanies matching ALL (ashwagandha + exporter + Gujarat):', all.length);
  all.forEach(c => console.log('-', c.company_name));
}

main().catch(console.error).finally(() => prisma.$disconnect());
