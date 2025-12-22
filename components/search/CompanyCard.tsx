import Link from 'next/link';
import {
  Star,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/lib/types';
import { COMPANY_TYPES } from '@/lib/constants';

interface CompanyCardProps {
  company: Company;
  showActions?: boolean;
}

export function CompanyCard({
  company,
}: CompanyCardProps) {
  const typeInfo = COMPANY_TYPES[company.type];

  return (
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

        {/* Certifications */}
        {company.verifications && company.verifications.length > 0 && (
          <div className="hidden md:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            <span>{company.verifications.length} cert{company.verifications.length > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Arrow */}
        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </Link>
  );
}
