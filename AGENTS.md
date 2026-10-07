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
  - `optimize-deps.ts`: rewrites Vite `optimizeDeps.include` entries so they resolve through the layer (see Module Order).
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
- Layer defaults are merged in `docd/modules/config.ts` with `defu` (from the `defu` package).
- The goal is normal Nuxt app-config precedence:
  - consuming app config wins
  - layer app config provides defaults

## Module Order And Dev Pre-bundling

Module order in `docd/nuxt.config.ts` is load-bearing.

- `modules/config.ts` must stay **first**. It sets defaults (`llms`, `site`, `colorMode`, `app.head`) that `nuxt-llms`, `@nuxtjs/robots` and others read in their own setup. When it ran later those defaults were silently ignored.
- `modules/optimize-deps.ts` must stay **last**. It rewrites the `optimizeDeps.include` entries added by earlier modules.
- Why: with isolated installs (bun/pnpm) the consuming app root cannot resolve the layer's dependencies, or those of `@nuxtjs/mdc` / `@nuxt/content`. Vite then skips pre-bundling and **dev breaks silently** (production is fine). The visible symptom was runtime `<MDC>` code blocks rendering unhighlighted after client navigation, because `.nuxt/mdc-imports.mjs` (which imports `remark-emoji`) failed to load in the browser. Entries are prefixed with the layer name (`@baybreezy/docd > mermaid`).
- If you add a dependency that the **client** imports, add it to `LAYER_OPTIMIZE_DEPS` in `docd/utils/optimize-deps.ts`.
- The `NUXT_B7002 ... could not be resolved` start-up warning is a useful canary. Only `@vue/devtools-core` / `@vue/devtools-kit` (Nuxt's, not ours) should remain.
- Two `@nuxtjs/mdc` versions are installed (one via `@nuxt/content`). Check `.nuxt/mdc-imports.mjs` for the one actually in use before reading its source.

## Site URL, SEO And Sitemap

- `site.url` resolution: `site.url` in `nuxt.config.ts`, then env vars (`NUXT_SITE_URL`, Vercel/Netlify/Cloudflare vars) via `resolveSiteURL` in `docd/utils/meta.ts`. `inferSiteURL` keeps an explicit `http://`.
- `nuxt-llms` disables `/llms.txt` completely without a domain, so `config.ts` falls back to `http://localhost:3000`. Do not remove that fallback.
- Production builds warn when no site URL is set. Keep that warning if you touch `config.ts`.
- `appConfig.seo` (`titleTemplate`, `title`, `description`) is applied in `app.vue` and `error.vue` with `useSeoMeta` getters. Pages override title/description from frontmatter. It is also exposed in `nuxt.schema.ts` for Studio, so keep the schema and the `app.config.ts` types in sync with real behavior.
- The sitemap is a custom route (`server/routes/sitemap.xml.ts`), not `@nuxtjs/sitemap`. Unknown frontmatter keys live under `page.meta`, so `sitemap: false` is read from `page.meta.sitemap`.
- OG helpers (`app/utils/og.ts`) intentionally do not strip dots or commas: `nuxt-og-image` >= 6.10.3 handles them.
- Nitro server code has `getSiteConfig(event)` auto-imported, not `useSiteConfig`. App code needs explicit `import { joinURL } from "ufo"`.
- Use `status` / `statusText` with `createError` (the `statusCode` / `statusMessage` forms are deprecated). The h3 v1 server error objects still expose `statusCode`, so read both when inspecting a caught error.

## Page Data Loading

Many components call `useDocPage()` (including every code block via `ProsePre`), so loading is shared on purpose.

- Load the current page with `useDocPageData(collection)` (inside `useDocPage`), never a hand-written `useAsyncData` for the same key. Nuxt warns (`NUXT_E3004`) when one key has different handlers/options.
- `getSharedCachedData` plus the layout middleware (`prefetchDocPage` in `app/utils/docPage.ts`) store the page in the payload under the page key, so one request does one query. Do not re-add per-component queries.
- A component that stays mounted across navigation (like `DocsSearch` in `app.vue`) keeps a `watch` on `route.path`. If it shares a key with another component, its refresh can overwrite that key with another page's data. That is why the landing collection always loads `/` and does not watch the route.
- Known issue, not fixed: in production, load a docs page, go to `/`, then return to that same docs page and it can show "Page not found" (the page key is fixed at first load while a persistent component refreshes it). A reactive key is the likely fix; test for flicker.
- Anything passed to `<MDC cache-key>` must include **every prop that changes the output**. Nuxt shares data by key, so a key built from only the file made snippets of the same file with different `meta`/`title`/`start`/`offset` all render the first one (hard loads only).
- Layout selection stays in middleware (`doc-page-layout`, `landing-page-layout`), as described above.

## Layout Selection

- Markdown pages can choose layout via frontmatter `layout`.
- The content schema includes `layout: string`.
- Docs pages default to `docs`.
- Layout switching is handled before render via route middleware using `setPageLayout`, not by hardcoding layout on the page component.

## Search

- The docs command modal supports both nav search and full-text content search.
- Keep search integrated into the existing modal UI unless there is a strong reason to split it.
- Searched collections come from `docd.search.collections` (default `["docs"]`, unknown names are skipped). `Cmd+K` and `Ctrl+K` open the dialog.
- Search sections load client-side only (`server: false`), so they cannot be checked with `curl`.

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

### Verifying Behavior Properly

- Server HTML, hydration and client-side navigation are three different code paths and have each hidden bugs here. Test a hard load **and** a client navigation (`$nuxt.$router.push(...)`), in dev **and** a production build (`bun run docs:build`), and in both color modes for visual issues. `curl` only sees the server HTML.
- For client-side checks, drive headless Chrome over the DevTools protocol (Node 24 has a global `WebSocket`; Chrome is at `/Applications/Google Chrome.app`). Start Chrome with `--headless=new --remote-debugging-port=<port> --user-data-dir=<tmp>`, `Page.navigate`, wait, then `Runtime.evaluate` with `awaitPromise` and `returnByValue`. Useful probes: `document.querySelector('#__nuxt').__vue_app__.config.globalProperties.$nuxt` for `payload.data`, `$config`, `$router`. Enable `Debugger.setPauseOnExceptions` to find swallowed errors, and `Network` events for failed requests (`fetch` wrappers miss `$fetch`).
- Nuxt CLI v4 has `nuxt curl <path>` for requests against the running dev server.
- The user often has their own dev server running on port 3000. Do not kill it or run builds over its `.nuxt`. For risky checks use a throwaway sibling copy of `docs/` (symlink its `node_modules`, set `extends: ["../docd"]`, give it its own port and `NUXT_IGNORE_LOCK=1`) and delete it afterwards. Keep the copy's folder name plain (a dot-folder layer failed to build in testing).
- From `docs/`, a bare `nuxt dev` booted an empty default Nuxt app. Pass the absolute directory: `nuxt dev /abs/path/to/docs --no-tui --port <port>`.
- Count real behavior, not assumptions: temporarily log inside a helper (for example a query counter) and remove it, rather than reasoning about how often something runs.
- In zsh, do not name a shell variable `path` (it is tied to `PATH` and breaks the command).

## Consuming App Conventions Used In This Repo

- Example consuming-app content lives in `docs/content/`.
- Example consuming-app global markdown components live in `docs/app/components/**` and should use `.global.vue` when intended for MDC.
- `docs/app/components/content/BrowserFrame.global.vue` is the canonical project-component example for `componentApi.path`.

## General Guidance For Future Agents

- Preserve UI Thing as the component/styling base.
- Prefer updating shared normalization/utilities in `docd/utils/` over scattering one-off logic across modules and components.
- If a feature affects ToC or markdown structure, implement it in the parsed content augmentation path, not only in a Vue renderer.
- If a component/path is intended for markdown usage, make it global.
- Update `docs/content/` when you add or change a user-facing option, and bump that page's `modifiedAt`. The public reads those pages.
- When a "bug" is only reproducible in one environment (dev vs production, hard load vs client nav), find out why before changing config. Two plausible theories this session (URL length of the highlight API, `noApiRoute: true`) were wrong or made things worse.

## Releasing

- Only `@baybreezy/docd` is published from here. `create-docd` is separate, and the starter (`.starters/default`) is fetched from GitHub `main` by `create-docd`, so starter changes go live without a release.
- Add a changeset with `bun run changeset`. It is interactive; non-interactively run `bunx changeset add --empty` and edit the generated `.changeset/*.md` (package, bump, text). `bunx changeset status` validates it.
- Past releases were patch bumps; new options justify a minor.
- The release workflow runs on push to `main`: it opens a "Version Packages" PR, and merging that PR publishes to npm. Never push to `main` without being asked.
- Commits use conventional commits (commitlint, body max 300 characters). Husky runs `lint-staged` (oxfmt, oxlint) on commit. Stage explicit paths and commit in small logical parts; do not use `git add .`.
- Do not add Claude attribution lines to commits unless asked.

## Syncing With Docus

Docd was modeled on [Docus](https://github.com/nuxt-content/docus). To sync, clone it somewhere temporary (do not leave it in the repo), then `git log --since=<date>` and diff `layer/` against `docd/`.

Deliberately not ported: i18n, the AI assistant, `nuxt-agent-discovery`, `nuxt-schema-org`, `@nuxtjs/sitemap`, FTS5 search, and Docus's Nuxt UI variant-scoping fixes (docd does not use Nuxt UI variant config). Docd keeps its own `markdown-rewrite.ts`, `skills.ts` and sitemap route instead. Docus enables `ogImage.zeroRuntime`; docd does not.
