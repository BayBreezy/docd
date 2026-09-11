---
"@baybreezy/docd": patch
---

Fix `DocsThemeToggler`'s view transition animating from the wrong origin (e.g. the sidebar) instead of the toggle button by switching the clip-path animation to percentage-based coordinates. Also ports over shape variants (circle/square/triangle/diamond/hexagon/rectangle/star) and a `fromCenter` option from the latest upstream Magic UI source, and reads/writes theme state through `useColorMode` instead of duplicating it locally.
