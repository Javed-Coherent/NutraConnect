import { NextResponse } from 'next/server'
import { fetchLatestNewsAction } from '@/lib/actions/news'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5', 10)
    const category = searchParams.get('category') as 'company' | 'industry' | 'regulatory' | undefined

    const { news, isLive, error } = await fetchLatestNewsAction(category, limit) as { news: any[]; isLive: boolean; error?: string }

    if (error) {
      return NextResponse.json({ news: [], isLive: false, error }, { status: 500 })
    }

    return NextResponse.json({ news, isLive })
  } catch (error) {
    console.error('Error fetching latest news:', error)
    return NextResponse.json({ news: [], isLive: false, error: 'Failed to fetch news' }, { status: 500 })
  }
}
