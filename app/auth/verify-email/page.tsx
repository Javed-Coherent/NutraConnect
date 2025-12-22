'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  Mail,
  CheckCircle2,
  Loader2,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OTPInput } from '@/components/auth/OTPInput';
import { sendEmailOTP, verifyEmailOTP } from '@/lib/actions/auth';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [hasSentInitialOTP, setHasSentInitialOTP] = useState(false);

  // Send initial OTP on page load
  useEffect(() => {
    if (email && !hasSentInitialOTP) {
      setHasSentInitialOTP(true);
      sendEmailOTP(email).then(result => {
        if (!result.success) {
          setError(result.error || 'Failed to send verification code');
        } else {
          setResendCooldown(60);
        }
      });
    }
  }, [email, hasSentInitialOTP]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await verifyEmailOTP(email, otp);

    if (result.success) {
      setIsVerified(true);
      // Navigate to home page after short delay for success UI
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      setError(result.error || 'Failed to verify email');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    const result = await sendEmailOTP(email);

    setIsResending(false);

    if (result.success) {
      setResendCooldown(60);
      setOtp('');
    } else {
      setError(result.error || 'Failed to send verification code');
    }
  };

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isLoading && !isVerified) {
      handleVerify();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  if (isVerified) {
    return (
      <div className="flex items-center justify-center p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your email has been successfully verified. Redirecting you to the home page...
          </p>
          <div className="flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signup' })}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sign Out & Use Different Account
          </button>
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600 shadow-lg">
              <span className="text-xl font-bold text-white">N</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
              NutraConnect
            </span>
          </Link>
        </div>

        <Card className="border-2 border-gray-100 dark:border-gray-800 shadow-xl dark:bg-gray-800">
          <CardHeader className="text-center pb-2">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900 dark:to-emerald-900 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="text-teal-600 dark:text-teal-400 font-medium">{email || 'your email'}</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
              />

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                onClick={handleVerify}
                className="w-full h-11 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Didn&apos;t receive the code?
                </p>
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  disabled={isResending || resendCooldown > 0}
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resend in {resendCooldown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resend Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          Check your spam folder if you don&apos;t see the email in your inbox.
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
