import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as z from 'zod';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, 'ইমেইল অথবা ফোন নম্বর প্রদান করা আবশ্যক')
    .refine(
      (val) => {
        const digitsOnly = val.replace(/\D/g, '');
        return digitsOnly.length === 11 || z.string().email().safeParse(val).success;
      },
      { message: 'সঠিক ইমেইল ঠিকানা অথবা ১১ ডিজিটের ফোন নম্বর দিন' }
    ),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;


interface ForgotPasswordFormProps {
  register: UseFormRegister<ForgotPasswordInput>;
  errors: FieldErrors<ForgotPasswordInput>;
  success: boolean;
  isPhoneSent: boolean;
  sentTo: string;
  error: string | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ForgotPasswordForm({
  register,
  errors,
  success,
  isPhoneSent,
  sentTo,
  error,
  loading,
  onSubmit,
}: ForgotPasswordFormProps) {
  if (success) {
    return (
      <div>
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[32px] text-primary">
              {isPhoneSent ? 'sms' : 'mail'}
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface text-center mb-2">
            {isPhoneSent ? 'আপনার ফোন চেক করুন' : 'আপনার ইমেইল চেক করুন'}
          </h1>
          <p className="font-body-md text-on-surface-variant text-center leading-relaxed">
            {isPhoneSent ? (
              <>
                আমরা পাসওয়ার্ড রিসেট লিঙ্ক এসএমএস-এর মাধ্যমে পাঠিয়েছি: <br />
                <span className="font-bold text-primary">{sentTo}</span>. <br />
                অনুগ্রহ করে এসএমএস-এর লিঙ্কে ক্লিক করে পাসওয়ার্ড রিসেট করুন।
              </>
            ) : (
              <>
                আমরা পাসওয়ার্ড রিসেট লিঙ্ক পাঠিয়েছি এখানে: <br />
                <span className="font-bold text-primary">{sentTo}</span>. <br />
                অনুগ্রহ করে আপনার ইনবক্স চেক করে পাসওয়ার্ড রিসেট করতে লিঙ্কে ক্লিক করুন।
              </>
            )}
          </p>
        </div>

        <div className="mt-8">
          <Link
            className="w-full h-14 border border-outline-variant bg-transparent rounded-lg hover:bg-surface-container-low transition-colors duration-200 flex items-center justify-center font-headline-md text-[18px] text-on-surface text-center"
            href="/auth/sign-in"
          >
            লগইন পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

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
          পাসওয়ার্ড রিসেট
        </h1>
        <p className="font-body-md text-on-surface-variant text-center">
          পাসওয়ার্ড রিসেটের লিঙ্ক পেতে আপনার ইমেইল অথবা ফোন নম্বর দিন
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
        {/* Identifier Input */}
        <div className="space-y-1">
          <div className="floating-label-group relative">
            <Input
              {...register('identifier')}
              disabled={loading}
              className={`w-full h-14 px-4 border bg-white rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all duration-200 outline-none text-on-surface peer placeholder:text-transparent ${
                errors.identifier ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-outline-variant'
              }`}
              id="identifier"
              placeholder="ইমেইল অথবা ফোন নম্বর"
              type="text"
              autoComplete="email tel"
            />
            <label
              className="absolute left-4 top-4 text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-primary-container peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary-container peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
              htmlFor="identifier"
            >
              ইমেইল অথবা ফোন নম্বর
            </label>
          </div>
          {errors.identifier && (
            <p className="text-xs text-red-500 pl-1">{errors.identifier.message}</p>
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
              <span>পাঠানো হচ্ছে...</span>
            </>
          ) : (
            <>
              <span>রিসেট লিঙ্ক পাঠান</span>
              <span className="material-symbols-outlined text-[20px]">send</span>
            </>
          )}
        </Button>
      </form>

      {/* Back to Login Link */}
      <div className="mt-10 pt-6 border-t border-outline-variant/30 text-center">
        <p className="font-body-md text-on-surface-variant">
          পাসওয়ার্ড মনে পড়েছে?
          <Link
            className={`text-primary font-bold hover:underline ml-1 ${
              loading ? 'pointer-events-none opacity-50' : ''
            }`}
            href="/auth/sign-in"
            onClick={(e) => loading && e.preventDefault()}
          >
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}
