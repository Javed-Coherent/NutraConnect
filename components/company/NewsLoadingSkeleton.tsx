'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function NewsLoadingSkeleton() {
  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        {/* Tab skeleton */}
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* News items skeleton */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
