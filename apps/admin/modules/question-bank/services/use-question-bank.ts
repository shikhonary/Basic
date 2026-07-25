import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import type {
  GetQuestionBankMcqInput,
  ListQuestionBankInput,
  QuestionBankByChapterInput,
  QuestionBankStatsInput,
} from "@workspace/api"

/**
 * Hook to list active MCQs in the question bank with filtering & pagination.
 */
export function useQuestionBankList(
  input: ListQuestionBankInput = { limit: 20 },
) {
  return useQuery(trpc.questionBank.list.queryOptions(input))
}

/**
 * Hook to fetch aggregate statistics for the question bank.
 * Optionally scoped to a subject or chapter.
 */
export function useQuestionBankStats(input?: QuestionBankStatsInput) {
  return useQuery(trpc.questionBank.stats.queryOptions(input))
}

/**
 * Hook to fetch a single active MCQ by ID (full detail view).
 */
export function useQuestionBankById(id: string, enabled = true) {
  return useQuery({
    ...trpc.questionBank.byId.queryOptions({ id } as GetQuestionBankMcqInput),
    enabled: Boolean(id) && enabled,
  })
}

/**
 * Hook to fetch MCQ counts grouped by chapter for a given subject.
 * Used in the chapter drill-down sidebar.
 */
export function useQuestionBankByChapter(
  input: QuestionBankByChapterInput,
  enabled = true,
) {
  return useQuery({
    ...trpc.questionBank.byChapter.queryOptions(input),
    enabled: Boolean(input.subjectId) && enabled,
  })
}
