'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmailComposer } from '@/components/workspace/email/EmailComposer';
import { VoipDialerDialog } from '@/components/workspace/calls/VoipDialerDialog';
import { Company } from '@/lib/types';

interface SavedCompanyData {
  savedId: string;
  savedAt: Date;
  company: Company;
}

interface SavedCompaniesPreviewProps {
  companies: SavedCompanyData[];
}

export function SavedCompaniesPreview({ companies }: SavedCompaniesPreviewProps) {
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [voipDialerOpen, setVoipDialerOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleEmailClick = (company: Company, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (company.email) {
      setSelectedCompany(company);
      setEmailComposerOpen(true);
    }
  };

  const handleCallClick = (company: Company, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (company.phone) {
      setSelectedCompany(company);
      setVoipDialerOpen(true);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      manufacturer: 'Manufacturer',
      distributor: 'Distributor',
      retailer: 'Retailer',
      exporter: 'Exporter',
      wholesaler: 'Wholesaler',
      raw_material: 'Raw Material',
      formulator: 'Formulator',
      packager: 'Packager',
      cro: 'CRO/Lab',
      importer: 'Importer',
      ecommerce: 'E-commerce',
      pharmacy_chain: 'Pharmacy',
    };
    return labels[type] || type;
  };

  // Show first 6 companies
  const displayCompanies = companies.slice(0, 6);

  if (companies.length === 0) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-teal-500" />
            Added Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 inline-block mb-4">
              <Building2 className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No saved companies yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
              Start exploring and save companies you want to contact
            </p>
            <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" asChild>
              <Link href="/search">
                Discover Companies
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-teal-500" />
              Added Companies
              <Badge variant="secondary" className="ml-2 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300">
                {companies.length}
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300" asChild>
              <Link href="/workspace/saved">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCompanies.map((item) => {
              const company = item.company;
              return (
                <div
                  key={item.savedId}
                  className="group relative p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600 bg-white dark:bg-gray-800/50 hover:shadow-md transition-all duration-200"
                >
                  {/* Company Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                        {company.name.charAt(0)}
                      </div>
                      {company.isVerified && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 flex items-center justify-center border-2 border-white dark:border-gray-800">
                          <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/company/${company.id}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors block truncate"
                      >
                        {company.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="secondary" className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-0 text-xs px-1.5 py-0">
                          {getTypeLabel(company.type)}
                        </Badge>
                        {company.rating && (
                          <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-0.5" />
                            {company.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-teal-500 dark:text-teal-400" />
                    {company.city}, {company.state}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    {company.email && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                        onClick={(e) => handleEmailClick(company, e)}
                      >
                        <Mail className="h-4 w-4 mr-1.5" />
                        Email
                      </Button>
                    )}
                    {company.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                        onClick={(e) => handleCallClick(company, e)}
                      >
                        <Phone className="h-4 w-4 mr-1.5" />
                        Call
                      </Button>
                    )}
                    {!company.email && !company.phone && (
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                        asChild
                      >
                        <Link href={`/company/${company.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show more indicator */}
          {companies.length > 6 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
              <Button variant="ghost" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300" asChild>
                <Link href="/workspace/saved">
                  View all {companies.length} added companies
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Composer Modal */}
      <EmailComposer
        open={emailComposerOpen}
        onOpenChange={setEmailComposerOpen}
        prefill={selectedCompany ? {
          toEmail: selectedCompany.email || undefined,
          toName: selectedCompany.name,
          companyId: parseInt(selectedCompany.id),
        } : undefined}
      />

      {/* VoIP Dialer Modal */}
      <VoipDialerDialog
        open={voipDialerOpen}
        onOpenChange={setVoipDialerOpen}
        prefillNumber={selectedCompany?.phone || undefined}
        prefillName={selectedCompany?.name}
        companyId={selectedCompany ? parseInt(selectedCompany.id) : undefined}
      />
    </>
  );
}
