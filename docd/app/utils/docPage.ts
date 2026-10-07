import type { Collections, PageCollectionItemBase } from "@nuxt/content";
import { kebabCase } from "lodash-es";

import type { AsyncDataRequestContext, NuxtApp } from "#app";

type DocCollection = "docs" | "landing";
type DocPage = PageCollectionItemBase | null;

/** Keys of pages the layout middleware loaded for the current navigation. */
const seeded = new WeakMap<NuxtApp, Set<string>>();

/** The `useAsyncData` key used for a page, shared so every caller reads the same payload entry. */
export const docPageKey = (collection: DocCollection, path: string) =>
  collection === "landing" ? "landing" : kebabCase(path) || "root";

/** Queries a single page of a collection by path. */
export const fetchDocPage = (collection: DocCollection, path: string): Promise<DocPage> =>
  (
    queryCollection(collection as keyof Collections)
      .path(path)
      .first() as Promise<DocPage>
  ).then((page) => page ?? null);

/**
 * Data that is safe to reuse for a first `useAsyncData` call: what the server rendered (while
 * hydrating), what the server already loaded for this request, a page the layout middleware just
 * loaded for this navigation, or a prerendered payload. Anything else is fetched again.
 */
const readCachedData = (key: string, nuxtApp: NuxtApp): unknown => {
  const usePayload = import.meta.server || nuxtApp.isHydrating || seeded.get(nuxtApp)?.has(key);
  if (usePayload && key in nuxtApp.payload.data) return nuxtApp.payload.data[key];
  return nuxtApp.static.data[key];
};

/**
 * `getCachedData` for page data that many components request through `useDocPage`.
 * Without it every call re-runs its queries, once per component (including every code block).
 * Refreshes, such as route changes, always fetch again.
 */
export const getSharedCachedData = <T>(
  key: string,
  nuxtApp: NuxtApp,
  ctx: AsyncDataRequestContext
): T | undefined => (ctx.cause === "initial" ? (readCachedData(key, nuxtApp) as T) : undefined);

/**
 * Used by route middleware to read the page before render, e.g. to pick its layout.
 * The page is stored under the key `useDocPage` uses, so the page component and the other
 * components reading it find it there instead of querying the collection again.
 */
export const prefetchDocPage = async (
  nuxtApp: NuxtApp,
  collection: DocCollection,
  path: string
): Promise<DocPage> => {
  const key = docPageKey(collection, path);

  // While hydrating, the server already rendered this page and its data is in the payload.
  // Reading it from there avoids loading the client-side content database just to pick a layout.
  if (import.meta.client && nuxtApp.isHydrating && key in nuxtApp.payload.data) {
    return nuxtApp.payload.data[key] as DocPage;
  }

  const page = await fetchDocPage(collection, path);
  nuxtApp.payload.data[key] = page;
  let keys = seeded.get(nuxtApp);
  if (!keys) seeded.set(nuxtApp, (keys = new Set()));
  keys.add(key);
  return page;
};
