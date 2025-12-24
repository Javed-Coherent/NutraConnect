/**
 * Twilio Voice Service
 *
 * Handles VoIP calling functionality using Twilio Programmable Voice
 * Requires the following environment variables:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_API_KEY
 * - TWILIO_API_SECRET
 * - TWILIO_TWIML_APP_SID
 * - TWILIO_PHONE_NUMBER
 */

import twilio from 'twilio';
import { jwt } from 'twilio';

const { AccessToken } = jwt;
const { VoiceGrant } = AccessToken;

// Twilio credentials from environment
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Lazy initialization of Twilio client
let twilioClient: twilio.Twilio | null = null;

function getTwilioClient(): twilio.Twilio | null {
  if (!accountSid || !authToken) {
    console.warn('[Twilio] Account SID or Auth Token not configured');
    return null;
  }
  if (!twilioClient) {
    twilioClient = twilio(accountSid, authToken);
  }
  return twilioClient;
}

/**
 * Check if Twilio is configured
 */
export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && apiKey && apiSecret && twimlAppSid);
}

/**
 * Generate an access token for browser-based calling
 * This token is used by the Twilio Voice SDK in the browser
 */
export function generateAccessToken(identity: string): string | null {
  if (!apiKey || !apiSecret || !accountSid || !twimlAppSid) {
    console.error('[Twilio] Missing required credentials for access token');
    return null;
  }

  try {
    // Create access token
    const accessToken = new AccessToken(accountSid, apiKey, apiSecret, {
      identity,
      ttl: 3600, // 1 hour
    });

    // Create voice grant
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });

    // Add grant to token
    accessToken.addGrant(voiceGrant);

    return accessToken.toJwt();
  } catch (error) {
    console.error('[Twilio] Error generating access token:', error);
    return null;
  }
}

/**
 * Generate TwiML for outgoing calls
 * This is the response returned by the TwiML App when a call is initiated
 */
export function generateOutgoingCallTwiml(to: string, callerId?: string): string {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  // Use provided caller ID or default Twilio number
  const from = callerId || twilioPhoneNumber;

  // Dial the number
  const dial = response.dial({
    callerId: from,
    timeout: 30,
    record: 'record-from-answer-dual', // Record both legs
  });

  dial.number(to);

  return response.toString();
}

/**
 * Generate TwiML for incoming calls
 */
export function generateIncomingCallTwiml(clientIdentity: string): string {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  // Ring the browser client
  const dial = response.dial();
  dial.client(clientIdentity);

  return response.toString();
}

/**
 * Make an outbound call (server-initiated)
 */
export async function makeOutboundCall(params: {
  to: string;
  from?: string;
  statusCallback?: string;
}): Promise<{ success: boolean; callSid?: string; error?: string }> {
  const client = getTwilioClient();
  if (!client) {
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    const call = await client.calls.create({
      to: params.to,
      from: params.from || twilioPhoneNumber!,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/workspace/calls/twiml`,
      statusCallback: params.statusCallback || `${process.env.NEXT_PUBLIC_APP_URL}/api/workspace/calls/webhook`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    });

    return { success: true, callSid: call.sid };
  } catch (error) {
    console.error('[Twilio] Error making outbound call:', error);
    return { success: false, error: 'Failed to initiate call' };
  }
}

/**
 * Get call details by SID
 */
export async function getCallDetails(callSid: string) {
  const client = getTwilioClient();
  if (!client) {
    return null;
  }

  try {
    const call = await client.calls(callSid).fetch();
    return {
      sid: call.sid,
      status: call.status,
      direction: call.direction,
      duration: call.duration,
      startTime: call.startTime,
      endTime: call.endTime,
      from: call.from,
      to: call.to,
    };
  } catch (error) {
    console.error('[Twilio] Error fetching call details:', error);
    return null;
  }
}

/**
 * End an active call
 */
export async function endCall(callSid: string): Promise<boolean> {
  const client = getTwilioClient();
  if (!client) {
    return false;
  }

  try {
    await client.calls(callSid).update({ status: 'completed' });
    return true;
  } catch (error) {
    console.error('[Twilio] Error ending call:', error);
    return false;
  }
}

/**
 * Get Twilio phone number
 */
export function getTwilioPhoneNumber(): string | undefined {
  return twilioPhoneNumber;
}

/**
 * Validate Twilio webhook signature
 */
export function validateWebhookSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  if (!authToken) {
    return false;
  }
  return twilio.validateRequest(authToken, signature, url, params);
}
