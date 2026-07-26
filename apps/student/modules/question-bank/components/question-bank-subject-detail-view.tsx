"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  BookOpen,
  Languages,
  Laptop,
  Landmark,
  Globe,
  GraduationCap,
  ChevronRight,
  HelpCircle,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Badge } from "@workspace/ui/components/badge"
import { Card } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import { trpc } from "@/trpc/client"
import { QuestionBankMcqListView } from "./question-bank-mcq-list-view"

function toBengaliNumerals(numStr: string | number): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
  return numStr
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)] ?? digit)
}

function resolveSubjectIcon(nameEn: string = "", nameBn: string = ""): React.ComponentType<{ className?: string }> {
  const text = `${nameEn} ${nameBn}`.toLowerCase()
  if (text.includes("physic") || text.includes("পদার্থ")) return Atom
  if (text.includes("chem") || text.includes("রসায়ন") || text.includes("রসায়ন")) return FlaskConical
  if (text.includes("math") || text.includes("গণিত")) return Calculator
  if (text.includes("bio") || text.includes("জীব")) return Dna
  if (text.includes("english") || text.includes("ইংরেজি")) return Languages
  if (text.includes("bangla") || text.includes("বাংলা")) return BookOpen
  if (text.includes("ict") || text.includes("computer") || text.includes("তথ্য")) return Laptop
  if (text.includes("account") || text.includes("finance") || text.includes("হিসাব")) return Landmark
  if (text.includes("history") || text.includes("ইতিহাস") || text.includes("islam")) return Globe
  return GraduationCap
}

interface QuestionBankSubjectDetailViewProps {
  subjectId: string
}

export function QuestionBankSubjectDetailView({ subjectId }: QuestionBankSubjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState<string>("mcq")

  const subjectQuery = useQuery(
    trpc.subject.byId.queryOptions({
      id: subjectId,
    })
  )

  const statsQuery = useQuery(
    trpc.questionBank.stats.queryOptions({
      subjectId,
    })
  )

  const subject = subjectQuery.data
  const stats = statsQuery.data
  const isLoading = subjectQuery.isLoading

  const IconComponent = resolveSubjectIcon(subject?.name, subject?.nameBn)
  const totalMcqs = stats?.totalCount ?? 0

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-12 py-8 md:py-12 bg-background min-h-screen">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList className="font-label-sm text-label-sm text-on-surface-variant">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="hover:text-primary transition-colors">
                ড্যাশবোর্ড
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-3.5 w-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/question-bank" className="hover:text-primary transition-colors">
                প্রশ্নব্যাংক
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-3.5 w-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-on-background font-medium">
              {subject?.nameBn || subject?.name || "বিষয় বিবরণী"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Info Banner */}
      <header className="mb-8 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-primary">
          <IconComponent className="w-36 h-36" />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-40 rounded" />
          </div>
        ) : (
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/30 text-primary flex items-center justify-center shrink-0">
                <IconComponent className="h-7 w-7" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="font-headline-md text-2xl md:text-3xl font-extrabold text-on-background">
                    {subject?.nameBn || subject?.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {subject?.level && (
                    <Badge variant="outline" className="bg-surface-container-low text-xs border-outline-variant/40 text-on-surface">
                      {subject.level}
                    </Badge>
                  )}
                  {subject?.group && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs font-semibold">
                      {subject.group}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* MCQ Stats Summary Badge */}
            <div className="flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant/30">
              <HelpCircle className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-on-surface-variant font-medium">মোট প্রোপ্ত প্রশ্ন</p>
                <p className="text-sm font-bold text-on-background">
                  {toBengaliNumerals(totalMcqs)} টি বহুনির্বাচনী প্রশ্ন
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Tabs Navigation Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Grid/Flex Tabs without scrollbar */}
        <div className="border-b border-outline-variant/40 mb-6 w-full">
          <TabsList className="bg-surface-container-low p-1 sm:p-1.5 rounded-xl gap-1 sm:gap-2 h-auto grid grid-cols-3 w-full sm:flex sm:w-fit">
            <TabsTrigger
              value="mcq"
              className="py-2 sm:py-2.5 px-1.5 sm:px-5 rounded-lg text-xs sm:text-sm font-semibold tracking-normal normal-case data-[state=active]:bg-primary data-[state=active]:text-white transition-all cursor-pointer justify-center"
            >
              <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 shrink-0" />
              <span>
                <span className="sm:hidden">বহুনির্বাচনী</span>
                <span className="hidden sm:inline">বহুনির্বাচনী প্রশ্ন (MCQ)</span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="cq"
              className="py-2 sm:py-2.5 px-1.5 sm:px-5 rounded-lg text-xs sm:text-sm font-semibold tracking-normal normal-case data-[state=active]:bg-primary data-[state=active]:text-white transition-all cursor-pointer justify-center"
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 shrink-0" />
              <span>
                <span className="sm:hidden">সৃজনশীল</span>
                <span className="hidden sm:inline">সৃজনশীল প্রশ্ন (CQ)</span>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="short"
              className="py-2 sm:py-2.5 px-1.5 sm:px-5 rounded-lg text-xs sm:text-sm font-semibold tracking-normal normal-case data-[state=active]:bg-primary data-[state=active]:text-white transition-all cursor-pointer justify-center"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 shrink-0" />
              <span>
                <span className="sm:hidden">সংক্ষিপ্ত</span>
                <span className="hidden sm:inline">সংক্ষিপ্ত প্রশ্ন (Short Q)</span>
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* MCQ Tab Content */}
        <TabsContent value="mcq" className="focus-visible:outline-none">
          <QuestionBankMcqListView subjectId={subjectId} />
        </TabsContent>

        {/* CQ Tab Content (Coming Soon Placeholder) */}
        <TabsContent value="cq" className="focus-visible:outline-none">
          <Card className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-14 h-14 rounded-full bg-amber-100/70 text-amber-700 flex items-center justify-center mb-4">
              <Clock className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-on-background mb-2">
              সৃজনশীল প্রশ্ন (CQ) শীঘ্রই আসছে!
            </h3>
            <p className="text-sm text-on-surface-variant max-w-md mb-4 leading-relaxed">
              এই বিষয়ের জন্য সৃজনশীল প্রশ্ন ও উত্তর সংকলনের কাজ চলমান রয়েছে। খুব শীঘ্রই আপনার জন্য এটি উন্মুক্ত করা হবে।
            </p>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 px-3 py-1">
              উন্নয়নাধীন (Under Development)
            </Badge>
          </Card>
        </TabsContent>

        {/* Short Question Tab Content (Coming Soon Placeholder) */}
        <TabsContent value="short" className="focus-visible:outline-none">
          <Card className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-14 h-14 rounded-full bg-blue-100/70 text-blue-700 flex items-center justify-center mb-4">
              <Clock className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-on-background mb-2">
              সংক্ষিপ্ত প্রশ্ন (Short Questions) শীঘ্রই আসছে!
            </h3>
            <p className="text-sm text-on-surface-variant max-w-md mb-4 leading-relaxed">
              এক কথায় উত্তর ও গুরুত্বপূর্ণ সংক্ষিপ্ত প্রশ্নোত্তর সংকলন প্রস্তুত করা হচ্ছে।
            </p>
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 px-3 py-1">
              উন্নয়নাধীন (Under Development)
            </Badge>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
