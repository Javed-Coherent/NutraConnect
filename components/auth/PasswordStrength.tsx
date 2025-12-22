'use client';

import { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains a number', test: (p) => /[0-9]/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };

    const passedCount = requirements.filter(r => r.test(password)).length;
    const score = (passedCount / requirements.length) * 100;

    if (score <= 20) return { score, label: 'Very Weak', color: 'bg-red-500' };
    if (score <= 40) return { score, label: 'Weak', color: 'bg-orange-500' };
    if (score <= 60) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 80) return { score, label: 'Good', color: 'bg-lime-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Password strength</span>
          <span className={`font-medium ${
            strength.score <= 40 ? 'text-red-600 dark:text-red-400' :
            strength.score <= 60 ? 'text-yellow-600 dark:text-yellow-400' :
            'text-green-600 dark:text-green-400'
          }`}>
            {strength.label}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${strength.color}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
      </div>

      {/* Requirements list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {requirements.map((req, i) => {
          const passed = req.test(password);
          return (
            <div
              key={i}
              className={`flex items-center text-xs ${passed ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}
            >
              {passed ? (
                <Check className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <X className="h-3.5 w-3.5 mr-1.5" />
              )}
              {req.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function isPasswordStrong(password: string): boolean {
  return requirements.every(r => r.test(password));
}
