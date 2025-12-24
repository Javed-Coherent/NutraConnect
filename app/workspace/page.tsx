import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { getWorkspaceStatsAction, getWorkspaceActivityAction } from '@/lib/actions/workspace';
import { getSavedCompaniesAction } from '@/lib/actions/companies';
import { WorkspaceStats } from '@/components/workspace/WorkspaceStats';
import { ActivityFeed } from '@/components/workspace/ActivityFeed';
import { SavedCompaniesPreview } from '@/components/workspace/SavedCompaniesPreview';

export default async function WorkspacePage() {
  const [stats, activities, savedCompanies] = await Promise.all([
    getWorkspaceStatsAction(),
    getWorkspaceActivityAction({ limit: 10 }),
    getSavedCompaniesAction(),
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Workspace</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your communications with suppliers and partners
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
            <Link href="/workspace/emails">
              <Mail className="h-4 w-4 mr-2" />
              Compose Email
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-900/30">
            <Link href="/workspace/calls">
              <Phone className="h-4 w-4 mr-2" />
              Make a Call
            </Link>
          </Button>
          <Button asChild variant="outline" className="dark:border-gray-700 dark:text-gray-300">
            <Link href="/workspace/saved">
              <Bookmark className="h-4 w-4 mr-2" />
              View Saved Companies
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Stats Dashboard */}
      <WorkspaceStats stats={stats} />

      {/* Saved Companies - Quick Access */}
      <SavedCompaniesPreview companies={savedCompanies} />

      {/* Recent Activity Feed */}
      <ActivityFeed
        activities={activities}
        showFilters={true}
        showSearch={true}
        maxItems={10}
      />
    </div>
  );
}
