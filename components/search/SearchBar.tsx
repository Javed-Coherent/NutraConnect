'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Mic, X, Sparkles, Bot, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INDIAN_STATES } from '@/lib/constants';

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  defaultRegion?: string;
  suggestions?: string[];
  variant?: 'default' | 'hero';
  colorTheme?: 'teal' | 'emerald';
  showRegionFilter?: boolean;
  className?: string;
}

const animatedPlaceholders = {
  teal: [
    'Find distributors looking to stock your products...',
    'Search retailers seeking new health supplement brands...',
    'Discover wholesalers wanting to expand their portfolio...',
    'Find pharmacy chains looking for vitamin suppliers...',
    'Search e-commerce platforms seeking nutraceutical partners...',
  ],
  emerald: [
    'Find GMP certified manufacturers in Gujarat...',
    'Search protein powder suppliers with FSSAI license...',
    'Discover contract manufacturers for private labeling...',
    'Find raw material suppliers for vitamins and minerals...',
    'Search formulators with R&D capabilities...',
  ],
};

export function SearchBar({
  placeholder = 'Search for companies, products, or services...',
  defaultValue = '',
  defaultRegion = '',
  suggestions = [],
  variant = 'default',
  colorTheme = 'teal',
  showRegionFilter = false,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [selectedRegion, setSelectedRegion] = useState(defaultRegion);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Check if we're on the search results page with an active query
  const isOnSearchResultsPage = pathname === '/search' && searchParams.get('q');

  const isHero = variant === 'hero';
  const isTeal = colorTheme === 'teal';
  const placeholders = animatedPlaceholders[colorTheme];

  // Sync query state with URL changes (for browser back/forward navigation)
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    setQuery(urlQuery);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Typewriter effect for placeholder
  useEffect(() => {
    if (!isHero || isFocused || query) return;

    const currentPlaceholder = placeholders[placeholderIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentPlaceholder.length) {
          setAnimatedText(currentPlaceholder.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Wait before starting to delete
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setAnimatedText(currentPlaceholder.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setPlaceholderIndex((placeholderIndex + 1) % placeholders.length);
        }
      }
    }, isDeleting ? 30 : 50);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex, isHero, isFocused, query, placeholders]);

  const handleSearch = () => {
    // Navigate to search page with query and optional region filter
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      params.set('q', trimmedQuery);
    }
    if (selectedRegion && selectedRegion !== 'all') {
      params.set('state', selectedRegion);
    }

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ''}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const clearQuery = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Determine the placeholder to show
  const displayPlaceholder = isHero && !isFocused && !query ? animatedText || placeholder : placeholder;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background glow for hero variant */}
      {isHero && (
        <div className={`absolute -inset-0.5 ${isTeal ? 'bg-gradient-to-r from-teal-300 via-teal-200 to-teal-300 dark:from-teal-600 dark:via-teal-500 dark:to-teal-600' : 'bg-gradient-to-r from-emerald-300 via-emerald-200 to-emerald-300 dark:from-emerald-600 dark:via-emerald-500 dark:to-emerald-600'} rounded-2xl blur-md transition-opacity duration-300 ${isHovered ? 'opacity-40' : 'opacity-20'}`} />
      )}

      <div
        className={`relative flex items-center ${
          isHero
            ? `bg-gradient-to-r ${isTeal ? 'from-teal-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800' : 'from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800'} rounded-2xl shadow-2xl border-2 ${isTeal ? 'border-teal-200 dark:border-teal-700' : 'border-emerald-200 dark:border-emerald-700'} transition-all duration-300 ${isHovered ? `${isTeal ? 'border-teal-400 dark:border-teal-500 shadow-teal-200/60 dark:shadow-teal-700/30' : 'border-emerald-400 dark:border-emerald-500 shadow-emerald-200/60 dark:shadow-emerald-700/30'} -translate-y-1 scale-[1.01]` : ''} ${isTeal ? 'focus-within:border-teal-500' : 'focus-within:border-emerald-500'} focus-within:shadow-lg ${isTeal ? 'focus-within:shadow-teal-200/50 dark:focus-within:shadow-teal-700/30' : 'focus-within:shadow-emerald-200/50 dark:focus-within:shadow-emerald-700/30'}`
            : `bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${isTeal ? 'border-teal-200 dark:border-teal-700 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 dark:focus-within:ring-teal-900' : 'border-emerald-200 dark:border-emerald-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900'} transition-all hover:shadow-md`
        }`}
      >
        {/* AI Badge */}
        {isHero && (
          <div className={`absolute -top-3 left-4 px-3 py-1 ${isTeal ? 'bg-gradient-to-r from-teal-500 to-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} rounded-full text-xs font-medium text-white flex items-center shadow-lg transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
            <Sparkles className="h-3 w-3 mr-1.5 animate-pulse" />
            AI-Powered
          </div>
        )}

        {/* Search Icon with background */}
        <div className={`flex items-center ${isHero ? 'pl-5' : 'pl-4'}`}>
          <div className={`${isHero ? 'p-2.5 rounded-xl' : 'p-1.5 rounded-lg'} ${isTeal ? 'bg-teal-100 dark:bg-teal-900' : 'bg-emerald-100 dark:bg-emerald-900'} transition-all duration-300 ${isHovered && isHero ? `${isTeal ? 'bg-teal-200 dark:bg-teal-800' : 'bg-emerald-200 dark:bg-emerald-800'} scale-110` : ''}`}>
            <Search className={`${isHero ? 'h-5 w-5' : 'h-4 w-4'} ${isTeal ? 'text-teal-600 dark:text-teal-400' : 'text-emerald-600 dark:text-emerald-400'} transition-transform duration-300 ${isHovered && isHero ? 'scale-110' : ''}`} />
          </div>
        </div>

        {/* Input with animated placeholder */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder=""
            className={`w-full border-0 shadow-none focus-visible:ring-0 bg-transparent dark:text-white ${
              isHero ? 'text-lg py-6 px-4' : 'py-3 px-3'
            }`}
          />
          {/* Custom animated placeholder */}
          {!query && (
            <div className={`absolute inset-0 flex items-center pointer-events-none ${isHero ? 'px-4' : 'px-3'}`}>
              <span className={`${isHero ? 'text-lg' : 'text-base'} text-gray-500 dark:text-gray-400`}>
                {displayPlaceholder}
                {isHero && !isFocused && (
                  <span className="inline-block w-0.5 h-5 ml-0.5 bg-gray-400 dark:bg-gray-500 animate-blink" />
                )}
              </span>
            </div>
          )}
        </div>

        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearQuery}
            className={`mr-1 h-8 w-8 ${isTeal ? 'text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900' : 'text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900'} transition-colors`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={`mr-2 h-9 w-9 ${isTeal ? 'text-teal-500 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900' : 'text-emerald-500 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900'} rounded-xl transition-colors`}
          title="Voice search (coming soon)"
        >
          <Mic className={`${isHero ? 'h-5 w-5' : 'h-4 w-4'}`} />
        </Button>

        {/* Region Filter Dropdown */}
        {showRegionFilter && (
          <div className={`flex items-center mr-2 ${isHero ? 'border-l border-gray-200 dark:border-gray-700 pl-2' : ''}`}>
            <MapPin className={`h-4 w-4 mr-1 ${isTeal ? 'text-teal-500 dark:text-teal-400' : 'text-emerald-500 dark:text-emerald-400'}`} />
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className={`${isHero ? 'w-[140px] h-10' : 'w-[120px] h-8'} border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 ${isTeal ? 'text-teal-700 dark:text-teal-300' : 'text-emerald-700 dark:text-emerald-300'} font-medium`}>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="all">All Regions</SelectItem>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          onClick={handleSearch}
          className={`mr-2 ${isTeal ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'} text-white font-semibold shadow-lg ${isTeal ? 'shadow-teal-300/50 hover:shadow-teal-400/50' : 'shadow-emerald-300/50 hover:shadow-emerald-400/50'} transition-all duration-300 hover:scale-105 ${
            isHero ? 'px-8 py-3 text-base rounded-xl' : 'px-5 py-2 rounded-lg'
          }`}
        >
          Search
        </Button>
      </div>

      {/* Suggestions Dropdown - hide on search results page */}
      {showSuggestions && suggestions.length > 0 && !isOnSearchResultsPage && (
        <div className={`absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border ${isTeal ? 'border-teal-100 dark:border-teal-800' : 'border-emerald-100 dark:border-emerald-800'} overflow-hidden z-50`}>
          <div className={`px-4 py-2.5 text-xs font-medium ${isTeal ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/50' : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/50'} border-b ${isTeal ? 'border-teal-100 dark:border-teal-800' : 'border-emerald-100 dark:border-emerald-800'} flex items-center`}>
            <Bot className="h-3.5 w-3.5 mr-2" />
            AI Suggestions
          </div>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-3 ${isTeal ? 'hover:bg-teal-50 dark:hover:bg-teal-900/30' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30'} flex items-center text-sm text-gray-700 dark:text-gray-300 transition-colors group`}
            >
              <div className={`p-1.5 rounded-lg ${isTeal ? 'bg-teal-100 dark:bg-teal-900 group-hover:bg-teal-200 dark:group-hover:bg-teal-800' : 'bg-emerald-100 dark:bg-emerald-900 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800'} mr-3 transition-colors`}>
                <Search className={`h-3.5 w-3.5 ${isTeal ? 'text-teal-600 dark:text-teal-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
              </div>
              <span className="group-hover:translate-x-1 transition-transform">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
