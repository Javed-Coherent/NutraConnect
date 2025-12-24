import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { EmailsPageClient } from '@/components/workspace/email/EmailsPageClient';
import { getSavedCompaniesAction } from '@/lib/actions/companies';

export default async function WorkspaceEmailsPage() {
  const session = await auth();

  const [emails, templates, savedCompanies] = await Promise.all([
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
        sentAt: true,
        createdAt: true,
      },
    }),
    prisma.emailTemplate.findMany({
      where: {
        OR: [
          { isSystem: true },
          { userId: session!.user!.id },
        ],
      },
      orderBy: { name: 'asc' },
    }),
    getSavedCompaniesAction(),
  ]);

  return <EmailsPageClient emails={emails} templates={templates} savedCompanies={savedCompanies} />;
}
