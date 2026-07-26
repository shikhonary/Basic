"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
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
import { useAcademicClassesForSelection, useUpdateStudentProfile } from "../services/use-profile"
import { ProfileImageUploader } from "./profile-image-uploader"
import { AlertCircle, CheckCircle2, Save, User, GraduationCap, Phone, MapPin } from "lucide-react"

interface ProfileEditFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentProfile: any
}

export function ProfileEditForm({ open, onOpenChange, studentProfile }: ProfileEditFormProps) {
  const { data: classesData, isLoading: isLoadingClasses } = useAcademicClassesForSelection()
  const updateProfileMutation = useUpdateStudentProfile()

  const [formData, setFormData] = useState({
    name: "",
    nameBn: "",
    studentId: "",
    mPhone: "",
    academicClassId: "",
    session: "",
    section: "",
    shift: "",
    group: "",
    roll: "",
    fName: "",
    mName: "",
    fPhone: "",
    gender: "",
    dob: "",
    nationality: "বাংলাদেশী",
    religion: "",
    presentAddress: "",
    permanentAddress: "",
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (studentProfile) {
      setFormData({
        name: studentProfile.name || "",
        nameBn: studentProfile.nameBn || "",
        studentId: studentProfile.studentId ? String(studentProfile.studentId) : "",
        mPhone: studentProfile.mPhone || "",
        academicClassId: studentProfile.academicClassId || "",
        session: studentProfile.session || "",
        section: studentProfile.section || "",
        shift: studentProfile.shift || "",
        group: studentProfile.group || "",
        roll: studentProfile.roll ? String(studentProfile.roll) : "",
        fName: studentProfile.fName || "",
        mName: studentProfile.mName || "",
        fPhone: studentProfile.fPhone || "",
        gender: studentProfile.gender || "",
        dob: studentProfile.dob ? (new Date(studentProfile.dob).toISOString().split("T")[0] || "") : "",
        nationality: studentProfile.nationality || "বাংলাদেশী",
        religion: studentProfile.religion || "",
        presentAddress: studentProfile.presentAddress || "",
        permanentAddress: studentProfile.permanentAddress || "",
      })
    }
  }, [studentProfile, open])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!formData.nameBn.trim()) {
      setError("বাংলায় নাম প্রদান করা আবশ্যক।")
      return
    }

    if (!formData.academicClassId) {
      setError("শ্রেণী নির্বাচন করা আবশ্যক।")
      return
    }

    try {
      const payload: any = {
        name: formData.name.trim(),
        nameBn: formData.nameBn.trim(),
        studentId: formData.studentId ? Number(formData.studentId) : Math.floor(100000 + Math.random() * 900000),
        mPhone: formData.mPhone.trim() || "01700000000",
        academicClassId: formData.academicClassId,
        session: formData.session.trim() || undefined,
        section: formData.section.trim() || undefined,
        shift: formData.shift.trim() || undefined,
        group: formData.group.trim() || undefined,
        roll: formData.roll ? Number(formData.roll) : undefined,
        fName: formData.fName.trim() || undefined,
        mName: formData.mName.trim() || undefined,
        fPhone: formData.fPhone.trim() || undefined,
        gender: formData.gender || undefined,
        dob: formData.dob || undefined,
        nationality: formData.nationality.trim() || "বাংলাদেশী",
        religion: formData.religion || undefined,
        presentAddress: formData.presentAddress.trim() || undefined,
        permanentAddress: formData.permanentAddress.trim() || undefined,
      }

      await updateProfileMutation.mutateAsync(payload)
      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
        onOpenChange(false)
      }, 1000)
    } catch (err: any) {
      setError(err?.message ?? "তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।")
    }
  }

  const classOptions = Array.isArray(classesData) ? classesData : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-surface text-on-surface border-outline-variant rounded-3xl">
        <DialogHeader className="space-y-1 pb-4 border-b border-outline-variant">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            শিক্ষার্থী তথ্য সম্পাদনা
          </DialogTitle>
          <DialogDescription className="text-xs text-on-surface-variant">
            আপনার ব্যক্তিগত, শিক্ষা ও অভিভাবকের তথ্য আপডেট করুন
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>তথ্য সফলভাবে সংরক্ষিত হয়েছে!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* SECTION 1: Personal Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                <User className="h-4 w-4" />
                ব্যক্তিগত পরিচয়
              </h4>
              <div className="scale-90 origin-right">
                <ProfileImageUploader
                  imageUrl={studentProfile?.imageUrl}
                  name={studentProfile?.nameBn || studentProfile?.name}
                  size="sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold">নাম (বাংলায়) *</Label>
                <Input
                  value={formData.nameBn}
                  onChange={(e) => handleChange("nameBn", e.target.value)}
                  placeholder="যেমন: রাফি আহমেদ"
                  required
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">নাম (ইংরেজি)</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Rafi Ahmed"
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">লিঙ্গ (Gender)</Label>
                <Select value={formData.gender} onValueChange={(val) => handleChange("gender", val)}>
                  <SelectTrigger className="h-11 mt-1">
                    <SelectValue placeholder="লিঙ্গ নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">পুরুষ (Male)</SelectItem>
                    <SelectItem value="Female">মহিলা (Female)</SelectItem>
                    <SelectItem value="Other">অন্যান্য (Other)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">জন্ম তারিখ</Label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">জাতীয়তা</Label>
                <Input
                  value={formData.nationality}
                  onChange={(e) => handleChange("nationality", e.target.value)}
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">ধর্ম</Label>
                <Input
                  value={formData.religion}
                  onChange={(e) => handleChange("religion", e.target.value)}
                  placeholder="যেমন: ইসলাম / হিন্দু"
                  className="h-11 mt-1"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Academic Info */}
          <div className="space-y-4 border-t pt-4 border-outline-variant/40">
            <h4 className="text-sm font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <GraduationCap className="h-4 w-4" />
              শিক্ষা সংক্রান্ত তথ্য
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold">শ্রেণী (Class) *</Label>
                <Select
                  value={formData.academicClassId}
                  onValueChange={(val) => handleChange("academicClassId", val)}
                >
                  <SelectTrigger className="h-11 mt-1">
                    <SelectValue placeholder="শ্রেণী নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nameBn || c.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">শিক্ষার্থী আইডি (Student ID)</Label>
                <Input
                  type="number"
                  value={formData.studentId}
                  onChange={(e) => handleChange("studentId", e.target.value)}
                  placeholder="যেমন: 100234"
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">বিভাগ (Group)</Label>
                <Select value={formData.group} onValueChange={(val) => handleChange("group", val)}>
                  <SelectTrigger className="h-11 mt-1">
                    <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="বিজ্ঞান">বিজ্ঞান (Science)</SelectItem>
                    <SelectItem value="মানবিক">মানবিক (Humanities)</SelectItem>
                    <SelectItem value="ব্যবসায় শিক্ষা">ব্যবসায় শিক্ষা (Commerce)</SelectItem>
                    <SelectItem value="সাধারণ">সাধারণ (General)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">শিক্ষাবর্ষ (Session)</Label>
                <Input
                  value={formData.session}
                  onChange={(e) => handleChange("session", e.target.value)}
                  placeholder="যেমন: 2025-2026"
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">শাখা (Section)</Label>
                <Input
                  value={formData.section}
                  onChange={(e) => handleChange("section", e.target.value)}
                  placeholder="যেমন: A / B / Padma"
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">শিফ্ট (Shift)</Label>
                <Input
                  value={formData.shift}
                  onChange={(e) => handleChange("shift", e.target.value)}
                  placeholder="যেমন: প্রভাতী / দিবা"
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">রোল নম্বর</Label>
                <Input
                  type="number"
                  value={formData.roll}
                  onChange={(e) => handleChange("roll", e.target.value)}
                  placeholder="যেমন: 15"
                  className="h-11 mt-1"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Parents & Contact Info */}
          <div className="space-y-4 border-t pt-4 border-outline-variant/40">
            <h4 className="text-sm font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <Phone className="h-4 w-4" />
              অভিভাবক ও যোগাযোগ
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold">পিতার নাম</Label>
                <Input
                  value={formData.fName}
                  onChange={(e) => handleChange("fName", e.target.value)}
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">পিতার মোবাইল নম্বর</Label>
                <Input
                  value={formData.fPhone}
                  onChange={(e) => handleChange("fPhone", e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">মাতার নাম</Label>
                <Input
                  value={formData.mName}
                  onChange={(e) => handleChange("mName", e.target.value)}
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">মাতার মোবাইল নম্বর</Label>
                <Input
                  value={formData.mPhone}
                  onChange={(e) => handleChange("mPhone", e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="h-11 mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold">বর্তমান ঠিকানা</Label>
                <Input
                  value={formData.presentAddress}
                  onChange={(e) => handleChange("presentAddress", e.target.value)}
                  placeholder="বাসা, সড়ক, থানা, জেলা"
                  className="h-11 mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold">স্থায়ী ঠিকানা</Label>
                <Input
                  value={formData.permanentAddress}
                  onChange={(e) => handleChange("permanentAddress", e.target.value)}
                  placeholder="গ্রাম/মহল্লা, ডাকঘর, থানা, জেলা"
                  className="h-11 mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateProfileMutation.isPending}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white gap-2 font-bold px-6"
              disabled={updateProfileMutation.isPending}
            >
              <Save className="h-4 w-4" />
              <span>{updateProfileMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "তথ্য সংরক্ষণ করুন"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
