---
"@baybreezy/docd": patch
---

Add `docd:css` Vite plugin that automatically scans the consuming app's `content/` directory for Tailwind classes.

Previously, Tailwind only scanned the layer's own source files, so utility classes used exclusively in markdown content were stripped from the production build. The new module injects an `@source` directive into the layer's Tailwind entry before `@tailwindcss/vite` compiles it — no extra configuration required.
