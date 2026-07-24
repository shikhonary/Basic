import React from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@workspace/ui/components/input-otp';

interface PhoneOtpVerificationCardProps {
  phoneNumber: string;
  otpCode: string;
  setOtpCode: (code: string) => void;
  loading: boolean;
  resending: boolean;
  resendSuccess: boolean;
  error: string | null;
  countdown: number;
  formatTime: (seconds: number) => string;
  title?: string;
  description?: string;
  backText?: string;
  verifyText?: string;
  onVerify: (codeOrEvent?: string | React.FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
}

export default function PhoneOtpVerificationCard({
  phoneNumber,
  otpCode,
  setOtpCode,
  loading,
  resending,
  resendSuccess,
  error,
  countdown,
  formatTime,
  title = "ফোন নম্বর ভেরিফাই করুন",
  description,
  backText = "&larr; পেছনে ফিরে যান",
  verifyText = "ভেরিফাই করুন",
  onVerify,
  onResend,
  onBack,
}: PhoneOtpVerificationCardProps) {
  return (
    <div>
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[32px] text-primary">sms</span>
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface text-center mb-2">
          {title}
        </h1>
        <p className="font-body-md text-on-surface-variant text-center">
          {description ? (
            description
          ) : (
            <>
              আমরা এসএমএসের মাধ্যমে ৬ ডিজিটের একটি ওটিপি (OTP) পাঠিয়েছি: <br />
              <span className="font-bold text-primary">{phoneNumber}</span>. <br />
              রেজিস্ট্রেশন সম্পন্ন করতে নিচের কোডটি প্রবেশ করান।
            </>
          )}
        </p>
      </div>

      {/* Resend Success Banner */}
      {resendSuccess && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          <span className="material-symbols-outlined text-[18px] mt-px shrink-0">check_circle</span>
          <span>আপনার ফোনে একটি নতুন ওটিপি (OTP) কোড পাঠানো হয়েছে।</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="material-symbols-outlined text-[18px] mt-px shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (otpCode.length === 6 && !loading) {
            onVerify(otpCode);
          }
        }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <label htmlFor="otpCode" className="block text-label-sm font-medium text-on-surface-variant text-center">
            ভেরিফিকেশন কোড
          </label>
          <div className="flex justify-center">
            <InputOTP
              id="otpCode"
              maxLength={6}
              value={otpCode}
              onChange={(val) => {
                const cleanVal = val.replace(/\D/g, '');
                setOtpCode(cleanVal);
                if (cleanVal.length === 6 && !loading) {
                  onVerify(cleanVal);
                }
              }}
              disabled={loading}
              autoFocus
            >
              <InputOTPGroup className="gap-2 sm:gap-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-11 h-14 sm:w-12 sm:h-14 text-2xl font-bold rounded-lg border border-outline-variant bg-white focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        {/* Primary Action Button (Verify / Continue) */}
        <Button
          type="submit"
          disabled={loading || resending || otpCode.length < 6}
          className="w-full h-14 bg-primary-container !text-white font-headline-md text-[18px] rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              <span>ভেরিফাই করা হচ্ছে...</span>
            </>
          ) : (
            <>
              <span>{verifyText}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          )}
        </Button>

        {/* Resend OTP Section */}
        <div className="text-center pt-1">
          {resending ? (
            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              <span>ওটিপি পাঠানো হচ্ছে...</span>
            </div>
          ) : countdown > 0 ? (
            <div className="flex items-center justify-center gap-1.5 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
              <span>{formatTime(countdown)} পর ওটিপি পুনরায় পাঠান</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={loading || resending}
              className="text-sm font-medium text-primary hover:underline cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1 mx-auto"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>ওটিপি পুনরায় পাঠান</span>
            </button>
          )}
        </div>
      </form>

      <div className="mt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="w-full text-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-2 cursor-pointer disabled:opacity-50"
        >
          {backText}
        </button>
      </div>
    </div>
  );
}
