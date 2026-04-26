---
"@baybreezy/docd": patch
---

Fix Tailwind CSS source scanning for packaged layer usage

The layer's `@source "../../../../"` was a relative path baked into `tailwind.css` that happened to resolve correctly in the local monorepo but pointed into `node_modules` when `docd` was installed as a package in a consuming app — so utility classes used in markdown content and user components were never scanned.
The CSS module now injects `@source` paths at build time using a Vite `load` hook instead of a transform hook. The load hook runs before `@tailwindcss/vite`'s own transform, which is the only point where injected directives are actually visible to the Tailwind compiler. The injected paths are resolved to absolute filesystem paths from the module's own location, so they remain correct regardless of where the package is installed. Tailwind now scans the consuming app's full project root and the layer's `app` directory.
