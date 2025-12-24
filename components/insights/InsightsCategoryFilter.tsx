import Link from 'next/link';
import {
  TrendingUp,
  Newspaper,
  Scale,
  Package,
  Globe,
  Building2,
  Filter,
} from 'lucide-react';
import { InsightsCategory } from '@/lib/actions/insights';
import { cn } from '@/lib/utils';

const categories: { id: InsightsCategory; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: Newspaper },
  { id: 'market-trends', label: 'Market Trends', icon: TrendingUp },
  { id: 'regulatory', label: 'Regulatory Updates', icon: Scale },
  { id: 'company-news', label: 'Company News', icon: Building2 },
  { id: 'product-launches', label: 'Product Launches', icon: Package },
  { id: 'import-export', label: 'Import/Export', icon: Globe },
];

interface InsightsCategoryFilterProps {
  currentCategory: InsightsCategory;
  lastUpdated: string;
}

export function InsightsCategoryFilter({
  currentCategory,
  lastUpdated,
}: InsightsCategoryFilterProps) {
  return (
    <section className="py-8 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            {categories.map((category) => {
              const isActive = currentCategory === category.id;
              const href = category.id === 'all' ? '/insights' : `/insights?category=${category.id}`;

              return (
                <Link
                  key={category.id}
                  href={href}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-3',
                    isActive
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'border border-input bg-background hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-accent-foreground'
                  )}
                >
                  <category.icon className="h-4 w-4 mr-1" />
                  {category.label}
                </Link>
              );
            })}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </div>
    </section>
  );
}
