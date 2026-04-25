import { existsSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { relative, resolve, join } from "node:path";

import { parse as parseYaml } from "yaml";

import {
  isBuiltInProseComponentPath,
  normalizeComponentApiConfig,
  normalizeComponentApiPath,
  normalizeComponentMetaPath,
} from "./component-api";

export interface ResolvedComponentApiSourcePath {
  kind: "builtin" | "project";
  manifestPath: string;
  absolutePath: string;
}

export interface DiscoveredProjectComponentPath {
  manifestPath: string;
  absolutePath: string;
}

export interface MissingProjectComponentPath {
  contentFile: string;
  componentPath: string;
}

export interface ProjectComponentApiDiscoveryResult {
  contentFiles: string[];
  components: DiscoveredProjectComponentPath[];
  missingComponents: MissingProjectComponentPath[];
}

async function listMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function extractFrontmatter(source: string) {
  const normalizedSource = source.replace(/\r\n/g, "\n");

  if (!normalizedSource.startsWith("---\n")) {
    return null;
  }

  const endIndex = normalizedSource.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return null;
  }

  return normalizedSource.slice(4, endIndex);
}

function readFrontmatter(path: string) {
  try {
    const contents = readFileSync(path, "utf8");
    const frontmatter = extractFrontmatter(contents);

    return frontmatter ? (parseYaml(frontmatter) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function resolveComponentApiSourcePath(options: {
  rootDir: string;
  layerRoot: string;
  path: string;
}): ResolvedComponentApiSourcePath {
  const normalizedMetaPath = normalizeComponentMetaPath(options.path);

  if (isBuiltInProseComponentPath(normalizedMetaPath)) {
    return {
      kind: "builtin",
      manifestPath: normalizedMetaPath,
      absolutePath: resolve(options.layerRoot, normalizedMetaPath),
    };
  }

  const manifestPath = normalizeComponentApiPath(options.path);

  return {
    kind: "project",
    manifestPath,
    absolutePath: resolve(options.rootDir, manifestPath),
  };
}

export async function discoverProjectComponentApiPaths(options: {
  rootDir: string;
  layerRoot: string;
  contentDir?: string;
}): Promise<ProjectComponentApiDiscoveryResult> {
  const contentDir = options.contentDir || resolve(options.rootDir, "content");

  if (!existsSync(contentDir)) {
    return {
      contentFiles: [],
      components: [],
      missingComponents: [],
    };
  }

  const markdownFiles = await listMarkdownFiles(contentDir);
  const componentMap = new Map<string, DiscoveredProjectComponentPath>();
  const missingComponentMap = new Map<string, MissingProjectComponentPath>();

  for (const file of markdownFiles) {
    const frontmatter = readFrontmatter(file);
    const componentApi = normalizeComponentApiConfig(frontmatter?.componentApi);

    if (!componentApi || componentApi === false || !componentApi.hasExplicitComponents) {
      continue;
    }

    for (const component of componentApi.components) {
      const resolvedPath = resolveComponentApiSourcePath({
        rootDir: options.rootDir,
        layerRoot: options.layerRoot,
        path: component.path,
      });

      if (resolvedPath.kind === "builtin") {
        continue;
      }

      if (!existsSync(resolvedPath.absolutePath)) {
        const key = `${relative(options.rootDir, file)}:${resolvedPath.manifestPath}`;
        missingComponentMap.set(key, {
          contentFile: relative(options.rootDir, file),
          componentPath: resolvedPath.manifestPath,
        });
        continue;
      }

      componentMap.set(resolvedPath.manifestPath, {
        manifestPath: resolvedPath.manifestPath,
        absolutePath: resolvedPath.absolutePath,
      });
    }
  }

  return {
    contentFiles: markdownFiles,
    components: Array.from(componentMap.values()),
    missingComponents: Array.from(missingComponentMap.values()),
  };
}
