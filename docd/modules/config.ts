import { defineNuxtModule } from "@nuxt/kit";
import { defaultsDeep } from "lodash-es";

import { getGitBranch, getGitEnv, getLocalGitInfo } from "../utils/git";
import { getPackageJsonMetadata, inferSiteURL } from "../utils/meta";

export default defineNuxtModule({
  meta: {
    name: "docd:config",
  },

  async setup(_options, nuxt) {
    const dir = nuxt.options.rootDir;
    const url = inferSiteURL();
    const meta = await getPackageJsonMetadata(dir);
    const gitInfo = (await getLocalGitInfo(dir)) || getGitEnv();
    const siteName =
      (typeof nuxt.options.site === "object" && nuxt.options.site?.name) ||
      meta.name ||
      gitInfo?.name ||
      "";

    nuxt.options.vite.optimizeDeps = defaultsDeep({}, nuxt.options.vite.optimizeDeps, {
      include: [
        "mermaid",
        "lodash-es",
        "tailwind-variants",
        "@baybreezy/file-extension-icon",
        "@iconify/utils",
      ],
    });

    nuxt.options.llms = defaultsDeep({}, nuxt.options.llms, {
      domain: url,
      title: siteName,
      description: meta.description || "",
      full: {
        title: siteName,
        description: meta.description || "",
      },
    });

    nuxt.options.app.head = defaultsDeep({}, nuxt.options.app.head, {
      title: siteName,
      titleTemplate: `%s - ${siteName}`,
    } as typeof nuxt.options.app.head);

    nuxt.options.site = defaultsDeep({}, nuxt.options.site, {
      url: url || "",
      name: siteName,
      debug: false,
    }) as typeof nuxt.options.site;

    if (siteName) {
      nuxt.options.colorMode = defaultsDeep({}, nuxt.options.colorMode, {
        storageKey: `${siteName.toLocaleLowerCase().replace(/\s+/g, "-")}-color-mode`,
      }) as typeof nuxt.options.colorMode;
    }

    nuxt.options.appConfig.docd = defaultsDeep({}, nuxt.options.appConfig.docd, {
      github: {
        repo: gitInfo?.url ?? url ?? "",
        branch: getGitBranch(),
        contentDir: "content",
      },
      ui: {
        header: {
          title: siteName,
        },
      },
    });

    nuxt.options.appConfig.seo = defaultsDeep({}, nuxt.options.appConfig.seo, {
      titleTemplate: `%s - ${siteName}`,
      title: siteName,
      description: meta.description || "",
    });

    const forcedColorMode = (
      nuxt.options.appConfig.docd as { ui?: { colorMode?: string } } | undefined
    )?.ui?.colorMode;
    if (forcedColorMode === "light" || forcedColorMode === "dark") {
      nuxt.options.colorMode = defaultsDeep(
        { preference: forcedColorMode, fallback: forcedColorMode },
        nuxt.options.colorMode || {}
      ) as typeof nuxt.options.colorMode;
    }
  },
});
