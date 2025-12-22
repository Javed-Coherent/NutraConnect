# NutraConnect

**AI-Powered B2B Supplier & Customer Intelligence Platform for the Nutraceutical Industry**

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)

---

## Overview

NutraConnect is a comprehensive B2B intelligence platform designed specifically for India's nutraceutical industry. It connects buyers (distributors, retailers, exporters) with suppliers (manufacturers, raw material suppliers, formulators) through an AI-powered search and discovery system.

### Key Highlights

- **50,000+** verified nutraceutical companies
- **500+** cities covered across India
- **9** supply chain stages (raw materials to retail)
- **AI-powered** natural language search
- **Real-time** industry news and market intelligence

---

## Features

### For Buyers (Distributors, Retailers, Exporters)
- Find verified manufacturers, raw material suppliers, and formulators
- Discover contract manufacturers (CDMOs) for custom formulations
- Connect with packaging service providers and testing labs
- Access supplier certifications and compliance information

### For Suppliers (Manufacturers, Producers)
- Discover distributors, retailers, and traders
- Find export partners and e-commerce platforms
- Track market trends and buyer demand
- Expand distribution network across India

### Core Platform Features

| Feature | Description |
|---------|-------------|
| **AI-Powered Search** | Natural language queries to find relevant companies |
| **Advanced Filtering** | Filter by company type, location, certifications, revenue, employee size |
| **Company Profiles** | Detailed information including products, certifications, contacts |
| **Saved Companies** | Bookmark and organize favorite suppliers/customers |
| **Search History** | Track and revisit previous searches |
| **Industry News** | Real-time news and market intelligence via Perplexity AI |
| **AI Assistant** | GPT-powered chatbot for industry Q&A |
| **Contact Reveals** | Access verified contact information (based on plan) |

---

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library with Server/Client Components
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js v5** - Authentication framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database

### AI & External APIs
- **OpenAI GPT-4o-mini** - AI chatbot and search enhancement
- **Perplexity AI** - Real-time industry news and insights

### Email
- **Resend** - Production email delivery
- **Nodemailer** - SMTP fallback

---

## Project Structure

```
nutraconnect/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, signup, verify)
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── chat/                 # AI chat endpoints
│   │   ├── news/                 # News feed endpoints
│   │   └── saved/                # Saved companies endpoints
│   ├── company/[id]/             # Company profile pages
│   ├── dashboard/                # User dashboard
│   ├── search/                   # Search results page
│   ├── for-buyers/               # Buyer discovery page
│   ├── for-suppliers/            # Supplier discovery page
│   └── knowledge/                # Industry knowledge page
│
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── chat/                     # Chatbot components
│   ├── company/                  # Company display components
│   ├── dashboard/                # Dashboard components
│   ├── layout/                   # Layout (Navbar, Footer, etc.)
│   ├── news/                     # News feed components
│   ├── search/                   # Search & filter components
│   ├── theme/                    # Theme provider
│   └── ui/                       # Reusable UI components (shadcn/ui)
│
├── lib/                          # Core utilities
│   ├── actions/                  # Server actions
│   ├── services/                 # Business logic services
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client
│   └── constants.ts              # App constants
│
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding script
│
├── dataset/                      # CSV data files
│   ├── manufacturer_10k.csv
│   ├── distributor_10k.csv
│   ├── retailer_10k.csv
│   ├── raw_material_10k.csv
│   ├── formulator_10k.csv
│   ├── packager_10k.csv
│   ├── cro_10k.csv
│   └── trader_10k.csv
│
└── public/                       # Static assets
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or later
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** 14 or later
- **Git**

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nutraconnect.git
cd nutraconnect
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/nutraconnect?schema=public"

# NextAuth.js
AUTH_SECRET="your-auth-secret-generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# OpenAI
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxx"

# Perplexity AI (for real-time news)
PERPLEXITY_API_KEY="pplx-xxxxxxxxxxxx"

# Email - Resend (Recommended for production)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="NutraConnect <noreply@yourdomain.com>"

# Email - SMTP Fallback (Gmail)
SMTP_EMAIL=""
SMTP_PASSWORD=""

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with company data
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | NextAuth.js secret key |
| `AUTH_URL` | Yes | Application URL for auth callbacks |
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI features |
| `PERPLEXITY_API_KEY` | No | Perplexity API for real-time news |
| `RESEND_API_KEY` | No | Resend API key for emails |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `SMTP_EMAIL` | No | Fallback SMTP email address |
| `SMTP_PASSWORD` | No | Fallback SMTP password |

---

## Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `User` | User accounts with authentication data |
| `Account` | OAuth provider accounts |
| `Session` | JWT session tokens |
| `companies` | 50,000+ nutraceutical company records |
| `SavedCompany` | User's bookmarked companies |
| `SearchHistory` | User search query history |
| `ProfileView` | Company profile view tracking |
| `ContactReveal` | Contact reveal tracking for limits |
| `Conversation` | AI chat conversations |
| `Message` | Individual chat messages |

### Company Data Fields

Each company record includes:
- **Identity**: Company name, GST number, entity type
- **Location**: Address, city, country, markets served
- **Business**: Year established, employee count, revenue range
- **Products**: Category, portfolio, brands, functionalities
- **Verification**: Confidence rating, certifications
- **Contacts**: Key person, designation, email, phone
- **Networks**: Distribution channels, export destinations, key clients

---

## API Routes

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signin` | User login |
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/signout` | User logout |
| GET | `/api/auth/session` | Get current session |

### Search & Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search` | Search companies |
| GET | `/api/company/[id]` | Get company details |

### News & Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news/latest` | Get latest industry news |
| GET | `/api/news/industry` | Get industry insights |

### User Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/saved/count` | Get saved companies count |
| POST | `/api/saved` | Save a company |
| DELETE | `/api/saved/[id]` | Remove saved company |

### AI Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to AI assistant |
| POST | `/api/knowledge/chat` | Knowledge base Q&A |

---

## Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma generate  # Generate Prisma client
npx prisma migrate dev    # Run migrations (dev)
npx prisma migrate deploy # Run migrations (prod)
npx prisma db seed   # Seed database
npx prisma studio    # Open Prisma Studio GUI

# Linting
npm run lint         # Run ESLint
```

---

## Subscription Tiers

### Free Tier
- 10 searches per day
- 2 company profile views per day
- 2 contact reveals per day
- 5 saved companies maximum
- Basic AI assistant

### Pro Tier
- Unlimited searches
- Unlimited profile views
- 50 contact reveals per day
- Unlimited saved companies
- Advanced AI features
- Export functionality

### Enterprise
- All Pro features
- API access
- Custom integrations
- Dedicated support
- Team management

---

## Company Types

The platform covers the complete nutraceutical supply chain:

| Type | Description |
|------|-------------|
| **Manufacturer** | Finished product manufacturers |
| **Distributor** | Wholesale distributors |
| **Retailer** | Retail businesses |
| **Wholesaler/Trader** | Traders and wholesalers |
| **Raw Material Supplier** | Ingredient and raw material suppliers |
| **Formulator (CDMO)** | Contract development and manufacturing |
| **Packager** | Packaging service providers |
| **Testing Lab (CRO)** | Quality testing and certification labs |

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is proprietary software. All rights reserved.

---

## Support

For support and inquiries:
- Email: support@nutraconnect.in
- Website: [nutraconnect.in](https://nutraconnect.in)

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [OpenAI](https://openai.com/) - AI capabilities
- [Perplexity AI](https://www.perplexity.ai/) - Real-time search
