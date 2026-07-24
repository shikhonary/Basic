"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import { toast } from "@workspace/ui/components/sonner"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

// Regex pattern matching Bengali characters, whitespace, dots, and hyphens (\u0980-\u09FF)
const BENGALI_REGEX = /^[\u0980-\u09FF\s.\-]+$/

// Regex pattern matching English characters, whitespace, dots, and hyphens
const ENGLISH_REGEX = /^[A-Za-z\s.\-]+$/

const onboardingSchema = z.object({
  studentId: z
    .string()
    .min(1, "শিক্ষার্থী আইডি প্রদান করা আবশ্যক")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "সঠিক সংখ্যাবাচক শিক্ষার্থী আইডি দিন",
    }),
  name: z
    .string()
    .min(1, "ইংরেজিতে নাম প্রদান করা আবশ্যক")
    .regex(ENGLISH_REGEX, "শুধুমাত্র ইংরেজি বর্ণমালা ব্যবহার করুন (e.g. Abdullah Al Mamun)"),
  nameBn: z
    .string()
    .min(1, "বাংলায় নাম প্রদান করা আবশ্যক")
    .regex(BENGALI_REGEX, "শুধুমাত্র বাংলা বর্ণমালা ব্যবহার করুন (যেমন: আব্দুল্লাহ আল মামুন)"),
  mPhone: z
    .string()
    .min(1, "মোবাইল নম্বর প্রদান করা আবশ্যক")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "")
        return digits.length === 10 || digits.length === 11
      },
      {
        message: "সঠিক ১০ বা ১১ ডিজিটের মোবাইল নম্বর দিন",
      }
    ),
  academicClassId: z.string().min(1, "শ্রেণি নির্বাচন করুন"),
})

type OnboardingFormValues = z.infer<typeof onboardingSchema>

export function OnboardingForm() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Fetch academic classes for selection
  const academicClassesQuery = useQuery(
    trpc.academicClass.forSelection.queryOptions({})
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      studentId: "",
      name: "",
      nameBn: "",
      mPhone: "",
      academicClassId: "",
    },
  })

  const queryClient = useQueryClient()

  // Mutation
  const completeMutation = useMutation(
    trpc.student.completeOnboarding.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: trpc.user.me.queryKey() })
        toast.success("প্রোফাইল অনবোর্ডিং সফল হয়েছে! ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...")
        setErrorMsg(null)
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 1200)
      },
      onError: (err) => {
        const msg = err.message || "অনবোর্ডিং সম্পূর্ণ করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।"
        setErrorMsg(msg)
        toast.error(msg)
      },
    })
  )

  const isPending = completeMutation.isPending || isFormSubmitting

  const onSubmit = (data: OnboardingFormValues) => {
    setErrorMsg(null)
    completeMutation.mutate({
      studentId: parseInt(data.studentId, 10),
      name: data.name.trim(),
      nameBn: data.nameBn.trim(),
      mPhone: data.mPhone.trim(),
      academicClassId: data.academicClassId,
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body-md text-on-surface">
      <main className="flex flex-grow items-center justify-center p-4 py-8 sm:p-6 md:p-10">
        <div className="w-full max-w-xl">
          {/* Card Container */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-xs sm:p-10">
            {/* Logo & Header like LoginPage */}
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
                অনবোর্ডিং
              </h1>
              <p className="font-body-md text-on-surface-variant text-center">
                <span className="font-bold text-primary">BEC</span> স্টুডেন্ট প্রোফাইল তৈরি সম্পূর্ণ করুন
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-error/30 bg-error-container/20 p-4 text-error">
                <span className="material-symbols-outlined">error</span>
                <span className="font-body-md text-sm font-medium">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 1. Academic Class (At the top) */}
              <div className="space-y-2">
                <Label className="block font-label-sm text-xs font-semibold tracking-wider text-on-surface-variant">
                  শ্রেণি <span className="text-error">*</span>
                </Label>
                <Controller
                  name="academicClassId"
                  control={control}
                  render={({ field }) => (
                    <div className="group relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                        school
                      </span>
                      <Select
                        disabled={isPending}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-outline-variant py-3 pl-10 pr-4 font-body-md text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto justify-between">
                          <SelectValue placeholder="-- শ্রেণি নির্বাচন করুন --" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
                          {academicClassesQuery.isLoading ? (
                            <SelectItem value="" disabled>
                              লোডিং হচ্ছে...
                            </SelectItem>
                          ) : (
                            academicClassesQuery.data?.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.nameBn}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.academicClassId && (
                  <p className="text-xs text-error">
                    {errors.academicClassId.message}
                  </p>
                )}
              </div>

              {/* 2. Name EN & Name BN (Row of 2) */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="block font-label-sm text-xs font-semibold tracking-wider text-on-surface-variant">
                    শিক্ষার্থীর নাম (ইংরেজিতে) <span className="text-error">*</span>
                  </Label>
                  <div className="group relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10">
                      abc
                    </span>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="Full Name in English"
                      {...register("name")}
                      className="w-full rounded-lg border border-outline-variant py-3 pl-10 pr-4 font-body-md text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-error">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="block font-label-sm text-xs font-semibold tracking-wider text-on-surface-variant">
                    শিক্ষার্থীর নাম (বাংলায়) <span className="text-error">*</span>
                  </Label>
                  <div className="group relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10">
                      translate
                    </span>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="বাংলায় সম্পূর্ণ নাম"
                      {...register("nameBn")}
                      className="w-full rounded-lg border border-outline-variant py-3 pl-10 pr-4 font-body-md font-bengali text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
                    />
                  </div>
                  {errors.nameBn && (
                    <p className="text-xs text-error">{errors.nameBn.message}</p>
                  )}
                </div>
              </div>

              {/* 3. Student ID & Mother's Phone (Row of 2) */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Student ID */}
                <div className="space-y-2">
                  <Label className="block font-label-sm text-xs font-semibold tracking-wider text-on-surface-variant">
                    শিক্ষার্থী আইডি <span className="text-error">*</span>
                  </Label>
                  <div className="group relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10">
                      badge
                    </span>
                    <Input
                      type="number"
                      disabled={isPending}
                      placeholder="যেমন: ১০২৫০"
                      {...register("studentId")}
                      className="w-full rounded-lg border border-outline-variant py-3 pl-10 pr-4 font-body-md text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
                    />
                  </div>
                  {errors.studentId && (
                    <p className="text-xs text-error">{errors.studentId.message}</p>
                  )}
                </div>

                {/* Mother's Phone */}
                <div className="space-y-2">
                  <Label className="block font-label-sm text-xs font-semibold tracking-wider text-on-surface-variant">
                    মোবাইল নম্বর <span className="text-error">*</span>
                  </Label>
                  <div className="group relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10">
                      call
                    </span>
                    <Input
                      type="tel"
                      disabled={isPending}
                      placeholder="1XXXXXXXXX"
                      {...register("mPhone")}
                      className="w-full rounded-lg border border-outline-variant py-3 pl-24 pr-4 font-body-md text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
                    />
                  </div>
                  {errors.mPhone && (
                    <p className="text-xs text-error">{errors.mPhone.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Action Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-3.5 font-label-sm text-xs font-bold uppercase tracking-widest text-on-primary-container shadow-md transition-all hover:shadow-lg hover:shadow-primary-container/30 active:scale-98 h-auto cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                      <span>সংরক্ষণ করা হচ্ছে...</span>
                    </>
                  ) : (
                    "অনবোর্ডিং সম্পূর্ণ করুন"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Supplemental System Info Footer like LoginPage */}
          <div className="mt-8 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-on-surface-variant/60">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="text-xs">এন্ড-টু-এন্ড এনক্রিপ্টেড</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant/60">
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span className="text-xs">v2.4.1 (স্টেবল)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
