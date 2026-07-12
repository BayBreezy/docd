import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve as resolvePath } from "node:path";

import { addVitePlugin, createResolver, defineNuxtModule, logger } from "@nuxt/kit";
import { defu } from "defu";

export interface CssModuleOptions {
  /**
   * Paths (relative to the consuming app root, or absolute) to CSS files that
   * should be merged into the layer's Tailwind entry.
   *
   * Files that only use `@apply` already work without this — they get
   * `@reference` injected automatically.
   *
   * Use `extend` for anything that needs
   * more than that (`@theme`, `@utility`, `@custom-variant`, etc.), since those
   * only take effect when the file is part of the same Tailwind build as the
   * layer, not a separate one started by its own `@import "tailwindcss"`.
   */
  extend?: string[];
}

const defaults: Required<CssModuleOptions> = {
  extend: [],
};

const log = logger.withTag("Docd");

export default defineNuxtModule<CssModuleOptions>({
  meta: {
    name: "docd:css",
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Absolute path to the layer's tailwind entry — resolved from this module's
    // location so it stays correct whether docd is local or installed from npm.
    const tailwindCssPath = resolver.resolve("../app/assets/css/tailwind.css").replace(/\\/g, "/");
    const tailwindCssDir = dirname(tailwindCssPath);

    // Absolute paths that Tailwind needs to scan.
    const rootDir = nuxt.options.rootDir.replace(/\\/g, "/");
    const layerAppDir = resolver.resolve("../app").replace(/\\/g, "/");

    const options = defu(
      (nuxt.options as unknown as { docd?: { css?: CssModuleOptions } }).docd?.css,
      defaults
    ) as Required<CssModuleOptions>;

    // Resolve and validate consumer-provided files that opt into being merged
    // into the layer's single Tailwind build.
    const extendPaths = options.extend
      .map((file) =>
        (isAbsolute(file) ? file : resolvePath(nuxt.options.rootDir, file)).replace(/\\/g, "/")
      )
      .filter((file) => {
        if (existsSync(file)) return true;
        log.warn(`docd.css.extend: CSS file not found, skipping: ${file}`);
        return false;
      });
    const extendPathSet = new Set(extendPaths);

    // Use the `load` hook rather than `transform` so our modified source is
    // visible to @tailwindcss/vite's transform hook (which has enforce:"pre"
    // and is registered earlier). Vite always runs `load` before `transform`.
    addVitePlugin({
      name: "docd:inject-tailwind-sources",
      enforce: "pre",
      async load(id) {
        const cleanId = id?.split("?")?.[0]?.replace(/\\/g, "/");
        if (cleanId !== tailwindCssPath) return null;

        const code = await readFile(tailwindCssPath, "utf8");

        // `@import` each consumer-registered file so it's part of this same
        // Tailwind compilation (one theme/base/utilities pass) instead of
        // starting its own via a separate `@import "tailwindcss"`.
        const extendImports = extendPaths.map((file) => {
          this.addWatchFile(file);
          const rel = relative(tailwindCssDir, file).replace(/\\/g, "/");
          return `@import ${JSON.stringify(rel.startsWith(".") ? rel : `./${rel}`)};`;
        });

        return [
          code,
          `@source ${JSON.stringify(`${rootDir}/**/*`)};`,
          `@source ${JSON.stringify(`${layerAppDir}/**/*`)};`,
          ...extendImports,
        ].join("\n");
      },
    });

    // Inject `@reference` into consuming-app CSS files that use `@apply` but
    // don't already import or reference Tailwind. This gives them access to the
    // layer's theme tokens without re-outputting Tailwind's stylesheet.
    addVitePlugin({
      name: "docd:inject-tailwind-reference",
      enforce: "pre",
      async load(id) {
        const cleanId = id?.split("?")?.[0]?.replace(/\\/g, "/");

        if (!cleanId?.endsWith(".css")) return null;
        // Skip the layer's own tailwind entry — it already has @import "tailwindcss".
        if (cleanId === tailwindCssPath) return null;
        // Skip files merged in via `docd.css.extend` — they're already `@import`ed
        // into the tailwind entry above, so injecting `@reference` back to that
        // same entry here would create a circular import.
        if (extendPathSet.has(cleanId)) return null;
        // Only touch files inside the consuming app root, not node_modules or the layer.
        if (!cleanId.startsWith(`${rootDir}/`)) return null;
        if (cleanId.startsWith(`${layerAppDir}/`)) return null;

        let code: string;
        try {
          code = await readFile(cleanId, "utf8");
        } catch {
          return null;
        }

        // Skip files that already have reference
        if (
          code.includes('@import "tailwindcss"') ||
          code.includes("@import 'tailwindcss'") ||
          code.includes("@reference")
        )
          return null;

        // Only inject when the file actually uses @apply to avoid unnecessary overhead.
        if (!code.includes("@apply")) return null;

        return `@reference ${JSON.stringify(tailwindCssPath)};\n${code}`;
      },
    });

    // Suppress noisy Vite warnings produced during Tailwind's build pass.
    nuxt.hook("vite:extendConfig", (config) => {
      const viteLogger = config.customLogger;
      if (!viteLogger) return;
      const ignore = ["@tailwindcss/vite:generate:build", "nuxt:module-preload-polyfill"];
      const originalWarn = viteLogger.warn.bind(viteLogger);
      viteLogger.warn = (msg, options) => {
        if (ignore.some((p) => msg.includes(p))) return;
        originalWarn(msg, options);
      };
    });
  },
});
