import manifestSource from "#build/docd/prose-component-meta";

import { normalizeComponentMetaPath } from "../../utils/component-api";
import type {
  ProseComponentMetaEntry,
  ProseComponentMetaManifest,
} from "../../utils/generate-prose-component-meta";

const proseComponentMetaManifest = manifestSource as ProseComponentMetaManifest;

export type {
  ProseComponentApiLayout,
  ProseComponentMetaEntry,
} from "../../utils/generate-prose-component-meta";
export type { ComponentApiSectionKind } from "../../utils/component-api";

export function useProseComponentMetaManifest() {
  return proseComponentMetaManifest;
}

export function resolveProseComponentMeta(path?: string | null): ProseComponentMetaEntry | null {
  if (!path) {
    return null;
  }

  const manifest = useProseComponentMetaManifest();
  const normalizedPath = normalizeComponentMetaPath(path);

  return manifest.components[normalizedPath] || null;
}
