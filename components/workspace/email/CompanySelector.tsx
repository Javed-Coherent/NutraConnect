'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Building2,
  MapPin,
  CheckCircle2,
  Star,
  Mail,
  ArrowRight,
  Bookmark,
} from 'lucide-react';
import Link from 'next/link';
import { Company } from '@/lib/types';

interface SavedCompanyData {
  savedId: string;
  savedAt: Date;
  company: Company;
}

interface CompanySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: SavedCompanyData[];
  onSelect: (company: Company) => void;
}

export function CompanySelector({
  open,
  onOpenChange,
  companies,
  onSelect,
}: CompanySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Reset search when dialog opens
  useEffect(() => {
    if (open) {
      setSearchQuery('');
    }
  }, [open]);

  // Filter companies that have email
  const companiesWithEmail = companies.filter(c => c.company.email);

  const filteredCompanies = companiesWithEmail.filter((item) => {
    const company = item.company;
    return (
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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

  const handleSelect = (company: Company) => {
    onSelect(company);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <Mail className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
            Select Company to Email
          </DialogTitle>
        </DialogHeader>

        {companiesWithEmail.length === 0 ? (
          <div className="py-12 text-center">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 inline-block mb-4">
              <Bookmark className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No companies to email
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm mx-auto">
              Save companies with email contact information to send them messages through the platform
            </p>
            <Button
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              onClick={() => onOpenChange(false)}
              asChild
            >
              <Link href="/search">
                <Search className="h-4 w-4 mr-2" />
                Discover Companies
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search saved companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* Info banner */}
            <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
              <p className="text-sm text-teal-700 dark:text-teal-300">
                Select a company to send them a message. All communications are routed through NutraConnect for your privacy.
              </p>
            </div>

            {/* Companies list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredCompanies.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No companies found matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                filteredCompanies.map((item) => {
                  const company = item.company;
                  return (
                    <button
                      key={item.savedId}
                      onClick={() => handleSelect(company)}
                      className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        {/* Company Logo */}
                        <div className="relative flex-shrink-0">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold">
                            {company.name.charAt(0)}
                          </div>
                          {company.isVerified && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 flex items-center justify-center border-2 border-white dark:border-gray-800">
                              <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Company Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white truncate">
                              {company.name}
                            </span>
                            {company.rating && (
                              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-0.5" />
                                {company.rating}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge
                              variant="secondary"
                              className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-0 text-xs"
                            >
                              {getTypeLabel(company.type)}
                            </Badge>
                            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <MapPin className="h-3.5 w-3.5 mr-1 text-teal-500 dark:text-teal-400" />
                              {company.city}
                            </span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <ArrowRight className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Only showing saved companies with email contact
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
