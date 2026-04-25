import { createResolver, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "docd:custom-icons",
  },
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    nuxt.options.icon ||= {};
    nuxt.options.icon.customCollections ||= [];
    nuxt.options.icon.customCollections.push({
      prefix: "custom",
      dir: resolve(nuxt.options.srcDir, "assets/icons"),
    });
  },
});
