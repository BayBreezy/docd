---
"@baybreezy/docd": patch
---

Update the bundled UI Thing components and refresh dependencies.

- `UiBadge` gains `soft`, `solid` and `modern` variants, a `shape` prop (`rounded` or `pill`), a color palette, and `icon`, `trailingIcon`, `avatar` and dot support with `leading`/`trailing` slots. `UiBadgeGroup` now shares the same color map (`app/utils/badge-colors.ts`).
- `UiButton`, `UiDrawer`, `UiDialog`, `UiTabs` indicator, `UiTree`, `UiSonner`, `UiAvatar` and `UiBgPattern` pick up upstream fixes. `UiDropdownMenu` adds a `Filter` item.
- Fix the table of contents highlight in `useScrollspy`. The active section is recomputed when the anchors render (client-only TOC and route changes) and after layout settles on first load, so the TOC no longer stays unhighlighted until the first scroll.
- Update dependencies, including `@nuxt/content` 3.16.2, `@nuxt/fonts` 1.x, `@nuxtjs/robots` 7.x, `nuxt-component-meta` 0.19, `nuxt-og-image` 6.10.4, `mermaid` 12.2, `motion-v` 2.8 and `@takumi-rs/core` 2.17.
