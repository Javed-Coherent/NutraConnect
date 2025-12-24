import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function InsightsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Skeleton className="h-6 w-32 mx-auto mb-4" />
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
          </div>
          <div className="flex justify-center gap-8 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter Skeleton */}
      <section className="py-8 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-9 w-28" />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-48 mb-4" />
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="dark:bg-gray-900 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-3" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="dark:bg-gray-900 dark:border-gray-700">
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Skeleton key={j} className="h-5 w-full" />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
