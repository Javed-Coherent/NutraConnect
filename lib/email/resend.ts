/**
 * Email Provider - Resend
 *
 * Production-ready email delivery using Resend API
 * https://resend.com
 */

import { Resend } from 'resend';

// Lazy initialization of Resend client to avoid errors when API key is not set
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// Sender email - use onboarding@resend.dev for testing, or your verified domain for production
const FROM_EMAIL = process.env.EMAIL_FROM || 'NutraConnect <onboarding@resend.dev>';

/**
 * Send verification OTP email
 */
export async function sendVerificationEmail(
  email: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify Your Email - NutraConnect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0d9488; margin: 0;">NutraConnect</h1>
            <p style="color: #666;">India's Leading B2B Nutraceutical Platform</p>
          </div>

          <h2 style="color: #1f2937;">Verify Your Email</h2>
          <p style="color: #4b5563;">Use the verification code below to complete your registration:</p>

          <div style="background: linear-gradient(135deg, #0d9488, #10b981); color: white; padding: 24px; text-align: center; font-size: 36px; letter-spacing: 8px; border-radius: 12px; margin: 24px 0; font-weight: bold;">
            ${otp}
          </div>

          <p style="color: #6b7280; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} NutraConnect. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Error sending verification email:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Resend] Verification email sent to ${email}`);
    return { success: true };
  } catch (err) {
    console.error('[Resend] Exception sending verification email:', err);
    return { success: false, error: 'Failed to send verification email' };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

  try {
    const { error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset Your Password - NutraConnect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0d9488; margin: 0;">NutraConnect</h1>
            <p style="color: #666;">India's Leading B2B Nutraceutical Platform</p>
          </div>

          <h2 style="color: #1f2937;">Reset Your Password</h2>
          <p style="color: #4b5563;">We received a request to reset your password. Click the button below to create a new password:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #0d9488, #10b981); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px;">This link expires in <strong>1 hour</strong>.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>

          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <a href="${resetUrl}" style="color: #0d9488; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} NutraConnect. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Error sending password reset email:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Resend] Password reset email sent to ${email}`);
    return { success: true };
  } catch (err) {
    console.error('[Resend] Exception sending password reset email:', err);
    return { success: false, error: 'Failed to send password reset email' };
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const { error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to NutraConnect! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0d9488; margin: 0;">NutraConnect</h1>
            <p style="color: #666;">India's Leading B2B Nutraceutical Platform</p>
          </div>

          <h2 style="color: #1f2937;">Welcome aboard, ${name}! 🎉</h2>
          <p style="color: #4b5563;">Thank you for joining NutraConnect - India's premier B2B platform for the nutraceutical industry.</p>

          <div style="background: linear-gradient(135deg, #f0fdfa, #ecfdf5); padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #99f6e4;">
            <h3 style="color: #0d9488; margin-top: 0;">What you can do now:</h3>
            <ul style="color: #4b5563; padding-left: 20px;">
              <li style="margin-bottom: 8px;">🔍 Search 30,000+ verified suppliers & manufacturers</li>
              <li style="margin-bottom: 8px;">📦 Explore products across 50+ categories</li>
              <li style="margin-bottom: 8px;">⭐ Read reviews and compare companies</li>
              <li style="margin-bottom: 8px;">💼 Connect with industry leaders</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #0d9488, #10b981); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Go to Dashboard
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px;">Need help getting started? Reply to this email or visit our help center.</p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} NutraConnect. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Error sending welcome email:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Resend] Welcome email sent to ${email}`);
    return { success: true };
  } catch (err) {
    console.error('[Resend] Exception sending welcome email:', err);
    return { success: false, error: 'Failed to send welcome email' };
  }
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
  try {
    const { data, error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="white-space: pre-wrap; color: #1f2937; line-height: 1.6;">
            ${params.body.replace(/\n/g, '<br/>')}
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Sent via <a href="https://nutraconnect.in" style="color: #0d9488;">NutraConnect</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] Error sending workspace email:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Resend] Workspace email sent to ${params.to}`);
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('[Resend] Exception sending workspace email:', err);
    return { success: false, error: 'Failed to send email' };
  }
}
