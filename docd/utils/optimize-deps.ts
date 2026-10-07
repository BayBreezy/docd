/**
 * Dependencies of the layer that Vite should pre-bundle in dev.
 * Listed here so the config module and the optimize-deps module agree on which entries are the layer's.
 */
export const LAYER_OPTIMIZE_DEPS = [
  "mermaid",
  "lodash-es",
  "tailwind-variants",
  "@baybreezy/file-extension-icon",
  "@iconify/utils",
  "vaul-vue",
];

/**
 * Packages whose own `optimizeDeps` entries (`<pkg> > <dep>`) are installed under the layer rather
 * than under the app root.
 */
export const LAYER_NESTED_OPTIMIZE_DEPS_PARENTS = ["@nuxtjs/mdc", "@nuxt/content"];
