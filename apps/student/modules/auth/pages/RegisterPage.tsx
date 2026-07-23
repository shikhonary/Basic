'use client';

import React, { useState } from 'react';
import { authClient } from '@workspace/auth/client';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RegisterForm from '../components/RegisterForm';
import VerificationStatusCard from '../components/VerificationStatusCard';

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

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  identifier: z
    .string()
    .min(1, 'Email or phone number is required')
    .refine(
      (val) => {
        const digitsOnly = val.replace(/\D/g, '');
        return digitsOnly.length === 11 || z.string().email().safeParse(val).success;
      },
      { message: 'Please enter a valid email address or 11-digit phone number' }
    ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  agreed: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service to continue.',
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Track if the registration was phone-based (to skip verification card)
  const [isPhoneRegistration, setIsPhoneRegistration] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      identifier: '',
      password: '',
      agreed: false,
    },
  });

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onSubmit: SubmitHandler<RegisterInput> = async (values) => {
    setError(null);
    setLoading(true);
    try {
      const identifier = values.identifier.trim();
      const isPhone = isPhoneNumber(identifier);

      // For phone registration: generate an internal email
      // For email registration: use the email directly
      const email = isPhone
        ? `${identifier.replace(/\D/g, '')}@${PHONE_EMAIL_DOMAIN}`
        : identifier;

      const { data, error: authError } = await authClient.signUp.email({
        name: values.name,
        email,
        password: values.password,
      });

      console.log('Sign up result:', { data, error: authError });

      if (authError) {
        setError(authError.message ?? 'Sign-up failed. Please try again.');
        return;
      }

      if (data) {
        if (isPhone) {
          // Phone registration: auto-verified via databaseHook,
          // so sign in immediately and redirect
          setIsPhoneRegistration(true);

          const phoneDigits = identifier.replace(/\D/g, '');
          const { error: signInError } = await authClient.signIn.phoneNumber({
            phoneNumber: phoneDigits,
            password: values.password,
          });

          if (signInError) {
            // Fallback: try email-based sign-in with the generated email
            const { error: emailSignInError } = await authClient.signIn.email({
              email,
              password: values.password,
            });

            if (emailSignInError) {
              setError('Account created but auto-login failed. Please sign in manually.');
              return;
            }
          }

          router.push('/');
        } else {
          // Email registration: show verification card
          setRegisteredEmail(identifier);
          setSignUpSuccess(true);
          setCountdown(120); // 2 minute countdown
        }
      }
    } catch (err: any) {
      console.error('Sign up unexpected error:', err);
      setError(err?.message ?? 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendSuccess(false);
    setError(null);

    try {
      const { error: resendError } = await authClient.sendVerificationEmail({
        email: registeredEmail,
        callbackURL: `${window.location.origin}/auth/sign-in?verified=true`,
      });

      console.log('Resend result:', { error: resendError });

      if (resendError) {
        setError(resendError.message ?? 'Failed to resend verification email.');
      } else {
        setResendSuccess(true);
        setCountdown(120); // Reset to 2 minute countdown
      }
    } catch (err: any) {
      console.error('Resend unexpected error:', err);
      setError(err?.message ?? 'An unexpected error occurred.');
    } finally {
      setResending(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (err: any) {
      console.error('Google sign-in unexpected error:', err);
      setError(err?.message ?? "An error occurred during Google sign-in.");
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

        {/* Register/Verify Card Container */}
        <div className="w-full max-w-[480px] fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 md:p-12 shadow-[0_4px_20px_-2px_rgba(31,41,55,0.08)]">

            {signUpSuccess ? (
              <VerificationStatusCard
                registeredEmail={registeredEmail}
                resendSuccess={resendSuccess}
                resending={resending}
                error={error}
                countdown={countdown}
                formatTime={formatTime}
                onResend={handleResend}
              />
            ) : (
              <RegisterForm
                register={register}
                errors={errors}
                setValue={setValue}
                control={control}
                loading={loading}
                error={error}
                onSubmit={handleSubmit(onSubmit)}
                onGoogleSignIn={handleGoogleSignIn}
              />
            )}

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