'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Star,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Users,
  Phone,
  Mail,
  Plus,
  Check,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Company } from '@/lib/types';
import { COMPANY_TYPES } from '@/lib/constants';
import { toggleSaveCompanyAction } from '@/lib/actions/companies';
import { EmailComposer } from '@/components/workspace/email/EmailComposer';
import { VoipDialerDialog } from '@/components/workspace/calls/VoipDialerDialog';

interface CompanyCardProps {
  company: Company;
  showActions?: boolean;
  isSaved?: boolean;
}

export function CompanyCard({
  company,
  isSaved: initialSaved = false,
}: CompanyCardProps) {
  const typeInfo = COMPANY_TYPES[company.type];
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [voipDialerOpen, setVoipDialerOpen] = useState(false);

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (company.phone) {
      setVoipDialerOpen(true);
    } else {
      alert('Phone number will be revealed after viewing the company profile.');
    }
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (company.email) {
      setEmailComposerOpen(true);
    } else {
      alert('Email will be revealed after viewing the company profile.');
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      const result = await toggleSaveCompanyAction(parseInt(company.id));
      if (result.success) {
        setIsSaved(result.saved);
      } else if (result.error === 'Not authenticated') {
        alert('Please login to save companies to your workspace.');
      }
    } catch (error) {
      console.error('Failed to save company:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Link href={`/company/${company.id}`}>
      <div className="flex items-center gap-4 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all duration-200 group cursor-pointer">
        {/* Logo */}
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
          {company.name.charAt(0)}
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
              {company.name}
            </h3>
            {company.isVerified && (
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
            )}
            {company.isFeatured && (
              <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300">
              {typeInfo?.label || company.type}
            </Badge>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {company.city}
            </span>
            {company.employeeCount && (
              <span className="flex items-center gap-1 hidden sm:flex">
                <Users className="h-3 w-3" />
                {company.employeeCount}
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        {company.rating && (
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md flex-shrink-0">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{company.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCall}
            className="h-8 w-8 p-0 text-gray-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30"
            title="Call"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEmail}
            className="h-8 w-8 p-0 text-gray-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30"
            title="Email"
          >
            <Mail className="h-4 w-4" />
          </Button>
          <Button
            variant={isSaved ? "default" : "outline"}
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
            className={`h-7 px-2 text-xs ${isSaved ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-teal-500 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30'}`}
          >
            {isSaved ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-1" />
                Workspace
              </>
            )}
          </Button>
        </div>

        {/* Arrow */}
        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </Link>

    {/* Email Composer Modal */}
    <EmailComposer
      open={emailComposerOpen}
      onOpenChange={setEmailComposerOpen}
      prefill={{
        toEmail: company.email || undefined,
        toName: company.name,
        companyId: parseInt(company.id),
      }}
    />

    {/* VoIP Dialer Modal */}
    <VoipDialerDialog
      open={voipDialerOpen}
      onOpenChange={setVoipDialerOpen}
      prefillNumber={company.phone || undefined}
      prefillName={company.name}
      companyId={parseInt(company.id)}
    />
    </>
  );
}
