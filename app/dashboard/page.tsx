import Link from 'next/link';
import {
  Bookmark,
  Search,
  Eye,
  Phone,
  ArrowRight,
  Star,
  CreditCard,
  Zap,
  Inbox,
  Mail,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle,
  Crown,
  Edit,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/auth';
import { getCurrentUser } from '@/lib/actions/auth';
import { prisma } from '@/lib/db';

// Plan limits configuration
const PLAN_LIMITS = {
  free: { contacts: 2, profiles: 20, searches: 10 },
  pro: { contacts: 15, profiles: 100, searches: 50 },
  enterprise: { contacts: 100, profiles: 500, searches: 200 },
};

export default async function ProfilePage() {
  const session = await auth();
  const user = await getCurrentUser();

  // Get user stats from database
  const firstName = user?.name?.split(' ')[0] || session?.user?.name?.split(' ')[0] || 'User';
  const plan = (user?.plan || 'free') as keyof typeof PLAN_LIMITS;
  const contactsRevealed = user?.contactsRevealed || 0;
  const profilesViewed = user?.profilesViewed || 0;
  const searchesUsed = user?.searchesUsed || 0;

  // Get plan limits
  const limits = PLAN_LIMITS[plan];
  const maxContacts = limits.contacts;
  const maxProfiles = limits.profiles;
  const maxSearches = limits.searches;
  const remainingContacts = Math.max(0, maxContacts - contactsRevealed);

  // Get saved companies count and data
  let savedCompaniesCount = 0;
  let savedCompaniesData: Array<{
    id: string;
    companyId: number;
    company: {
      id: number;
      company_name: string | null;
      entity: string | null;
      hq_country_city_address: string | null;
      confidence_rating: string | null;
    } | null;
  }> = [];

  if (user?.id) {
    savedCompaniesCount = await prisma.savedCompany.count({
      where: { userId: user.id }
    });

    // Get last 3 saved companies with company details
    const savedCompanies = await prisma.savedCompany.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    // Fetch company details for each saved company
    savedCompaniesData = await Promise.all(
      savedCompanies.map(async (sc: { id: string; companyId: number; createdAt: Date }) => {
        const company = await prisma.companies.findUnique({
          where: { id: sc.companyId },
          select: {
            id: true,
            company_name: true,
            entity: true,
            hq_country_city_address: true,
            confidence_rating: true,
          }
        });
        return { ...sc, company };
      })
    );
  }

  // Get initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  // Extract city from address
  const extractCity = (address: string | null | undefined) => {
    if (!address) return 'India';
    const parts = address.split(',').map(p => p.trim());
    return parts.length > 1 ? parts[parts.length - 2] || parts[0] : parts[0];
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-24" />
        <CardContent className="relative pt-0 pb-6 px-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white dark:border-gray-800">
              {initials}
            </div>

            {/* User Info */}
            <div className="flex-1 md:mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {user?.name || 'User'}
                    <Badge className="bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border-0">
                      <Crown className="h-3 w-3 mr-1" />
                      {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </Badge>
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role || 'Member'} • {user?.company || 'Independent'}
                  </p>
                </div>
                <Button asChild variant="outline" className="border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30">
                  <Link href="/dashboard/settings">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Info Row */}
          <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm text-gray-900 dark:text-white">{user?.email || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-900 dark:text-white">{user?.phone || 'Not set'}</p>
                  {user?.phone && (
                    user?.phoneVerified ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-orange-500" />
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-900/30">
                <Bookmark className="h-5 w-5 text-teal-500 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Saved</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{savedCompaniesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30">
                <Search className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Searches</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{searchesUsed}<span className="text-sm font-normal text-gray-400">/{maxSearches}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30">
                <Eye className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{profilesViewed}<span className="text-sm font-normal text-gray-400">/{maxProfiles}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-50 dark:bg-green-900/30">
                <Phone className="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Contacts</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{contactsRevealed}<span className="text-sm font-normal text-gray-400">/{maxContacts}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </CardTitle>
            <Link href="/dashboard/history" className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center">
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            {searchesUsed === 0 && profilesViewed === 0 && savedCompaniesCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <Inbox className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">No activity yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Start exploring companies to see your activity here
                </p>
                <Button asChild variant="outline" className="border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400">
                  <Link href="/search">
                    <Search className="h-4 w-4 mr-2" />
                    Start Searching
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {searchesUsed > 0 && (
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                      <Search className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {searchesUsed} search{searchesUsed !== 1 ? 'es' : ''} performed
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {maxSearches - searchesUsed} remaining
                    </span>
                  </div>
                )}
                {profilesViewed > 0 && (
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {profilesViewed} profile{profilesViewed !== 1 ? 's' : ''} viewed
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {maxProfiles - profilesViewed} remaining
                    </span>
                  </div>
                )}
                {contactsRevealed > 0 && (
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {contactsRevealed} contact{contactsRevealed !== 1 ? 's' : ''} revealed
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {remainingContacts} remaining
                    </span>
                  </div>
                )}
                {savedCompaniesCount > 0 && (
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400">
                      <Bookmark className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {savedCompaniesCount} compan{savedCompaniesCount !== 1 ? 'ies' : 'y'} saved
                      </p>
                    </div>
                    <Link href="/workspace/saved" className="text-xs text-teal-600 dark:text-teal-400 hover:underline">
                      View all
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Current Plan</span>
                <Badge className={`${plan === 'free' ? 'bg-gray-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'} text-white capitalize`}>{plan}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Contact Reveals</span>
                  <span className="font-medium text-gray-900 dark:text-white">{contactsRevealed}/{maxContacts}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (contactsRevealed / maxContacts) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Profile Views</span>
                  <span className="font-medium text-gray-900 dark:text-white">{profilesViewed}/{maxProfiles}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (profilesViewed / maxProfiles) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Searches</span>
                  <span className="font-medium text-gray-900 dark:text-white">{searchesUsed}/{maxSearches}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (searchesUsed / maxSearches) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                {plan === 'free' ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Upgrade to unlock more features
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Limits reset monthly
                  </p>
                )}
                <Button variant="outline" className="w-full border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30" asChild>
                  <Link href="/dashboard/subscription">
                    <Zap className="h-4 w-4 mr-2" />
                    {plan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Companies Preview */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-teal-500" />
            Saved Companies
          </CardTitle>
          {savedCompaniesCount > 0 && (
            <Link href="/workspace/saved" className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center">
              View all {savedCompaniesCount}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {savedCompaniesData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Bookmark className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">No saved companies</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Save companies you&apos;re interested in to access them quickly
              </p>
              <Button asChild variant="outline" className="border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400">
                <Link href="/search">
                  <Search className="h-4 w-4 mr-2" />
                  Find Companies
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {savedCompaniesData.map((saved) => (
                <Link key={saved.id} href={`/company/${saved.companyId}`}>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all duration-300 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {saved.company?.company_name?.charAt(0) || 'C'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                          {saved.company?.company_name || 'Unknown Company'}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {saved.company?.entity || 'Company'} • {extractCity(saved.company?.hq_country_city_address)}
                        </p>
                        {saved.company?.confidence_rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {saved.company.confidence_rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Status - Only show if something needs verification */}
      {(user?.phone && !user?.phoneVerified) && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              Complete Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">Phone Number</span>
              </div>
              <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-0">
                <XCircle className="h-3 w-3 mr-1" />
                Not Verified
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
