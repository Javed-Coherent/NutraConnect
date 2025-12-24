'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Star,
  MapPin,
  CheckCircle2,
  Search,
  Filter,
  Grid3X3,
  List,
  Trash2,
  Eye,
  Phone,
  Mail,
  MoreVertical,
  SortAsc,
  Inbox,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { removeSavedCompanyAction, type SavedCompanyWithDetails } from '@/lib/actions/companies';
import { Company } from '@/lib/types';
import { EmailComposer } from '@/components/workspace/email/EmailComposer';
import { VoipDialerDialog } from '@/components/workspace/calls/VoipDialerDialog';

interface SavedCompaniesListProps {
  initialData: SavedCompanyWithDetails[];
}

export function SavedCompaniesList({ initialData }: SavedCompaniesListProps) {
  const [companies, setCompanies] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterType, setFilterType] = useState('all');
  const [isPending, startTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [voipDialerOpen, setVoipDialerOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleEmailClick = (company: Company, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (company.email) {
      setSelectedCompany(company);
      setEmailComposerOpen(true);
    }
  };

  const handleCallClick = (company: Company, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (company.phone) {
      setSelectedCompany(company);
      setVoipDialerOpen(true);
    }
  };

  const handleRemove = async (savedId: string) => {
    setRemovingId(savedId);
    startTransition(async () => {
      const result = await removeSavedCompanyAction(savedId);
      if (result.success) {
        setCompanies(prev => prev.filter(c => c.savedId !== savedId));
      }
      setRemovingId(null);
    });
  };

  const filteredCompanies = companies.filter((item) => {
    const company = item.company;
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.category.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || company.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.company.name.localeCompare(b.company.name);
      case 'rating':
        return (b.company.rating || 0) - (a.company.rating || 0);
      case 'recent':
      default:
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    }
  });

  const getTypeLabel = (type: string) => {
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-teal-500" />
            Saved Companies
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {companies.length} compan{companies.length !== 1 ? 'ies' : 'y'} saved to your list
          </p>
        </div>
        <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" asChild>
          <Link href="/search">
            <Search className="h-4 w-4 mr-2" />
            Find More Companies
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search saved companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-44 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="manufacturer">Manufacturer</SelectItem>
                <SelectItem value="distributor">Distributor</SelectItem>
                <SelectItem value="wholesaler">Wholesaler</SelectItem>
                <SelectItem value="retailer">Retailer</SelectItem>
                <SelectItem value="exporter">Exporter</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-44 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                <SortAsc className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="recent">Recently Saved</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-teal-600 hover:bg-teal-700' : 'dark:text-gray-400'}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-teal-600 hover:bg-teal-700' : 'dark:text-gray-400'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid/List */}
      {sortedCompanies.length === 0 ? (
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-12 text-center">
            {companies.length === 0 ? (
              <>
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 inline-block mb-4">
                  <Inbox className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No saved companies yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start exploring and save companies you&apos;re interested in
                </p>
              </>
            ) : (
              <>
                <Bookmark className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No companies found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search query.
                </p>
              </>
            )}
            <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" asChild>
              <Link href="/search">
                <Search className="h-4 w-4 mr-2" />
                Discover Companies
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedCompanies.map((item) => {
            const company = item.company;
            const isRemoving = removingId === item.savedId;
            return (
              <Card
                key={item.savedId}
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600 bg-white dark:bg-gray-800 hover:-translate-y-1 ${isRemoving ? 'opacity-50' : ''}`}
              >
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
                        {company.name.charAt(0)}
                      </div>
                      {company.isVerified && (
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center border-2 border-white dark:border-gray-800">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/company/${company.id}`}
                          className="font-semibold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors truncate block"
                        >
                          {company.name}
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 -mr-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                            <DropdownMenuItem className="dark:text-gray-300 dark:focus:bg-gray-700" asChild>
                              <Link href={`/company/${company.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400 dark:focus:bg-gray-700"
                              onClick={() => handleRemove(item.savedId)}
                              disabled={isRemoving}
                            >
                              {isRemoving ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {company.isFeatured && (
                        <Badge className="mt-1 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 text-xs">
                          <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Type & Location */}
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <Badge variant="secondary" className="bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                      {getTypeLabel(company.type)}
                    </Badge>
                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-teal-500 dark:text-teal-400" />
                      {company.city}
                    </span>
                  </div>

                  {/* Rating */}
                  {company.rating && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(company.rating || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {company.rating}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({company.reviewsCount})
                      </span>
                    </div>
                  )}

                  {/* Categories */}
                  {company.category.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {company.category.slice(0, 2).map((cat) => (
                        <Badge key={cat} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                          {cat}
                        </Badge>
                      ))}
                      {company.category.length > 2 && (
                        <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                          +{company.category.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" asChild>
                      <Link href={`/company/${company.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    {company.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                        onClick={(e) => handleCallClick(company, e)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    {company.email && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                        onClick={(e) => handleEmailClick(company, e)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedCompanies.map((item) => {
            const company = item.company;
            const isRemoving = removingId === item.savedId;
            return (
              <Card
                key={item.savedId}
                className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-teal-200 dark:hover:border-teal-600 ${isRemoving ? 'opacity-50' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="relative">
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {company.name.charAt(0)}
                      </div>
                      {company.isVerified && (
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center border-2 border-white dark:border-gray-800">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/company/${company.id}`}
                          className="font-semibold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                          {company.name}
                        </Link>
                        {company.isFeatured && (
                          <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 text-xs">
                            <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Badge variant="secondary" className="bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 text-xs">
                          {getTypeLabel(company.type)}
                        </Badge>
                        <span className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-teal-500 dark:text-teal-400" />
                          {company.city}, {company.state}
                        </span>
                        {company.rating && (
                          <div className="flex items-center">
                            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">{company.rating}</span>
                            <span className="text-gray-400 ml-1">({company.reviewsCount})</span>
                          </div>
                        )}
                      </div>
                      {company.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                          {company.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button size="sm" className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" asChild>
                        <Link href={`/company/${company.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      {company.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                          onClick={(e) => handleCallClick(company, e)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      {company.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                          onClick={(e) => handleEmailClick(company, e)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 h-9 w-9"
                        onClick={() => handleRemove(item.savedId)}
                        disabled={isRemoving}
                      >
                        {isRemoving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Email Composer Modal */}
      <EmailComposer
        open={emailComposerOpen}
        onOpenChange={setEmailComposerOpen}
        prefill={selectedCompany ? {
          toEmail: selectedCompany.email || undefined,
          toName: selectedCompany.name,
          companyId: parseInt(selectedCompany.id),
        } : undefined}
      />

      {/* VoIP Dialer Modal */}
      <VoipDialerDialog
        open={voipDialerOpen}
        onOpenChange={setVoipDialerOpen}
        prefillNumber={selectedCompany?.phone || undefined}
        prefillName={selectedCompany?.name}
        companyId={selectedCompany ? parseInt(selectedCompany.id) : undefined}
      />
    </div>
  );
}
