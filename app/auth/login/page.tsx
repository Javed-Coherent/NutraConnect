'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { loginWithCredentials } from '@/lib/actions/auth';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await loginWithCredentials(formData.email, formData.password);

      if (result.success) {
        // Use full page reload to ensure session is properly initialized
        window.location.href = '/';
      } else {
        setErrors({ general: result.error || 'Invalid email or password' });
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
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
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Login to access your account
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Error Alert */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-400">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
                  Email
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={`pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className={`pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => updateField('rememberMe', checked as boolean)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  Remember me for 30 days
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <SocialLoginButtons mode="login" isLoading={isLoading} />
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">
                Sign up free
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
          Protected by industry-standard encryption. Your data is safe with us.
        </p>
      </div>
    </div>
  );
}
