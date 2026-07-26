"use client"

import React from "react"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useCurrentUser } from "@/modules/user/services/use-user"

interface DashboardVerificationBannerProps {
  onOpenModal: () => void
}

export function DashboardVerificationBanner({
  onOpenModal,
}: DashboardVerificationBannerProps) {
  const { user, isPhoneUnverified, isEmailUnverified, isVerified } = useCurrentUser()

  if (!user || isVerified) {
    return null
  }

  const isPhone = isPhoneUnverified
  const contactText = isPhone
    ? user.phoneNumber || "আপনার মোবাইল নম্বর"
    : user.email || "আপনার ইমেইল"

  return (
    <div className="w-full rounded-xl border border-amber-300/80 bg-amber-50/90 p-4 sm:p-5 shadow-sm backdrop-blur-sm transition-all dark:border-amber-900/50 dark:bg-amber-950/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-950 dark:text-amber-200 text-base">
              অ্যাকাউন্ট ভেরিফিকেশন প্রয়োজন
            </h3>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300/90 leading-relaxed">
              {isPhone ? (
                <>
                  আপনার মোবাইল নম্বর (<span className="font-semibold">{contactText}</span>) ভেরিফাই করা হয়নি। পরীক্ষা ও অন্যান্য সেবা পেতে এখনই ভেরিফাই করুন।
                </>
              ) : (
                <>
                  আপনার ইমেইল ঠিকানা (<span className="font-semibold">{contactText}</span>) ভেরিফাই করা হয়নি। আপনার ইমেইল চেক করুন অথবা পুনরায় লিঙ্ক পাঠান।
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
          <Button
            onClick={onOpenModal}
            size="sm"
            className="bg-amber-600 text-white hover:bg-amber-700 shadow-sm gap-1.5 font-medium px-4 h-9"
          >
            <span>এখনই ভেরিফাই করুন</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
