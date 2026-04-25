import { createResolver, defineNuxtModule, extendPages } from "@nuxt/kit";

import { landingPageExists } from "../utils/pages";

export default defineNuxtModule({
  meta: {
    name: "docd:routing",
  },
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    if (!landingPageExists(nuxt.options.rootDir)) {
      extendPages((pages) => {
        pages.push({
          name: "index",
          path: "/",
          file: resolve("../app/templates/landing.vue"),
        });
      });
    }
  },
});
