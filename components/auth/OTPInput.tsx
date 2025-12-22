'use client';

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { Input } from '@/components/ui/input';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OTPInput({ length = 6, value, onChange, disabled = false }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));

  useEffect(() => {
    // Sync internal state with external value
    const valueArray = value.split('').slice(0, length);
    const paddedArray = [...valueArray, ...new Array(length - valueArray.length).fill('')];
    setOtp(paddedArray);
  }, [value, length]);

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Only allow numbers
    const sanitized = inputValue.replace(/\D/g, '');
    if (!sanitized && inputValue !== '') return;

    const newOtp = [...otp];
    newOtp[index] = sanitized.slice(-1); // Only take last character
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Move to next input
    if (sanitized && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, i) => {
        if (i < length) newOtp[i] = char;
      });
      setOtp(newOtp);
      onChange(newOtp.join(''));

      // Focus on the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex(val => !val);
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold
            border-2 rounded-lg transition-all
            focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800
            dark:bg-gray-700 dark:text-white
            ${digit ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/30 dark:border-teal-500' : 'border-gray-200 dark:border-gray-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      ))}
    </div>
  );
}
