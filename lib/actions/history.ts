'use server';

import { prisma } from '../db';
import { auth } from '../auth';
import { revalidatePath } from 'next/cache';
import { Company } from '../types';

// Helper to map db company to Company type
function mapDbToCompanyBasic(dbCompany: {
  id: number;
  company_name: string | null;
  entity: string | null;
  address: string | null;
  hq_country_city_address: string | null;
  gst_number: string | null;
  email: string | null;
}) {
  const name = dbCompany.company_name || 'Unknown Company';

  // Extract city from address
  let city = 'India';
  if (dbCompany.hq_country_city_address) {
    const parts = dbCompany.hq_country_city_address.split(',').map(p => p.trim());
    if (parts.length >= 1) city = parts[0] || 'India';
  } else if (dbCompany.address) {
    const parts = dbCompany.address.split(',').map(p => p.trim());
    if (parts.length >= 2) city = parts[parts.length - 2] || 'India';
  }

  // Map entity to type
  const entityLower = (dbCompany.entity || '').toLowerCase();
  let type = 'manufacturer';
  if (entityLower.includes('distributor')) type = 'distributor';
  else if (entityLower.includes('retailer')) type = 'retailer';
  else if (entityLower.includes('exporter')) type = 'exporter';
  else if (entityLower.includes('wholesaler')) type = 'wholesaler';

  return {
    id: dbCompany.id,
    name,
    type,
    city,
    isVerified: !!dbCompany.gst_number,
    email: dbCompany.email,
  };
}

// ============================================
// Search History Functions
// ============================================

export interface SearchHistoryItem {
  id: string;
  query: string;
  resultsCount: number;
  createdAt: Date;
}

export async function getSearchHistoryAction(limit: number = 20): Promise<SearchHistoryItem[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const history = await prisma.searchHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return history.map(h => ({
    id: h.id,
    query: h.query,
    resultsCount: h.resultsCount,
    createdAt: h.createdAt,
  }));
}

export async function addSearchHistoryAction(
  query: string,
  resultsCount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    await prisma.searchHistory.create({
      data: {
        userId: session.user.id,
        query,
        resultsCount,
      },
    });

    // Update user's searchesUsed count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { searchesUsed: { increment: 1 } },
    });

    revalidatePath('/dashboard/history');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Add search history error:', error);
    return { success: false, error: 'Failed to save search' };
  }
}

export async function deleteSearchHistoryAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify ownership
    const record = await prisma.searchHistory.findUnique({
      where: { id },
    });

    if (!record || record.userId !== session.user.id) {
      return { success: false, error: 'Not authorized' };
    }

    await prisma.searchHistory.delete({
      where: { id },
    });

    revalidatePath('/dashboard/history');

    return { success: true };
  } catch (error) {
    console.error('Delete search history error:', error);
    return { success: false, error: 'Failed to delete search' };
  }
}

export async function clearSearchHistoryAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    await prisma.searchHistory.deleteMany({
      where: { userId: session.user.id },
    });

    revalidatePath('/dashboard/history');

    return { success: true };
  } catch (error) {
    console.error('Clear search history error:', error);
    return { success: false, error: 'Failed to clear history' };
  }
}

// ============================================
// Profile View Functions
// ============================================

export interface ProfileViewItem {
  id: string;
  companyId: number;
  createdAt: Date;
  company: {
    id: number;
    name: string;
    type: string;
    city: string;
    isVerified: boolean;
  };
}

export async function getProfileViewsAction(limit: number = 20): Promise<ProfileViewItem[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const views = await prisma.profileView.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  // Fetch company details for each view
  const viewsWithCompanies = await Promise.all(
    views.map(async (view) => {
      const dbCompany = await prisma.companies.findUnique({
        where: { id: view.companyId },
        select: {
          id: true,
          company_name: true,
          entity: true,
          address: true,
          hq_country_city_address: true,
          gst_number: true,
          email: true,
        },
      });

      if (!dbCompany) return null;

      return {
        id: view.id,
        companyId: view.companyId,
        createdAt: view.createdAt,
        company: mapDbToCompanyBasic(dbCompany),
      };
    })
  );

  return viewsWithCompanies.filter((v): v is NonNullable<typeof v> => v !== null) as ProfileViewItem[];
}

export async function addProfileViewAction(
  companyId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    await prisma.profileView.create({
      data: {
        userId: session.user.id,
        companyId,
      },
    });

    // Update user's profilesViewed count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { profilesViewed: { increment: 1 } },
    });

    // Note: revalidatePath removed - this action is called during render,
    // and revalidatePath can only be called in response to user actions in Next.js 15

    return { success: true };
  } catch (error) {
    console.error('Add profile view error:', error);
    return { success: false, error: 'Failed to track view' };
  }
}

// ============================================
// Contact Reveal Functions
// ============================================

export interface ContactRevealItem {
  id: string;
  companyId: number;
  createdAt: Date;
  company: {
    id: number;
    name: string;
    type: string;
    city: string;
    isVerified: boolean;
    email: string | null;
  };
}

export async function getContactRevealsAction(limit: number = 20): Promise<ContactRevealItem[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const reveals = await prisma.contactReveal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  // Fetch company details for each reveal
  const revealsWithCompanies = await Promise.all(
    reveals.map(async (reveal) => {
      const dbCompany = await prisma.companies.findUnique({
        where: { id: reveal.companyId },
        select: {
          id: true,
          company_name: true,
          entity: true,
          address: true,
          hq_country_city_address: true,
          gst_number: true,
          email: true,
        },
      });

      if (!dbCompany) return null;

      const companyBasic = mapDbToCompanyBasic(dbCompany);

      return {
        id: reveal.id,
        companyId: reveal.companyId,
        createdAt: reveal.createdAt,
        company: {
          ...companyBasic,
          email: dbCompany.email,
        },
      };
    })
  );

  return revealsWithCompanies.filter((r): r is ContactRevealItem => r !== null);
}

export async function addContactRevealAction(
  companyId: number
): Promise<{ success: boolean; error?: string; alreadyRevealed?: boolean }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if already revealed
    const existing = await prisma.contactReveal.findUnique({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId,
        },
      },
    });

    if (existing) {
      return { success: true, alreadyRevealed: true };
    }

    await prisma.contactReveal.create({
      data: {
        userId: session.user.id,
        companyId,
      },
    });

    // Update user's contactsRevealed count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { contactsRevealed: { increment: 1 } },
    });

    revalidatePath('/dashboard/history');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Add contact reveal error:', error);
    return { success: false, error: 'Failed to reveal contact' };
  }
}

export async function isContactRevealedAction(companyId: number): Promise<boolean> {
  const session = await auth();

  if (!session?.user?.id) {
    return false;
  }

  const reveal = await prisma.contactReveal.findUnique({
    where: {
      userId_companyId: {
        userId: session.user.id,
        companyId,
      },
    },
  });

  return !!reveal;
}

// ============================================
// Combined History Data for Page
// ============================================

export interface HistoryPageData {
  searches: SearchHistoryItem[];
  profileViews: ProfileViewItem[];
  contactReveals: ContactRevealItem[];
  user: {
    plan: string;
    contactsRevealed: number;
  } | null;
}

export async function getHistoryPageDataAction(): Promise<HistoryPageData> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      searches: [],
      profileViews: [],
      contactReveals: [],
      user: null,
    };
  }

  const [searches, profileViews, contactReveals, user] = await Promise.all([
    getSearchHistoryAction(50),
    getProfileViewsAction(50),
    getContactRevealsAction(50),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, contactsRevealed: true },
    }),
  ]);

  return {
    searches,
    profileViews,
    contactReveals,
    user,
  };
}
