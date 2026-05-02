import type { Collections, ContentNavigationItem, PageCollectionItemBase } from "@nuxt/content";
import { findPageHeadline } from "@nuxt/content/utils";
import { kebabCase } from "lodash-es";

export const useSearchModal = () => useState("docSearchModal", () => false);

export const useDocPage = async () => {
  const route = useRoute();
  const isLandingRoute = route.path === "/";

  const [{ data: page }, { data: surround }, { data: navigation }] = await Promise.all([
    useAsyncData<PageCollectionItemBase | null>(
      kebabCase(route.path) || "root",
      () =>
        isLandingRoute
          ? (queryCollection("landing" as keyof Collections)
              .path(route.path)
              .first() as Promise<PageCollectionItemBase | null>)
          : (queryCollection("docs" as keyof Collections)
              .path(route.path)
              .first() as Promise<PageCollectionItemBase | null>),
      { watch: [() => route.path] }
    ),
    useAsyncData(
      `${kebabCase(route.path) || "root"}-surround`,
      () => {
        if (isLandingRoute) {
          return Promise.resolve(null);
        }

        return queryCollectionItemSurroundings("docs" as keyof Collections, route.path, {
          fields: ["title", "description", "path"],
        }).where("path", "NOT LIKE", "%/.navigation");
      },
      { watch: [() => route.path] }
    ),
    useAsyncData(
      () => `navigation_docs`,
      () => queryCollectionNavigation("docs" as keyof Collections, ["label", "target"]),
      {
        watch: [() => route.path],
        transform: (data: ContentNavigationItem[]) =>
          data.find((item) => item.path === "/docs")?.children || data,
      }
    ),
  ]);

  /**
   * The headline for the current page, derived from the navigation structure.
   */
  const headline = ref(findPageHeadline(navigation?.value, page.value?.path));
  /**
   * The breadcrumbs for the current page, derived from the navigation structure.
   */
  const breadcrumbs = computed(() =>
    findPageBreadcrumbs(navigation?.value, page.value?.path || "")
  );
  /**
   * The previous and next pages in the collection, if available.
   */
  const prev = computed(() => surround.value?.[0]);
  /** The next page in the collection, if available. */
  const next = computed(() => surround.value?.[1]);

  return { page, surround, navigation, headline, breadcrumbs, prev, next };
};
