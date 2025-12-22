'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { requestPasswordReset } from '@/lib/actions/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await requestPasswordReset(email);

    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.error || 'Failed to send reset link');
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    const result = await requestPasswordReset(email);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to send reset link');
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
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
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  We&apos;ve sent a password reset link to
                </p>
                <p className="text-teal-600 dark:text-teal-400 font-medium mb-6">{email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  The link will expire in 1 hour. If you don&apos;t see the email, check your spam folder.
                </p>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleResend}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send Again
                  </Button>
                  <Button asChild className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                    <Link href="/auth/login">
                      Back to Login
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/auth/login" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
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
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900 dark:to-emerald-900 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${error ? 'border-red-500 focus:ring-red-200' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
