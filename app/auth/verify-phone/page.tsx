'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Phone,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { OTPInput } from '@/components/auth/OTPInput';

function VerifyPhoneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get('phone') || '';
  const userEmail = searchParams.get('email') || '';

  const [phone, setPhone] = useState(initialPhone);
  const [isEditingPhone, setIsEditingPhone] = useState(!initialPhone);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(!!initialPhone);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(initialPhone ? 60 : 0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const validatePhone = (phoneNumber: string): boolean => {
    const cleaned = phoneNumber.replace(/[\s-]/g, '');
    return /^[+]?\d{10,15}$/.test(cleaned);
  };

  const handleSendOtp = async () => {
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsSendingOtp(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSendingOtp(false);
    setOtpSent(true);
    setIsEditingPhone(false);
    setResendCooldown(60);
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo, accept any 6-digit code
    setIsVerified(true);

    // Redirect after 2 seconds to email verification
    setTimeout(() => {
      router.push('/auth/verify-email?email=' + encodeURIComponent(userEmail));
    }, 2000);
  };

  const handleResend = async () => {
    setIsSendingOtp(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSendingOtp(false);
    setResendCooldown(60);
  };

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isLoading && !isVerified && otpSent) {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Phone Verified!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your phone number has been successfully verified. Now let&apos;s verify your email...
          </p>
          <div className="flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Redirecting to email verification...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/auth/signup" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sign Up
          </Link>
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
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Phone</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              {otpSent
                ? 'Enter the 6-digit code sent to your phone'
                : 'We\'ll send a verification code to your phone'}
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Phone Number Input */}
              {isEditingPhone || !otpSent ? (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError('');
                      }}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      disabled={isSendingOtp}
                    />
                  </div>
                  {error && !otpSent && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                  )}
                  <Button
                    onClick={handleSendOtp}
                    className="w-full h-11 mt-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg"
                    disabled={isSendingOtp}
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send Verification Code'
                    )}
                  </Button>
                </div>
              ) : (
                <>
                  {/* Display phone with edit option */}
                  <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{phone}</span>
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* OTP Input */}
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
                      'Verify Phone'
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Didn&apos;t receive the code?
                    </p>
                    <Button
                      variant="ghost"
                      onClick={handleResend}
                      disabled={isSendingOtp || resendCooldown > 0}
                      className="text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                    >
                      {isSendingOtp ? (
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
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="h-2 w-8 rounded-full bg-teal-500" />
          <div className="h-2 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
          Step 1 of 2: Phone Verification
        </p>
      </div>
    </div>
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    }>
      <VerifyPhoneContent />
    </Suspense>
  );
}
