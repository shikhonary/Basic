import React, { useState } from 'react';
import Image from 'next/image';
import * as z from 'zod';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড দুটি মিলছে না",
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;


interface ResetPasswordFormProps {
  register: UseFormRegister<ResetPasswordInput>;
  errors: FieldErrors<ResetPasswordInput>;
  error: string | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack?: () => void;
}

export default function ResetPasswordForm({
  register,
  errors,
  error,
  loading,
  onSubmit,
  onBack,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div>
      {/* Logo & Header */}
      <div className="flex flex-col items-center mb-10">
        <Image
          alt="Basic Education Care Logo"
          src="/logo.jpg"
          width={200}
          height={64}
          priority
          className="h-16 w-auto mb-8 object-contain"
        />
        <h1 className="font-headline-md text-headline-md text-on-surface text-center mb-2">
          নতুন পাসওয়ার্ড
        </h1>
        <p className="font-body-md text-on-surface-variant text-center">
          আপনার নতুন পাসওয়ার্ড প্রবেশ করান
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="material-symbols-outlined text-[18px] mt-px shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        {/* New Password Input */}
        <div className="space-y-1">
          <div className="floating-label-group relative">
            <Input
              {...register('password')}
              disabled={loading}
              className={`w-full h-14 pl-4 pr-12 border bg-white rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all duration-200 outline-none text-on-surface peer placeholder:text-transparent ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-outline-variant'
                }`}
              id="password"
              placeholder="নতুন পাসওয়ার্ড"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
            />
            <label
              className="absolute left-4 top-4 text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-primary-container peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary-container peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
              htmlFor="password"
            >
              নতুন পাসওয়ার্ড
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface select-none focus:outline-none flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 pl-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1">
          <div className="floating-label-group relative">
            <Input
              {...register('confirmPassword')}
              disabled={loading}
              className={`w-full h-14 pl-4 pr-12 border bg-white rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all duration-200 outline-none text-on-surface peer placeholder:text-transparent ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-outline-variant'
                }`}
              id="confirmPassword"
              placeholder="নতুন পাসওয়ার্ড নিশ্চিত করুন"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
            />
            <label
              className="absolute left-4 top-4 text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-primary-container peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary-container peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
              htmlFor="confirmPassword"
            >
              নতুন পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface select-none focus:outline-none flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showConfirmPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 pl-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          className="w-full h-14 !text-white font-headline-md text-[18px] bg-primary-container rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
          variant="default"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              <span>আপডেট করা হচ্ছে...</span>
            </>
          ) : (
            <>
              <span>পাসওয়ার্ড আপডেট করুন</span>
              <span className="material-symbols-outlined text-[20px]">lock_reset</span>
            </>
          )}
        </Button>
      </form>

      {onBack && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="w-full text-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-2 cursor-pointer disabled:opacity-50"
          >
            &larr; ওটিপি পেজে ফিরে যান
          </button>
        </div>
      )}
    </div>
  );
}
