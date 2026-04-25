interface DocPageLayout {
  layout?: string;
}

export default defineNuxtRouteMiddleware(async (to) => {
  const page = (await queryCollection("docs" as never)
    .path(to.path)
    .first()) as DocPageLayout | null;

  setPageLayout(page?.layout || "docs");
});
