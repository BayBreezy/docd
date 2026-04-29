export const DEFAULT_COMPONENT_API_LAYOUT = "table" as const;
export const DEFAULT_COMPONENT_API_SECTIONS = ["props", "slots", "events", "exposed"] as const;
export const BUILT_IN_PROSE_COMPONENT_ROOT = "app/components/content/prose/";

export type ProseComponentApiLayout = "field" | "table";
export type ComponentApiSectionKind = (typeof DEFAULT_COMPONENT_API_SECTIONS)[number];

export interface ComponentApiComponentInput {
  path?: string;
  title?: string;
  layout?: ProseComponentApiLayout;
  sections?: ComponentApiSectionKind[] | string;
}

export interface NormalizedComponentApiItem {
  path: string;
  title?: string;
  layout: ProseComponentApiLayout;
  sections: ComponentApiSectionKind[];
}

export interface NormalizedComponentApiConfig {
  heading?: string | false;
  layout: ProseComponentApiLayout;
  sections: ComponentApiSectionKind[];
  components: NormalizedComponentApiItem[];
  hasExplicitComponents: boolean;
}

export interface BuiltInComponentApiRegistryItem extends ComponentApiComponentInput {
  path: string;
}

export const BUILT_IN_PROSE_COMPONENT_API_REGISTRY: Record<
  string,
  false | readonly BuiltInComponentApiRegistryItem[]
> = {
  field: [
    { path: "app/components/content/prose/ProseField.vue" },
    { path: "app/components/content/prose/ProseFieldGroup.vue" },
  ],
  images: [
    { path: "app/components/content/prose/ProseImg.vue" },
    { path: "app/components/content/prose/ProseColorModeImage.vue" },
  ],
  "icon-list": [
    { path: "app/components/content/prose/ProseIconList.vue" },
    { path: "app/components/content/prose/ProseLi.vue" },
  ],
  "package-manager": [
    { path: "app/components/content/prose/ProsePmInstall.vue" },
    { path: "app/components/content/prose/ProsePmRun.vue" },
    { path: "app/components/content/prose/ProsePmX.vue" },
  ],
  steps: [
    { path: "app/components/content/prose/ProseSteps.vue" },
    { path: "app/components/content/prose/ProseStep.vue" },
  ],
  "code-snippet": false,
  typography: false,
};

function toPosixPath(value: string) {
  return value.replace(/\\/g, "/");
}

export function normalizeComponentApiPath(path: string) {
  return toPosixPath(path)
    .trim()
    .replace(/^([@~])\//, "")
    .replace(/^\.\//, "")
    .replace(/^\/(?!\/)/, "");
}

export function normalizeComponentMetaPath(path: string) {
  const normalized = normalizeComponentApiPath(path);
  const proseIndex = normalized.lastIndexOf(BUILT_IN_PROSE_COMPONENT_ROOT);

  if (proseIndex !== -1) {
    return normalized.slice(proseIndex);
  }

  return normalized;
}

export const normalizeProseComponentPath = normalizeComponentMetaPath;

export function isBuiltInProseComponentPath(path: string) {
  return normalizeComponentMetaPath(path).startsWith(BUILT_IN_PROSE_COMPONENT_ROOT);
}

export function componentNameFromPath(path: string) {
  const normalized = normalizeComponentMetaPath(path);
  const fileName = normalized.split("/").pop() || normalized;

  return fileName.replace(/\.vue$/, "").replace(/\.global$/, "");
}

export function componentLabelFromName(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim();
}

export function componentLabelFromPath(path: string) {
  return componentLabelFromName(componentNameFromPath(path));
}

export function componentTagFromName(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

export function componentNameFromSlug(slug: string) {
  const pascalCase = slug
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");

  return `Prose${pascalCase}`;
}

export function inferredBuiltInProseComponentPathFromSlug(slug: string) {
  return `${BUILT_IN_PROSE_COMPONENT_ROOT}${componentNameFromSlug(slug)}.vue`;
}

export function normalizeComponentApiLayout(
  value: unknown,
  fallback: ProseComponentApiLayout = DEFAULT_COMPONENT_API_LAYOUT
): ProseComponentApiLayout {
  return value === "table" || value === "field" ? value : fallback;
}

export function normalizeComponentApiSections(
  value: unknown,
  fallback: readonly ComponentApiSectionKind[] = DEFAULT_COMPONENT_API_SECTIONS
) {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value
          .split(",")
          .map((section) => section.trim())
          .filter(Boolean)
      : [];

  const sections = values.filter((section): section is ComponentApiSectionKind =>
    (DEFAULT_COMPONENT_API_SECTIONS as readonly string[]).includes(String(section))
  );

  return (
    sections.length ? Array.from(new Set(sections)) : [...fallback]
  ) as ComponentApiSectionKind[];
}

export function normalizeComponentApiHeading(value: unknown) {
  if (value === false) {
    return false;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const heading = value.trim();
  return heading || undefined;
}

function normalizeComponentApiItem(
  input: unknown,
  defaults: Pick<NormalizedComponentApiConfig, "layout" | "sections">
) {
  if (typeof input === "string") {
    return {
      path: normalizeComponentMetaPath(input),
      layout: defaults.layout,
      sections: [...defaults.sections],
    } satisfies NormalizedComponentApiItem;
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }

  const item = input as Record<string, unknown>;

  if (typeof item.path !== "string" || !item.path.trim()) {
    return null;
  }

  return {
    path: normalizeComponentMetaPath(item.path),
    title: typeof item.title === "string" ? item.title : undefined,
    layout: normalizeComponentApiLayout(item.layout, defaults.layout),
    sections: normalizeComponentApiSections(item.sections, defaults.sections),
  } satisfies NormalizedComponentApiItem;
}

export function normalizeComponentApiConfig(
  input: unknown
): false | NormalizedComponentApiConfig | null {
  if (input === false) {
    return false;
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }

  const config = input as Record<string, unknown>;
  const heading = normalizeComponentApiHeading(config.heading);
  const layout = normalizeComponentApiLayout(config.layout);
  const sections = normalizeComponentApiSections(config.sections);
  const defaults = { layout, sections };
  const components: NormalizedComponentApiItem[] = [];

  const pathItem = normalizeComponentApiItem(config.path, defaults);
  if (pathItem) {
    components.push(pathItem);
  }

  if (Array.isArray(config.components)) {
    for (const component of config.components) {
      const normalizedComponent = normalizeComponentApiItem(component, defaults);

      if (normalizedComponent) {
        components.push(normalizedComponent);
      }
    }
  }

  return {
    heading,
    layout,
    sections,
    components,
    hasExplicitComponents: components.length > 0,
  };
}
