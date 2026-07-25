import { useQueryStates, parseAsString, parseAsInteger, parseAsStringEnum, parseAsBoolean } from "nuqs"

export const examGroupSortOptions = [
  "All",
  "newest",
  "oldest",
  "title_asc",
  "title_desc",
] as const
export type ExamGroupSortOption = (typeof examGroupSortOptions)[number]

export const examGroupTypeOptions = [
  "All",
  "MODEL_TEST",
  "TERM_EXAM",
  "WEEKLY_SERIES",
  "SUBJECT_COMBO",
] as const
export type ExamGroupTypeOption = (typeof examGroupTypeOptions)[number]

export const calculationTypeOptions = [
  "All",
  "SUM",
  "AVERAGE",
  "WEIGHTED_AVERAGE",
  "BEST_OF_N",
] as const
export type CalculationTypeOption = (typeof calculationTypeOptions)[number]

export const examGroupSearchParamsParsers = {
  query: parseAsString.withDefault(""),
  type: parseAsString.withDefault("All"),
  calculationType: parseAsString.withDefault("All"),
  academicClassId: parseAsString.withDefault("All"),
  isPublished: parseAsString.withDefault("All"),
  sort: parseAsStringEnum<ExamGroupSortOption>(Array.from(examGroupSortOptions)).withDefault("All"),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

export function useExamGroupSearchParams() {
  return useQueryStates(examGroupSearchParamsParsers, {
    shallow: true,
  })
}
