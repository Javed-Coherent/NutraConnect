import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth';
import { auth } from '@/lib/auth';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { prisma } from '@/lib/db';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  // Check email verification from database (JWT may have stale data)
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true, email: true }
  });

  if (dbUser && !dbUser.emailVerified) {
    redirect(`/auth/verify-email?email=${encodeURIComponent(dbUser.email || session.user.email || '')}`);
  }

  const user = await getCurrentUser();

  // Get saved companies count
  let savedCompaniesCount = 0;
  if (user?.id) {
    savedCompaniesCount = await prisma.savedCompany.count({
      where: { userId: user.id }
    });
  }

  const userData = {
    name: user?.name || session?.user?.name || null,
    plan: user?.plan || 'free',
    role: user?.role || 'buyer',
    savedCompaniesCount,
  };

  return (
    <DashboardSidebar user={userData}>
      {children}
    </DashboardSidebar>
  );
}
