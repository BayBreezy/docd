export interface DocSearchSection {
  id: string;
  title: string;
  titles: string[];
  level: number;
  content: string;
}

const SEARCH_SECTION_IGNORED_TAGS = ["code", "pre"];
const DEFAULT_SEARCH_COLLECTIONS = ["docs"];

/**
 * Names of the collections included in search, from `docd.search.collections`.
 * Falls back to the docs collection when none are configured.
 */
export function useDocSearchCollections() {
  const appConfig = useAppConfig();

  return computed(() => {
    const configured = (appConfig.docd as { search?: { collections?: unknown } } | undefined)
      ?.search?.collections;
    const names = Array.isArray(configured)
      ? configured.filter((name): name is string => typeof name === "string" && !!name.trim())
      : [];

    return names.length ? [...new Set(names)] : DEFAULT_SEARCH_COLLECTIONS;
  });
}

export function useDocSearchSections() {
  const collections = useDocSearchCollections();

  return useLazyAsyncData(
    "docd-search-sections",
    async () => {
      const results = await Promise.all(
        collections.value.map(async (collection) => {
          try {
            return (await queryCollectionSearchSections(collection as never, {
              ignoredTags: SEARCH_SECTION_IGNORED_TAGS,
            })) as DocSearchSection[];
          } catch {
            // A collection that does not exist in this app is skipped rather than breaking search
            if (import.meta.dev) {
              console.warn(`[docd] Search skipped unknown collection "${collection}"`);
            }
            return [];
          }
        })
      );

      return results.flat();
    },
    {
      server: false,
      default: () => [],
      watch: [collections],
    }
  );
}
