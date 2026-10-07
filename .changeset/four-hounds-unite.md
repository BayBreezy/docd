---
"@baybreezy/docd": minor
---

**New**

- The top-level `seo` app config (`titleTemplate`, `title`, `description`) is now applied site-wide, so it does something. It is typed, editable in Nuxt Studio, and also applies to the error page. Page frontmatter still takes priority.
- `docd.search.collections` lets you choose which content collections the search dialog covers (default: `["docs"]`). Collections that do not exist are skipped.
- A built-in error page (`app/error.vue`) for 404s and other errors. Add your own `app/error.vue` to replace it.
- `ui.body.maxWidth` and `docd.search.collections` are available in the Studio config form.
- The landing `Hero` accepts a `logoAlt` prop. By default the logo alt text now comes from `docd.ui.header.logo.alt`, then `<siteName> logo`, instead of the hardcoded "Light Logo" and "Dark Logo".
- `Ctrl+K` now opens search on Windows and Linux, alongside `Cmd+K`.
- Production builds warn when no site URL is configured.

**Fixes**

- Sitemap: URLs are now absolute (they were relative because they read a runtime value nothing set), `sitemap: false` in frontmatter is honored, and `robots.txt` now points to `/sitemap.xml`. The duplicate `@nuxtjs/robots` module entry is gone.
- `llms.txt` follows `site.url`. The layer's config module now runs before `nuxt-llms`, so its defaults (llms domain, site config, color mode storage key) actually apply. An explicit `http://` URL is no longer rewritten to `https://`, and the domain falls back to `http://localhost:3000` so `/llms.txt` still works locally. The starter and docs app no longer hardcode `llms.domain`.
- Dev: code blocks rendered at runtime (such as `prose-code-snippet`) showed up unhighlighted after client-side navigation because Vite could not pre-bundle the dependencies of the layer, `@nuxtjs/mdc` and `@nuxt/content` from the app root. Entries are now resolved through the layer. This also silences most of the `NUXT_B7002` start-up warning.
- The same page was queried many times per request (up to 32 on pages with many code blocks, because `useDocPage` ran once per component). It is now loaded once and shared. Going back to the home page after visiting a docs page no longer risks a stale "Page not found", and the `NUXT_E3004` warning for the landing key is fixed.
- Page header: "Copy page" fetched `/raw//…` (double slash) and read `window` during server rendering. The menu labels are rendered as text instead of `v-html`, and the tooltip now says the Markdown is copied rather than a link.
- Accessibility: icon-only header buttons (search, theme toggle, theme customizer, GitHub, mobile nav close) now have accessible names, and the mobile menu button reports `aria-expanded`.
- Vercel Markdown negotiation sends `Vary: Accept, User-Agent`, so CDNs cache the HTML and Markdown versions of a page separately.
- OG images keep the dots and commas in titles and descriptions. They were being stripped, which is not needed with `nuxt-og-image` 6.10.3.
- Article structured data uses `TechArticle`, the page title and description stay in sync when the route changes, and `createError` calls use `status` and `statusText` instead of the deprecated `statusCode` and `statusMessage`.

**Housekeeping**

- `nuxt` `^4.0.0` is now declared as a peer dependency, and the starter uses `nuxt` `^4.6.0`.
- The docs cover site URL setup, the `seo` config, the sitemap opt-out, the error page, search options and Vercel Markdown negotiation, and CI now builds the docs app.
