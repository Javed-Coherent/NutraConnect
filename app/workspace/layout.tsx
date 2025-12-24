import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  // Check email verification from database
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      emailVerified: true,
      email: true,
      name: true,
      plan: true,
    }
  });

  if (dbUser && !dbUser.emailVerified) {
    redirect(`/auth/verify-email?email=${encodeURIComponent(dbUser.email || session.user.email || '')}`);
  }

  // Get workspace stats
  const [emailsSent, callsMade, savedCompanies] = await Promise.all([
    prisma.workspaceEmail.count({
      where: { userId: session.user.id }
    }),
    prisma.workspaceCall.count({
      where: { userId: session.user.id }
    }),
    prisma.savedCompany.count({
      where: { userId: session.user.id }
    }),
  ]);

  const userData = {
    name: dbUser?.name || session?.user?.name || null,
    plan: dbUser?.plan || 'free',
  };

  const stats = {
    emailsSent,
    callsMade,
    savedCompanies,
  };

  return (
    <WorkspaceSidebar user={userData} stats={stats}>
      {children}
    </WorkspaceSidebar>
  );
}
