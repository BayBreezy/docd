import { createResolver } from "@nuxt/kit";
import tailwindcss from "@tailwindcss/vite";
import type { BundledLanguage } from "shiki";

const resolver = createResolver(import.meta.url);

const langs: BundledLanguage[] = [
  "json",
  "js",
  "ts",
  "css",
  "html",
  "md",
  "yaml",
  "vue",
  "vue-html",
  "bash",
  "sh",
  "typescript",
  "javascript",
  "svelte",
  "tsx",
  "jsx",
  "prisma",
  "sql",
  "docker",
  "dockerfile",
  "python",
];

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "latest",
  modules: [
    "@nuxtjs/robots",
    "@nuxt/content",
    "@nuxtjs/mdc",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "reka-ui/nuxt",
    "@nuxtjs/color-mode",
    "motion-v/nuxt",
    "@vueuse/nuxt",
    "nuxt-gtag",
    "nuxt-llms",
    "@nuxtjs/robots",
    "@nuxtjs/mcp-toolkit",
    "nuxt-og-image",
    "@morev/vue-transitions/nuxt",
    "vue-sonner/nuxt",
    resolver.resolve("./modules/routing"),
    resolver.resolve("./modules/config"),
    resolver.resolve("./modules/custom-icons"),
    resolver.resolve("./modules/prose-component-meta"),
    resolver.resolve("./modules/skills"),
    resolver.resolve("./modules/markdown-rewrite"),
  ],

  mdc: {
    highlight: { langs, noApiRoute: false },
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 4, searchDepth: 4 },
        highlight: { langs },
      },
    },
    experimental: { sqliteConnector: "native" },
  },

  imports: {
    imports: [
      { from: "tailwind-variants", name: "tv" },
      { from: "tailwind-variants", name: "VariantProps", type: true },
      { from: "vue-sonner", name: "toast", as: "useSonner" },
    ],
  },

  icon: {
    clientBundle: { scan: true, sizeLimitKb: 0 },
    mode: "svg",
    class: "shrink-0",
    fetchTimeout: 2000,
    serverBundle: "local",
  },
  css: [
    resolver.resolve("./app/assets/css/tailwind.css"),
    resolver.resolve("./app/assets/css/theme.css"),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
