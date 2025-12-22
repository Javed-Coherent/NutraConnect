'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  COMPANY_TYPES,
  INDIAN_STATES,
  MAJOR_CITIES,
  VERIFICATION_TYPES,
  EMPLOYEE_COUNTS,
  ANNUAL_TURNOVERS,
} from '@/lib/constants';
import { CompanyType, VerificationType } from '@/lib/types';

// Sorted and grouped company types for better UX
const SORTED_COMPANY_TYPES: { group: string; types: CompanyType[] }[] = [
  {
    group: 'Supply Side',
    types: ['manufacturer', 'raw_material', 'formulator', 'packager'],
  },
  {
    group: 'Distribution',
    types: ['distributor', 'wholesaler', 'importer', 'exporter'],
  },
  {
    group: 'Retail',
    types: ['retailer', 'ecommerce', 'pharmacy_chain'],
  },
  {
    group: 'Services',
    types: ['cro'],
  },
];

// Sorted verification types by importance
const SORTED_VERIFICATION_TYPES: VerificationType[] = [
  'gst',
  'fssai',
  'gmp',
  'iso',
  'fda',
  'organic',
  'halal',
];

interface FilterSidebarProps {
  filters: {
    types: CompanyType[];
    states: string[];
    cities: string[];
    rating: number | null;
    verifications: VerificationType[];
    employeeCounts: string[];
    turnovers: string[];
  };
  onFiltersChange: (filters: FilterSidebarProps['filters']) => void;
  onClear: () => void;
  resultCount: number;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = false }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white py-3"
      >
        {title}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      {isOpen && <div className="pt-2">{children}</div>}
    </div>
  );
}

function FilterSubSection({ title, children, defaultOpen = false }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 dark:border-gray-600 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left py-2"
      >
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="h-3 w-3 text-gray-400 dark:text-gray-500" />
        ) : (
          <ChevronDown className="h-3 w-3 text-gray-400 dark:text-gray-500" />
        )}
      </button>
      {isOpen && <div className="pb-2">{children}</div>}
    </div>
  );
}

export function MobileFilterContent({
  filters,
  onFiltersChange,
  onClear,
  resultCount,
}: FilterSidebarProps) {
  const activeFilterCount =
    filters.types.length +
    filters.states.length +
    filters.cities.length +
    (filters.rating ? 1 : 0) +
    filters.verifications.length +
    filters.employeeCounts.length +
    filters.turnovers.length;

  const toggleType = (type: CompanyType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const toggleVerification = (v: VerificationType) => {
    const newVerifications = filters.verifications.includes(v)
      ? filters.verifications.filter((x) => x !== v)
      : [...filters.verifications, v];
    onFiltersChange({ ...filters, verifications: newVerifications });
  };

  const toggleEmployeeCount = (count: string) => {
    const newCounts = filters.employeeCounts.includes(count)
      ? filters.employeeCounts.filter((c) => c !== count)
      : [...filters.employeeCounts, count];
    onFiltersChange({ ...filters, employeeCounts: newCounts });
  };

  const toggleTurnover = (turnover: string) => {
    const newTurnovers = filters.turnovers.includes(turnover)
      ? filters.turnovers.filter((t) => t !== turnover)
      : [...filters.turnovers, turnover];
    onFiltersChange({ ...filters, turnovers: newTurnovers });
  };

  const removeFilter = (type: 'type' | 'state' | 'city' | 'rating' | 'verification' | 'employee' | 'turnover', value?: string) => {
    switch (type) {
      case 'type':
        onFiltersChange({ ...filters, types: filters.types.filter(t => t !== value) });
        break;
      case 'state':
        onFiltersChange({ ...filters, states: filters.states.filter(s => s !== value) });
        break;
      case 'city':
        onFiltersChange({ ...filters, cities: filters.cities.filter(c => c !== value) });
        break;
      case 'rating':
        onFiltersChange({ ...filters, rating: null });
        break;
      case 'verification':
        onFiltersChange({ ...filters, verifications: filters.verifications.filter(v => v !== value) });
        break;
      case 'employee':
        onFiltersChange({ ...filters, employeeCounts: filters.employeeCounts.filter(e => e !== value) });
        break;
      case 'turnover':
        onFiltersChange({ ...filters, turnovers: filters.turnovers.filter(t => t !== value) });
        break;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">Filters</span>
            {activeFilterCount > 0 && (
              <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 max-h-20 overflow-y-auto">
            {filters.types.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-teal-50 text-teal-700 hover:bg-teal-100 cursor-pointer"
                onClick={() => removeFilter('type', type)}
              >
                {COMPANY_TYPES[type]?.label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {filters.states.map((state) => (
              <Badge
                key={state}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                onClick={() => removeFilter('state', state)}
              >
                {state}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {filters.cities.map((city) => (
              <Badge
                key={city}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                onClick={() => removeFilter('city', city)}
              >
                {city}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {filters.rating && (
              <Badge
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 cursor-pointer"
                onClick={() => removeFilter('rating')}
              >
                {filters.rating}+ Stars
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {filters.verifications.map((v) => (
              <Badge
                key={v}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer"
                onClick={() => removeFilter('verification', v)}
              >
                {VERIFICATION_TYPES[v]?.label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {filters.employeeCounts.map((count) => (
              <Badge
                key={count}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 cursor-pointer"
                onClick={() => removeFilter('employee', count)}
              >
                {count}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {filters.turnovers.map((turnover) => (
              <Badge
                key={turnover}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer"
                onClick={() => removeFilter('turnover', turnover)}
              >
                {turnover}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Filters - Scrollable Area */}
      <div className="flex-1 overflow-y-auto min-h-0 filter-scroll">
        <div className="p-4 space-y-3">
          {/* Business Type - Grouped */}
          <FilterSection title="Business Type">
            <div className="space-y-1">
              {SORTED_COMPANY_TYPES.map((group) => (
                <FilterSubSection key={group.group} title={group.group}>
                  <div className="space-y-1.5 pl-1">
                    {group.types.map((type) => (
                      <label
                        key={type}
                        className="flex items-center space-x-2.5 cursor-pointer py-1 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Checkbox
                          checked={filters.types.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                          className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {COMPANY_TYPES[type]?.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSubSection>
              ))}
            </div>
          </FilterSection>

          {/* Location */}
          <FilterSection title="Location">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">State</label>
                <Select
                  value={filters.states[0] || ''}
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      states: value ? [value] : [],
                    })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">City</label>
                <Select
                  value={filters.cities[0] || ''}
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      cities: value ? [value] : [],
                    })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {MAJOR_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection title="Minimum Rating">
            <div className="flex gap-2 flex-wrap">
              {[4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={filters.rating === rating ? 'default' : 'outline'}
                  size="sm"
                  className={
                    filters.rating === rating
                      ? 'bg-teal-600 hover:bg-teal-700'
                      : 'hover:border-teal-300 hover:text-teal-600'
                  }
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      rating: filters.rating === rating ? null : rating,
                    })
                  }
                >
                  {rating}+ Stars
                </Button>
              ))}
            </div>
          </FilterSection>

          {/* Certifications */}
          <FilterSection title="Certifications">
            <div className="grid grid-cols-2 gap-1.5">
              {SORTED_VERIFICATION_TYPES.map((key) => {
                const value = VERIFICATION_TYPES[key];
                return (
                  <label
                    key={key}
                    className="flex items-center space-x-2 cursor-pointer py-1.5 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Checkbox
                      checked={filters.verifications.includes(key)}
                      onCheckedChange={() => toggleVerification(key)}
                      className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{value.label}</span>
                  </label>
                );
              })}
            </div>
          </FilterSection>

          {/* Company Size */}
          <FilterSection title="Company Size">
            <div className="space-y-1.5">
              {EMPLOYEE_COUNTS.map((count) => (
                <label
                  key={count}
                  className="flex items-center space-x-2.5 cursor-pointer py-1.5 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Checkbox
                    checked={filters.employeeCounts.includes(count)}
                    onCheckedChange={() => toggleEmployeeCount(count)}
                    className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{count} employees</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Annual Turnover */}
          <FilterSection title="Annual Turnover">
            <div className="space-y-1.5">
              {ANNUAL_TURNOVERS.map((turnover) => (
                <label
                  key={turnover}
                  className="flex items-center space-x-2.5 cursor-pointer py-1.5 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Checkbox
                    checked={filters.turnovers.includes(turnover)}
                    onCheckedChange={() => toggleTurnover(turnover)}
                    className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{turnover}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Bottom padding for scroll */}
          <div className="h-6" />
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {resultCount} {resultCount === 1 ? 'company' : 'companies'} found
          </p>
          {activeFilterCount > 0 && (
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-700"
              onClick={onClear}
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  // Desktop version only - mobile is handled separately in the page
  return (
    <div className="hidden lg:block w-72 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-[calc(100vh-64px)] sticky top-16">
      <MobileFilterContent {...props} />
    </div>
  );
}
