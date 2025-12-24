'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Bookmark,
  Calendar,
  Shield,
  Award,
  ChevronRight,
  Loader2,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/lib/types';
import { COMPANY_TYPES, VERIFICATION_TYPES } from '@/lib/constants';
import { toggleSaveCompanyAction, isCompanySavedAction } from '@/lib/actions/companies';
import { EmailComposer } from '@/components/workspace/email/EmailComposer';
import { VoipDialerDialog } from '@/components/workspace/calls/VoipDialerDialog';

interface CompanyHeaderProps {
  company: Company;
  isLoggedIn?: boolean;
}

export function CompanyHeader({ company, isLoggedIn = false }: CompanyHeaderProps) {
  const typeInfo = COMPANY_TYPES[company.type];
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [voipDialerOpen, setVoipDialerOpen] = useState(false);

  // Check if company is saved on mount (server action handles auth check)
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const saved = await isCompanySavedAction(parseInt(company.id));
        setIsSaved(saved);
      } catch (error) {
        // User not logged in or error - that's fine
      }
    };
    checkSavedStatus();
  }, [company.id]);

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const result = await toggleSaveCompanyAction(parseInt(company.id));
      if (result.success) {
        setIsSaved(result.saved);
      } else if (result.error?.includes('not authenticated') || result.error?.includes('sign in')) {
        // Redirect to login if not authenticated
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error saving company:', error);
      // If error, might be auth issue - redirect to login
      router.push('/auth/login');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-teal-50/30 to-emerald-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-b dark:border-gray-700">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3 text-sm">
        <nav className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/search?type=${company.type}`} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            {typeInfo?.label || company.type}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/search?city=${company.city}`} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            {company.city}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 dark:text-white font-medium">{company.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Logo */}
          <div className="relative">
            <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-5xl font-bold flex-shrink-0 shadow-xl">
              {company.name.charAt(0)}
            </div>
            {company.isVerified && (
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg border-2 border-white">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {company.name}
              </h1>
              {company.isFeatured && (
                <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                  <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                  Featured
                </Badge>
              )}
              {company.isVerified && (
                <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Business
                </Badge>
              )}
            </div>

            {/* Type & Location */}
            <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-400 mb-4">
              <Badge variant="secondary" className="text-sm bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                {typeInfo?.label || company.type}
              </Badge>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-teal-500 dark:text-teal-400" />
                {company.city}, {company.state}
              </span>
              {company.yearEstablished && (
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  Est. {company.yearEstablished}
                </span>
              )}
              {company.completenessScore && company.completenessScore >= 80 && (
                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <Award className="h-4 w-4 mr-1" />
                  Complete Profile
                </span>
              )}
            </div>

            {/* Verifications */}
            {company.verifications && company.verifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {company.verifications.map((v) => {
                  const vInfo = VERIFICATION_TYPES[v];
                  return (
                    <Badge
                      key={v}
                      variant="outline"
                      className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 px-3 py-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      {vInfo?.label || v.toUpperCase()}
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {company.email && (
                <Button
                  variant="outline"
                  className="border-teal-300 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-400"
                  onClick={() => setEmailComposerOpen(true)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              )}
              {company.phone && (
                <Button
                  variant="outline"
                  className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-400"
                  onClick={() => setVoipDialerOpen(true)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={saveLoading}
                className={
                  isSaved
                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400 border-teal-300 dark:border-teal-700"
                    : "dark:border-gray-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-500 dark:hover:text-teal-400 hover:border-teal-300 dark:hover:border-teal-700"
                }
              >
                {saveLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                )}
                {saveLoading ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>

          </div>
        </div>
      </div>

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
    </div>
  );
}
