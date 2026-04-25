---
title: Code Snippet
description: Dynamically import and display code from your project files or external URLs without duplicating content in your documentation.
componentApi:
  heading: Code Snippet API
  path: /app/components/content/ProseCodeSnippet.global.vue
  layout: table
links:
  - title: Source Code
    href: https://github.com/BayBreezy/docd/blob/main/docd/app/components/content/ProseCodeSnippet.global.vue
    icon: lucide:code-xml
publishedAt: 2026-04-24
modifiedAt: 2026-04-24
---

## Overview

The `ProseCodeSnippet` component allows you to reference actual source files from your project or external URLs, ensuring your documentation always shows the latest code without manual updates. Perfect for keeping docs in sync with your codebase.

You will need to copy the source code and add it to your own project to use it.

::prose-callout{variant="info" title="Features"}

- **Dynamic Imports** - Load code directly from your project files
- **External URLs** - Fetch code from GitHub, GitLab, or any URL
- **Line Extraction** - Show specific line ranges from large files
- **Syntax Highlighting** - Full language support via Shiki
- **Auto-sync** - Documentation updates automatically when source code changes
- **Performance** - Lazy loads files only when needed

::

::prose-callout{variant="warning" title="Build Consideration"}
Files must match the `import.meta.glob` patterns in the component. The current setup includes all `.vue`, `.ts`, `.css`, and `.json` files from `/app/**` (excluding test files). Adjust patterns as needed for your use case.

::

## Basic Usage

Import a component from your project:

:::prose-show-case{prose}

  ::prose-code-snippet{file="/components/content/BrowserFrame.global.vue" language="vue" title="Browser Frame Component"}
  ::

#code

```mdc
  ::prose-code-snippet{file="/components/content/BrowserFrame.global.vue" language="vue" title="Browser Frame Component"}
  ::
```

:::

## Import Project Files

### TypeScript Utilities

Reference ts files:

:::prose-show-case{prose}

  ::prose-code-snippet{file="/app.config.ts" language="ts" title="App Configuration"}
  ::

#code

```mdc
  ::prose-code-snippet{file="/app.config.ts" language="ts" title="App Configuration"}
  ::
```

:::

## Extract Specific Lines

Use `start` and `offset` to show only relevant portions of large files:

:::prose-show-case{prose}

  ::prose-code-snippet{file="/app.config.ts" language="ts" title="App Configuration" start="4" offset="6"}
  ::

#code

```mdc
::prose-code-snippet{file="/app.config.ts" language="ts" title="App Configuration" start="4" offset="6"}
::
```

:::

The example above starts at line 4 and shows the next 6 lines.

## Highlight Lines

Combine with the `highlights` prop to emphasize important code:

:::prose-show-case{prose}

  ::prose-code-snippet{file="/app.config.ts" language="ts" title="App Configuration" start="3" offset="33" highlights="2,8,10-18" meta="lines"}
  ::

#code

```mdc
  ::prose-code-snippet{file="/app.config.ts" language="ts" title="App Configuration" start="3" offset="33" highlights="2,8,10-18" meta="lines"}
  ::
```

:::

## External URLs

### GitHub Raw Content

Load code directly from GitHub:

:::prose-show-case{prose}

  ::prose-code-snippet{url="https://raw.githubusercontent.com/nuxt/nuxt/refs/heads/main/packages/nuxt/src/app/composables/state.ts" language="ts" title="Nuxt useState Source" meta="lines noFormat"}
  ::

#code

```mdc
::prose-code-snippet{url="https://raw.githubusercontent.com/nuxt/nuxt/refs/heads/main/packages/nuxt/src/app/composables/state.ts" language="ts" title="Nuxt useState Source" meta="lines noFormat"}
::
```

:::

### External Examples

Pull examples from documentation sites or CDNs.

This example fetches the Vue 3 ESM build from a CDN and displays lines 1-20:

:::prose-show-case{prose}

  ::prose-code-snippet{url="https://unpkg.com/vue@3/dist/vue.esm-browser.js" language="js" title="Vue 3 ESM Build" start="1" offset="20" meta="lines"}
  ::

#code

```mdc
::prose-code-snippet{url="https://unpkg.com/vue@3/dist/vue.esm-browser.js" language="js" title="Vue 3 ESM Build" start="1" offset="20" meta="lines"}
::
```

:::

## Advanced Meta Options

Use the `meta` prop to pass additional options to the code block:

:::prose-show-case{prose}

  ::prose-code-snippet{file="/app.config.ts" language="ts" title="App Configuration" meta="icon=lucide:package noFormat lines"}
  ::

#code

```mdc
  ::prose-code-snippet{file="/app.config.ts" language="ts" title="App Configuration" meta="icon=lucide:package noFormat lines"}
  ::
```

:::

Available meta options:

- `icon=<name>` - Custom file icon
- `noFormat` - Disable code formatting
- `lines` - Show line numbers
- `noHeader` - Hide title header

## Performance Considerations

### Bundle Size Impact

The `import.meta.glob` pattern includes files in your build. Be strategic:

**✅ Good Practices:**

- Use specific file extensions: `*.{vue,ts}` instead of `*`
- Exclude test files: `!**/*.test.ts`
- Only include directories you'll reference in docs
- Use `eager: false` for lazy loading (already configured)

**❌ Avoid:**

- Overly broad patterns like `/app/**/*` (includes everything)
- Including asset files (images, videos)
- Globbing node_modules or build outputs

### Current Configuration Impact

With the default patterns (`/app/**/*.{vue,ts,css,json}`), expect:

- **Small projects** (<100 files): ~100-200KB added to bundle
- **Medium projects** (100-500 files): ~200KB-1MB added to bundle
- **Large projects** (500+ files): 1MB+ added to bundle

Files are lazy-loaded, so only referenced snippets are downloaded to the client.

### URL Fetching for Large Files

For very large files or files outside your project:

```mdc
::prose-code-snippet{url="/api/files/large-schema.json" language="json"}
::
```

This avoids bundling and fetches on-demand.

## Error Handling

The component handles errors gracefully:

### File Not Found

```mdc
::prose-code-snippet{file="/app/nonexistent.ts" language="typescript"}
::
```

Shows error callout: "Cannot load code: /app/nonexistent.ts"

::prose-callout{variant="error" title="Code Snippet Error"}
Cannot load code: `/app/nonexistent.ts`
::

### Invalid URL

```mdc
::prose-code-snippet{url="https://invalid-url-404.com/code.js" language="javascript"}
::
```

Shows error callout with the URL.
::prose-callout{variant="error" title="Code Snippet Error"}
Cannot load code: `https://invalid-url-404.com/code.js`
::

## Best Practices

::prose-callout{variant="tip" title="Documentation Tips"}

1. **Keep Docs in Sync** - Reference actual source files instead of copying code
2. **Show Relevant Code** - Use `start` and `offset` to show only what matters
3. **Add Context** - Always use `title` to explain what the code does
4. **Highlight Key Lines** - Use `highlights` to draw attention to important parts
5. **Version Control** - Reference specific branches/tags in URLs for stable examples
6. **Test Paths** - Ensure file paths match your glob patterns
7. **Performance** - For large apps, consider creating a `/docs-examples/` directory with curated files

::
