-- NutraConnect Database Schema
-- Run this first to create tables

-- Drop tables if exist (for clean re-run)
DROP TABLE IF EXISTS news_company CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Enum types
DROP TYPE IF EXISTS company_type CASCADE;
DROP TYPE IF EXISTS verification_type CASCADE;

CREATE TYPE company_type AS ENUM (
  'manufacturer',
  'distributor',
  'retailer',
  'exporter',
  'wholesaler',
  'raw_material',
  'formulator',
  'packager',
  'cro',
  'importer',
  'ecommerce',
  'pharmacy_chain'
);

CREATE TYPE verification_type AS ENUM (
  'gst',
  'fssai',
  'iso',
  'gmp',
  'fda',
  'halal',
  'organic'
);

-- Companies table
CREATE TABLE companies (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo VARCHAR(500),
  type company_type NOT NULL,
  category TEXT[] DEFAULT '{}',
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  address TEXT,
  pincode VARCHAR(10),
  coverage_areas TEXT[] DEFAULT '{}',
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(500),
  gst_number VARCHAR(50),
  fssai_number VARCHAR(50),
  year_established INTEGER,
  employee_count VARCHAR(50),
  annual_turnover VARCHAR(50),
  products TEXT[] DEFAULT '{}',
  brands TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2),
  reviews_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  verifications verification_type[] DEFAULT '{}',
  description TEXT,
  ai_summary TEXT,
  highlights TEXT[] DEFAULT '{}',
  completeness_score INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_companies_type ON companies(type);
CREATE INDEX idx_companies_state_city ON companies(state, city);
CREATE INDEX idx_companies_rating ON companies(rating);
CREATE INDEX idx_companies_is_featured ON companies(is_featured);

-- News table
CREATE TABLE news (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT NOT NULL,
  source VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  published_at TIMESTAMP NOT NULL,
  category VARCHAR(50) NOT NULL,
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_published_at ON news(published_at);

-- News-Company relationship (many-to-many)
CREATE TABLE news_company (
  id SERIAL PRIMARY KEY,
  news_id VARCHAR(255) REFERENCES news(id) ON DELETE CASCADE,
  company_id VARCHAR(255) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE(news_id, company_id)
);

CREATE INDEX idx_news_company_news_id ON news_company(news_id);
CREATE INDEX idx_news_company_company_id ON news_company(company_id);

-- Testimonials table
CREATE TABLE testimonials (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  avatar VARCHAR(500),
  rating INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Success message
SELECT 'Schema created successfully!' AS status;
