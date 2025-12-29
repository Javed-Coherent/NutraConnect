'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Mail,
  Phone,
  Building2,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WorkspaceSidebarProps {
  user: {
    name: string | null;
    plan: string;
  };
  stats: {
    emailsSent: number;
    callsMade: number;
    savedCompanies: number;
  };
  children: React.ReactNode;
}

const sidebarItems = [
  {
    title: 'Overview',
    href: '/workspace',
    icon: LayoutDashboard,
  },
  {
    title: 'Emails',
    href: '/workspace/emails',
    icon: Mail,
    statsKey: 'emailsSent' as const,
  },
  {
    title: 'Calls',
    href: '/workspace/calls',
    icon: Phone,
    statsKey: 'callsMade' as const,
  },
  {
    title: 'Added Companies',
    href: '/workspace/saved',
    icon: Building2,
    statsKey: 'savedCompanies' as const,
  },
  {
    title: 'Activity',
    href: '/workspace/activity',
    icon: History,
  },
  {
    title: 'Settings',
    href: '/workspace/settings',
    icon: Settings,
  },
];

export function WorkspaceSidebar({ user, stats, children }: WorkspaceSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user.name);
  const displayName = user.name || 'User';
  const planLabel = user.plan === 'free' ? 'Free' : user.plan === 'pro' ? 'Pro' : 'Enterprise';

  const getStatsValue = (statsKey?: 'emailsSent' | 'callsMade' | 'savedCompanies') => {
    if (!statsKey) return null;
    return stats[statsKey]?.toString() || '0';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{displayName}</p>
                <Badge variant="secondary" className="text-xs bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
                  {planLabel}
                </Badge>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold mx-auto">
              {initials}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/workspace' && pathname.startsWith(item.href));
            const statsValue = getStatsValue(item.statsKey);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/50 dark:to-emerald-900/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
                  isCollapsed && 'justify-center'
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-teal-600 dark:text-teal-400')} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 font-medium">{item.title}</span>
                    {statsValue && (
                      <Badge
                        variant={isActive ? 'default' : 'secondary'}
                        className={cn(
                          'text-xs',
                          isActive
                            ? 'bg-teal-600 dark:bg-teal-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        )}
                      >
                        {statsValue}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="absolute bottom-4 left-0 right-0 px-3 hidden lg:block">
          <Button
            variant="ghost"
            className="w-full justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>

        {/* Mobile Close Button */}
        <button
          className="absolute top-4 right-4 lg:hidden text-gray-500 dark:text-gray-400"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300',
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      >
        {/* Top Bar */}
        <div className="sticky top-16 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-500 dark:text-gray-400"
                onClick={() => setIsMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Workspace Hub
              </h1>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 md:p-6 pb-32 min-h-[calc(100vh-8rem)]">{children}</main>
      </div>
    </div>
  );
}
