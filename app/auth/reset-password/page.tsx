'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PasswordStrength, isPasswordStrong } from '@/components/auth/PasswordStrength';
import { validateResetToken, resetPassword } from '@/lib/actions/auth';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; general?: string }>({});

  // Validate token on page load
  useEffect(() => {
    if (token) {
      validateResetToken(token).then(result => {
        setIsValidating(false);
        if (result.valid) {
          setTokenValid(true);
        } else {
          setTokenError(result.error || 'Invalid or expired reset link');
        }
      });
    } else {
      setIsValidating(false);
      setTokenError('Invalid or expired reset link');
    }
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirm?: string } = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordStrong(password)) {
      newErrors.password = 'Please create a stronger password';
    }

    if (!confirmPassword) {
      newErrors.confirm = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !token) return;

    setIsLoading(true);
    setErrors({});

    const result = await resetPassword(token, password);

    if (result.success) {
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } else {
      setErrors({ general: result.error || 'Failed to reset password' });
      setIsLoading(false);
    }
  };

  // Show loading while validating token
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Show invalid token message
  if (!tokenValid) {
    return (
      <div className="flex items-center justify-center p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <Card className="border-2 border-red-100 dark:border-red-900 shadow-xl dark:bg-gray-800">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-red-500 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid or Expired Link</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                {tokenError}
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                <Link href="/auth/forgot-password">
                  Request New Link
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset Successfully!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your password has been changed. You can now login with your new password.
          </p>
          <div className="flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400 mb-6">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Redirecting to login...</span>
          </div>
          <Button asChild className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
            <Link href="/auth/login">
              Go to Login
            </Link>
          </Button>
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
              <Lock className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Create a new password for your account.
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <p className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">{errors.general}</p>
              )}

              {/* New Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                  New Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a new password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className={`pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
                <PasswordStrength password={password} />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirm) setErrors(prev => ({ ...prev, confirm: undefined }));
                    }}
                    className={`pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.confirm ? 'border-red-500 focus:ring-red-200' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirm && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>
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
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
