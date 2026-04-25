# Docd

Docd is a Nuxt documentation layer built with Nuxt Layers. The docs UI is built with UI Thing components and Docd-specific wrappers.

## Repo Shape

- `docd/` is the reusable Nuxt layer package.
- `docs/` is the local consuming app used to develop and verify the layer.
- `docs-llms/` contains text exports of upstream docs and framework references for local searching.

## Important Paths

- `docd/nuxt.config.ts`: layer Nuxt config and module registration.
- `docd/content.config.ts`: shared content collections and frontmatter schema for consuming apps.
- `docd/modules/`: Nuxt modules. Important ones:
  - `config.ts`: merges sensible defaults into `nuxt.options.*` and `nuxt.options.appConfig`.
  - `prose-component-meta.ts`: generates component metadata and augments parsed content.
  - `markdown-rewrite.ts`, `routing.ts`, `custom-icons.ts`, `skills.ts`.
- `docd/app/components/content/prose/`: shipped prose/global markdown components.
- `docd/app/components/component-api/`: runtime renderers for props/slots/events/exposed.
- `docd/utils/`: shared normalization, discovery, metadata generation, and content augmentation helpers.
- `docs/content/`: the docs app markdown content.
- `docs/app/`: consuming-app overrides and example app components.

## Content Rules

- Docs content in this repo lives under `docs/content/`, not `apps/docs/content/`.
- Markdown pages should include:
  - `title`
  - `description`
  - `navigation.icon` when the page belongs in nav
  - `publishedAt`
  - `modifiedAt`
- Dates should be ISO strings like `2026-04-18`.
- Use MDC syntax for interactive/content components.
- Components used directly in markdown must be global. Use `.global.vue` or otherwise register globally.
- Markdown component tags should be lowercase kebab-case, for example `::prose-card`.
- MDC props should follow Nuxt Content's YAML/attribute conventions.

## App Config And Layer Precedence

- In Nuxt 4, the consuming app config path is `app/app.config.ts`.
- For the local docs app, the effective file is `docs/app/app.config.ts`.
- Root-level `docs/app.config.ts` is not the path to use.
- Layer defaults are merged in `docd/modules/config.ts` with `lodash-es/defaultsDeep`.
- The goal is normal Nuxt app-config precedence:
  - consuming app config wins
  - layer app config provides defaults

## Layout Selection

- Markdown pages can choose layout via frontmatter `layout`.
- The content schema includes `layout: string`.
- Docs pages default to `docs`.
- Layout switching is handled before render via route middleware using `setPageLayout`, not by hardcoding layout on the page component.

## Search

- The docs command modal supports both nav search and full-text content search.
- Keep search integrated into the existing modal UI unless there is a strong reason to split it.

## Logo / OG / Typing

- Docd has a Docus-style logo asset system, but it still renders with Docd/UI Thing components.
- OG image components follow the Docus naming:
  - `docd/app/components/OgImage/Docs.takumi.vue`
  - `docd/app/components/OgImage/Landing.takumi.vue`
- Module config typing is exported from `docd/index.d.ts`.

## Component API Metadata System

This is an important repo-specific system. Future agents should not reinvent it.

- Metadata generation is handled by `docd/modules/prose-component-meta.ts`.
- It runs during Nuxt module setup for both dev and build.
- Metadata is generated with the standalone `nuxt-component-meta/parser` API, not the Nuxt module integration that was causing layer issues.
- Built metadata is written under the consuming app root:
  - `docs/.data/docd/prose-component-meta.json` in this repo.
- A build template is emitted at `#build/docd/prose-component-meta` for runtime reads.

### Metadata Sources

- Built-in prose components are scanned from:
  - `docd/app/components/content/prose`
- Explicit consuming-app components are discovered by scanning markdown frontmatter in the consuming app's `content/` tree.
- Discovery logic is in:
  - `docd/utils/component-api-discovery.ts`

### Runtime Access

- Runtime manifest access is in:
  - `docd/app/composables/useProseComponentMeta.ts`
- Markdown-facing renderers are:
  - `ProseComponentApi.global.vue`
  - `ProseComponentProps.global.vue`
  - `ProseComponentSlots.global.vue`
  - `ProseComponentEvents.global.vue`
  - `ProseComponentExposed.global.vue`

## Component API Frontmatter

The shared content schema includes `componentApi`.

Supported shapes:

```yaml
componentApi: false
```

```yaml
componentApi:
  heading: BrowserFrame API
  path: app/components/content/BrowserFrame.global.vue
  layout: table
  sections: [props, slots, events, exposed]
```

```yaml
componentApi:
  heading: Component API
  layout: field
  sections: [props, slots]
  components:
    - path: app/components/content/prose/ProseImg.global.vue
      title: ProseImg
    - path: app/components/content/prose/ProseColorModeImage.global.vue
      title: ProseColorModeImage
      sections: [props]
```

Rules:

- `path` is shorthand for a single component.
- `components` supports multi-component pages.
- Root `layout` and `sections` are inherited by each item unless overridden.
- `heading` is the section heading injected into markdown and should be used when you want the ToC to include the API section.
- `componentApi: false` disables built-in auto-append for eligible built-in prose docs pages.

## Component API Content Augmentation

This does not rely on Nuxt Content transformers.

- Parsed content is modified in the Nuxt hook:
  - `content:file:afterParse`
- That hook is registered in:
  - `docd/modules/prose-component-meta.ts`
- Shared augmentation logic lives in:
  - `docd/utils/component-api-content.ts`

### Built-in Prose Docs Behavior

- Only built-in prose docs pages under `docs/4.prose/**` are auto-targeted.
- Resolution order:
  - `componentApi: false` disables append
  - explicit `componentApi.path` / `componentApi.components`
  - built-in registry for known multi-component pages
  - filename convention fallback like `slug -> Prose{Slug}.global.vue`

### Project Page Behavior

- Non-built-in pages only get component API blocks when they explicitly declare `componentApi`.
- Project component paths are resolved from the consuming app root.

### ToC Behavior

- Component API headings must be injected as real markdown heading nodes so they appear in the ToC.
- The append helper is responsible for both:
  - appending heading + component API nodes
  - merging those headings into the parsed `body.toc.links`
- For single-component pages, `componentApi.heading` creates one ToC entry.
- For multi-component pages:
  - the root heading becomes the parent ToC section
  - each component `title` becomes a nested ToC item
- If no root heading is provided, the default is `Component API`.

### Current Known Working Examples

- Consuming-app single component:
  - `docs/content/2.concepts/05.nuxt.md`
  - `docs/app/components/content/BrowserFrame.global.vue`
- Built-in multi-component page:
  - `docs/content/4.prose/images.md`

## Caching / Watching

- Component metadata generation is cached by source fingerprint.
- Watches should refresh when:
  - built-in prose `.vue` files change
  - explicitly referenced consuming-app component `.vue` files change
  - markdown frontmatter changes in the consuming app `content/` tree

## Verification Guidance

- `bun run dev:prepare` is useful for template/type generation, but it is not enough to validate content augmentation behavior by itself.
- Use `bun run docs:build` to verify the real content parse/build pipeline.
- Useful verification targets:
  - `docs/.data/docd/prose-component-meta.json`
  - `docs/.data/content/contents.sqlite`
- When checking whether component API injection worked, inspect stored parsed content or ToC entries in `contents.sqlite`.

## Consuming App Conventions Used In This Repo

- Example consuming-app content lives in `docs/content/`.
- Example consuming-app global markdown components live in `docs/app/components/**` and should use `.global.vue` when intended for MDC.
- `docs/app/components/content/BrowserFrame.global.vue` is the canonical project-component example for `componentApi.path`.

## General Guidance For Future Agents

- Preserve UI Thing as the component/styling base.
- Prefer updating shared normalization/utilities in `docd/utils/` over scattering one-off logic across modules and components.
- If a feature affects ToC or markdown structure, implement it in the parsed content augmentation path, not only in a Vue renderer.
- If a component/path is intended for markdown usage, make it global.
