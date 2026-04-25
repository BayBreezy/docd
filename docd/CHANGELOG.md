# docd

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
