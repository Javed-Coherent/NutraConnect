import { CompanyType, VerificationType } from './types';

export const COMPANY_TYPES: Record<CompanyType, { label: string; icon: string; description: string }> = {
  manufacturer: {
    label: 'Manufacturer',
    icon: 'Factory',
    description: 'Companies that produce nutraceutical products',
  },
  distributor: {
    label: 'Distributor',
    icon: 'Truck',
    description: 'Wholesale distributors of health products',
  },
  retailer: {
    label: 'Retailer',
    icon: 'Store',
    description: 'Retail stores selling nutraceuticals',
  },
  wholesaler: {
    label: 'Trader/Wholesaler',
    icon: 'Warehouse',
    description: 'Bulk traders and wholesalers',
  },
  raw_material: {
    label: 'Raw Material Supplier',
    icon: 'Leaf',
    description: 'Suppliers of raw ingredients and materials',
  },
  formulator: {
    label: 'Formulator',
    icon: 'FlaskConical',
    description: 'Product formulation and R&D services',
  },
  packager: {
    label: 'Packager',
    icon: 'Package',
    description: 'Packaging and labeling services',
  },
  cro: {
    label: 'Testing Lab (CRO)',
    icon: 'Microscope',
    description: 'Quality testing and certification labs',
  },
};

export const VERIFICATION_TYPES: Record<VerificationType, { label: string; color: string }> = {
  gst: { label: 'GST Verified', color: 'green' },
  fssai: { label: 'FSSAI', color: 'blue' },
  iso: { label: 'ISO 9001', color: 'purple' },
  gmp: { label: 'GMP Certified', color: 'orange' },
  fda: { label: 'FDA Approved', color: 'red' },
  halal: { label: 'Halal Certified', color: 'teal' },
  organic: { label: 'Organic Certified', color: 'green' },
};

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
];

export const MAJOR_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Surat',
  'Chandigarh',
  'Indore',
  'Nagpur',
  'Vadodara',
  'Coimbatore',
  'Kochi',
  'Visakhapatnam',
  'Bhopal',
  'Patna',
];

export const PRODUCT_CATEGORIES = [
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
];

export const EMPLOYEE_COUNTS = [
  '1-10',
  '11-50',
  '51-100',
  '101-200',
  '201-500',
  '500+',
];

export const ANNUAL_TURNOVERS = [
  'Less than 1 Cr',
  '1-5 Cr',
  '5-10 Cr',
  '10-50 Cr',
  '50-100 Cr',
  '100+ Cr',
];

export const PLATFORM_STATS = {
  companies: 50000,
  cities: 500,
  supplyChainStages: 9,
};

// Freemium limits
export const FREE_TIER_LIMITS = {
  searchesPerDay: 10,
  profilesPerDay: 2,
  contactsPerDay: 2,
  savedCompanies: 5,
};

export const FEATURES = [
  {
    icon: 'Bot',
    title: 'AI-Powered Search',
    description: 'Natural language search - find exactly what you need with simple queries',
  },
  {
    icon: 'BadgeCheck',
    title: 'Verified Contacts',
    description: 'GST verified businesses with direct phone & email contacts',
  },
  {
    icon: 'TrendingUp',
    title: 'Industry Insights',
    description: 'Market trends, growth data, and comprehensive analysis',
  },
  {
    icon: 'Newspaper',
    title: 'News Alerts',
    description: 'Real-time news about companies & industry developments',
  },
  {
    icon: 'GitCompare',
    title: 'Company Compare',
    description: 'Side-by-side comparison of multiple companies',
  },
  {
    icon: 'Target',
    title: 'Smart Matching',
    description: 'AI suggests the most relevant business partners for you',
  },
];

// Supplier page categories (for finding customers)
export const CUSTOMER_CATEGORIES = [
  { id: 'distributor', name: 'Distributors', count: 10000 },
  { id: 'retailer', name: 'Retailers', count: 10000 },
  { id: 'wholesaler', name: 'Traders/Wholesalers', count: 10000 },
];

// Buyer page categories (for finding suppliers)
export const SUPPLIER_CATEGORIES = [
  { id: 'manufacturer', name: 'Manufacturers', count: 10000 },
  { id: 'raw_material', name: 'Raw Material Suppliers', count: 10000 },
  { id: 'formulator', name: 'Formulators', count: 10000 },
  { id: 'packager', name: 'Packagers', count: 10000 },
  { id: 'cro', name: 'Testing Labs (CRO)', count: 10000 },
];

export const SEARCH_SUGGESTIONS = {
  suppliers: [
    'CDMOs for vitamin C formulations',
    'CROs for protein supplement testing',
    'contract manufacturers for ayurvedic products',
    'packaging partners for nutraceutical tablets',
    'formulators for herbal extract capsules',
  ],
  buyers: [
    'protein powder manufacturers in Gujarat',
    'ayurvedic product manufacturers with GMP certification',
    'raw material providers for vitamin supplements',
    'contract manufacturers for nutraceuticals',
    'organic herbal extract providers',
  ],
};
