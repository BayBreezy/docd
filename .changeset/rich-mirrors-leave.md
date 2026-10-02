---
"@baybreezy/docd": patch
---

Fix a production-only hydration crash when apps extending the Docd layer restored light mode from persisted color-mode state. The shared Sonner wrapper now renders the `vue-sonner` toaster client-only, avoiding the light-mode refresh failure with `Cannot read properties of null (reading 'parentNode')` while preserving normal toast behavior.

Also pin `mdast-util-to-markdown` to `2.1.2` through the root package overrides so docs builds avoid the upstream markdown serialization regression seen during `llms-full.txt` generation.
