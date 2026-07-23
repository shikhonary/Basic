import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { UseFormRegister, FieldErrors, UseFormSetValue, Control, useWatch } from 'react-hook-form';
import { RegisterInput } from '../pages/RegisterPage';

interface RegisterFormProps {
  register: UseFormRegister<RegisterInput>;
  errors: FieldErrors<RegisterInput>;
  setValue: UseFormSetValue<RegisterInput>;
  control: Control<RegisterInput>;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
}

export default function RegisterForm({
  register,
  errors,
  setValue,
  control,
  loading,
  error,
  onSubmit,
  onGoogleSignIn,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const agreed = useWatch({
    control,
    name: 'agreed',
    defaultValue: false,
  });

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
          Create an Account
        </h1>
        <p className="font-body-md text-on-surface-variant text-center">
          Join <span className="font-bold text-primary">BEC</span> workstation
        </p>
      </div>

      {/* Server Error Banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="material-symbols-outlined text-[18px] mt-px shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Register Form */}
      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        {/* Full Name Input */}
        <div className="space-y-1">
          <div className="floating-label-group relative">
            <Input
              {...register('name')}
              disabled={loading}
              className={`w-full h-14 px-4 border bg-white rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all duration-200 outline-none text-on-surface peer placeholder:text-transparent ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-outline-variant'
                }`}
              id="fullName"
              placeholder="Full Name"
              type="text"
              autoComplete="name"
            />
            <label
              className="absolute left-4 top-4 text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-primary-container peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary-container peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
              htmlFor="fullName"
            >
              Full Name
            </label>
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 pl-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email or Phone Input */}
        <div className="space-y-1">
          <div className="floating-label-group relative">
            <Input
              {...register('identifier')}
              disabled={loading}
              className={`w-full h-14 px-4 border bg-white rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all duration-200 outline-none text-on-surface peer placeholder:text-transparent ${errors.identifier ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-outline-variant'
                }`}
              id="identifier"
              placeholder="Email or Phone Number"
              type="text"
              autoComplete="email tel"
            />
            <label
              className="absolute left-4 top-4 text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-primary-container peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary-container peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
              htmlFor="identifier"
            >
              Email or Phone Number
            </label>
          </div>
          {errors.identifier && (
            <p className="text-xs text-red-500 pl-1">{errors.identifier.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="floating-label-group relative">
              <Input
                {...register('password')}
                disabled={loading}
                className={`w-full h-14 pl-4 pr-12 border bg-white rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all duration-200 outline-none text-on-surface peer placeholder:text-transparent ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-outline-variant'
                  }`}
                id="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
              />
              <label
                className="absolute left-4 top-4 text-on-surface-variant transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-primary-container peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary-container peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
                htmlFor="password"
              >
                Password
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

          <div className="flex flex-col gap-1 mt-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                className="w-4 h-4 rounded border-outline text-primary-container data-checked:bg-primary-container data-checked:border-primary-container focus:ring-primary-container cursor-pointer"
                checked={agreed}
                disabled={loading}
                onCheckedChange={(v) => setValue('agreed', v === true, { shouldValidate: true })}
              />
              <span className="text-label-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                I agree to the <Link href="/terms-of-service" className='hover:underline'>Terms of Service</Link>
              </span>
            </label>
            {errors.agreed && (
              <p className="text-xs text-red-500 pl-1">{errors.agreed.message}</p>
            )}
          </div>
        </div>

        {/* Register Button */}
        <Button
          className="w-full h-14 bg-primary-container !text-white font-headline-md text-[18px] rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
          variant="default"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Sign Up</span>
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </>
          )}
        </Button>
      </form>

      {/* Separator */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant"></div>
        </div>
        <div className="relative flex justify-center text-label-sm">
          <span className="px-4 bg-surface-container-lowest text-on-surface-variant">
            OR CONTINUE WITH
          </span>
        </div>
      </div>

      {/* Social Logins */}
      <div className="flex flex-col gap-4">
        <Button
          disabled={loading}
          onClick={onGoogleSignIn}
          className="flex items-center justify-center gap-3 h-12 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors duration-200 group bg-transparent shadow-none"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="text-label-sm font-medium text-on-surface">Continue with Google</span>
        </Button>
      </div>

      {/* Login Link */}
      <div className="mt-10 pt-6 border-t border-outline-variant/30 text-center">
        <p className="font-body-md text-on-surface-variant">
          Already have an account?
          <Link
            className={`text-primary font-bold hover:underline ml-1 ${loading ? 'pointer-events-none opacity-50' : ''
              }`}
            href="/auth/sign-in"
            onClick={(e) => loading && e.preventDefault()}
            prefetch
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
