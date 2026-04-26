# @baybreezy/docd

> Build beautiful documentation sites with Nuxt, Markdown, and Vue components.

[![npm version](https://img.shields.io/npm/v/@baybreezy/docd.svg?style=flat&colorA=020420&colorB=EEEEEE)](https://npmjs.com/package/@baybreezy/docd)
[![npm downloads](https://img.shields.io/npm/dm/@baybreezy/docd.svg?style=flat&colorA=020420&colorB=EEEEEE)](https://npm.chart.dev/@baybreezy/docd)
[![License](https://img.shields.io/npm/l/@baybreezy/docd.svg?style=flat&colorA=020420&colorB=EEEEEE)](https://npmjs.com/package/@baybreezy/docd)

## Quick Start

Scaffold a new project in seconds:

```bash
# Create a new docs project
npx create-docd my-docs

# Navigate to your project
cd my-docs

# Start the dev server
bun run dev
```

Your documentation site will be running at `http://localhost:3000`.

## What you get

A fully configured documentation site with:

- **Beautiful design** — Clean, modern theme built on [UI Thing](https://uithing.com) components
- **Theming** — 17 color themes with light/dark mode out of the box
- **Markdown enhanced** — Extended MDC syntax with interactive components and prose wrappers
- **Component API docs** — Automatic prop/slot/event documentation from Vue component metadata
- **Full-text search** — Built-in search across all your content
- **OG images** — Automatic Open Graph image generation
- **LLM-ready** — Auto-generates `llms.txt` and `llms-full.txt` for AI tool integration
- **MCP server** — Built-in Model Context Protocol server for Cursor, VS Code, Claude, and more
- **SEO** — Sitemap, robots.txt, and meta tags configured automatically
- **TypeScript** — Full type safety throughout

## Project structure

```
my-docs/
├── content/              # Your Markdown content
│   ├── index.md          # Homepage
│   └── docs/             # Documentation pages
├── public/               # Static assets
└── package.json
```

Docd is a Nuxt layer — you can extend it with any standard Nuxt feature:

```
my-docs/
├── nuxt.config.ts        # Extra modules and Nuxt configuration
├── app/
│   ├── app.config.ts     # Theme, navigation, and feature flags
│   ├── components/       # Your own Vue components (usable in Markdown)
│   ├── layouts/          # Custom layouts
│   └── pages/            # Extra pages outside of content/
└── server/               # Server-side code
```

## Configuration

Most things are controlled through `app.config.ts`:

```ts
export default defineAppConfig({
  docd: {
    ui: {
      toc: { title: "On this page", icon: "lucide:list" },
      borderType: "dashed",
      transition: {
        name: "fade",
        duration: 0.35,
        easing: "easeOut",
      },
    },
  },
});
```

Full configuration reference: [docd.uithing.com](https://docd.uithing.com)

## Built with

- [Nuxt](https://nuxt.com) — web framework
- [Nuxt Content](https://content.nuxt.com) — file-based content layer
- [UI Thing](https://uithing.com) — component library
- [Tailwind CSS](https://tailwindcss.com) — utility-first CSS
- [Nuxt Image](https://image.nuxt.com) — optimised image handling
- [nuxt-og-image](https://nuxtseo.com/og-image/getting-started/installation) — OG image generation
- [nuxt-llms](https://github.com/nuxt-hub/nuxt-llms) — LLM file generation

## License

Published under the [MIT](./LICENSE.md) license.
