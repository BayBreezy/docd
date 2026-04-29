import { resolve as resolvePath } from "node:path";

import { addTemplate, createResolver, defineNuxtModule, logger, updateTemplates } from "@nuxt/kit";

import {
  appendComponentApiBlocks,
  projectComponentApiConfig,
  warnForMissingComponentPaths,
  withAutoTitles,
} from "../utils/component-api-content";
import { discoverProjectComponentApiPaths } from "../utils/component-api-discovery";
import {
  EMPTY_PROSE_COMPONENT_META_MANIFEST,
  generateProseComponentMeta,
  readGeneratedProseComponentMeta,
  resolveProseComponentPaths,
} from "../utils/generate-prose-component-meta";

const log = logger.withTag("Docd");

function normalizeFsPath(path: string) {
  return path.replace(/\\/g, "/");
}

export default defineNuxtModule({
  meta: {
    name: "docd:prose-component-meta",
  },
  async setup(_, nuxt) {
    const resolver = createResolver(import.meta.url);
    const layerRoot = resolver.resolve("..");
    const { componentsDir, outputFile, cacheDir } = resolveProseComponentPaths({
      rootDir: nuxt.options.rootDir,
      layerRoot,
    });
    const contentDir = resolvePath(nuxt.options.rootDir, "content");
    let watchedProjectComponentFiles = new Set<string>();

    let manifest = readGeneratedProseComponentMeta(outputFile);
    if (!Object.keys(manifest.components).length) {
      manifest = EMPTY_PROSE_COMPONENT_META_MANIFEST;
    }

    const manifestTemplate = addTemplate({
      filename: "docd/prose-component-meta.mjs",
      write: true,
      getContents: () => `export default ${JSON.stringify(manifest, null, 2)};\n`,
    });

    async function regenerate() {
      const discovery = await discoverProjectComponentApiPaths({
        rootDir: nuxt.options.rootDir,
        layerRoot,
        contentDir,
      });

      watchedProjectComponentFiles = new Set(
        discovery.components.map((component) => normalizeFsPath(component.absolutePath))
      );

      manifest = await generateProseComponentMeta({
        rootDir: nuxt.options.rootDir,
        layerRoot,
        componentsDir,
        outputFile,
        cache: true,
        cacheDir,
        additionalComponents: discovery.components,
      });

      await updateTemplates({
        filter: (template) => template.filename === manifestTemplate.filename,
      });
    }

    await regenerate();

    nuxt.hook("content:file:afterParse", async (event) => {
      const context = {
        rootDir: nuxt.options.rootDir,
        layerRoot,
        warn: (message: string) => log.warn(message),
      };

      const componentApi = projectComponentApiConfig(event.content);

      if (!componentApi || componentApi === false) {
        return;
      }

      if (!componentApi.hasExplicitComponents) {
        log.warn(
          `The componentApi config in ${typeof event.content.id === "string" ? event.content.id : "this page"} must declare a path or components array.`
        );
        return;
      }

      const items = withAutoTitles(componentApi.components);
      warnForMissingComponentPaths(event.content, items, context);
      event.content = await appendComponentApiBlocks(event.content, items, componentApi.heading);
    });

    nuxt.hook("builder:watch", async (_event, changedPath) => {
      const normalizedComponentsDir = normalizeFsPath(componentsDir);
      const normalizedContentDir = normalizeFsPath(contentDir);
      const candidates = [
        normalizeFsPath(changedPath),
        normalizeFsPath(resolvePath(nuxt.options.rootDir, changedPath)),
        normalizeFsPath(resolvePath(layerRoot, changedPath)),
      ];

      const matchesProseComponent = candidates.some(
        (candidate) => candidate.endsWith(".vue") && candidate.startsWith(normalizedComponentsDir)
      );
      const matchesWatchedProjectComponent = candidates.some((candidate) =>
        watchedProjectComponentFiles.has(candidate)
      );
      const matchesContentFrontmatter = candidates.some(
        (candidate) => candidate.endsWith(".md") && candidate.startsWith(normalizedContentDir)
      );

      if (!matchesProseComponent && !matchesWatchedProjectComponent && !matchesContentFrontmatter) {
        return;
      }

      try {
        await regenerate();
      } catch (error) {
        log.error(`Failed to refresh prose component metadata: ${String(error)}`);
      }
    });
  },
});
