import React, { Suspense } from 'react';
import ResetPasswordPage from '@/modules/auth/pages/ResetPasswordPage';

export default function ResetPasswordRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined animate-spin text-[32px] text-primary">sync</span>
            <span className="text-sm text-on-surface-variant">Loading Reset Session...</span>
          </div>
        </div>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
