import nodemailer from 'nodemailer';

// Lazy initialization of transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

// Email sender configuration
const FROM_EMAIL = process.env.EMAIL_FROM || 'NutraConnect <noreply@nutraconnect.in>';

// HTML template for verification OTP
function getVerificationEmailHTML(otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px;">
      <div style="max-width: 400px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #0d9488, #10b981); border-radius: 10px; line-height: 50px; color: white; font-size: 24px; font-weight: bold;">N</div>
          <h1 style="color: #0d9488; margin: 15px 0 5px; font-size: 24px;">NutraConnect</h1>
        </div>
        <h2 style="color: #1f2937; text-align: center; margin-bottom: 10px; font-size: 20px;">Verify Your Email</h2>
        <p style="color: #6b7280; text-align: center; margin-bottom: 30px;">Enter the following code to verify your email address:</p>
        <div style="background: linear-gradient(135deg, #0d9488, #10b981); border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
          <span style="font-size: 32px; font-weight: bold; color: white; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #9ca3af; text-align: center; font-size: 14px; margin-bottom: 10px;">This code expires in 10 minutes.</p>
        <p style="color: #9ca3af; text-align: center; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    </body>
    </html>
  `;
}

// HTML template for password reset
function getPasswordResetEmailHTML(resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px;">
      <div style="max-width: 400px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #0d9488, #10b981); border-radius: 10px; line-height: 50px; color: white; font-size: 24px; font-weight: bold;">N</div>
          <h1 style="color: #0d9488; margin: 15px 0 5px; font-size: 24px;">NutraConnect</h1>
        </div>
        <h2 style="color: #1f2937; text-align: center; margin-bottom: 10px; font-size: 20px;">Reset Your Password</h2>
        <p style="color: #6b7280; text-align: center; margin-bottom: 30px;">Click the button below to reset your password:</p>
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #0d9488, #10b981); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        </div>
        <p style="color: #9ca3af; text-align: center; font-size: 14px; margin-bottom: 10px;">This link expires in 1 hour.</p>
        <p style="color: #9ca3af; text-align: center; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send verification OTP email via Nodemailer (Gmail SMTP)
 */
export async function sendVerificationEmail(
  email: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transport = getTransporter();

    if (!transport) {
      return { success: false, error: 'SMTP not configured' };
    }

    await transport.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your NutraConnect Verification Code',
      html: getVerificationEmailHTML(otp),
    });

    return { success: true };
  } catch (error) {
    console.error('Nodemailer send verification email error:', error);
    return { success: false, error: 'Failed to send verification email' };
  }
}

/**
 * Send password reset email via Nodemailer (Gmail SMTP)
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    const transport = getTransporter();

    if (!transport) {
      return { success: false, error: 'SMTP not configured' };
    }

    await transport.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset Your NutraConnect Password',
      html: getPasswordResetEmailHTML(resetUrl),
    });

    return { success: true };
  } catch (error) {
    console.error('Nodemailer send password reset email error:', error);
    return { success: false, error: 'Failed to send password reset email' };
  }
}

/**
 * Send welcome email via Nodemailer (Gmail SMTP)
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transport = getTransporter();

    if (!transport) {
      return { success: false, error: 'SMTP not configured' };
    }

    await transport.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to NutraConnect!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0d9488;">Welcome to NutraConnect, ${name}!</h1>
          <p>Thank you for joining India's leading B2B nutraceutical marketplace.</p>
          <p>With NutraConnect, you can:</p>
          <ul>
            <li>Search 80,000+ verified companies</li>
            <li>Find manufacturers, distributors, and retailers</li>
            <li>Access GST-verified contact details</li>
            <li>Compare companies side-by-side</li>
          </ul>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/search"
               style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #0d9488, #10b981); color: white; text-decoration: none; border-radius: 8px;">
              Start Searching
            </a>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            If you have any questions, feel free to contact us at support@nutraconnect.in
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Nodemailer send welcome email error:', error);
    return { success: false, error: 'Failed to send welcome email' };
  }
}
