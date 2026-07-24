import { useQueryStates, parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs"

export const chapterSortOptions = [
  "All",
  "position_asc",
  "position_desc",
  "name_asc",
  "name_desc",
  "newest",
  "oldest",
] as const
export type ChapterSortOption = (typeof chapterSortOptions)[number]

export const chapterSearchParamsParsers = {
  query: parseAsString.withDefault(""),
  subjectId: parseAsString.withDefault("All"),
  sort: parseAsStringEnum<ChapterSortOption>(Array.from(chapterSortOptions)).withDefault("All"),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

export function useChapterSearchParams() {
  return useQueryStates(chapterSearchParamsParsers, {
    shallow: true,
  })
}
