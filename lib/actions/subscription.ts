'use server';

import { prisma } from '../db';
import { auth } from '../auth';
import { PLAN_LIMITS, getPlans, type SubscriptionData } from '../subscription-config';

export type { SubscriptionData };

export async function getSubscriptionDataAction(): Promise<SubscriptionData> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      user: null,
      usage: {
        contactReveals: { used: 0, limit: PLAN_LIMITS.free.contacts },
        profileViews: { used: 0, limit: PLAN_LIMITS.free.profiles },
        searches: { used: 0, limit: PLAN_LIMITS.free.searches },
        savedCompanies: { used: 0, limit: PLAN_LIMITS.free.savedCompanies },
      },
      plans: getPlans('free'),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      createdAt: true,
      searchesUsed: true,
      profilesViewed: true,
      contactsRevealed: true,
    },
  });

  if (!user) {
    return {
      user: null,
      usage: {
        contactReveals: { used: 0, limit: PLAN_LIMITS.free.contacts },
        profileViews: { used: 0, limit: PLAN_LIMITS.free.profiles },
        searches: { used: 0, limit: PLAN_LIMITS.free.searches },
        savedCompanies: { used: 0, limit: PLAN_LIMITS.free.savedCompanies },
      },
      plans: getPlans('free'),
    };
  }

  // Get saved companies count
  const savedCompaniesCount = await prisma.savedCompany.count({
    where: { userId: user.id },
  });

  const planLimits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      createdAt: user.createdAt,
    },
    usage: {
      contactReveals: {
        used: user.contactsRevealed,
        limit: planLimits.contacts,
      },
      profileViews: {
        used: user.profilesViewed,
        limit: planLimits.profiles,
      },
      searches: {
        used: user.searchesUsed,
        limit: planLimits.searches,
      },
      savedCompanies: {
        used: savedCompaniesCount,
        limit: planLimits.savedCompanies,
      },
    },
    plans: getPlans(user.plan),
  };
}
