import { existsSync } from "node:fs";
import { basename, extname } from "node:path";

import { parseMarkdown } from "@nuxtjs/mdc/runtime";

import {
  BUILT_IN_PROSE_COMPONENT_API_REGISTRY,
  DEFAULT_COMPONENT_API_LAYOUT,
  DEFAULT_COMPONENT_API_SECTIONS,
  componentLabelFromPath,
  componentNameFromPath,
  inferredBuiltInProseComponentPathFromSlug,
  normalizeComponentApiConfig,
  normalizeComponentApiLayout,
  normalizeComponentApiSections,
  type BuiltInComponentApiRegistryItem,
  type NormalizedComponentApiItem,
} from "./component-api";
import { resolveComponentApiSourcePath } from "./component-api-discovery";

type TransformerBodyNode = {
  type?: string;
  tag?: string;
  children?: TransformerBodyNode[];
};

type TransformerTocLink = {
  id?: string;
  depth?: number;
  text?: string;
  children?: TransformerTocLink[];
};

type MinimarkNode = string | number | boolean | null | MinimarkElement;
type MinimarkElement = [string, Record<string, unknown>?, ...MinimarkNode[]];

export type ComponentApiTransformerContent = {
  id?: string;
  body?: {
    type?: string;
    children?: TransformerBodyNode[];
    value?: MinimarkNode[];
    toc?: {
      title?: string;
      searchDepth?: number;
      depth?: number;
      links?: TransformerTocLink[];
    };
    [key: string]: unknown;
  };
  componentApi?: unknown;
  [key: string]: unknown;
};

export interface ComponentApiTransformerContext {
  rootDir: string;
  layerRoot: string;
  warn: (message: string) => void;
}

function escapeMdcProp(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function fileId(file: ComponentApiTransformerContent) {
  return typeof file.id === "string" ? file.id : "";
}

function hasExistingComponentApiNode(nodes: TransformerBodyNode[] = []): boolean {
  return nodes.some((node) => {
    if (node.tag === "prose-component-api") {
      return true;
    }

    return Array.isArray(node.children) && hasExistingComponentApiNode(node.children);
  });
}

function isMinimarkElement(node: MinimarkNode): node is MinimarkElement {
  return Array.isArray(node) && typeof node[0] === "string";
}

function hasExistingComponentApiMinimarkNode(nodes: MinimarkNode[] = []): boolean {
  return nodes.some((node) => {
    if (!isMinimarkElement(node)) {
      return false;
    }

    if (node[0] === "prose-component-api") {
      return true;
    }

    return hasExistingComponentApiMinimarkNode(node.slice(2) as MinimarkNode[]);
  });
}

export function withAutoTitles(items: NormalizedComponentApiItem[]) {
  const needsAutoTitles = items.length > 1;

  return items.map((item) => ({
    ...item,
    title: item.title ?? (needsAutoTitles ? componentNameFromPath(item.path) : undefined),
  }));
}

function registryItemsToNormalizedItems(
  items: readonly BuiltInComponentApiRegistryItem[],
  defaults: Pick<NormalizedComponentApiItem, "layout" | "sections">
) {
  return items.map(
    (item) =>
      ({
        path: item.path,
        title: item.title,
        layout: normalizeComponentApiLayout(item.layout, defaults.layout),
        sections: normalizeComponentApiSections(item.sections, defaults.sections),
      }) satisfies NormalizedComponentApiItem
  );
}

function inferredItem(
  slug: string,
  defaults: Pick<NormalizedComponentApiItem, "layout" | "sections">,
  context: ComponentApiTransformerContext
) {
  const inferredPath = inferredBuiltInProseComponentPathFromSlug(slug);
  const resolvedPath = resolveComponentApiSourcePath({
    rootDir: context.rootDir,
    layerRoot: context.layerRoot,
    path: inferredPath,
  });

  if (!existsSync(resolvedPath.absolutePath)) {
    return [];
  }

  return [
    {
      path: inferredPath,
      layout: defaults.layout,
      sections: [...defaults.sections],
    } satisfies NormalizedComponentApiItem,
  ];
}

function defaultItemSettings(config: ReturnType<typeof normalizeComponentApiConfig>) {
  if (config && config !== false) {
    return {
      heading: config.heading,
      layout: config.layout,
      sections: config.sections,
    };
  }

  return {
    heading: undefined,
    layout: DEFAULT_COMPONENT_API_LAYOUT,
    sections: [...DEFAULT_COMPONENT_API_SECTIONS],
  };
}

function buildComponentApiBlockSource(item: NormalizedComponentApiItem, title?: string) {
  const props = [`path="${escapeMdcProp(item.path)}"`];

  if (item.layout !== DEFAULT_COMPONENT_API_LAYOUT) {
    props.push(`layout="${item.layout}"`);
  }

  if (title) {
    props.push(`title="${escapeMdcProp(title)}"`);
  }

  if (item.sections.length) {
    props.push(`sections="${escapeMdcProp(item.sections.join(","))}"`);
  }

  return `:prose-component-api{${props.join(" ")}}`;
}

function buildComponentApiBlockMinimarkNode(
  item: NormalizedComponentApiItem,
  title?: string
): MinimarkElement {
  const props: Record<string, string> = {
    path: item.path,
    sections: item.sections.join(","),
  };

  if (item.layout !== DEFAULT_COMPONENT_API_LAYOUT) {
    props.layout = item.layout;
  }

  if (title) {
    props.title = title;
  }

  return ["prose-component-api", props];
}

function buildComponentApiBlocksSource(
  items: NormalizedComponentApiItem[],
  heading: string | false | undefined
) {
  const lines: string[] = [];
  const hasGroupHeading = heading !== false;
  const groupHeading =
    heading ||
    (items.length === 1 ? `${componentLabelFromPath(items[0].path)} API` : "Component API");
  const needsItemHeadings = items.length > 1;

  if (hasGroupHeading) {
    lines.push(`## ${groupHeading}`, "");
  }

  for (const item of items) {
    if (needsItemHeadings) {
      lines.push(
        `${hasGroupHeading ? "###" : "##"} ${item.title || componentNameFromPath(item.path)}`,
        ""
      );
    }

    lines.push(buildComponentApiBlockSource(item), "");
  }

  return lines.join("\n").trim();
}

function slugifyHeading(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function uniqueHeadingId(text: string, counts: Map<string, number>) {
  const base = slugifyHeading(text) || "section";
  const current = counts.get(base) || 0;
  counts.set(base, current + 1);
  return current ? `${base}-${current}` : base;
}

function buildComponentApiMinimarkAppend(
  items: NormalizedComponentApiItem[],
  heading: string | false | undefined
) {
  const value: MinimarkNode[] = [];
  const links: TransformerTocLink[] = [];
  const hasGroupHeading = heading !== false;
  const groupHeading =
    heading ||
    (items.length === 1 ? `${componentLabelFromPath(items[0].path)} API` : "Component API");
  const needsItemHeadings = items.length > 1;
  const idCounts = new Map<string, number>();
  let parentLink: TransformerTocLink | undefined;

  if (hasGroupHeading) {
    const groupId = uniqueHeadingId(groupHeading, idCounts);
    parentLink = {
      id: groupId,
      depth: 2,
      text: groupHeading,
      children: [],
    };
    links.push(parentLink);
    value.push(["h2", { id: groupId }, groupHeading]);
  }

  for (const item of items) {
    if (needsItemHeadings) {
      const itemHeading = item.title || componentNameFromPath(item.path);
      const itemDepth = hasGroupHeading ? 3 : 2;
      const itemTag = hasGroupHeading ? "h3" : "h2";
      const itemId = uniqueHeadingId(itemHeading, idCounts);
      const itemLink: TransformerTocLink = {
        id: itemId,
        depth: itemDepth,
        text: itemHeading,
      };

      if (parentLink) {
        parentLink.children = [...(parentLink.children || []), itemLink];
      } else {
        links.push(itemLink);
      }

      value.push([itemTag, { id: itemId }, itemHeading]);
    }

    value.push(buildComponentApiBlockMinimarkNode(item));
  }

  return { links, value };
}

function appendTocLinks(
  body: ComponentApiTransformerContent["body"],
  links: TransformerTocLink[] | undefined
) {
  if (!body || !Array.isArray(links) || !links.length) {
    return body;
  }

  return {
    ...body,
    toc: {
      ...(body.toc || {}),
      links: [...(body.toc?.links || []), ...links],
    },
  };
}

export function isBuiltInProseDocFile(file: ComponentApiTransformerContent) {
  return /^docs\/4\.prose\/.+\.md$/i.test(fileId(file));
}

export function builtInProseDocSlug(file: ComponentApiTransformerContent) {
  return basename(fileId(file), extname(fileId(file)));
}

export function projectComponentApiConfig(file: ComponentApiTransformerContent) {
  return normalizeComponentApiConfig(file.componentApi);
}

export function builtInComponentApiItems(
  file: ComponentApiTransformerContent,
  context: ComponentApiTransformerContext
) {
  const config = normalizeComponentApiConfig(file.componentApi);

  if (config === false) {
    return {
      heading: undefined,
      items: [] as NormalizedComponentApiItem[],
      explicit: false,
    };
  }

  if (config?.hasExplicitComponents) {
    return {
      heading: config.heading,
      items: withAutoTitles(config.components),
      explicit: true,
    };
  }

  const slug = builtInProseDocSlug(file);
  const defaults = defaultItemSettings(config);
  const registryEntry = BUILT_IN_PROSE_COMPONENT_API_REGISTRY[slug];

  if (registryEntry === false) {
    return {
      heading: defaults.heading,
      items: [] as NormalizedComponentApiItem[],
      explicit: false,
    };
  }

  if (Array.isArray(registryEntry)) {
    return {
      heading: defaults.heading,
      items: withAutoTitles(registryItemsToNormalizedItems(registryEntry, defaults)),
      explicit: false,
    };
  }

  return {
    heading: defaults.heading,
    items: inferredItem(slug, defaults, context),
    explicit: false,
  };
}

export function warnForMissingComponentPaths(
  file: ComponentApiTransformerContent,
  items: NormalizedComponentApiItem[],
  context: ComponentApiTransformerContext
) {
  for (const item of items) {
    const resolvedPath = resolveComponentApiSourcePath({
      rootDir: context.rootDir,
      layerRoot: context.layerRoot,
      path: item.path,
    });

    if (!existsSync(resolvedPath.absolutePath)) {
      context.warn(
        `No component metadata was found for "${item.path}" while transforming ${fileId(file)}.`
      );
    }
  }
}

export async function appendComponentApiBlocks(
  file: ComponentApiTransformerContent,
  items: NormalizedComponentApiItem[],
  heading?: string | false
) {
  if (!file.body || !items.length) {
    return file;
  }

  const config = normalizeComponentApiConfig(file.componentApi);
  const resolvedHeading =
    heading === false
      ? false
      : (heading ?? (config && config !== false ? config.heading : undefined));
  const source = buildComponentApiBlocksSource(items, resolvedHeading);
  const parsed = await parseMarkdown(source);
  const parsedTocLinks = parsed.body.toc?.links as TransformerTocLink[] | undefined;

  if (file.body.type === "minimark" && Array.isArray(file.body.value)) {
    if (hasExistingComponentApiMinimarkNode(file.body.value)) {
      return file;
    }

    const { links, value: parsedValue } = buildComponentApiMinimarkAppend(items, resolvedHeading);
    const value = [...file.body.value];

    for (const node of parsedValue) {
      value.push(node);
    }

    return {
      ...file,
      body: appendTocLinks(
        {
          ...file.body,
          value,
        },
        links
      ),
    };
  }

  if (!Array.isArray(file.body.children)) {
    return file;
  }

  if (hasExistingComponentApiNode(file.body.children)) {
    return file;
  }

  const children = [...file.body.children];
  const parsedChildren = Array.isArray(parsed.body.children)
    ? (parsed.body.children as TransformerBodyNode[])
    : [];

  for (const node of parsedChildren) {
    children.push(node);
  }

  return {
    ...file,
    body: appendTocLinks(
      {
        ...file.body,
        children,
      },
      parsedTocLinks
    ),
  };
}
