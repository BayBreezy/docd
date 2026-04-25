interface LandingPageLayout {
  layout?: string;
}

export default defineNuxtRouteMiddleware(async (to) => {
  const page = (await queryCollection("landing" as never)
    .path(to.path)
    .first()) as LandingPageLayout | null;

  setPageLayout(page?.layout || "default");
});
