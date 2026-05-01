# docd

## 0.1.0

### Minor Changes

- [`e5f78fb`](https://github.com/BayBreezy/docd/commit/e5f78fba9b1a52540814fca4b37ce240bfc89ee2) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Add `expandNav` config option to control which nav collapsibles are expanded by default. Accepts `true` to expand all, a `number` for a specific 1-based position, or `number[]` for multiple positions.

## 0.0.12

### Patch Changes

- [`b5fa40f`](https://github.com/BayBreezy/docd/commit/b5fa40f92256cb25a9324c6269fd0bf8434e107d) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Add format prop to control filename formatting in `ProsePre` component

- [`ca72ce1`](https://github.com/BayBreezy/docd/commit/ca72ce18df9b5a003779511bba74a9c34e543bab) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Handle empty route path in `useDocPage` for async data fetching

## 0.0.11

### Patch Changes

- [`afdee97`](https://github.com/BayBreezy/docd/commit/afdee9783bae113139610638ce0c430c00613a1e) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Correct padding in base style for `ProseField` component

## 0.0.10

### Patch Changes

- [`79e1381`](https://github.com/BayBreezy/docd/commit/79e1381ea6975c951b27fbed3f84a403e5a85ed6) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Remove auto-injection of component API blocks for built-in prose components

  Previously, the layer automatically appended component API sections (props, slots, events, exposed) to docs pages under `4.prose/**` based on a built-in registry and filename convention fallback. This caused unwanted component API blocks to appear in apps that extend the layer.

  The auto-injection logic has been removed entirely. Component API blocks are now only rendered when explicitly declared in a page's front matter via the `componentApi` field. The metadata generation and runtime renderers (`ProseComponentApi`, `ProseComponentProps`, etc.) remain fully functional for explicit usage.

## 0.0.9

### Patch Changes

- [`39ade50`](https://github.com/BayBreezy/docd/commit/39ade50a15c589d96084323eaa5659847ced2bbb) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Add README and LICENSE to layer root

## 0.0.8

### Patch Changes

- [`1cbce30`](https://github.com/BayBreezy/docd/commit/1cbce30598061846668331a7daef7f81bd349787) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Added `@iconify-json/material-icon-theme` as a dependency

## 0.0.7

### Patch Changes

- [`e91f617`](https://github.com/BayBreezy/docd/commit/e91f6178db0a06c811099a790a88d077099cf3ea) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Update some doc components and change how defaults are assigned in the config module.

  - DocsGithubLink: Remove dark mode text color class.
  - DocsThemeCustomizer: Add a fallback for the popover trigger.
  - DocsThemeToggler: Add a fallback for the theme icon.
  - Use `defu` in the config module to ensure that user-provided config values are merged with defaults rather than replaced.

## 0.0.6

### Patch Changes

- [`6dc9e1e`](https://github.com/BayBreezy/docd/commit/6dc9e1e9704ff95e257bc8cbc20297584730031d) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Fix Tailwind CSS source scanning for packaged layer usage

  The layer's `@source "../../../../"` was a relative path baked into `tailwind.css` that happened to resolve correctly in the local monorepo but pointed into `node_modules` when `docd` was installed as a package in a consuming app — so utility classes used in markdown content and user components were never scanned.
  The CSS module now injects `@source` paths at build time using a Vite `load` hook instead of a transform hook. The load hook runs before `@tailwindcss/vite`'s own transform, which is the only point where injected directives are actually visible to the Tailwind compiler. The injected paths are resolved to absolute filesystem paths from the module's own location, so they remain correct regardless of where the package is installed. Tailwind now scans the consuming app's full project root and the layer's `app` directory.

## 0.0.5

### Patch Changes

- [`62de337`](https://github.com/BayBreezy/docd/commit/62de337e0f37818679b7aec180750c8f3b2c75de) Thanks [@BayBreezy](https://github.com/BayBreezy)! - - Added `hasGithub` computed property and update template render conditions

## 0.0.4

### Patch Changes

- [`84a4974`](https://github.com/BayBreezy/docd/commit/84a497417c2df851e4ffcf959f61e48702197d79) Thanks [@BayBreezy](https://github.com/BayBreezy)! - ## 🚀 Features

  - Make the Theme Customizer mobile-friendly by adding a responsive design and improving the user interface for smaller screens.
  - Add Theme Customizer to the mobile navigation bar.

  ## 🐛 Bug Fixes

  - Hide DocHeader on mobile devices.

## 0.0.3

### Patch Changes

- [`6324480`](https://github.com/BayBreezy/docd/commit/63244807dd64a552c74572c64c97e002824faaa8) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Add `docd:css` Vite plugin that automatically scans the consuming app's `content/` directory for Tailwind classes.

  Previously, Tailwind only scanned the layer's own source files, so utility classes used exclusively in markdown content were stripped from the production build. The new module injects an `@source` directive into the layer's Tailwind entry before `@tailwindcss/vite` compiles it — no extra configuration required.

## 0.0.2

### Patch Changes

- [`21e3c0f`](https://github.com/BayBreezy/docd/commit/21e3c0f715a141042b24cf9a8bdb56c50507ecd1) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Parallelize prose component metadata generation with worker threads, reducing cold-start from ~40s to ~9s

## 0.0.2

### Patch Changes

- [`13e9fcb`](https://github.com/BayBreezy/docd/commit/13e9fcbae7682e8e75b7d523116e44983cdbaeb1) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Initial release
