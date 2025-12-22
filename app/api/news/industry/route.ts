import { NextResponse } from 'next/server'
import { fetchIndustryNewsAction } from '@/lib/actions/news'

export async function GET() {
  try {
    const { news } = await fetchIndustryNewsAction(5)
    return NextResponse.json({ news })
  } catch (error) {
    console.error('Error fetching industry news:', error)
    return NextResponse.json({ news: [], error: 'Failed to fetch news' }, { status: 500 })
  }
}
