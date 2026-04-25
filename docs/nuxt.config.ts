export default defineNuxtConfig({
  extends: ["../docd"],
  site: {
    name: "Docd",
  },
  llms: {
    domain: process.env.NUXT_SITE_URL || "http://localhost:3000",
    title: process.env.NUXT_SITE_NAME || "Docd",
    description: "Documentation for the Docd Nuxt layer.",
    full: {
      title: process.env.NUXT_SITE_NAME || "Docd",
      description: "Documentation for the Docd Nuxt layer.",
    },
  },
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "SOURCEMAP_BROKEN" || warning.code === "CIRCULAR_DEPENDENCY") {
            return;
          }
          warn(warning);
        },
      },
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
