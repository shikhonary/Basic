"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "@workspace/ui/components/sonner"
import { useCreateSubject } from "../services/use-subject"
import { useAcademicClassesForSelection } from "@/modules/academic-class/services/use-academic-class"
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { BookOpen } from "lucide-react"

const createSubjectSchema = z.object({
  name: z.string().min(1, "English name is required"),
  nameBn: z.string().min(1, "Bengali name is required"),
  level: z.string().min(1, "Please select an academic level"),
  group: z.string().min(1, "Please select a group"),
  position: z.coerce.number().int().min(0, "Position must be 0 or greater"),
  academicClassIds: z.array(z.string()),
})

type CreateSubjectFormData = z.infer<typeof createSubjectSchema>

export function CreateSubjectView() {
  const router = useRouter()
  const createMutation = useCreateSubject()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<CreateSubjectFormData>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      name: "",
      nameBn: "",
      level: "",
      group: "General",
      position: 0,
      academicClassIds: [],
    },
  })

  const selectedLevel = watch("level")
  const selectedClassIds = watch("academicClassIds") || []

  // Fetch available academic classes for mapping
  const { data: availableClasses = [] } = useAcademicClassesForSelection(
    selectedLevel && selectedLevel !== "" ? selectedLevel : undefined
  )

  const isSubmitting = createMutation.isPending || isFormSubmitting

  const toggleAcademicClass = (classId: string) => {
    if (selectedClassIds.includes(classId)) {
      setValue(
        "academicClassIds",
        selectedClassIds.filter((id) => id !== classId)
      )
    } else {
      setValue("academicClassIds", [...selectedClassIds, classId])
    }
  }

  const onSubmit = async (data: CreateSubjectFormData) => {
    setErrorMessage(null)

    try {
      await createMutation.mutateAsync({
        name: data.name.trim(),
        nameBn: data.nameBn.trim(),
        level: data.level,
        group: data.group.trim(),
        position: Number(data.position) || 0,
        academicClassIds: data.academicClassIds,
      })

      toast.success("Subject created successfully.")
      setTimeout(() => {
        router.push("/subjects")
      }, 1000)
    } catch (err: any) {
      const msg = err.message || "Failed to create subject"
      setErrorMessage(msg)
      toast.error(msg)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Header Section */}
      <div className="mb-6 sm:mb-10 flex flex-col gap-4 md:flex-row md:items-end justify-between">
        <div className="max-w-2xl">
          <nav className="mb-3 flex items-center space-x-2 text-on-surface-variant">
            <Link
              href="/subjects"
              className="font-label-sm text-xs hover:text-primary transition-colors cursor-pointer"
            >
              Subjects
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="font-label-sm text-xs font-bold text-primary">Create New</span>
          </nav>
          <h2 className="mb-1.5 font-headline-md text-2xl sm:text-3xl font-extrabold text-primary">
            New Academic Subject
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Define new subject offerings, level/group classification, and map them to target academic classes.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-error/30 bg-error-container/20 p-4 text-error">
          <span className="material-symbols-outlined text-lg">error</span>
          <span className="font-body-md text-xs sm:text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <Card className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-outline-variant bg-white p-0 shadow-xs ring-0">
        <CardHeader className="border-b border-outline-variant/40 bg-surface-container-lowest p-4 sm:p-8 flex flex-row items-center gap-3 sm:gap-4">
          <div className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <CardTitle className="font-headline-md text-base sm:text-[20px] font-extrabold text-on-surface normal-case tracking-normal">
              Subject Specifications
            </CardTitle>
            <p className="text-[11px] sm:text-xs font-body-md text-on-surface-variant mt-0.5">
              Configure subject naming conventions, levels, groups, and mappings for your institution
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-8">
          <form
            onSubmit={handleSubmit(onSubmit, (invalidErrors) => {
              console.log("[CreateSubjectView] Submit blocked by validation errors:", invalidErrors)
            })}
            className="space-y-6 sm:space-y-8"
          >
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              {/* Subject Name (English) */}
              <div className="space-y-2">
                <Label className="block font-label-sm text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                  Subject Name (English)
                </Label>
                <div className="group relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 text-base sm:text-lg">
                    abc
                  </span>
                  <Input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="e.g. Physics"
                    {...register("name")}
                    className="w-full rounded-lg border border-outline-variant py-2.5 sm:py-3 pl-10 pr-4 font-body-md text-sm text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-error">{errors.name.message}</p>
                )}
              </div>

              {/* Subject Name (Bengali) */}
              <div className="space-y-2">
                <Label className="block font-label-sm text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                  Subject Name (Bengali)
                </Label>
                <div className="group relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 text-base sm:text-lg">
                    translate
                  </span>
                  <Input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="উদাঃ পদার্থবিজ্ঞান"
                    {...register("nameBn")}
                    className="w-full rounded-lg border border-outline-variant py-2.5 sm:py-3 pl-10 pr-4 font-body-md font-bengali text-sm text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
                  />
                </div>
                {errors.nameBn && (
                  <p className="text-xs text-error">{errors.nameBn.message}</p>
                )}
              </div>

              {/* Academic Level */}
              <div className="space-y-2">
                <Label className="block font-label-sm text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                  Academic Level
                </Label>
                <Controller
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <div className="group relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 pointer-events-none text-base sm:text-lg">
                        layers
                      </span>
                      <Select
                        disabled={isSubmitting}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 sm:py-3 pl-10 pr-10 font-body-md text-sm text-on-surface transition-all cursor-pointer focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto justify-between">
                          <SelectValue placeholder="Select level..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
                          <SelectItem value="Primary">Primary</SelectItem>
                          <SelectItem value="Secondary">Secondary</SelectItem>
                          <SelectItem value="Higher Secondary (HSC)">
                            Higher Secondary (HSC)
                          </SelectItem>
                          <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="Graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.level && (
                  <p className="text-xs text-error">{errors.level.message}</p>
                )}
              </div>

              {/* Group */}
              <div className="space-y-2">
                <Label className="block font-label-sm text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                  Group / Discipline
                </Label>
                <Controller
                  name="group"
                  control={control}
                  render={({ field }) => (
                    <div className="group relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 pointer-events-none text-base sm:text-lg">
                        category
                      </span>
                      <Select
                        disabled={isSubmitting}
                        value={field.value || "General"}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-outline-variant bg-white py-2.5 sm:py-3 pl-10 pr-10 font-body-md text-sm text-on-surface transition-all cursor-pointer focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto justify-between">
                          <SelectValue placeholder="Select group..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-outline-variant shadow-md rounded-lg">
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="Commerce">Commerce / Business</SelectItem>
                          <SelectItem value="Humanities">Humanities / Arts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.group && (
                  <p className="text-xs text-error">{errors.group.message}</p>
                )}
              </div>

              {/* Position / Order */}
              <div className="space-y-2 md:col-span-2">
                <Label className="block font-label-sm text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                  Display Position
                </Label>
                <div className="group relative max-w-xs">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors z-10 text-base sm:text-lg">
                    format_list_numbered
                  </span>
                  <Input
                    type="number"
                    min="0"
                    disabled={isSubmitting}
                    {...register("position")}
                    className="w-full rounded-lg border border-outline-variant py-2.5 sm:py-3 pl-10 pr-4 font-body-md text-sm text-on-surface transition-all bg-white focus:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-hidden h-auto"
                  />
                </div>
                <p className="text-[12px] italic text-outline mt-1.5">
                  Defines display order in curriculum and subject lists
                </p>
                {errors.position && (
                  <p className="text-xs text-error">{errors.position.message}</p>
                )}
              </div>

              {/* Academic Class Mapping */}
              <div className="space-y-3 md:col-span-2 border-t border-outline-variant/40 pt-6">
                <div className="flex flex-col">
                  <Label className="block font-label-sm text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                    Map to Academic Classes
                  </Label>
                  <p className="text-xs text-outline mt-1 leading-relaxed">
                    Select academic classes that offer this subject.
                  </p>
                </div>

                {availableClasses.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 pt-2">
                    {availableClasses.map((ac) => {
                      const isSelected = selectedClassIds.includes(ac.id)
                      return (
                        <div
                          key={ac.id}
                          onClick={() => !isSubmitting && toggleAcademicClass(ac.id)}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                              : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"
                          } ${isSubmitting ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                        >
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold truncate">
                              {ac.nameEn}
                            </span>
                            <span className="text-xs text-outline font-bengali truncate">
                              {ac.nameBn}
                            </span>
                          </div>
                          <Badge
                            variant={isSelected ? "default" : "outline"}
                            className="ml-2 text-[10px] px-1.5 py-0.5"
                          >
                            {isSelected ? "Mapped" : "Add"}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-outline-variant p-4 text-center font-body-md text-xs text-outline leading-relaxed">
                    {selectedLevel
                      ? "No active academic classes found for the selected level."
                      : "Please select an Academic Level above to load associated classes."}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-outline-variant pt-6 sm:pt-8">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">history</span>
                <span className="text-[12px]">New Record</span>
              </div>
              <div className="flex flex-col-reverse sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 sm:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => router.push("/subjects")}
                  className="w-full sm:w-auto rounded-lg border border-outline-variant px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-primary transition-all active:scale-95 hover:bg-surface-container-low cursor-pointer h-auto normal-case tracking-normal disabled:opacity-50 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-lg bg-primary-container px-8 sm:px-10 py-2.5 sm:py-3 font-bold text-on-primary-container shadow-md transition-all active:scale-95 hover:bg-primary hover:text-white disabled:opacity-50 cursor-pointer h-auto normal-case tracking-normal text-sm"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin text-[18px] sm:text-[20px]">
                      progress_activity
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">save</span>
                  )}
                  <span>{isSubmitting ? "Saving..." : "Save Subject"}</span>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
