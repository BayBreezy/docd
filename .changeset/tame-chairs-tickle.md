---
"@baybreezy/docd": patch
---

Fix package-manager command snippets so they are expanded before Nuxt Content parses markdown. This routes `prose-pm-*` output through the same Shiki highlighting pipeline as normal fenced code blocks, which keeps snippets highlighted consistently after client-side navigation and hard reloads.

Also fix default handling for NuxtLink-backed components like `Button`, `ProseA`, and `ProseCard`, add the Nuxt Studio `slugify` optimize-dependency entry, and refresh package dependencies.
