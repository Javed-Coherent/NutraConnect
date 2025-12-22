import { NewsItem } from '../types';

export const news: NewsItem[] = [
  {
    id: 'news-1',
    title: 'NutriMart Distributors expands to Gujarat with new warehouse facility',
    summary: 'Leading Mumbai-based distributor opens 50,000 sq ft warehouse in Ahmedabad to serve growing demand in Western India.',
    source: 'Business Standard',
    url: 'https://example.com/news/nutrimart-expansion',
    publishedAt: '2024-12-01',
    relatedCompanyIds: ['nutrimart-distributors'],
    category: 'company',
    image: '/images/placeholders/news-1.jpg',
  },
  {
    id: 'news-2',
    title: 'VitaForce receives FDA approval for US market entry',
    summary: 'Ahmedabad-based nutraceutical manufacturer gets FDA registration, set to begin exports to United States.',
    source: 'Economic Times',
    url: 'https://example.com/news/vitaforce-fda',
    publishedAt: '2024-11-28',
    relatedCompanyIds: ['vitaforce-pharma'],
    category: 'company',
    image: '/images/placeholders/news-2.jpg',
  },
  {
    id: 'news-3',
    title: 'Indian nutraceutical market to reach $18 billion by 2025',
    summary: 'Industry report projects 15% CAGR growth driven by health consciousness and preventive healthcare trends.',
    source: 'Mint',
    url: 'https://example.com/news/market-growth',
    publishedAt: '2024-11-25',
    category: 'industry',
    image: '/images/placeholders/news-3.jpg',
  },
  {
    id: 'news-4',
    title: 'FSSAI introduces new labeling requirements for supplements',
    summary: 'New regulations mandate detailed ingredient disclosure and health claims substantiation for all nutraceutical products.',
    source: 'Financial Express',
    url: 'https://example.com/news/fssai-labeling',
    publishedAt: '2024-11-22',
    category: 'regulatory',
    image: '/images/placeholders/news-4.jpg',
  },
  {
    id: 'news-5',
    title: 'HealthFirst Distribution partners with 50 new retailers in Q3',
    summary: 'Delhi-based sports nutrition distributor expands retail network, adding 50 premium fitness stores.',
    source: 'India Retail News',
    url: 'https://example.com/news/healthfirst-expansion',
    publishedAt: '2024-11-20',
    relatedCompanyIds: ['healthfirst-distribution'],
    category: 'company',
  },
  {
    id: 'news-6',
    title: 'Protein supplement demand surges 40% post-pandemic',
    summary: 'Rising fitness awareness drives unprecedented growth in sports nutrition segment across India.',
    source: 'Hindu Business Line',
    url: 'https://example.com/news/protein-demand',
    publishedAt: '2024-11-18',
    category: 'industry',
  },
  {
    id: 'news-7',
    title: 'Herbex Naturals achieves USDA Organic certification',
    summary: 'Haridwar manufacturer becomes one of few Indian companies with US organic certification for Ayurvedic products.',
    source: 'Organic Today',
    url: 'https://example.com/news/herbex-organic',
    publishedAt: '2024-11-15',
    relatedCompanyIds: ['herbex-naturals'],
    category: 'company',
  },
  {
    id: 'news-8',
    title: 'E-commerce drives 60% of nutraceutical sales in metros',
    summary: 'Online channels dominate supplement purchases in tier-1 cities, traditional retail remains strong in smaller towns.',
    source: 'ET Retail',
    url: 'https://example.com/news/ecommerce-sales',
    publishedAt: '2024-11-12',
    category: 'industry',
  },
  {
    id: 'news-9',
    title: 'Government announces PLI scheme for nutraceutical manufacturing',
    summary: 'Rs 1,500 crore incentive scheme to boost domestic manufacturing of health supplements and active ingredients.',
    source: 'PIB',
    url: 'https://example.com/news/pli-scheme',
    publishedAt: '2024-11-10',
    category: 'regulatory',
  },
  {
    id: 'news-10',
    title: 'Apollo Pharmacy adds dedicated nutraceutical sections in 500 stores',
    summary: 'India\'s largest pharmacy chain creates specialized health supplement zones with trained staff.',
    source: 'Pharmacy Today',
    url: 'https://example.com/news/apollo-nutra',
    publishedAt: '2024-11-08',
    relatedCompanyIds: ['apollo-pharmacy'],
    category: 'company',
  },
  {
    id: 'news-11',
    title: 'Ashwagandha exports from India grow 35% in 2024',
    summary: 'Global demand for traditional Ayurvedic ingredients drives record export volumes.',
    source: 'APEDA News',
    url: 'https://example.com/news/ashwagandha-exports',
    publishedAt: '2024-11-05',
    category: 'industry',
  },
  {
    id: 'news-12',
    title: 'BioTech Nutraceuticals launches patented probiotic strain',
    summary: 'Bangalore-based company introduces clinically-validated probiotic for gut health market.',
    source: 'BioSpectrum',
    url: 'https://example.com/news/biotech-probiotic',
    publishedAt: '2024-11-02',
    relatedCompanyIds: ['biotech-nutraceuticals'],
    category: 'company',
  },
  {
    id: 'news-13',
    title: 'Maharashtra emerges as India\'s nutraceutical manufacturing hub',
    summary: 'State accounts for 30% of country\'s supplement production capacity with 200+ manufacturing units.',
    source: 'DNA India',
    url: 'https://example.com/news/maharashtra-hub',
    publishedAt: '2024-10-30',
    category: 'industry',
  },
  {
    id: 'news-14',
    title: 'New quality standards for imported supplements announced',
    summary: 'FSSAI mandates additional testing and documentation requirements for imported nutraceuticals.',
    source: 'Import Export News',
    url: 'https://example.com/news/import-standards',
    publishedAt: '2024-10-28',
    category: 'regulatory',
  },
  {
    id: 'news-15',
    title: 'Plant-based protein market in India to triple by 2027',
    summary: 'Growing vegan trend and sustainability concerns drive demand for plant proteins.',
    source: 'Food Navigator',
    url: 'https://example.com/news/plant-protein',
    publishedAt: '2024-10-25',
    category: 'industry',
  },
];

// Helper functions
export function getNewsById(id: string): NewsItem | undefined {
  return news.find((n) => n.id === id);
}

export function getNewsByCompany(companyId: string): NewsItem[] {
  return news.filter((n) => n.relatedCompanyIds?.includes(companyId));
}

export function getNewsByCategory(category: 'company' | 'industry' | 'regulatory'): NewsItem[] {
  return news.filter((n) => n.category === category);
}

export function getLatestNews(limit: number = 5): NewsItem[] {
  return [...news]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getIndustryNews(limit: number = 5): NewsItem[] {
  return news
    .filter((n) => n.category === 'industry' || n.category === 'regulatory')
    .slice(0, limit);
}
