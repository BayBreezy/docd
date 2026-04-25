import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { cpus } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Worker } from "node:worker_threads";

import {
  componentNameFromPath,
  componentTagFromName,
  normalizeComponentMetaPath,
} from "./component-api";

export type { ProseComponentApiLayout } from "./component-api";

export interface ProseComponentMetaTag {
  name: string;
  text?: string;
}

interface BaseProseComponentMetaItem {
  name: string;
  description: string;
  type: string;
  tags: ProseComponentMetaTag[];
}

type RawProseComponentSchema = unknown;

interface RawMetaTag {
  name: string;
  text?: string;
}

interface RawPropertyMeta {
  name: string;
  description: string;
  type: string;
  default?: string;
  required: boolean;
  tags: RawMetaTag[];
  schema?: RawProseComponentSchema;
}

interface RawSlotMeta {
  name: string;
  description: string;
  type: string;
  tags: RawMetaTag[];
  schema?: RawProseComponentSchema;
}

interface RawEventMeta {
  name: string;
  description: string;
  type: string;
  signature: string;
  tags: RawMetaTag[];
  schema?: RawProseComponentSchema[];
}

interface RawExposedMeta {
  name: string;
  description: string;
  type: string;
  tags: RawMetaTag[];
  schema?: RawProseComponentSchema;
}

export interface ProseComponentMetaProp extends BaseProseComponentMetaItem {
  default?: string;
  required: boolean;
  schema?: RawProseComponentSchema;
}

export interface ProseComponentMetaSlot extends BaseProseComponentMetaItem {
  schema?: RawProseComponentSchema;
}

export interface ProseComponentMetaEvent extends BaseProseComponentMetaItem {
  signature: string;
  schema?: RawProseComponentSchema[];
}

export interface ProseComponentMetaExposed extends BaseProseComponentMetaItem {
  schema?: RawProseComponentSchema;
}

export interface ProseComponentMetaEntry {
  name: string;
  tag: string;
  path: string;
  props: ProseComponentMetaProp[];
  slots: ProseComponentMetaSlot[];
  events: ProseComponentMetaEvent[];
  exposed: ProseComponentMetaExposed[];
}

export interface ProseComponentMetaManifest {
  generatedAt: string;
  components: Record<string, ProseComponentMetaEntry>;
  sourceHashes?: Record<string, string>;
}

export interface ProseComponentMetaSource {
  absolutePath: string;
  manifestPath: string;
}

export interface GenerateProseComponentMetaOptions {
  rootDir: string;
  layerRoot: string;
  componentsDir: string;
  outputFile: string;
  cache?: boolean;
  cacheDir?: string;
  additionalComponents?: ProseComponentMetaSource[];
}

export const EMPTY_PROSE_COMPONENT_META_MANIFEST: ProseComponentMetaManifest = {
  generatedAt: "",
  components: {},
};

export const normalizeProseComponentPath = normalizeComponentMetaPath;

function normalizeTags(tags: RawMetaTag[] = []): ProseComponentMetaTag[] {
  return tags.map((tag) => ({ name: tag.name, text: tag.text }));
}

function normalizeProp(prop: RawPropertyMeta): ProseComponentMetaProp {
  return {
    name: prop.name,
    description: prop.description || "",
    type: prop.type || "unknown",
    default: prop.default,
    required: prop.required,
    tags: normalizeTags(prop.tags),
    schema: prop.schema,
  };
}

function normalizeSlot(slot: RawSlotMeta): ProseComponentMetaSlot {
  return {
    name: slot.name,
    description: slot.description || "",
    type: slot.type || "unknown",
    tags: normalizeTags(slot.tags),
    schema: slot.schema,
  };
}

function normalizeEvent(event: RawEventMeta): ProseComponentMetaEvent {
  return {
    name: event.name,
    description: event.description || "",
    type: event.type || "unknown",
    signature: event.signature || event.type || "unknown",
    tags: normalizeTags(event.tags),
    schema: event.schema,
  };
}

function normalizeExposed(exposed: RawExposedMeta): ProseComponentMetaExposed {
  return {
    name: exposed.name,
    description: exposed.description || "",
    type: exposed.type || "unknown",
    tags: normalizeTags(exposed.tags),
    schema: exposed.schema,
  };
}

interface WorkerResult {
  manifestPath: string;
  raw: Record<string, unknown[]> | null;
  ok: boolean;
  error?: string;
}

const WORKER_PATH = fileURLToPath(new URL("./component-meta-worker.mjs", import.meta.url));

async function runInWorkers(
  components: ProseComponentMetaSource[],
  opts: { rootDir: string; cache: boolean; cacheDir: string }
): Promise<WorkerResult[]> {
  const numWorkers = Math.min(cpus().length, components.length, 8);
  const chunkSize = Math.ceil(components.length / numWorkers);

  const chunks: ProseComponentMetaSource[][] = [];
  for (let i = 0; i < components.length; i += chunkSize) {
    chunks.push(components.slice(i, i + chunkSize));
  }

  const spawnWorker = (batch: ProseComponentMetaSource[]) =>
    new Promise<WorkerResult[]>((resolve, reject) => {
      const worker = new Worker(WORKER_PATH, {
        workerData: {
          batch: batch.map((c) => ({
            manifestPath: c.manifestPath,
            absolutePath: c.absolutePath,
          })),
          rootDir: opts.rootDir,
          cacheDir: opts.cacheDir,
        },
      });
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0) reject(new Error(`Component meta worker exited with code ${code}`));
      });
    });

  try {
    const results = await Promise.all(chunks.map(spawnWorker));
    return results.flat();
  } catch {
    // Fall back to sequential processing if workers fail.
    const { getComponentMeta } = await import("nuxt-component-meta/parser");
    return components.map(({ manifestPath, absolutePath }) => {
      try {
        const raw = getComponentMeta(absolutePath, {
          rootDir: opts.rootDir,
          cache: opts.cache,
          cacheDir: opts.cacheDir,
        }) as Record<string, unknown[]>;
        return { manifestPath, raw, ok: true };
      } catch (err) {
        return { manifestPath, raw: null, ok: false, error: String(err) };
      }
    });
  }
}

async function listVueFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listVueFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith(".vue")) {
      files.push(fullPath);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function readExistingManifest(outputFile: string): ProseComponentMetaManifest {
  if (!existsSync(outputFile)) {
    return EMPTY_PROSE_COMPONENT_META_MANIFEST;
  }

  try {
    const contents = readFileSync(outputFile, "utf8");
    return JSON.parse(contents) as ProseComponentMetaManifest;
  } catch {
    return EMPTY_PROSE_COMPONENT_META_MANIFEST;
  }
}

export function readGeneratedProseComponentMeta(outputFile: string): ProseComponentMetaManifest {
  return readExistingManifest(outputFile);
}

export async function generateProseComponentMeta(
  options: GenerateProseComponentMetaOptions
): Promise<ProseComponentMetaManifest> {
  const previousManifest = readExistingManifest(options.outputFile);
  const builtInComponentFiles = await listVueFiles(options.componentsDir);
  const componentSources = new Map<string, ProseComponentMetaSource>();
  const components: Record<string, ProseComponentMetaEntry> = {};
  const sourceHashes: Record<string, string> = {};

  for (const componentPath of builtInComponentFiles) {
    const manifestPath = normalizeComponentMetaPath(relative(options.layerRoot, componentPath));
    componentSources.set(manifestPath, {
      absolutePath: componentPath,
      manifestPath,
    });
  }

  for (const component of options.additionalComponents || []) {
    componentSources.set(component.manifestPath, component);
  }

  const sources = Array.from(componentSources.values()).sort((a, b) =>
    a.manifestPath.localeCompare(b.manifestPath)
  );
  let hasChanges = sources.length !== Object.keys(previousManifest.components || {}).length;

  // First pass: resolve hashes and split into cache hits vs misses.
  const cacheMisses: ProseComponentMetaSource[] = [];

  for (const component of sources) {
    const stats = await stat(component.absolutePath);
    const sourceHash = `${stats.mtimeMs}:${stats.size}`;
    sourceHashes[component.manifestPath] = sourceHash;

    const cachedEntry = previousManifest.components?.[component.manifestPath];
    const cachedHash = previousManifest.sourceHashes?.[component.manifestPath];

    if (cachedEntry && cachedHash === sourceHash) {
      components[component.manifestPath] = cachedEntry;
    } else {
      hasChanges = true;
      cacheMisses.push(component);
    }
  }

  // Second pass: process cache misses in parallel worker threads.
  if (cacheMisses.length > 0) {
    const rawResults = await runInWorkers(cacheMisses, {
      rootDir: options.rootDir,
      cache: options.cache ?? true,
      cacheDir: options.cacheDir ?? "",
    });

    for (const result of rawResults) {
      if (!result.ok || !result.raw) continue;
      const name = componentNameFromPath(result.manifestPath);
      components[result.manifestPath] = {
        name,
        tag: componentTagFromName(name),
        path: result.manifestPath,
        props: (result.raw.props ?? []).map(normalizeProp),
        slots: (result.raw.slots ?? []).map(normalizeSlot),
        events: (result.raw.events ?? []).map(normalizeEvent),
        exposed: (result.raw.exposed ?? []).map(normalizeExposed),
      };
    }
  }

  if (!hasChanges) {
    return previousManifest;
  }

  const nextManifest: ProseComponentMetaManifest = {
    generatedAt: new Date().toISOString(),
    components,
    sourceHashes,
  };

  const nextContents = `${JSON.stringify(nextManifest, null, 2)}\n`;
  const previousContents = existsSync(options.outputFile)
    ? readFileSync(options.outputFile, "utf8")
    : "";

  if (previousContents !== nextContents) {
    await mkdir(dirname(options.outputFile), { recursive: true });
    await writeFile(options.outputFile, nextContents, "utf8");
  }

  return nextManifest;
}

export function resolveProseComponentPaths(options: { rootDir: string; layerRoot: string }) {
  const componentsDir = resolve(options.layerRoot, "app/components/content/prose");
  const outputFile = resolve(options.rootDir, ".data/docd/prose-component-meta.json");
  const cacheDir = resolve(options.rootDir, ".data/docd/prose-component-meta");

  return {
    componentsDir,
    outputFile,
    cacheDir,
  };
}
