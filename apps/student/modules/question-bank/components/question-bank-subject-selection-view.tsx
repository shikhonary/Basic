"use client"

import React, { useState, useMemo } from "react"
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
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { trpc } from "@/trpc/client"

export interface SubjectCardItem {
  id: string
  nameBn: string
  nameEn: string
  group?: string
  questionCount: string
  icon: React.ComponentType<{ className?: string }>
  accentColor: string
  watermarkColor: string
  iconBgColor: string
  buttonVariant: "default" | "outline"
  isPrimaryCard?: boolean
}

function toBengaliNumerals(numStr: string | number): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
  return numStr
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)] ?? digit)
}

/**
 * Intelligently resolves contextual icon and theme colors based on subject names in English or Bengali.
 */
function resolveSubjectIconAndTheme(nameEn: string, nameBn: string = ""): {
  icon: React.ComponentType<{ className?: string }>
  accentColor: string
  watermarkColor: string
  iconBgColor: string
} {
  const text = `${nameEn} ${nameBn}`.toLowerCase()

  if (text.includes("physic") || text.includes("পদার্থ")) {
    return {
      icon: Atom,
      accentColor: "text-primary",
      watermarkColor: "text-primary",
      iconBgColor: "bg-surface-container-low text-primary",
    }
  }
  if (text.includes("chem") || text.includes("রসায়ন") || text.includes("রসায়ন")) {
    return {
      icon: FlaskConical,
      accentColor: "text-secondary",
      watermarkColor: "text-secondary",
      iconBgColor: "bg-surface-container-low text-secondary",
    }
  }
  if (
    text.includes("math") ||
    text.includes("গণিত") ||
    text.includes("algebra") ||
    text.includes("calculus") ||
    text.includes("জ্যামিতি")
  ) {
    return {
      icon: Calculator,
      accentColor: "text-tertiary",
      watermarkColor: "text-tertiary",
      iconBgColor: "bg-surface-container-low text-tertiary",
    }
  }
  if (text.includes("bio") || text.includes("জীব") || text.includes("botany") || text.includes("zoology")) {
    return {
      icon: Dna,
      accentColor: "text-[#15803d]",
      watermarkColor: "text-[#15803d]",
      iconBgColor: "bg-surface-container-low text-[#15803d]",
    }
  }
  if (text.includes("english") || text.includes("ইংরেজি")) {
    return {
      icon: Languages,
      accentColor: "text-[#b91c1c]",
      watermarkColor: "text-[#b91c1c]",
      iconBgColor: "bg-surface-container-low text-[#b91c1c]",
    }
  }
  if (text.includes("bangla") || text.includes("bengali") || text.includes("বাংলা") || text.includes("সাহিত্য")) {
    return {
      icon: BookOpen,
      accentColor: "text-[#c2410c]",
      watermarkColor: "text-[#c2410c]",
      iconBgColor: "bg-surface-container-low text-[#c2410c]",
    }
  }
  if (
    text.includes("ict") ||
    text.includes("computer") ||
    text.includes("কম্পিউটার") ||
    text.includes("তথ্য") ||
    text.includes("প্রযুক্তি")
  ) {
    return {
      icon: Laptop,
      accentColor: "text-[#0284c7]",
      watermarkColor: "text-[#0284c7]",
      iconBgColor: "bg-surface-container-low text-[#0284c7]",
    }
  }
  if (
    text.includes("account") ||
    text.includes("finance") ||
    text.includes("হিসাব") ||
    text.includes("ব্যবসায়") ||
    text.includes("ব্যবসা") ||
    text.includes("অর্থনীতি")
  ) {
    return {
      icon: Landmark,
      accentColor: "text-[#0d9488]",
      watermarkColor: "text-[#0d9488]",
      iconBgColor: "bg-surface-container-low text-[#0d9488]",
    }
  }
  if (
    text.includes("history") ||
    text.includes("ইতিহাস") ||
    text.includes("islam") ||
    text.includes("ইসলাম") ||
    text.includes("পৌরনীতি") ||
    text.includes("সমাজ")
  ) {
    return {
      icon: Globe,
      accentColor: "text-[#7c3aed]",
      watermarkColor: "text-[#7c3aed]",
      iconBgColor: "bg-surface-container-low text-[#7c3aed]",
    }
  }

  return {
    icon: GraduationCap,
    accentColor: "text-primary",
    watermarkColor: "text-primary",
    iconBgColor: "bg-surface-container-low text-primary",
  }
}

const DEFAULT_SUBJECTS: SubjectCardItem[] = [
  {
    id: "physics",
    nameBn: "পদার্থবিজ্ঞান",
    nameEn: "Physics",
    group: "Science",
    questionCount: "০ টি বহুনির্বাচনী প্রশ্ন",
    ...resolveSubjectIconAndTheme("Physics", "পদার্থবিজ্ঞান"),
    buttonVariant: "default",
    isPrimaryCard: true,
  },
  {
    id: "chemistry",
    nameBn: "রসায়ন",
    nameEn: "Chemistry",
    group: "Science",
    questionCount: "০ টি বহুনির্বাচনী প্রশ্ন",
    ...resolveSubjectIconAndTheme("Chemistry", "রসায়ন"),
    buttonVariant: "outline",
    isPrimaryCard: false,
  },
  {
    id: "math",
    nameBn: "উচ্চতর গণিত",
    nameEn: "Higher Math",
    group: "Science",
    questionCount: "০ টি বহুনির্বাচনী প্রশ্ন",
    ...resolveSubjectIconAndTheme("Higher Math", "উচ্চতর গণিত"),
    buttonVariant: "outline",
    isPrimaryCard: false,
  },
  {
    id: "biology",
    nameBn: "জীববিজ্ঞান",
    nameEn: "Biology",
    group: "Science",
    questionCount: "০ টি বহুনির্বাচনী প্রশ্ন",
    ...resolveSubjectIconAndTheme("Biology", "জীববিজ্ঞান"),
    buttonVariant: "outline",
    isPrimaryCard: false,
  },
  {
    id: "english",
    nameBn: "ইংরেজি",
    nameEn: "English",
    group: "General",
    questionCount: "০ টি বহুনির্বাচনী প্রশ্ন",
    ...resolveSubjectIconAndTheme("English", "ইংরেজি"),
    buttonVariant: "outline",
    isPrimaryCard: false,
  },
]

export function QuestionBankSubjectSelectionView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")

  const statsQuery = useQuery(trpc.questionBank.stats.queryOptions(undefined))
  const subjectsQuery = useQuery(
    trpc.subject.list.queryOptions({
      page: 1,
      limit: 50,
      query: searchQuery || undefined,
      group: selectedGroup !== "all" ? selectedGroup : undefined,
    })
  )

  const statsData = statsQuery.data
  const dbSubjects = subjectsQuery.data

  // Merge dynamic subject stats with contextual icon resolving
  const displaySubjects = useMemo<SubjectCardItem[]>(() => {
    let sourceList: SubjectCardItem[]

    if (!dbSubjects?.items || dbSubjects.items.length === 0) {
      sourceList = statsData?.subjectCounts
        ? DEFAULT_SUBJECTS.map((sub) => {
          const rawCount = statsData.subjectCounts[sub.id] ?? 0
          return {
            ...sub,
            questionCount: `${toBengaliNumerals(rawCount.toLocaleString())} টি বহুনির্বাচনী প্রশ্ন`,
          }
        })
        : DEFAULT_SUBJECTS
    } else {
      sourceList = dbSubjects.items.map(
        (
          sub: { id: string; name: string; nameBn?: string; group?: string | null },
          index: number
        ) => {
          const matchedDefault = DEFAULT_SUBJECTS.find(
            (d) =>
              d.nameEn.toLowerCase() === sub.name.toLowerCase() ||
              (sub.nameBn && d.nameBn === sub.nameBn)
          )

          const rawCount = statsData?.subjectCounts?.[sub.id] ?? 0
          const count = `${toBengaliNumerals(rawCount.toLocaleString())} টি বহুনির্বাচনী প্রশ্ন`

          const theme = resolveSubjectIconAndTheme(sub.name, sub.nameBn || "")

          return {
            id: sub.id,
            nameBn: sub.nameBn || matchedDefault?.nameBn || sub.name,
            nameEn: sub.name || matchedDefault?.nameEn || "",
            group: sub.group || matchedDefault?.group,
            questionCount: count,
            icon: theme.icon,
            accentColor: theme.accentColor,
            watermarkColor: theme.watermarkColor,
            iconBgColor: theme.iconBgColor,
            buttonVariant: index === 0 ? "default" : "outline",
            isPrimaryCard: index === 0,
          }
        }
      )
    }

    // Client-side search and group filtering matching create-subject-view values
    return sourceList.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesGroup =
        selectedGroup === "all" ||
        (item.group && item.group.toLowerCase() === selectedGroup.toLowerCase())

      return matchesSearch && matchesGroup
    })
  }, [dbSubjects, statsData, searchQuery, selectedGroup])

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedGroup("all")
  }

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-12 py-8 md:py-12 bg-background min-h-screen">
      {/* Breadcrumbs with Bengali labels */}
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
            <BreadcrumbPage className="text-on-background font-medium">
              প্রশ্নব্যাংক
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <header className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-2 font-extrabold tracking-tight">
          বিষয় নির্বাচন
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          আপনার কাঙ্ক্ষিত বিষয়টি নির্বাচন করে অধ্যায়ভিত্তিক বহুনির্বাচনী প্রশ্ন ও ব্যাখ্যাসহ সমাধান নিয়ে পরীক্ষার পূর্ণাঙ্গ প্রস্তুতি শুরু করুন।
        </p>
      </header>

      {/* Filter and Search Bar */}
      <div className="sticky top-16 z-30 mb-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-surface-container-lowest/95 backdrop-blur-md p-4 rounded-xl border border-outline-variant/40 shadow-xs">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <Input
            type="text"
            placeholder="বিষয় দিয়ে খুঁজুন (যেমন: পদার্থবিজ্ঞান, English)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-10 bg-surface-container-low/50 border border-outline-variant/30 rounded-lg text-sm placeholder:text-on-surface-variant/60 focus-visible:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-0.5 rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Group Filter Dropdown matching create-subject-view values */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-on-surface-variant shrink-0" />
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full sm:w-[200px] h-10 bg-surface-container-low/50 border border-outline-variant/30 rounded-lg text-sm px-3">
              <SelectValue placeholder="সকল বিভাগ" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-md">
              <SelectItem value="all">সকল বিভাগ (All Groups)</SelectItem>
              <SelectItem value="Science">বিজ্ঞান (Science)</SelectItem>
              <SelectItem value="Commerce">ব্যবসায় শিক্ষা (Commerce)</SelectItem>
              <SelectItem value="Humanities">মানবিক (Humanities)</SelectItem>
              <SelectItem value="General">সাধারণ (General)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subject Cards Grid Layout */}
      {displaySubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySubjects.map((subject: SubjectCardItem) => {
            const IconComponent = subject.icon

            return (
              <Card
                key={subject.id}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 flex flex-col hover:shadow-lg transition-all duration-300 relative overflow-hidden group border-solid"
              >
                {/* Background Watermark Icon */}
                <div
                  className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${subject.watermarkColor}`}
                >
                  <IconComponent className="w-28 h-28" />
                </div>

                {/* Main Card Content */}
                <div className="relative z-10 flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${subject.iconBgColor}`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-background mb-1 font-bold">
                    {subject.nameBn}
                  </h2>
                  {subject.nameEn && (
                    <p className="text-xs text-on-surface-variant/80 mb-2 font-medium">
                      {subject.nameEn}
                    </p>
                  )}
                  {/* Question Type & Count Badge with Icon */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-sm text-on-surface mb-6">
                    <HelpCircle className="h-3.5 w-3.5 text-on-surface-variant shrink-0" />
                    <Badge
                      variant="outline"
                      className="border-0 bg-transparent p-0 text-on-surface font-medium text-xs normal-case tracking-normal"
                    >
                      {subject.questionCount}
                    </Badge>
                  </div>
                </div>

                {/* Action Button: Mobile default bg-primary-container, Desktop hover bg-primary-container */}
                <div className="relative z-10 mt-auto pt-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full py-3 h-auto rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-2 normal-case tracking-normal transition-all duration-200 bg-primary-container text-white border-transparent hover:bg-primary-container/90 md:bg-transparent md:border md:border-outline md:text-on-surface md:hover:bg-primary-container md:hover:text-white md:hover:border-transparent"
                  >
                    <Link href={`/question-bank/${subject.id}`}>
                      অনুশীলন শুরু করুন
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Empty Filter State */
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[240px]">
          <Search className="h-12 w-12 text-on-surface-variant/40 mb-4" />
          <h3 className="text-lg font-bold text-on-background mb-1">
            কোন বিষয় পাওয়া যায়নি
          </h3>
          <p className="text-sm text-on-surface-variant mb-6 max-w-sm">
            আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোনো বিষয় খুঁজে পাওয়া যায়নি।
          </p>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            ফিল্টার রিসেট করুন
          </Button>
        </div>
      )}
    </div>
  )
}
