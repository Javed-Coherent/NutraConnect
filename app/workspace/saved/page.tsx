import { getSavedCompaniesAction } from '@/lib/actions/companies';
import { SavedCompaniesList } from '@/components/dashboard/SavedCompaniesList';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, Building2, Phone, Mail, Star } from 'lucide-react';

export default async function WorkspaceSavedPage() {
  const savedCompanies = await getSavedCompaniesAction();

  // Calculate stats
  const totalCompanies = savedCompanies.length;
  const verifiedCount = savedCompanies.filter(c => c.company.isVerified).length;
  const withPhone = savedCompanies.filter(c => c.company.phone).length;
  const withEmail = savedCompanies.filter(c => c.company.email).length;

  // Get type distribution
  const typeDistribution = savedCompanies.reduce((acc, item) => {
    const type = item.company.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTypes = Object.entries(typeDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Companies</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quick access to your saved companies for easy communication
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-teal-200 dark:border-teal-800 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <Bookmark className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCompanies}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Saved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-200 dark:border-green-800 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{verifiedCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Verified</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-teal-200 dark:border-teal-800 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{withPhone}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">With Phone</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200 dark:border-emerald-800 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{withEmail}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">With Email</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Types */}
      {topTypes.length > 0 && (
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Top Company Types</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topTypes.map(([type, count]) => (
                <div
                  key={type}
                  className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 rounded-full"
                >
                  <span className="text-sm text-teal-700 dark:text-teal-300 capitalize">
                    {type.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Companies List */}
      <SavedCompaniesList initialData={savedCompanies} />
    </div>
  );
}
