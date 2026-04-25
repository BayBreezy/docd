import type { ContentNavigationItem } from "@nuxt/content";
import { joinURL, withoutTrailingSlash } from "ufo";
import type { MaybeRefOrGetter } from "vue";

export interface BreadcrumbItem {
  title: string;
  path: string;
}

/**
 * Find breadcrumb path to a page in the navigation tree
 */
export function findPageBreadcrumbs(
  navigation: ContentNavigationItem[] | undefined,
  path: string,
  currentPath: BreadcrumbItem[] = []
): BreadcrumbItem[] | undefined {
  if (!navigation) return undefined;

  for (const item of navigation) {
    const itemPath = [...currentPath, { title: item.title, path: item.path }];

    if (item.path === path) {
      return itemPath;
    }

    if (item.children) {
      const found = findPageBreadcrumbs(item.children, path, itemPath);
      if (found) return found;
    }
  }

  return undefined;
}

export interface UseSeoOptions {
  /**
   * Page title
   */
  title: MaybeRefOrGetter<string | undefined>;
  /**
   * Page description
   */
  description: MaybeRefOrGetter<string | undefined>;
  /**
   * Page type for og:type (default: 'article' for docs, 'website' for landing)
   */
  type?: MaybeRefOrGetter<"website" | "article">;
  /**
   * Custom OG image URL (absolute)
   */
  ogImage?: MaybeRefOrGetter<string | undefined>;
  /**
   * Published date for article schema
   */
  publishedAt?: MaybeRefOrGetter<string | undefined>;
  /**
   * Modified date for article schema
   */
  modifiedAt?: MaybeRefOrGetter<string | undefined>;
  /**
   * Breadcrumb items for BreadcrumbList schema
   */
  breadcrumbs?: MaybeRefOrGetter<BreadcrumbItem[] | undefined>;
  /**
   * Language for the page
   */
  lang?: MaybeRefOrGetter<string | undefined>;
}

/**
 * Composable for comprehensive SEO setup including:
 * - Meta tags (title, description, og:*, twitter:*)
 * - Canonical URLs
 * - Hreflang tags for i18n
 * - JSON-LD structured data
 */
export function useSeo(options: UseSeoOptions) {
  const route = useRoute();
  const site = useSiteConfig();
  const { logo } = useDocd();
  const title = computed(() => toValue(options.title));
  const description = computed(() => toValue(options.description));
  const type = computed(() => toValue(options.type) || "article");
  const ogImage = computed(() => toValue(options.ogImage));
  const publishedAt = computed(() => toValue(options.publishedAt));
  const modifiedAt = computed(() => toValue(options.modifiedAt));
  const breadcrumbs = computed(() => toValue(options.breadcrumbs));
  const lang = computed(() => toValue(options.lang) || site.language || "en");

  // Build canonical URL
  const canonicalUrl = computed(() => {
    if (!site.url) return undefined;
    return joinURL(site.url, route.path);
  });

  // Base URL for building other URLs
  const baseUrl = computed(() => (site.url ? withoutTrailingSlash(site.url) : ""));

  // Set meta tags
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: type,
    ogUrl: canonicalUrl,
    twitterTitle: title,
    twitterDescription: description,
    twitterCard: "summary_large_image",
  });

  // Set canonical link
  useHead({
    link: computed(() => {
      const links: Array<{ rel: string; href?: string; hreflang?: string }> = [];

      // Canonical URL
      if (canonicalUrl.value) {
        links.push({
          rel: "canonical",
          href: canonicalUrl.value,
        });
      }

      // Logo favicon as icon
      if (logo.value?.favicon) {
        links.push({
          rel: "icon",
          href: logo.value.favicon,
        });
      } else if (logo.value?.light) {
        links.push({
          rel: "icon",
          href: logo.value.light,
        });
      } else if (logo.value?.dark) {
        links.push({
          rel: "icon",
          href: logo.value.dark,
        });
      }

      return links;
    }),
  });

  // Custom OG image handling
  if (ogImage.value) {
    useSeoMeta({
      ogImage: ogImage.value,
      twitterImage: ogImage.value,
      twitterCard: "summary_large_image",
    });
  }

  // JSON-LD structured data
  useHead({
    htmlAttrs: { lang },
    script: computed(() => {
      const scripts: Array<{ type: string; innerHTML: string }> = [];

      if (!baseUrl.value || !title.value) return scripts;

      const pageUrl = joinURL(baseUrl.value, route.path);

      // Article schema for documentation pages
      if (type.value === "article") {
        const articleSchema: Record<string, unknown> = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title.value,
          description: description.value,
          url: pageUrl,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
          },
        };

        if (publishedAt.value) {
          articleSchema.datePublished = publishedAt.value;
        }

        if (modifiedAt.value) {
          articleSchema.dateModified = modifiedAt.value;
        }

        if (site.name) {
          articleSchema.publisher = {
            "@type": "Organization",
            name: site.name,
          };
        }

        scripts.push({
          type: "application/ld+json",
          innerHTML: JSON.stringify(articleSchema),
        });
      }

      // WebSite schema for landing pages
      if (type.value === "website") {
        const websiteSchema: Record<string, unknown> = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name || title.value,
          description: description.value,
          url: baseUrl.value,
        };

        scripts.push({
          type: "application/ld+json",
          innerHTML: JSON.stringify(websiteSchema),
        });
      }

      // BreadcrumbList schema for navigation
      if (breadcrumbs.value && breadcrumbs.value.length > 0) {
        const breadcrumbSchema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.value.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title,
            item: joinURL(baseUrl.value, item.path),
          })),
        };

        scripts.push({
          type: "application/ld+json",
          innerHTML: JSON.stringify(breadcrumbSchema),
        });
      }

      return scripts;
    }),
  });
}
