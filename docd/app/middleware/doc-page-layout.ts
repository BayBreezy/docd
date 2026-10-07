export default defineNuxtRouteMiddleware(async (to) => {
  const page = (await prefetchDocPage(useNuxtApp(), "docs", to.path)) as { layout?: string } | null;

  setPageLayout(page?.layout || "docs");
});
