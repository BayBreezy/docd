---
"@baybreezy/docd": patch
"create-docd": patch
---

Add a `theme` prop to `ProseMermaid` and update dependencies.

**`@baybreezy/docd`**

- `ProseMermaid` now accepts an optional `theme` prop to force a specific Mermaid theme (`base`, `default`, `dark`, `forest`, `neutral`, `neo`, `neo-dark`, `redux`, `redux-dark`, `redux-color`, `redux-dark-color`, or `null`). When it is not set, the theme still follows the color mode (`dark` / `default`).
- Upgrade `mermaid` to v12 and `@vueuse/core` / `@vueuse/nuxt` to v15.
- Update `@nuxt/content` (3.16.1), `@nuxtjs/mcp-toolkit` (0.21.0), `@nuxtjs/robots` (6.2.3), `@takumi-rs/core` (2.14.0), `motion-v` (2.4.4), `nuxt-og-image` (6.8.0), `reka-ui` (2.10.5), `tailwind-merge` (3.7.0), `yaml` (2.9.1) and `zod` (4.6.5).

**`create-docd`**

- Update `@clack/prompts` to 1.8.1.
