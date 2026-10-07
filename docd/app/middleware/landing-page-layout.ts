export default defineNuxtRouteMiddleware(async (to) => {
  const page = (await prefetchDocPage(useNuxtApp(), "landing", to.path)) as {
    layout?: string;
  } | null;

  setPageLayout(page?.layout || "default");
});
