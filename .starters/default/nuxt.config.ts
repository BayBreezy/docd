export default defineNuxtConfig({
  extends: ["@baybreezy/docd"],
  llms: {
    title: process.env.NUXT_SITE_NAME || "My Docs",
    description: "A starter documentation site powered by Docd.",
    full: {
      title: process.env.NUXT_SITE_NAME || "My Docs",
      description: "A starter documentation site powered by Docd.",
    },
  },
});
