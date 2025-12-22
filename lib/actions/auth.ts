'use server'

import bcrypt from "bcryptjs"
import crypto from "crypto"
import { prisma } from "../db"
import { signIn, signOut } from "../auth"
import { AuthError } from "next-auth"
import { sendVerificationEmail, sendPasswordResetEmail } from "../email"

// Register a new user
export async function registerUser(data: {
  name: string
  email: string
  password: string
  role: 'buyer' | 'supplier'
  company?: string
}): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        company: data.company,
      }
    })

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Failed to create account" }
  }
}

// Login with credentials
export async function loginWithCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    // In NextAuth v5, successful login may throw a redirect error
    // Check if it's a redirect error (which means login succeeded)
    if (error instanceof Error) {
      const errorMessage = error.message || ''
      const errorDigest = (error as { digest?: string }).digest || ''

      // Next.js redirect errors indicate successful authentication
      if (errorMessage.includes('NEXT_REDIRECT') ||
          errorDigest.includes('NEXT_REDIRECT') ||
          errorMessage === 'NEXT_REDIRECT') {
        console.log('[Auth] Login successful (redirect detected)')
        return { success: true }
      }
    }

    // Handle actual authentication errors
    if (error instanceof AuthError) {
      console.log('[Auth] AuthError:', error.type)
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" }
        default:
          return { success: false, error: "Something went wrong" }
      }
    }

    // Log unexpected errors for debugging
    console.error('[Auth] Unexpected login error:', error)
    return { success: false, error: "Login failed. Please try again." }
  }
}

// Login with Google
export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" })
}

// Logout
export async function logout() {
  await signOut({ redirectTo: "/" })
}

// Generate OTP for phone verification
export async function sendPhoneOTP(
  phone: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing OTPs for this phone
    await prisma.phoneOTP.deleteMany({
      where: { phone }
    })

    // Create new OTP record
    await prisma.phoneOTP.create({
      data: {
        phone,
        otp,
        expires,
      }
    })

    // In production, send SMS via provider (Twilio, MSG91, etc.)
    // For now, log to console for testing
    console.log(`[OTP] Phone: ${phone}, OTP: ${otp}`)

    return { success: true }
  } catch (error) {
    console.error("Send OTP error:", error)
    return { success: false, error: "Failed to send OTP" }
  }
}

// Verify phone OTP
export async function verifyPhoneOTP(
  phone: string,
  otp: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const otpRecord = await prisma.phoneOTP.findFirst({
      where: {
        phone,
        verified: false,
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!otpRecord) {
      return { success: false, error: "No OTP found for this number" }
    }

    // Check if expired
    if (new Date() > otpRecord.expires) {
      await prisma.phoneOTP.delete({ where: { id: otpRecord.id } })
      return { success: false, error: "OTP has expired" }
    }

    // Check attempts (max 3)
    if (otpRecord.attempts >= 3) {
      await prisma.phoneOTP.delete({ where: { id: otpRecord.id } })
      return { success: false, error: "Too many attempts. Please request a new OTP" }
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      await prisma.phoneOTP.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 }
      })
      return { success: false, error: "Invalid OTP" }
    }

    // Mark as verified
    await prisma.phoneOTP.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    })

    // If userId provided, update user's phone verification
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          phone,
          phoneVerified: new Date()
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Verify OTP error:", error)
    return { success: false, error: "Failed to verify OTP" }
  }
}

// Get current user
export async function getCurrentUser() {
  const { auth } = await import("../auth")
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      company: true,
      phone: true,
      phoneVerified: true,
      searchesUsed: true,
      profilesViewed: true,
      contactsRevealed: true,
      createdAt: true,
    }
  })

  return user
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string
    company?: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data
    })
    return { success: true }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

// ============================================
// Email Verification Functions
// ============================================

// Send email verification OTP
export async function sendEmailOTP(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing OTPs for this email
    await prisma.emailOTP.deleteMany({
      where: { email }
    })

    // Create new OTP record
    await prisma.emailOTP.create({
      data: {
        email,
        otp,
        expires,
      }
    })

    // Send email with OTP
    const result = await sendVerificationEmail(email, otp)

    if (!result.success) {
      return { success: false, error: result.error }
    }

    return { success: true }
  } catch (error) {
    console.error("Send email OTP error:", error)
    return { success: false, error: "Failed to send verification email" }
  }
}

// Verify email OTP
export async function verifyEmailOTP(
  email: string,
  otp: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const otpRecord = await prisma.emailOTP.findFirst({
      where: {
        email,
        verified: false,
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!otpRecord) {
      return { success: false, error: "No verification code found for this email" }
    }

    // Check if expired
    if (new Date() > otpRecord.expires) {
      await prisma.emailOTP.delete({ where: { id: otpRecord.id } })
      return { success: false, error: "Verification code has expired" }
    }

    // Check attempts (max 3)
    if (otpRecord.attempts >= 3) {
      await prisma.emailOTP.delete({ where: { id: otpRecord.id } })
      return { success: false, error: "Too many attempts. Please request a new code" }
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      await prisma.emailOTP.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 }
      })
      return { success: false, error: "Invalid verification code" }
    }

    // Mark as verified
    await prisma.emailOTP.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    })

    // If userId provided, update user's email verification
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          emailVerified: new Date()
        }
      })
    } else {
      // Find user by email and update
      await prisma.user.updateMany({
        where: { email },
        data: {
          emailVerified: new Date()
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Verify email OTP error:", error)
    return { success: false, error: "Failed to verify email" }
  }
}

// ============================================
// Password Reset Functions
// ============================================

// Request password reset
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return { success: true }
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email }
    })

    // Create new token record
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      }
    })

    // Send password reset email
    const result = await sendPasswordResetEmail(email, token)

    if (!result.success) {
      console.error("Failed to send password reset email:", result.error)
      // Still return success to prevent enumeration
    }

    return { success: true }
  } catch (error) {
    console.error("Request password reset error:", error)
    return { success: false, error: "Failed to process password reset request" }
  }
}

// Validate password reset token
export async function validateResetToken(
  token: string
): Promise<{ valid: boolean; email?: string; error?: string }> {
  try {
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!tokenRecord) {
      return { valid: false, error: "Invalid or expired reset link" }
    }

    if (tokenRecord.used) {
      return { valid: false, error: "This reset link has already been used" }
    }

    if (new Date() > tokenRecord.expires) {
      return { valid: false, error: "This reset link has expired" }
    }

    return { valid: true, email: tokenRecord.email }
  } catch (error) {
    console.error("Validate reset token error:", error)
    return { valid: false, error: "Failed to validate reset link" }
  }
}

// Reset password with token
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate token
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!tokenRecord) {
      return { success: false, error: "Invalid or expired reset link" }
    }

    if (tokenRecord.used) {
      return { success: false, error: "This reset link has already been used" }
    }

    if (new Date() > tokenRecord.expires) {
      return { success: false, error: "This reset link has expired" }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user's password
    await prisma.user.update({
      where: { email: tokenRecord.email },
      data: { password: hashedPassword }
    })

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: { used: true }
    })

    return { success: true }
  } catch (error) {
    console.error("Reset password error:", error)
    return { success: false, error: "Failed to reset password" }
  }
}
