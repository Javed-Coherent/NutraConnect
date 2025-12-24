import { NextRequest, NextResponse } from 'next/server';
import { generateOutgoingCallTwiml } from '@/lib/services/twilio';

/**
 * POST /api/workspace/calls/twiml
 * Generate TwiML for browser-initiated outgoing calls
 * This endpoint is called by Twilio when a call is initiated from the browser
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Get the destination number from the request
    // This is passed from the browser when initiating the call
    const to = formData.get('To') as string;
    const from = formData.get('From') as string;

    console.log('[TwiML] Generating TwiML for call to:', to);

    if (!to) {
      // Return error TwiML if no destination
      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?><Response><Say>No destination number provided.</Say></Response>',
        {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        }
      );
    }

    // Generate TwiML for the outgoing call
    const twiml = generateOutgoingCallTwiml(to, from);

    return new NextResponse(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('[TwiML] Error generating TwiML:', error);

    // Return error TwiML
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response><Say>An error occurred. Please try again.</Say></Response>',
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      }
    );
  }
}
