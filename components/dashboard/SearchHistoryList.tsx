'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  History,
  Search,
  Eye,
  Phone,
  Building2,
  Clock,
  Trash2,
  Calendar,
  ArrowRight,
  Star,
  MapPin,
  ExternalLink,
  RotateCcw,
  Inbox,
  Loader2,
  Mail,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  deleteSearchHistoryAction,
  type SearchHistoryItem,
  type ProfileViewItem,
  type ContactRevealItem,
} from '@/lib/actions/history';

interface SearchHistoryListProps {
  initialSearches: SearchHistoryItem[];
  initialProfileViews: ProfileViewItem[];
  initialContactReveals: ContactRevealItem[];
  userPlan: string;
  contactsRevealed: number;
}

// Plan limits for contacts
const PLAN_LIMITS = {
  free: 2,
  pro: 15,
  enterprise: 100,
};

function formatTimestamp(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

function getTypeLabel(type: string) {
  const labels: Record<string, string> = {
    manufacturer: 'Manufacturer',
    distributor: 'Distributor',
    retailer: 'Retailer',
    exporter: 'Exporter',
    wholesaler: 'Wholesaler',
    raw_material: 'Raw Material Supplier',
    formulator: 'Formulator',
    packager: 'Packager',
    cro: 'CRO/Lab',
    importer: 'Importer',
    ecommerce: 'E-commerce',
    pharmacy_chain: 'Pharmacy Chain',
  };
  return labels[type] || type;
}

export function SearchHistoryList({
  initialSearches,
  initialProfileViews,
  initialContactReveals,
  userPlan,
  contactsRevealed,
}: SearchHistoryListProps) {
  const [searches, setSearches] = useState(initialSearches);
  const [profileViews] = useState(initialProfileViews);
  const [contactReveals] = useState(initialContactReveals);
  const [timeFilter, setTimeFilter] = useState('all');
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const contactLimit = PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;

  const handleDeleteSearch = async (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteSearchHistoryAction(id);
      if (result.success) {
        setSearches(prev => prev.filter(s => s.id !== id));
      }
      setDeletingId(null);
    });
  };

  // Filter by time
  const filterByTime = <T extends { createdAt: Date }>(items: T[]): T[] => {
    if (timeFilter === 'all') return items;

    const now = new Date();
    const filterDate = new Date();

    switch (timeFilter) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
    }

    return items.filter(item => new Date(item.createdAt) >= filterDate);
  };

  const filteredSearches = filterByTime(searches);
  const filteredProfileViews = filterByTime(profileViews);
  const filteredContactReveals = filterByTime(contactReveals);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="h-6 w-6 text-blue-500" />
            Search History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your recent searches, viewed profiles, and revealed contacts
          </p>
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-44 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="searches" className="space-y-6">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="searches" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 dark:text-gray-300 dark:data-[state=active]:text-white">
            <Search className="h-4 w-4 mr-2" />
            Searches ({filteredSearches.length})
          </TabsTrigger>
          <TabsTrigger value="viewed" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 dark:text-gray-300 dark:data-[state=active]:text-white">
            <Eye className="h-4 w-4 mr-2" />
            Viewed ({filteredProfileViews.length})
          </TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 dark:text-gray-300 dark:data-[state=active]:text-white">
            <Phone className="h-4 w-4 mr-2" />
            Contacts ({filteredContactReveals.length})
          </TabsTrigger>
        </TabsList>

        {/* Searches Tab */}
        <TabsContent value="searches" className="space-y-4">
          {filteredSearches.length === 0 ? (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-12 text-center">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 inline-block mb-4">
                  <Inbox className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No search history yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start searching for companies to see your history here
                </p>
                <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" asChild>
                  <Link href="/search">
                    <Search className="h-4 w-4 mr-2" />
                    Search Companies
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredSearches.map((search) => {
                    const isDeleting = deletingId === search.id;
                    return (
                      <div
                        key={search.id}
                        className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isDeleting ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                            <Search className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {search.query}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {formatTimestamp(search.createdAt)}
                              </span>
                              <span className="flex items-center">
                                <Building2 className="h-3.5 w-3.5 mr-1" />
                                {search.resultsCount} results
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                            asChild
                          >
                            <Link href={`/search?q=${encodeURIComponent(search.query)}`}>
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Search Again
                            </Link>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                            onClick={() => handleDeleteSearch(search.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Viewed Profiles Tab */}
        <TabsContent value="viewed" className="space-y-4">
          {filteredProfileViews.length === 0 ? (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-12 text-center">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 inline-block mb-4">
                  <Inbox className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No profile views yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  View company profiles to see them here
                </p>
                <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" asChild>
                  <Link href="/search">
                    <Search className="h-4 w-4 mr-2" />
                    Discover Companies
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredProfileViews.map((view) => (
                    <div
                      key={view.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                          {view.company.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/company/${view.companyId}`}
                              className="font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                            >
                              {view.company.name}
                            </Link>
                            {view.company.isVerified && (
                              <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-0 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <Badge variant="secondary" className="bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 text-xs">
                              {getTypeLabel(view.company.type)}
                            </Badge>
                            <span className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1 text-teal-500 dark:text-teal-400" />
                              {view.company.city}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {formatTimestamp(view.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                          asChild
                        >
                          <Link href={`/company/${view.companyId}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Again
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-4">
          {filteredContactReveals.length === 0 ? (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-12 text-center">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 inline-block mb-4">
                  <Inbox className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No contacts revealed yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Reveal contact information to see them here
                </p>
                <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" asChild>
                  <Link href="/search">
                    <Search className="h-4 w-4 mr-2" />
                    Find Companies
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium text-gray-900 dark:text-white">
                      Revealed Contacts
                    </CardTitle>
                    <Badge variant="secondary" className="bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                      {contactsRevealed}/{contactLimit} used this month
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredContactReveals.map((contact) => (
                      <div
                        key={contact.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                              {contact.company.name.charAt(0)}
                            </div>
                            <div>
                              <Link
                                href={`/company/${contact.companyId}`}
                                className="font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                              >
                                {contact.company.name}
                              </Link>
                              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                <Badge variant="secondary" className="bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 text-xs">
                                  {getTypeLabel(contact.company.type)}
                                </Badge>
                                <span className="flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1 text-teal-500 dark:text-teal-400" />
                                  {contact.company.city}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {formatTimestamp(contact.createdAt)}
                                </span>
                              </div>
                              {contact.company.email && (
                                <div className="flex items-center gap-4 mt-3">
                                  <a
                                    href={`mailto:${contact.company.email}`}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                                  >
                                    <Mail className="h-4 w-4" />
                                    {contact.company.email}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade CTA */}
              {userPlan === 'free' && (
                <Card className="border-teal-200 dark:border-teal-700 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Need more contact reveals?
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Upgrade your plan to get more contact reveals per month.
                        </p>
                      </div>
                      <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" asChild>
                        <Link href="/dashboard/subscription">
                          Upgrade Plan
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
