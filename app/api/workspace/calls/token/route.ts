import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateAccessToken, isTwilioConfigured } from '@/lib/services/twilio';

/**
 * GET /api/workspace/calls/token
 * Generate a Twilio access token for browser-based calling
 */
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Twilio is configured
    if (!isTwilioConfigured()) {
      return NextResponse.json(
        { error: 'VoIP calling is not configured' },
        { status: 503 }
      );
    }

    // Generate access token using user ID as identity
    const token = generateAccessToken(session.user.id);

    if (!token) {
      return NextResponse.json(
        { error: 'Failed to generate access token' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      token,
      identity: session.user.id,
    });
  } catch (error) {
    console.error('[API] Error generating Twilio token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
