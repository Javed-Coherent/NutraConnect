/**
 * Email Provider - Unified Email Service
 *
 * Priority order:
 * 1. Resend (production-ready, recommended)
 * 2. Nodemailer (Gmail SMTP, fallback)
 * 3. Console logging (development mode)
 */

import * as resendProvider from './resend';
import * as nodemailerProvider from './nodemailer';

// Check which provider is configured
const isResendConfigured = !!process.env.RESEND_API_KEY;
const isSmtpConfigured = !!(process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD);

/**
 * Send verification OTP email
 */
export async function sendVerificationEmail(
  email: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  // Priority 1: Resend (recommended for production)
  if (isResendConfigured) {
    console.log(`[Email] Using Resend to send verification OTP to ${email}`);
    return resendProvider.sendVerificationEmail(email, otp);
  }

  // Priority 2: Nodemailer (Gmail SMTP)
  if (isSmtpConfigured) {
    console.log(`[Email] Using Nodemailer to send verification OTP to ${email}`);
    return nodemailerProvider.sendVerificationEmail(email, otp);
  }

  // Priority 3: DEV MODE - log to console
  console.log(`[DEV MODE] Verification OTP for ${email}: ${otp}`);
  return { success: true };
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  // Priority 1: Resend (recommended for production)
  if (isResendConfigured) {
    console.log(`[Email] Using Resend to send password reset to ${email}`);
    return resendProvider.sendPasswordResetEmail(email, token);
  }

  // Priority 2: Nodemailer (Gmail SMTP)
  if (isSmtpConfigured) {
    console.log(`[Email] Using Nodemailer to send password reset to ${email}`);
    return nodemailerProvider.sendPasswordResetEmail(email, token);
  }

  // Priority 3: DEV MODE - log to console
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;
  console.log(`[DEV MODE] Password reset link for ${email}: ${resetUrl}`);
  return { success: true };
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  // Priority 1: Resend (recommended for production)
  if (isResendConfigured) {
    console.log(`[Email] Using Resend to send welcome email to ${email}`);
    return resendProvider.sendWelcomeEmail(email, name);
  }

  // Priority 2: Nodemailer (Gmail SMTP)
  if (isSmtpConfigured) {
    console.log(`[Email] Using Nodemailer to send welcome email to ${email}`);
    return nodemailerProvider.sendWelcomeEmail(email, name);
  }

  // Priority 3: DEV MODE - log to console
  console.log(`[DEV MODE] Welcome email for ${name} (${email})`);
  return { success: true };
}

/**
 * Get current email provider status
 */
export function getEmailProviderStatus(): {
  provider: 'resend' | 'nodemailer' | 'console';
  configured: boolean;
} {
  if (isResendConfigured) {
    return { provider: 'resend', configured: true };
  }
  if (isSmtpConfigured) {
    return { provider: 'nodemailer', configured: true };
  }
  return { provider: 'console', configured: false };
}

/**
 * Send workspace email (custom email from user)
 */
export async function sendWorkspaceEmail(params: {
  to: string;
  subject: string;
  body: string;
  fromName?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Priority 1: Resend (recommended for production)
  if (isResendConfigured) {
    console.log(`[Email] Using Resend to send workspace email to ${params.to}`);
    return resendProvider.sendWorkspaceEmail(params);
  }

  // Priority 2: Nodemailer (Gmail SMTP)
  if (isSmtpConfigured) {
    console.log(`[Email] Using Nodemailer to send workspace email to ${params.to}`);
    return nodemailerProvider.sendWorkspaceEmail(params);
  }

  // Priority 3: DEV MODE - log to console
  console.log(`[DEV MODE] Workspace email to ${params.to}:`, {
    subject: params.subject,
    body: params.body.substring(0, 100) + '...',
  });
  return { success: true, messageId: `dev-${Date.now()}` };
}
