'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface ScrollingCategoriesProps {
  categories: Category[];
  colorTheme?: 'teal' | 'emerald';
  className?: string;
}

export function ScrollingCategories({
  categories,
  colorTheme = 'teal',
  className = '',
}: ScrollingCategoriesProps) {
  const isTeal = colorTheme === 'teal';

  // Duplicate categories for seamless infinite scroll
  const duplicatedCategories = [...categories, ...categories];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Gradient fade on edges */}
      <div className={`absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none ${isTeal ? 'bg-gradient-to-r from-teal-50 to-transparent' : 'bg-gradient-to-r from-emerald-50 to-transparent'}`} />
      <div className={`absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none ${isTeal ? 'bg-gradient-to-l from-teal-50 to-transparent' : 'bg-gradient-to-l from-emerald-50 to-transparent'}`} />

      {/* Scrolling container */}
      <div className="flex gap-3 animate-scroll-x hover:pause-animation">
        {duplicatedCategories.map((cat, index) => (
          <Link key={`${cat.id}-${index}`} href={`/search?type=${cat.id}`}>
            <Badge
              variant="outline"
              className={`px-5 py-2.5 text-sm cursor-pointer whitespace-nowrap transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 ${
                isTeal
                  ? 'bg-gradient-to-r from-teal-50 to-teal-100 border-teal-300 text-teal-700 hover:from-teal-100 hover:to-teal-200 hover:border-teal-400 hover:text-teal-800'
                  : 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 hover:border-emerald-400 hover:text-emerald-800'
              }`}
            >
              {cat.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
