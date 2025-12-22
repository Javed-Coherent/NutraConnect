'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpDown, Filter, Search, X, Loader2 } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { CompanyCard } from '@/components/search/CompanyCard';
import { MobileFilterContent } from '@/components/search/FilterSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { searchCompaniesPaginatedAction } from '@/lib/actions/companies';
import { addSearchHistoryAction } from '@/lib/actions/history';
import { SEARCH_SUGGESTIONS, COMPANY_TYPES, VERIFICATION_TYPES } from '@/lib/constants';
import { CompanyType, VerificationType, Company } from '@/lib/types';

const PAGE_SIZE = 20;

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || '';

  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'recent' | 'name'>('relevance');
  const [filters, setFilters] = useState({
    types: initialType ? [initialType as CompanyType] : [],
    states: [] as string[],
    cities: [] as string[],
    rating: null as number | null,
    verifications: [] as VerificationType[],
    employeeCounts: [] as string[],
    turnovers: [] as string[],
  });

  // Results and pagination state
  const [results, setResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Ref for intersection observer
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Build filter object for API call
  const getFilterParams = useCallback(() => ({
    query: initialQuery,
    type: filters.types.length > 0 ? filters.types : undefined,
    city: filters.cities.length > 0 ? filters.cities : undefined,
    state: filters.states.length > 0 ? filters.states : undefined,
    rating: filters.rating || undefined,
    verified: filters.verifications.length > 0 ? true : undefined,
  }), [initialQuery, filters]);

  // Apply client-side sorting and filtering
  const applyClientFilters = useCallback((companies: Company[]) => {
    let filtered = [...companies];

    // Additional filtering for verifications
    if (filters.verifications.length > 0) {
      filtered = filtered.filter((c) =>
        filters.verifications.some((v) => c.verifications?.includes(v))
      );
    }

    // Additional filtering for employee count
    if (filters.employeeCounts.length > 0) {
      filtered = filtered.filter((c) =>
        filters.employeeCounts.includes(c.employeeCount || '')
      );
    }

    // Additional filtering for turnover
    if (filters.turnovers.length > 0) {
      filtered = filtered.filter((c) =>
        filters.turnovers.includes(c.annualTurnover || '')
      );
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        filtered.sort(
          (a, b) =>
            new Date(b.updatedAt || 0).getTime() -
            new Date(a.updatedAt || 0).getTime()
        );
        break;
      default:
        // relevance - featured first, then by rating
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }

    return filtered;
  }, [filters.verifications, filters.employeeCounts, filters.turnovers, sortBy]);

  // Check if any search/filter criteria is active
  const hasSearchCriteria = initialQuery.trim() !== '' ||
    filters.types.length > 0 ||
    filters.states.length > 0 ||
    filters.cities.length > 0 ||
    filters.rating !== null ||
    filters.verifications.length > 0 ||
    filters.employeeCounts.length > 0 ||
    filters.turnovers.length > 0;

  // Initial fetch when filters or query change
  useEffect(() => {
    const fetchInitialData = async () => {
      // Don't fetch if no search criteria
      if (!hasSearchCriteria) {
        setIsLoading(false);
        setResults([]);
        setTotal(0);
        setHasMore(false);
        return;
      }

      setIsLoading(true);
      setPage(0);
      setResults([]);

      try {
        const result = await searchCompaniesPaginatedAction({
          ...getFilterParams(),
          skip: 0,
          take: PAGE_SIZE,
        });

        const filtered = applyClientFilters(result.companies);
        setResults(filtered);
        setTotal(result.total);
        setHasMore(result.hasMore);

        // Track search in history (only if there's a query)
        if (initialQuery && initialQuery.trim()) {
          addSearchHistoryAction(initialQuery, result.total).catch(console.error);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setResults([]);
        setTotal(0);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [initialQuery, filters, getFilterParams, applyClientFilters, hasSearchCriteria]);

  // Load more function
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const result = await searchCompaniesPaginatedAction({
        ...getFilterParams(),
        skip: nextPage * PAGE_SIZE,
        take: PAGE_SIZE,
      });

      const filtered = applyClientFilters(result.companies);
      setResults(prev => [...prev, ...filtered]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more companies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore, getFilterParams, applyClientFilters]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  // Update filters when URL changes
  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setFilters(prev => ({
        ...prev,
        types: [type as CompanyType]
      }));
    }
  }, [searchParams]);

  const clearFilters = () => {
    setFilters({
      types: [],
      states: [],
      cities: [],
      rating: null,
      verifications: [],
      employeeCounts: [],
      turnovers: [],
    });
  };

  const allSuggestions = [
    ...SEARCH_SUGGESTIONS.suppliers,
    ...SEARCH_SUGGESTIONS.buyers,
  ].slice(0, 5);

  const activeFilterCount =
    filters.types.length +
    filters.states.length +
    filters.cities.length +
    (filters.rating ? 1 : 0) +
    filters.verifications.length +
    filters.employeeCounts.length +
    filters.turnovers.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <SearchBar
            defaultValue={initialQuery}
            suggestions={allSuggestions}
            placeholder="Search companies, products, or services..."
          />
        </div>
      </div>

      {/* Results Area - Full Width */}
      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {!hasSearchCriteria
                ? 'Company Search'
                : initialQuery
                ? `Results for "${initialQuery}"`
                : 'Search Results'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {!hasSearchCriteria ? (
                <span>Search for companies, products, or services</span>
              ) : isLoading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <span className="font-medium text-teal-600 dark:text-teal-400">{results.length}</span>
                  {total > 0 && <span> of {total}</span>} companies found
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Dropdown Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 bg-teal-600 text-white hover:bg-teal-600">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 max-h-[80vh] overflow-hidden" align="end">
                <MobileFilterContent
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClear={clearFilters}
                  resultCount={results.length}
                />
              </PopoverContent>
            </Popover>

            {/* Sort */}
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as typeof sortBy)
              }
            >
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="recent">Recently Updated</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Active:</span>
            {filters.types.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-teal-50 text-teal-700 hover:bg-teal-100 cursor-pointer dark:bg-teal-900/50 dark:text-teal-300"
                onClick={() => setFilters(prev => ({ ...prev, types: prev.types.filter(t => t !== type) }))}
              >
                {COMPANY_TYPES[type]?.label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {filters.states.map((state) => (
              <Badge
                key={state}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer dark:bg-blue-900/50 dark:text-blue-300"
                onClick={() => setFilters(prev => ({ ...prev, states: prev.states.filter(s => s !== state) }))}
              >
                {state}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {filters.cities.map((city) => (
              <Badge
                key={city}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer dark:bg-blue-900/50 dark:text-blue-300"
                onClick={() => setFilters(prev => ({ ...prev, cities: prev.cities.filter(c => c !== city) }))}
              >
                {city}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {filters.rating && (
              <Badge
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 cursor-pointer dark:bg-yellow-900/50 dark:text-yellow-300"
                onClick={() => setFilters(prev => ({ ...prev, rating: null }))}
              >
                {filters.rating}+ Stars
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {filters.verifications.map((v) => (
              <Badge
                key={v}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer dark:bg-green-900/50 dark:text-green-300"
                onClick={() => setFilters(prev => ({ ...prev, verifications: prev.verifications.filter(x => x !== v) }))}
              >
                {VERIFICATION_TYPES[v]?.label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-red-600 h-6 px-2"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Searching companies...</p>
          </div>
        ) : !hasSearchCriteria ? (
          /* Initial state - no search performed yet */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/50 dark:to-emerald-900/50 flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-teal-500 dark:text-teal-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Search for Companies
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
              Find manufacturers, distributors, suppliers, and more in the nutraceutical industry. Use the search bar above or apply filters to get started.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Try searching:</span>
              {['Protein manufacturers', 'GMP certified', 'Mumbai distributors', 'Ayurvedic suppliers'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    window.location.href = `/search?q=${encodeURIComponent(suggestion)}`;
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900 dark:to-emerald-900 flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-teal-500 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No companies found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
              We couldn&apos;t find any companies matching your criteria. Try adjusting your filters or search query.
            </p>
            <Button variant="outline" onClick={clearFilters} className="border-teal-200 text-teal-600 hover:bg-teal-50">
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Results List */}
            <div className="flex flex-col gap-3">
              {results.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {/* Load More Trigger / Loading Indicator */}
            <div ref={loadMoreRef} className="py-8 text-center">
              {isLoadingMore && (
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
                  <span>Loading more companies...</span>
                </div>
              )}
              {!hasMore && results.length > 0 && (
                <p className="text-gray-500 dark:text-gray-400">
                  All {total} companies loaded
                </p>
              )}
              {hasMore && !isLoadingMore && (
                <Button
                  variant="outline"
                  onClick={loadMore}
                  className="border-teal-200 text-teal-600 hover:bg-teal-50"
                >
                  Load More
                </Button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
