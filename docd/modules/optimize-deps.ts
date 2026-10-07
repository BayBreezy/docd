import { readFileSync } from "node:fs";

import { defineNuxtModule, extendViteConfig } from "@nuxt/kit";

import { LAYER_NESTED_OPTIMIZE_DEPS_PARENTS, LAYER_OPTIMIZE_DEPS } from "../utils/optimize-deps";

const layerName: string = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8")
).name;

/**
 * Vite resolves `optimizeDeps.include` entries from the app root. With isolated installs (bun, pnpm)
 * the layer's dependencies, and those of the modules it brings in, are not reachable from there, so
 * they are never pre-bundled and break in dev (for example `remark-emoji`, which stops Markdown from
 * being highlighted in the browser). Prefixing the entries with the layer name makes Vite resolve
 * them through the layer instead.
 *
 * This module must be registered after the modules that add their own entries.
 */
export default defineNuxtModule({
  meta: {
    name: "docd:optimize-deps",
  },
  setup() {
    const layerDeps = new Set(LAYER_OPTIMIZE_DEPS);

    extendViteConfig((config) => {
      const include = config.optimizeDeps?.include;
      if (!include) return;

      config.optimizeDeps!.include = include.map((id) => {
        if (id.startsWith(`${layerName} > `)) return id;
        const isLayerDep = layerDeps.has(id);
        const isNestedLayerDep = LAYER_NESTED_OPTIMIZE_DEPS_PARENTS.some((parent) =>
          id.startsWith(`${parent} > `)
        );
        return isLayerDep || isNestedLayerDep ? `${layerName} > ${id}` : id;
      });
    });
  },
});
