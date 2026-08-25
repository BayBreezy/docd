type PackageManagerTag = "prose-pm-install" | "prose-pm-run" | "prose-pm-x";

type PackageManagerProps = Record<string, string | boolean>;

const PACKAGE_MANAGERS = [
  {
    name: "npm",
    command: "npm ",
    install: "i ",
    installEmpty: "install",
    run: "run ",
    x: "npx ",
    saveDev: "-D ",
    icon: "material-icon-theme:npm",
  },
  {
    name: "pnpm",
    command: "pnpm ",
    install: "i ",
    installEmpty: "install",
    run: "run ",
    x: "pnpm dlx ",
    saveDev: "-D ",
    icon: "material-icon-theme:pnpm",
  },
  {
    name: "bun",
    command: "bun ",
    install: "add ",
    installEmpty: "install",
    run: "run ",
    x: "bun x ",
    saveDev: "-d ",
    icon: "material-icon-theme:bun",
  },
  {
    name: "yarn",
    command: "yarn ",
    install: "add ",
    installEmpty: "install",
    run: "run ",
    x: "yarn dlx ",
    saveDev: "-D ",
    icon: "material-icon-theme:yarn",
  },
] as const;

const PACKAGE_MANAGER_LINE_RE = /^(\s*)(:{1,})(prose-pm-(?:install|run|x))(?:\{([^}]*)\})?\s*$/;
const FENCE_RE = /^\s*(`{3,}|~{3,})/;
const ATTRIBUTE_RE = /(?::?[\w-]+)(?:=(?:"[^"]*"|'[^']*'|[^\s}]+))?/g;

function escapeMdcAttribute(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function normalizePropName(name: string) {
  return name.replace(/^:/, "").replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

function parseProps(source = "") {
  const props: PackageManagerProps = {};
  const attributes = source.match(ATTRIBUTE_RE) || [];

  for (const attribute of attributes) {
    const [rawName, ...rawValueParts] = attribute.split("=");
    const name = normalizePropName(rawName);
    const rawValue = rawValueParts.join("=");

    if (!rawValue) {
      props[name] = true;
      continue;
    }

    props[name] = rawValue.replace(/^["']|["']$/g, "");
  }

  return props;
}

function stringProp(props: PackageManagerProps, name: string) {
  const value = props[name];
  return typeof value === "string" ? value : undefined;
}

function booleanProp(props: PackageManagerProps, name: string) {
  const value = props[name];

  if (typeof value === "boolean") {
    return value;
  }

  return value === "" || value === "true";
}

function buildCodeFence(label: string, icon: string, command: string) {
  return `\`\`\`bash icon="${icon}" noFormat hideHeader [${label}]\n${command}\n\`\`\``;
}

function buildCodeGroupSource(tag: PackageManagerTag, props: PackageManagerProps) {
  const inStack = booleanProp(props, "inStack");
  const noSync = booleanProp(props, "noSync");
  const sync = stringProp(props, "sync") || "_pm";

  const codeBlocks = PACKAGE_MANAGERS.map((pm) => {
    if (tag === "prose-pm-install") {
      const name = stringProp(props, "name");
      const saveDev = booleanProp(props, "saveDev");
      const command = name
        ? `${pm.command}${pm.install}${saveDev ? pm.saveDev : ""}${name}`
        : `${pm.command}${pm.installEmpty}`;

      return buildCodeFence(pm.name, pm.icon, command);
    }

    if (tag === "prose-pm-run") {
      const script = stringProp(props, "script");

      if (!script) {
        return undefined;
      }

      return buildCodeFence(pm.name, pm.icon, `${pm.command}${pm.run}${script}`);
    }

    const command = stringProp(props, "command");

    if (!command) {
      return undefined;
    }

    return buildCodeFence(pm.name, pm.icon, `${pm.x}${command}`);
  }).filter((block): block is string => Boolean(block));

  if (!codeBlocks.length) {
    return;
  }

  const attributes = [
    inStack && "in-stack",
    !noSync && `sync="${escapeMdcAttribute(sync)}"`,
    tag === "prose-pm-x" && "noFormat",
    tag === "prose-pm-x" && "hideHeaderMeta",
  ]
    .filter(Boolean)
    .join(" ");

  return `::prose-code-group${attributes ? `{${attributes}}` : ""}\n${codeBlocks.join("\n\n")}\n::`;
}

function indentBlock(block: string, indent: string) {
  return block
    .split("\n")
    .map((line) => (line ? `${indent}${line}` : line))
    .join("\n");
}

function nextNonEmptyLineIndex(lines: string[], start: number) {
  for (let index = start; index < lines.length; index += 1) {
    if (lines[index].trim()) {
      return index;
    }
  }
}

export function rewritePackageManagerMarkdown(markdown: string) {
  const lines = markdown.split("\n");
  const output: string[] = [];
  const skipLines = new Set<number>();
  let activeFence: string | undefined;
  let changed = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (skipLines.has(index)) {
      changed = true;
      continue;
    }

    const fence = line.match(FENCE_RE)?.[1];
    if (fence && (!activeFence || fence[0] === activeFence[0])) {
      activeFence = activeFence ? undefined : fence;
      output.push(line);
      continue;
    }

    if (activeFence) {
      output.push(line);
      continue;
    }

    const match = line.match(PACKAGE_MANAGER_LINE_RE);

    if (!match) {
      output.push(line);
      continue;
    }

    const [, indent, marker, tag, propsSource] = match as [
      string,
      string,
      string,
      PackageManagerTag,
      string | undefined,
    ];
    const source = buildCodeGroupSource(tag, parseProps(propsSource));

    if (!source) {
      output.push(line);
      continue;
    }

    output.push(indentBlock(source, indent));
    changed = true;

    if (marker.length > 1) {
      const closeIndex = nextNonEmptyLineIndex(lines, index + 1);

      if (closeIndex !== undefined && lines[closeIndex].trim() === marker) {
        skipLines.add(closeIndex);
      }
    }
  }

  return changed ? output.join("\n") : markdown;
}
