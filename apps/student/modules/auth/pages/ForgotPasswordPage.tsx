'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@workspace/auth/client';
import ForgotPasswordForm, { forgotPasswordSchema, ForgotPasswordInput } from '../components/ForgotPasswordForm';


export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordInput> = async (values) => {
    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message ?? 'Failed to send password reset email.');
      } else {
        setEmailSentTo(values.email);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message ?? 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md overflow-x-hidden">
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
              register={register}
              errors={errors}
              success={success}
              emailSentTo={emailSentTo}
              error={error}
              loading={loading}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>

          {/* Supplemental System Info */}
          <div className="mt-8 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-on-surface-variant/60">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="text-label-sm">End-to-end Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant/60">
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span className="text-label-sm">v2.4.1 (Stable)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
