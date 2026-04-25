# Contributing to Docd

Thanks for your interest in contributing. This guide covers everything you need to get started.

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.3
- Node.js ≥ 20 (for scripts that require it)
- Git

## Repo layout

| Path | Purpose |
|---|---|
| `docd/` | The publishable Nuxt layer |
| `docs/` | Local consuming app used for development and verification |
| `create-docd/` | Scaffolding CLI (`create-docd`) |

## Setup

```sh
git clone https://github.com/behonbaker/docd.git
cd docd
bun install
```

## Development

Start the docs dev server (which consumes the `docd` layer locally):

```sh
bun run dev
```

Generate Nuxt types without starting the server:

```sh
bun run dev:prepare
```

## Verifying content changes

The dev server is not enough to validate the full content pipeline. Use the build to verify:

```sh
bun run docs:build
```

Key artifacts to inspect after a build:

- `docs/.data/docd/prose-component-meta.json` — component metadata
- `docs/.data/content/contents.sqlite` — parsed content and ToC entries

## Linting and formatting

This repo uses [oxlint](https://oxc.rs/docs/guide/usage/linter.html) and [oxfmt](https://github.com/oxc-project/oxfmt).

```sh
# Lint
bun run lint

# Lint with auto-fix
bun run lint:fix

# Check formatting
bun run fmt:check

# Format
bun run fmt
```

A pre-commit hook runs `lint-staged` automatically on staged files, so you rarely need to run these manually.

## Submitting changes

1. Fork the repo and create a branch from `main`.
2. Make your changes. Keep commits focused — one logical change per commit.
3. Ensure `bun run lint` and `bun run fmt:check` both pass.
4. If your change affects content parsing, ToC behaviour, or component metadata, run `bun run docs:build` and verify the artefacts above.
5. Open a pull request against `main`. Fill out the PR template and link any related issues.

## Pull request guidelines

- Keep PRs small and focused. Large refactors are harder to review.
- Prefer updating shared utilities in `docd/utils/` over scattering logic across modules or components.
- If a feature affects the ToC or markdown structure, implement it in the content augmentation path (`content:file:afterParse`), not only in a Vue renderer.
- If a component is intended for use in markdown, make it global (`.global.vue` or registered globally).
- Do not add comments that restate what the code does. Only comment non-obvious constraints or workarounds.

## Reporting bugs and requesting features

Use the GitHub issue templates — they help us triage quickly.
