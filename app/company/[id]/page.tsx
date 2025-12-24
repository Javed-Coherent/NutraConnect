import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CompanyHeader } from '@/components/company/CompanyHeader';
import { CompanyContent } from '@/components/company/CompanyContent';
import { getCompanyById } from '@/lib/data/companies';
import { COMPANY_TYPES } from '@/lib/constants';
import { addProfileViewAction } from '@/lib/actions/history';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const company = await getCompanyById(id);

  if (!company) {
    return {
      title: 'Company Not Found',
    };
  }

  const typeInfo = COMPANY_TYPES[company.type];

  return {
    title: `${company.name} - ${typeInfo?.label || company.type} in ${company.city}`,
    description:
      company.description ||
      `${company.name} is a ${typeInfo?.label || company.type} based in ${company.city}, ${company.state}. View contact details, products, and more.`,
    openGraph: {
      title: `${company.name} | NutraConnect`,
      description: company.description || `View ${company.name} profile on NutraConnect`,
      type: 'website',
    },
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const { id } = await params;
  const company = await getCompanyById(id);

  if (!company) {
    notFound();
  }

  // Track profile view (fire and forget - don't block page render)
  const companyId = parseInt(id, 10);
  if (!isNaN(companyId)) {
    addProfileViewAction(companyId).catch(console.error);
  }

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    description: company.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
      addressLocality: company.city,
      addressRegion: company.state,
      postalCode: company.pincode,
      addressCountry: 'IN',
    },
    telephone: company.phone,
    email: company.email,
    url: company.website,
    aggregateRating: company.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: company.rating,
          reviewCount: company.reviewsCount,
        }
      : undefined,
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CompanyHeader company={company} isLoggedIn={false} />
        <CompanyContent company={company} isLoggedIn={false} />
      </div>
    </>
  );
}
