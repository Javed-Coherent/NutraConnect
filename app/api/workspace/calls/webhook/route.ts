import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/workspace/calls/webhook
 * Handle Twilio call status callbacks
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract call data from Twilio webhook
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;
    const callDuration = formData.get('CallDuration') as string;
    const recordingUrl = formData.get('RecordingUrl') as string;

    console.log('[Twilio Webhook] Call status update:', {
      callSid,
      callStatus,
      callDuration,
    });

    if (!callSid) {
      return NextResponse.json({ error: 'Missing CallSid' }, { status: 400 });
    }

    // Map Twilio status to our status
    const statusMap: Record<string, string> = {
      'queued': 'initiated',
      'initiated': 'initiated',
      'ringing': 'ringing',
      'in-progress': 'in-progress',
      'completed': 'completed',
      'busy': 'busy',
      'no-answer': 'no-answer',
      'failed': 'failed',
      'canceled': 'failed',
    };

    const mappedStatus = statusMap[callStatus] || callStatus;

    // Update call record in database
    const updateData: Record<string, unknown> = {
      status: mappedStatus,
    };

    // Add duration if call completed
    if (callDuration) {
      updateData.duration = parseInt(callDuration, 10);
    }

    // Add recording URL if available
    if (recordingUrl) {
      updateData.recordingUrl = recordingUrl;
    }

    // Set timestamps based on status
    if (callStatus === 'in-progress') {
      updateData.answeredAt = new Date();
    } else if (callStatus === 'completed' || callStatus === 'busy' || callStatus === 'no-answer' || callStatus === 'failed') {
      updateData.endedAt = new Date();
    }

    // Update the call record
    await prisma.workspaceCall.updateMany({
      where: { twilioCallSid: callSid },
      data: updateData,
    });

    // Return empty TwiML response (Twilio expects this)
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('[Twilio Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
