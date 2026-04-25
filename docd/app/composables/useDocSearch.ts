export interface DocSearchSection {
  id: string;
  title: string;
  titles: string[];
  level: number;
  content: string;
}

const SEARCH_SECTION_IGNORED_TAGS = ["code", "pre"];

export function useDocSearchSections() {
  return useLazyAsyncData(
    "docd-search-sections",
    () =>
      queryCollectionSearchSections("docs" as never, {
        ignoredTags: SEARCH_SECTION_IGNORED_TAGS,
      }) as Promise<DocSearchSection[]>,
    {
      server: false,
      default: () => [],
    }
  );
}
