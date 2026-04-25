import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";

import { getComponentMeta } from "nuxt-component-meta/parser";

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

  for (const component of sources) {
    const stats = await stat(component.absolutePath);
    const sourceHash = `${stats.mtimeMs}:${stats.size}`;

    sourceHashes[component.manifestPath] = sourceHash;

    const cachedEntry = previousManifest.components?.[component.manifestPath];
    const cachedHash = previousManifest.sourceHashes?.[component.manifestPath];

    if (cachedEntry && cachedHash === sourceHash) {
      components[component.manifestPath] = cachedEntry;
      continue;
    }

    hasChanges = true;

    const meta = getComponentMeta(component.absolutePath, {
      rootDir: options.rootDir,
      cache: options.cache ?? true,
      cacheDir: options.cacheDir,
    });

    const name = componentNameFromPath(component.manifestPath);
    components[component.manifestPath] = {
      name,
      tag: componentTagFromName(name),
      path: component.manifestPath,
      props: meta.props.map(normalizeProp),
      slots: meta.slots.map(normalizeSlot),
      events: meta.events.map(normalizeEvent),
      exposed: meta.exposed.map(normalizeExposed),
    };
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
