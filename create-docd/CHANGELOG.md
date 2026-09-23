# create-docd

## 0.0.9

### Patch Changes

- e7a3f34: Add a `theme` prop to `ProseMermaid` and update dependencies.
  
  **`@baybreezy/docd`**
  
  - `ProseMermaid` now accepts an optional `theme` prop to force a specific Mermaid theme (`base`, `default`, `dark`, `forest`, `neutral`, `neo`, `neo-dark`, `redux`, `redux-dark`, `redux-color`, `redux-dark-color`, or `null`). When it is not set, the theme still follows the color mode (`dark` / `default`).
  - Upgrade `mermaid` to v12 and `@vueuse/core` / `@vueuse/nuxt` to v15.
  - Update `@nuxt/content` (3.16.1), `@nuxtjs/mcp-toolkit` (0.21.0), `@nuxtjs/robots` (6.2.3), `@takumi-rs/core` (2.14.0), `motion-v` (2.4.4), `nuxt-og-image` (6.8.0), `reka-ui` (2.10.5), `tailwind-merge` (3.7.0), `yaml` (2.9.1) and `zod` (4.6.5).
  
  **`create-docd`**
  
  - Update `@clack/prompts` to 1.8.1.

## 0.0.8

### Patch Changes

- f93cd28: Bumped dependencies

## 0.0.7

### Patch Changes

- c3b18fb: Bump deps

## 0.0.6

### Patch Changes

- 6c3a173: Bump deps

## 0.0.5

### Patch Changes

- [`a4ac32b`](https://github.com/BayBreezy/docd/commit/a4ac32bf07a97e3571a48114f33c8f24fa7a3715) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Bumped dependencies

## 0.0.4

### Patch Changes

- [`f69a755`](https://github.com/BayBreezy/docd/commit/f69a7551415a0059356e2ab6b2ada414bf4265f8) Thanks [@BayBreezy](https://github.com/BayBreezy)! - - Bump dependencies in the `create-docd` package.
  - Add icons to documentation landing page CTA's
  - Update CSS to include proper color schema for slect elements in Brave browser
  - Add overflow to Theme customizer component.

## 0.0.3

### Patch Changes

- [`4f87dcb`](https://github.com/BayBreezy/docd/commit/4f87dcbc86dfd7341f58bcf7a56a0f5a4043a9f1) Thanks [@BayBreezy](https://github.com/BayBreezy)! - ## 🚀 Features

  - Accept arg passed to create-docd to specify the path of the new docd project.

## 0.0.2

### Patch Changes

- [`13e9fcb`](https://github.com/BayBreezy/docd/commit/13e9fcbae7682e8e75b7d523116e44983cdbaeb1) Thanks [@BayBreezy](https://github.com/BayBreezy)! - Initial release
