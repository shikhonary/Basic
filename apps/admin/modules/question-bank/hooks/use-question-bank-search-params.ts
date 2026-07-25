import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs"

export const questionBankSortOptions = [
  "All",
  "newest",
  "oldest",
  "question_asc",
  "question_desc",
] as const
export type QuestionBankSortOption = (typeof questionBankSortOptions)[number]

export const questionBankSearchParamsParsers = {
  query: parseAsString.withDefault(""),
  subjectId: parseAsString.withDefault("All"),
  chapterId: parseAsString.withDefault("All"),
  type: parseAsString.withDefault("All"),
  isMath: parseAsString.withDefault("All"), // "All" | "true" | "false"
  sort: parseAsStringEnum<QuestionBankSortOption>(
    Array.from(questionBankSortOptions),
  ).withDefault("All"),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(20),
}

export function useQuestionBankSearchParams() {
  return useQueryStates(questionBankSearchParamsParsers, {
    shallow: true,
  })
}
