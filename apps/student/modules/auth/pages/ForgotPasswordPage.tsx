'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@workspace/auth/client';
import ForgotPasswordForm, { forgotPasswordSchema, ForgotPasswordInput } from '../components/ForgotPasswordForm';
import PhoneOtpVerificationCard from '../components/PhoneOtpVerificationCard';
import ResetPasswordForm, { resetPasswordSchema, ResetPasswordInput } from '../components/ResetPasswordForm';

/**
 * Domain used for internally-generated emails for phone-based registrations.
 * Must match the value in packages/auth/src/server/auth.ts
 */
const PHONE_EMAIL_DOMAIN = 'phone.bec.local';

/**
 * Check if a string is an 11-digit phone number (digits only).
 */
function isPhoneNumber(value: string): boolean {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length === 11;
}

type Step = 'IDENTIFIER' | 'SENT';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('IDENTIFIER');
  const [sentTo, setSentTo] = useState('');
  const [isPhoneSent, setIsPhoneSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form for Email or Phone
  const {
    register: registerIdentifier,
    handleSubmit: handleSubmitIdentifier,
    formState: { errors: errorsIdentifier },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: '',
    },
  });

  const onSubmitIdentifier: SubmitHandler<ForgotPasswordInput> = async (values) => {
    setError(null);
    setLoading(true);

    try {
      const identifier = values.identifier.trim();
      const isPhone = isPhoneNumber(identifier);

      // For phone registration: generate the internal email (e.g. 01712345678@phone.bec.local)
      // For email registration: use the email directly
      const email = isPhone
        ? `${identifier.replace(/\D/g, '')}@${PHONE_EMAIL_DOMAIN}`
        : identifier;

      const { error: resetError } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(
          resetError.message ??
            (isPhone
              ? 'পাসওয়ার্ড রিসেট লিঙ্ক এসএমএস পাঠানো সম্ভব হয়নি।'
              : 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো সম্ভব হয়নি।')
        );
        return;
      }

      setSentTo(identifier);
      setIsPhoneSent(isPhone);
      setStep('SENT');
    } catch (err: any) {
      setError(err?.message ?? 'একটি অপ্রত্যাশিত সমস্যা ঘটেছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md font-solaiman overflow-x-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}} />
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12 relative">
        {/* Atmospheric Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-fixed-dim/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-fixed-dim/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-[480px] fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 md:p-12 shadow-[0_4px_20px_-2px_rgba(31,41,55,0.08)]">
            <ForgotPasswordForm
              register={registerIdentifier}
              errors={errorsIdentifier}
              success={step === 'SENT'}
              isPhoneSent={isPhoneSent}
              sentTo={sentTo}
              error={error}
              loading={loading}
              onSubmit={handleSubmitIdentifier(onSubmitIdentifier)}
            />
          </div>

          {/* Supplemental System Info */}
          <div className="mt-8 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-on-surface-variant/60">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="text-label-sm">এন্ড-টু-এন্ড এনক্রিপ্টেড</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant/60">
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span className="text-label-sm">v2.4.1 (স্টেবল)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
