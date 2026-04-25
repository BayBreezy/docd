# Docd

> Build beautiful documentation sites with Nuxt, Markdown, and Vue components.

[![npm version](https://img.shields.io/npm/v/docd.svg?style=flat&colorA=020420&colorB=EEEEEE)](https://npmjs.com/package/docd)
[![npm downloads](https://img.shields.io/npm/dm/docd.svg?style=flat&colorA=020420&colorB=EEEEEE)](https://npm.chart.dev/docd)
[![License](https://img.shields.io/npm/l/docd.svg?style=flat&colorA=020420&colorB=EEEEEE)](https://npmjs.com/package/docd)

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

---

## Monorepo

  This repository contains all packages for the Docd ecosystem.

  | Package | Description |
  |---|---|
  | [`docd/`](./docd) | The publishable Nuxt layer (`docd` on npm) |
  | [`create-docd/`](./create-docd) | Scaffolding CLI (`create-docd` on npm) |
  | [`docs/`](./docs) | Official documentation site |
  | [`.starters/`](./.starters) | Starter templates used by `create-docd` |

### Prerequisites

  - [Bun](https://bun.sh) ≥ 1.3

### Setup

```bash
git clone https://github.com/BayBreezy/docd.git
cd docd
bun install
```

### Development

```bash
# Start the docs dev server (consumes the docd layer locally)
bun run dev

# Generate Nuxt types without starting the server
bun run dev:prepare
```

### Lint and format

```bash
bun run lint        # Run oxlint
bun run lint:fix    # Lint with auto-fix
bun run fmt:check   # Check formatting with oxfmt
bun run fmt         # Format
```

### Verifying content changes

  The dev server does not run the full content pipeline. To verify content parsing, ToC injection, and component metadata:

```bash
bun run docs:build
```

  Key artefacts after a build:

  - `docs/.data/docd/prose-component-meta.json` — generated component metadata
  - `docs/.data/content/contents.sqlite` — parsed content and ToC entries

### Releasing

  This repo uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

  When contributing a change worth noting:

```bash
bun changeset
```

  The CLI will ask which packages changed, what semver bump applies, and prompt for a short description. Commit the generated `.changeset/*.md` file with your PR.

  Releases happen automatically when a "Version Packages" PR is merged into `main`.

## Contributing

  See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

  Published under the [MIT](./LICENSE.md) license.
