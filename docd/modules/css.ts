import { readFile } from "node:fs/promises";

import { addVitePlugin, createResolver, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "docd:css",
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Absolute path to the layer's tailwind entry — resolved from this module's
    // location so it stays correct whether docd is local or installed from npm.
    const tailwindCssPath = resolver.resolve("../app/assets/css/tailwind.css").replace(/\\/g, "/");

    // Absolute paths that Tailwind needs to scan.
    const rootDir = nuxt.options.rootDir.replace(/\\/g, "/");
    const layerAppDir = resolver.resolve("../app").replace(/\\/g, "/");

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
        return [
          code,
          `@source ${JSON.stringify(`${rootDir}/**/*`)};`,
          `@source ${JSON.stringify(`${layerAppDir}/**/*`)};`,
        ].join("\n");
      },
    });

    // Suppress noisy Vite warnings produced during Tailwind's build pass.
    nuxt.hook("vite:extendConfig", (config) => {
      const logger = config.customLogger;
      if (!logger) return;
      const ignore = ["@tailwindcss/vite:generate:build", "nuxt:module-preload-polyfill"];
      const originalWarn = logger.warn.bind(logger);
      logger.warn = (msg, options) => {
        if (ignore.some((p) => msg.includes(p))) return;
        originalWarn(msg, options);
      };
    });
  },
});
