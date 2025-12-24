import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, History, Filter } from 'lucide-react';

type ActivityItem = {
  id: string;
  type: 'email' | 'call';
  title: string;
  subtitle: string;
  status: string;
  createdAt: Date;
};

export default async function WorkspaceActivityPage() {
  const session = await auth();

  const [emails, calls] = await Promise.all([
    prisma.workspaceEmail.findMany({
      where: { userId: session!.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        toEmail: true,
        toName: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.workspaceCall.findMany({
      where: { userId: session!.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        toNumber: true,
        toName: true,
        status: true,
        duration: true,
        createdAt: true,
      },
    }),
  ]);

  // Combine and sort activities
  const activities: ActivityItem[] = [
    ...emails.map(email => ({
      id: email.id,
      type: 'email' as const,
      title: email.toName || email.toEmail,
      subtitle: email.subject,
      status: email.status,
      createdAt: email.createdAt,
    })),
    ...calls.map(call => ({
      id: call.id,
      type: 'call' as const,
      title: call.toName || call.toNumber,
      subtitle: call.duration
        ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')} call`
        : 'No answer',
      status: call.status,
      createdAt: call.createdAt,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400';
      case 'draft':
      case 'no-answer':
      case 'busy':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your recent communications timeline
          </p>
        </div>
      </div>

      {/* Activity Feed */}
      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <History className="h-5 w-5 mr-2 text-gray-500" />
            All Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No activity yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your communication history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'email'
                      ? 'bg-blue-100 dark:bg-blue-900/50'
                      : 'bg-green-100 dark:bg-green-900/50'
                  }`}>
                    {activity.type === 'email' ? (
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {activity.title}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {activity.subtitle}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
