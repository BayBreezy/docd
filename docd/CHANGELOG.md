# docd

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
