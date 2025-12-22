'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Building2,
  Mail,
  Phone,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShoppingBag,
  Factory,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { PasswordStrength, isPasswordStrong } from '@/components/auth/PasswordStrength';
import { registerUser, loginWithCredentials } from '@/lib/actions/auth';

const benefits = [
  '10 free searches per day',
  '2 company profile views',
  '2 contact reveals',
  'No credit card required',
];

type UserRole = 'supplier' | 'buyer' | '';

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string;
  general?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordStrong(formData.password)) {
      newErrors.password = 'Please create a stronger password';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your role';
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
      // Register the user
      const result = await registerUser({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.role as 'buyer' | 'supplier',
        company: formData.companyName,
      });

      if (!result.success) {
        setErrors({ general: result.error || 'Failed to create account' });
        setIsLoading(false);
        return;
      }

      // Auto-login after registration
      const loginResult = await loginWithCredentials(formData.email, formData.password);

      if (loginResult.success) {
        // Redirect to email verification
        router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
        router.refresh();
      } else {
        // Registration succeeded but login failed - redirect to login
        router.push('/auth/login?registered=true');
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        {/* Left - Benefits */}
        <div className="hidden md:flex flex-col justify-center p-8">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600 shadow-lg">
              <span className="text-xl font-bold text-white">N</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
              NutraConnect
            </span>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Join 10,000+ businesses already on NutraConnect
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get access to verified suppliers, manufacturers, and distributors across India&apos;s nutraceutical industry.
          </p>

          <ul className="space-y-3">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center mr-3">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                {benefit}
              </li>
            ))}
          </ul>

          {/* Trust indicators */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Trusted by leading companies</p>
            <div className="flex gap-4 text-gray-400">
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div>
          <div className="md:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
            <Link href="/" className="flex items-center justify-center space-x-2">
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
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Start finding business partners for free
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
                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="firstName">
                      First Name *
                    </label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className={`pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.firstName ? 'border-red-500 focus:ring-red-200' : ''}`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="lastName">
                      Last Name *
                    </label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className={`pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.lastName ? 'border-red-500 focus:ring-red-200' : ''}`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="companyName">
                    Company Name *
                  </label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="companyName"
                      placeholder="Your Company Pvt Ltd"
                      value={formData.companyName}
                      onChange={(e) => updateField('companyName', e.target.value)}
                      className={`pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.companyName ? 'border-red-500 focus:ring-red-200' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
                    Work Email *
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
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="phone">
                    Phone Number *
                  </label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={`pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.phone ? 'border-red-500 focus:ring-red-200' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                    Password *
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className={`pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
                      disabled={isLoading}
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
                  <PasswordStrength password={formData.password} />
                </div>

                {/* Role Selection */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I am a: *</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => updateField('role', 'supplier')}
                      disabled={isLoading}
                      className={`
                        flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all
                        ${formData.role === 'supplier'
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 ring-2 ring-teal-200 dark:ring-teal-800'
                          : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-900/20'
                        }
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <Factory className={`h-8 w-8 mb-2 ${formData.role === 'supplier' ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${formData.role === 'supplier' ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        Supplier / Manufacturer
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('role', 'buyer')}
                      disabled={isLoading}
                      className={`
                        flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all
                        ${formData.role === 'buyer'
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 ring-2 ring-teal-200 dark:ring-teal-800'
                          : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-900/20'
                        }
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <ShoppingBag className={`h-8 w-8 mb-2 ${formData.role === 'buyer' ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${formData.role === 'buyer' ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        Buyer / Distributor
                      </span>
                    </button>
                  </div>
                  {errors.role && (
                    <p className="text-xs text-red-500 mt-2">{errors.role}</p>
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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="text-teal-600 dark:text-teal-400 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-teal-600 dark:text-teal-400 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>

              <div className="mt-6">
                <SocialLoginButtons mode="signup" isLoading={isLoading} />
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">
                  Login
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
