'use server'

import { prisma } from '../db'

export interface PlatformStats {
  companiesCount: number
  usersCount: number
  citiesCount: number
  verifiedPercentage: number
  averageRating: number
  // Pre-formatted values for display
  companiesFormatted: string
  usersFormatted: string
  citiesFormatted: string
  satisfactionFormatted: string
}

// Helper to format numbers with + suffix for display (internal, not exported)
function formatStatValue(value: number): string {
  if (value >= 1000) {
    const rounded = Math.floor(value / 1000) * 1000
    return `${rounded.toLocaleString()}+`
  }
  return `${value}+`
}

// Fetch platform statistics from the database
export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    // Run all counts in parallel for better performance
    const [companiesCount, usersCount, citiesResult, verifiedCount] = await Promise.all([
      // Count total companies
      prisma.companies.count(),

      // Count total users
      prisma.user.count(),

      // Count distinct cities from companies' hq_country_city_address field
      prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(DISTINCT
          CASE
            WHEN hq_country_city_address IS NOT NULL AND hq_country_city_address != ''
            THEN SPLIT_PART(hq_country_city_address, ',', 1)
            ELSE NULL
          END
        ) as count
        FROM companies
        WHERE hq_country_city_address IS NOT NULL AND hq_country_city_address != ''
      `,

      // Count GST verified companies
      prisma.companies.count({
        where: {
          gst_number: {
            not: null,
          },
        },
      }),
    ])

    const citiesCount = Number(citiesResult[0]?.count || 0)

    // Calculate verified percentage (GST verified companies)
    const verifiedPercentage = companiesCount > 0
      ? Math.round((verifiedCount / companiesCount) * 100)
      : 0

    // Static satisfaction score (no rating column exists in database)
    const averageRating = 4.5
    const satisfactionScore = 90

    return {
      companiesCount,
      usersCount,
      citiesCount,
      verifiedPercentage,
      averageRating,
      companiesFormatted: formatStatValue(companiesCount),
      usersFormatted: formatStatValue(usersCount),
      citiesFormatted: formatStatValue(citiesCount),
      satisfactionFormatted: `${satisfactionScore}%`,
    }
  } catch (error) {
    console.error('Error fetching platform stats:', error)
    // Return fallback values if database query fails
    return {
      companiesCount: 0,
      usersCount: 0,
      citiesCount: 0,
      verifiedPercentage: 0,
      averageRating: 0,
      companiesFormatted: '0+',
      usersFormatted: '0+',
      citiesFormatted: '0+',
      satisfactionFormatted: '0%',
    }
  }
}
