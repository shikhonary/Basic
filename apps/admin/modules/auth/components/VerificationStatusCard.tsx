import React from 'react';
import Link from 'next/link';
import { Button } from '@workspace/ui/components/button';

interface VerificationStatusCardProps {
  registeredEmail: string;
  resendSuccess: boolean;
  resending: boolean;
  error: string | null;
  countdown: number;
  formatTime: (seconds: number) => string;
  onResend: () => void;
}

export default function VerificationStatusCard({
  registeredEmail,
  resendSuccess,
  resending,
  error,
  countdown,
  formatTime,
  onResend,
}: VerificationStatusCardProps) {
  return (
    <div>
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[32px] text-primary">mail</span>
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface text-center mb-2">
          Check your email
        </h1>
        <p className="font-body-md text-on-surface-variant text-center">
          We sent a verification link to <br />
          <span className="font-bold text-primary">{registeredEmail}</span>. <br />
          Please click the link in the email to verify your account.
        </p>
      </div>

      {/* Resend Success Banner */}
      {resendSuccess && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          <span className="material-symbols-outlined text-[18px] mt-px shrink-0">check_circle</span>
          <span>A new verification link has been sent successfully.</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="material-symbols-outlined text-[18px] mt-px shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <Button
          className="w-full h-14 bg-primary-container !text-white font-headline-md text-[18px] rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="button"
          disabled={resending || countdown > 0}
          onClick={onResend}
        >
          {resending ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              <span>Resending...</span>
            </>
          ) : countdown > 0 ? (
            <>
              <span>Resend in {formatTime(countdown)}</span>
              <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
            </>
          ) : (
            <>
              <span>Resend Email</span>
              <span className="material-symbols-outlined text-[20px]">send</span>
            </>
          )}
        </Button>

        <Link
          className="w-full h-14 border border-outline-variant bg-transparent rounded-lg hover:bg-surface-container-low transition-colors duration-200 flex items-center justify-center font-headline-md text-[18px] text-on-surface text-center"
          href="/auth/sign-in"
        >
          Back to Log In
        </Link>
      </div>
    </div>
  );
}
