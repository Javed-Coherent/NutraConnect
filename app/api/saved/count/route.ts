import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 })
    }

    const count = await prisma.savedCompany.count({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching saved count:', error)
    return NextResponse.json({ count: 0 })
  }
}
