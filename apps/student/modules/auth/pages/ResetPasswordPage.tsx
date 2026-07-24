'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@workspace/auth/client';
import ResetPasswordForm, { resetPasswordSchema, ResetPasswordInput } from '../components/ResetPasswordForm';


export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(token ? null : 'পাসওয়ার্ড রিসেট টোকেন পাওয়া যায়নি। নতুন লিঙ্কের জন্য আবেদন করুন।');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordInput> = async (values) => {
    if (!token) {
      setError('পাসওয়ার্ড রিসেট টোকেন নেই। নতুন পাসওয়ার্ড রিসেট লিঙ্ক অনুরোধ করুন।');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: values.password,
        token: token,
      });

      if (resetError) {
        setError(resetError.message ?? 'পাসওয়ার্ড রিসেট করা সম্ভব হয়নি। লিঙ্কটির মেয়াদ শেষ হয়ে গিয়ে থাকতে পারে।');
      } else {
        router.push('/auth/sign-in?resetSuccess=true');
      }
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
            <ResetPasswordForm
              register={register}
              errors={errors}
              error={error}
              loading={loading}
              onSubmit={handleSubmit(onSubmit)}
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
