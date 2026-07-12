---
"@baybreezy/docd": minor
---

Add `docd.css.extend` config option to merge consuming-app CSS files into the layer's Tailwind build
- Files needing more than `@apply` (`@theme`, `@utility`, `@custom-variant`, etc.) can now be registered via `docd.css.extend` so they share a single Tailwind compilation with the layer instead of overriding its tokens/reset via a separate `@import "tailwindcss"`
