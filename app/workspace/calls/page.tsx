import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { CallsPageClient } from '@/components/workspace/calls/CallsPageClient';

export default async function WorkspaceCallsPage() {
  const session = await auth();

  const [calls, totalDurationResult] = await Promise.all([
    prisma.workspaceCall.findMany({
      where: { userId: session!.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.workspaceCall.aggregate({
      where: { userId: session!.user!.id },
      _sum: { duration: true },
    }),
  ]);

  const totalDuration = totalDurationResult._sum.duration || 0;

  return <CallsPageClient calls={calls} totalDuration={totalDuration} />;
}
