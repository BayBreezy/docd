import { addVitePlugin, createResolver, defineNuxtModule } from "@nuxt/kit";
import { joinURL } from "ufo";

export default defineNuxtModule({
  meta: {
    name: "docd:css",
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Absolute path to the layer's tailwind entry — this is the file that owns
    // `@import "tailwindcss"` and therefore controls Tailwind's scanner.
    const tailwindCssPath = resolver.resolve("../app/assets/css/tailwind.css");

    // The consuming app's content directory.  We convert to forward-slashes so
    // the injected @source glob works on Windows too.
    const contentDir = joinURL(nuxt.options.rootDir, "content").replace(/\\/g, "/");

    // Inject `@source <contentDir>/**/*` into tailwind.css
    addVitePlugin({
      name: "docd:inject-tailwind-sources",
      enforce: "pre",
      transform(code: string, id: string) {
        if (id.split("?")[0] !== tailwindCssPath) return null;
        return {
          code: `${code}\n@source ${JSON.stringify(`${contentDir}/**/*`)};`,
          map: null,
        };
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
