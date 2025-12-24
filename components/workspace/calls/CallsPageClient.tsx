'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, PhoneCall, PhoneMissed, PhoneOff, Clock } from 'lucide-react';
import { VoipDialer } from './VoipDialer';
import { initiateCallAction } from '@/lib/actions/workspace';

interface Call {
  id: string;
  toNumber: string;
  toName: string | null;
  status: string;
  duration: number | null;
  createdAt: Date;
}

interface CallsPageClientProps {
  calls: Call[];
  totalDuration: number;
}

export function CallsPageClient({ calls, totalDuration }: CallsPageClientProps) {
  const router = useRouter();

  const statusCounts = {
    completed: calls.filter(c => c.status === 'completed').length,
    noAnswer: calls.filter(c => c.status === 'no-answer' || c.status === 'busy').length,
    failed: calls.filter(c => c.status === 'failed').length,
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleCallStart = async (data: { toNumber: string; toName?: string }) => {
    // Log the call to database
    await initiateCallAction({
      toNumber: data.toNumber,
      toName: data.toName,
    });
  };

  const handleCallEnd = () => {
    // Refresh the page to show updated call history
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calls</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Make VoIP calls and track your call history
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border border-emerald-200 dark:border-emerald-800 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <PhoneCall className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.completed}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-yellow-200 dark:border-yellow-800 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
              <PhoneMissed className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.noAnswer}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">No Answer</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-red-200 dark:border-red-800 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <PhoneOff className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.failed}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-teal-200 dark:border-teal-800 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatDuration(totalDuration)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialer */}
      <div className="max-w-md mx-auto">
        <VoipDialer
          onCallStart={handleCallStart}
          onCallEnd={handleCallEnd}
        />
      </div>

      {/* Call History */}
      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Call History</CardTitle>
        </CardHeader>
        <CardContent>
          {calls.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No calls yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Use the dialer above to make your first call
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Number</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((call) => (
                    <tr key={call.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {call.toName || 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{call.toNumber}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          call.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                            : call.status === 'failed'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                            : call.status === 'no-answer' || call.status === 'busy'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {call.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {call.duration
                          ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}`
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(call.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
