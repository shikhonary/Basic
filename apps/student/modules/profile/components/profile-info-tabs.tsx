"use client"

import React from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import {
  User,
  GraduationCap,
  Users,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Globe,
  Heart,
  ShieldCheck,
  Building,
} from "lucide-react"
import { useCurrentUser } from "@/modules/user/services/use-user"

interface ProfileInfoTabsProps {
  studentProfile: any
}

export function ProfileInfoTabs({ studentProfile }: ProfileInfoTabsProps) {
  const { user } = useCurrentUser()

  const formatDate = (dob: string | Date | null | undefined) => {
    if (!dob) return "নির্ধারিত নয়"
    const d = new Date(dob)
    return isNaN(d.getTime()) ? "নির্ধারিত নয়" : d.toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-5 sm:p-6 shadow-sm">
      <Tabs defaultValue="personal" className="w-full space-y-6">
        {/* Tab Headers */}
        <TabsList className="grid w-full grid-cols-3 h-12 rounded-xl bg-surface-container-low p-1 text-on-surface-variant">
          <TabsTrigger
            value="personal"
            className="flex items-center justify-center gap-2 rounded-lg font-bold text-xs sm:text-sm data-[state=active]:bg-surface-bright data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">ব্যক্তিগত ও শিক্ষা</span>
            <span className="sm:hidden">শিক্ষা</span>
          </TabsTrigger>

          <TabsTrigger
            value="guardian"
            className="flex items-center justify-center gap-2 rounded-lg font-bold text-xs sm:text-sm data-[state=active]:bg-surface-bright data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            <Users className="h-4 w-4" />
            <span>অভিভাবক</span>
          </TabsTrigger>

          <TabsTrigger
            value="contact"
            className="flex items-center justify-center gap-2 rounded-lg font-bold text-xs sm:text-sm data-[state=active]:bg-surface-bright data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">যোগাযোগ ও ঠিকানা</span>
            <span className="sm:hidden">ঠিকানা</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Personal & Academic Info */}
        <TabsContent value="personal" className="space-y-6">
          <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            ব্যক্তিগত ও শিক্ষা সংক্রান্ত তথ্য
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="শিক্ষার্থী নাম (বাংলা)" value={studentProfile?.nameBn || "নির্ধারিত নয়"} />
            <InfoItem label="শিক্ষার্থী নাম (ইংরেজি)" value={studentProfile?.name || user?.name || "নির্ধারিত নয়"} />
            <InfoItem label="শিক্ষার্থী আইডি" value={studentProfile?.studentId ? `#${studentProfile.studentId}` : "নির্ধারিত নয়"} />
            <InfoItem label="শ্রেণী" value={studentProfile?.academicClass?.nameBn || "নির্ধারিত নয়"} />
            <InfoItem label="শিক্ষাবর্ষ (Session)" value={studentProfile?.session || "নির্ধারিত নয়"} />
            <InfoItem label="বিভাগ (Group)" value={studentProfile?.group || "নির্ধারিত নয়"} />
            <InfoItem label="শাখা (Section)" value={studentProfile?.section || "নির্ধারিত নয়"} />
            <InfoItem label="শিফ্ট (Shift)" value={studentProfile?.shift || "নির্ধারিত নয়"} />
            <InfoItem label="রোল নম্বর" value={studentProfile?.roll ? String(studentProfile.roll) : "নির্ধারিত নয়"} />
            <InfoItem label="লিঙ্গ (Gender)" value={studentProfile?.gender || "নির্ধারিত নয়"} />
            <InfoItem label="জন্ম তারিখ" value={formatDate(studentProfile?.dob)} />
            <InfoItem label="জাতীয়তা" value={studentProfile?.nationality || "বাংলাদেশী"} />
            <InfoItem label="ধর্ম" value={studentProfile?.religion || "নির্ধারিত নয়"} />
          </div>
        </TabsContent>

        {/* Tab 2: Guardian Info */}
        <TabsContent value="guardian" className="space-y-6">
          <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            পিতা-মাতা ও অভিভাবকের তথ্য
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="পিতার নাম" value={studentProfile?.fName || "নির্ধারিত নয়"} />
            <InfoItem label="পিতার মোবাইল নম্বর" value={studentProfile?.fPhone || "নির্ধারিত নয়"} />
            <InfoItem label="মাতার নাম" value={studentProfile?.mName || "নির্ধারিত নয়"} />
            <InfoItem label="মাতার মোবাইল নম্বর" value={studentProfile?.mPhone || "নির্ধারিত নয়"} />
          </div>
        </TabsContent>

        {/* Tab 3: Contact & Address Info */}
        <TabsContent value="contact" className="space-y-6">
          <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            যোগাযোগের মাধ্যম ও ঠিকানা
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="অ্যাকাউন্ট ইমেইল" value={user?.email || "নির্ধারিত নয়"} />
            <InfoItem label="মোবাইল নম্বর" value={user?.phoneNumber || "নির্ধারিত নয়"} />
            <InfoItem label="বর্তমান ঠিকানা" value={studentProfile?.presentAddress || "নির্ধারিত নয়"} className="md:col-span-2" />
            <InfoItem label="স্থায়ী ঠিকানা" value={studentProfile?.permanentAddress || "নির্ধারিত নয়"} className="md:col-span-2" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InfoItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-2xl bg-surface-container-low border border-outline-variant/20 p-4 space-y-1 ${className}`}>
      <span className="text-xs font-semibold text-on-surface-variant block">{label}</span>
      <p className="font-bold text-base text-on-surface leading-snug">{value}</p>
    </div>
  )
}
