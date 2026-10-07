export default defineNuxtConfig({
  extends: ["@baybreezy/docd"],
  site: {
    name: "Docd",
  },
  llms: {
    title: process.env.NUXT_SITE_NAME || "Docd",
    description: "Documentation for the Docd Nuxt layer.",
    full: {
      title: process.env.NUXT_SITE_NAME || "Docd",
      description: "Documentation for the Docd Nuxt layer.",
    },
  },

  modules: ["nuxt-studio"],

  studio: {
    route: "/admin",
    repository: {
      provider: "github",
      branch: "main",
      owner: "BayBreezy",
      repo: "docd",
      rootDir: "docs",
    },
  },
});
