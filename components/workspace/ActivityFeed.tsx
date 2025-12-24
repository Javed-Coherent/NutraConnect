'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  PhoneMissed,
  Search,
  Filter,
  Inbox,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ActivityType = 'email' | 'call';

interface EmailActivity {
  id: string;
  type: 'email';
  toEmail: string;
  toName: string | null;
  subject: string;
  status: string;
  createdAt: Date;
}

interface CallActivity {
  id: string;
  type: 'call';
  toNumber: string;
  toName: string | null;
  status: string;
  duration: number | null;
  createdAt: Date;
}

type Activity = EmailActivity | CallActivity;

interface ActivityFeedProps {
  activities: Activity[];
  showFilters?: boolean;
  showSearch?: boolean;
  maxItems?: number;
}

export function ActivityFeed({
  activities,
  showFilters = true,
  showSearch = true,
  maxItems,
}: ActivityFeedProps) {
  const [filter, setFilter] = useState<'all' | 'email' | 'call'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = activities.filter((activity) => {
    // Type filter
    if (filter !== 'all' && activity.type !== filter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (activity.type === 'email') {
        return (
          activity.toEmail.toLowerCase().includes(query) ||
          activity.toName?.toLowerCase().includes(query) ||
          activity.subject.toLowerCase().includes(query)
        );
      } else {
        return (
          activity.toNumber.includes(query) ||
          activity.toName?.toLowerCase().includes(query)
        );
      }
    }

    return true;
  });

  const displayedActivities = maxItems
    ? filteredActivities.slice(0, maxItems)
    : filteredActivities;

  const getStatusIcon = (activity: Activity) => {
    if (activity.type === 'email') {
      switch (activity.status) {
        case 'sent':
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'failed':
          return <XCircle className="h-4 w-4 text-red-500" />;
        case 'draft':
          return <Clock className="h-4 w-4 text-yellow-500" />;
        default:
          return <Mail className="h-4 w-4 text-gray-400" />;
      }
    } else {
      switch (activity.status) {
        case 'completed':
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'no-answer':
        case 'busy':
          return <PhoneMissed className="h-4 w-4 text-yellow-500" />;
        case 'failed':
          return <XCircle className="h-4 w-4 text-red-500" />;
        default:
          return <Phone className="h-4 w-4 text-gray-400" />;
      }
    }
  };

  const getStatusBadge = (activity: Activity) => {
    const status = activity.status;
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
    let className = '';

    if (status === 'sent' || status === 'completed') {
      className = 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400';
    } else if (status === 'failed') {
      className = 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400';
    } else if (status === 'no-answer' || status === 'busy' || status === 'draft') {
      className = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400';
    }

    return (
      <Badge variant={variant} className={`text-xs ${className}`}>
        {status}
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          {(showFilters || showSearch) && (
            <div className="flex items-center gap-2">
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-9 w-44 text-sm dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
              )}
              {showFilters && (
                <Select
                  value={filter}
                  onValueChange={(v) => setFilter(v as 'all' | 'email' | 'call')}
                >
                  <SelectTrigger className="w-28 h-9 dark:bg-gray-900 dark:border-gray-700">
                    <Filter className="h-4 w-4 mr-1 text-gray-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="email">Emails</SelectItem>
                    <SelectItem value="call">Calls</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <Inbox className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || filter !== 'all'
                ? 'No activities match your filters'
                : 'No activity yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedActivities.map((activity) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {/* Icon */}
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'email'
                      ? 'bg-teal-100 dark:bg-teal-900/50'
                      : 'bg-emerald-100 dark:bg-emerald-900/50'
                  }`}
                >
                  {activity.type === 'email' ? (
                    <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 dark:text-white truncate">
                      {activity.toName || (activity.type === 'email' ? 'Company' : activity.toNumber)}
                    </span>
                    {getStatusBadge(activity)}
                  </div>

                  {activity.type === 'email' ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">
                      {activity.subject}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {activity.toNumber}
                      {activity.duration && (
                        <span className="ml-2 text-gray-500">
                          ({formatDuration(activity.duration)})
                        </span>
                      )}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>

                {/* Status icon */}
                <div className="flex-shrink-0">{getStatusIcon(activity)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
