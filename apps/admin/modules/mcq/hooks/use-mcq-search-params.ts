import { useQueryStates, parseAsString, parseAsInteger, parseAsStringEnum, parseAsBoolean } from "nuqs"

export const mcqSortOptions = [
  "All",
  "newest",
  "oldest",
  "question_asc",
  "question_desc",
] as const
export type McqSortOption = (typeof mcqSortOptions)[number]

export const mcqSearchParamsParsers = {
  query: parseAsString.withDefault(""),
  subjectId: parseAsString.withDefault("All"),
  chapterId: parseAsString.withDefault("All"),
  type: parseAsString.withDefault("All"),
  isMath: parseAsString.withDefault("All"), // "All" | "true" | "false"
  isActive: parseAsString.withDefault("All"), // "All" | "true" | "false"
  sort: parseAsStringEnum<McqSortOption>(Array.from(mcqSortOptions)).withDefault("All"),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

export function useMcqSearchParams() {
  return useQueryStates(mcqSearchParamsParsers, {
    shallow: true,
  })
}
