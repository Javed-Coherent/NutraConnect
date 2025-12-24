'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, Bookmark, Clock, TrendingUp, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WorkspaceStatsProps {
  stats: {
    emails: {
      today: number;
      thisWeek: number;
      thisMonth: number;
    };
    calls: {
      today: number;
      thisWeek: number;
      thisMonth: number;
    };
    savedCompanies: number;
    totalCallDuration: number;
    topEmailContacts: Array<{
      email: string;
      name: string | null;
      count: number;
    }>;
    topCallContacts: Array<{
      number: string;
      name: string | null;
      count: number;
    }>;
  } | null;
}

export function WorkspaceStats({ stats }: WorkspaceStatsProps) {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');

  if (!stats) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Unable to load stats</p>
        </CardContent>
      </Card>
    );
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getEmailCount = () => {
    switch (period) {
      case 'today':
        return stats.emails.today;
      case 'week':
        return stats.emails.thisWeek;
      case 'month':
        return stats.emails.thisMonth;
    }
  };

  const getCallCount = () => {
    switch (period) {
      case 'today':
        return stats.calls.today;
      case 'week':
        return stats.calls.thisWeek;
      case 'month':
        return stats.calls.thisMonth;
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
    }
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-teal-500" />
          Activity Overview
        </h3>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as 'today' | 'week' | 'month')}>
          <TabsList className="bg-gray-100 dark:bg-gray-700">
            <TabsTrigger value="today" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              Today
            </TabsTrigger>
            <TabsTrigger value="week" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-teal-200 dark:border-teal-800 dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getEmailCount()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Emails Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200 dark:border-emerald-800 dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getCallCount()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Calls Made</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-cyan-200 dark:border-cyan-800 dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(stats.totalCallDuration)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Call Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-teal-200 dark:border-teal-800 dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                <Bookmark className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.savedCompanies}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Saved Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Contacts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Top Email Contacts */}
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Mail className="h-4 w-4 text-teal-500" />
              Most Contacted (Email)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topEmailContacts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No email contacts yet
              </p>
            ) : (
              <div className="space-y-2">
                {stats.topEmailContacts.map((contact, index) => (
                  <div
                    key={contact.email}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 font-medium text-sm">
                      {contact.name?.charAt(0) || contact.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {contact.name || contact.email}
                      </p>
                      {contact.name && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {contact.email}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-semibold bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full">
                      {contact.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Call Contacts */}
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Phone className="h-4 w-4 text-emerald-500" />
              Most Contacted (Calls)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topCallContacts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No call contacts yet
              </p>
            ) : (
              <div className="space-y-2">
                {stats.topCallContacts.map((contact, index) => (
                  <div
                    key={contact.number}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                      {contact.name?.charAt(0) || <User className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {contact.name || contact.number}
                      </p>
                      {contact.name && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {contact.number}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      {contact.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" asChild className="dark:border-gray-700 dark:text-gray-300">
          <Link href="/workspace/emails">
            View All Emails
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="dark:border-gray-700 dark:text-gray-300">
          <Link href="/workspace/calls">
            View All Calls
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="dark:border-gray-700 dark:text-gray-300">
          <Link href="/workspace/saved">
            Saved Companies
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
